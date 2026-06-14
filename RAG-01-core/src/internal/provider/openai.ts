// §03 The Provider Interface — OpenAI adapter.
// Also works with Ollama since Ollama exposes an OpenAI-compatible API
// at http://localhost:11434/v1. Set PROVIDER=ollama and OLLAMA_BASE_URL.
// "One adapter serves multiple backends" via baseURL configuration.

import OpenAI from "openai";
import type { Provider } from "./index.js";
import { ProviderError } from "./index.js";
import type { Message, ToolDef, LLMResponse, Block, StopReason } from "../api/types.js";

export class OpenAIProvider implements Provider {
  private client: OpenAI;
  private currentModel: string;
  private system: string;

  constructor(
    system: string,
    modelId = "gpt-4o",
    apiKey?: string,
    baseURL?: string
  ) {
    // Ollama doesn't require an API key — use a placeholder
    this.client = new OpenAI({ apiKey: apiKey ?? "ollama", baseURL });
    this.currentModel = modelId;
    this.system = system;
  }

  async send(messages: Message[], tools: ToolDef[]): Promise<LLMResponse> {
    try {
      const resp = await this.client.chat.completions.create({
        model: this.currentModel,
        // System prompt goes as the first message in the OpenAI format
        messages: [
          { role: "system", content: this.system },
          ...this.toOpenAIMessages(messages),
        ],
        tools: tools.length > 0 ? this.toOpenAITools(tools) : undefined,
        tool_choice: tools.length > 0 ? "auto" : undefined,
      });

      const choice = resp.choices[0];
      // Map OpenAI's finish_reason to harness StopReason
      const finishReason = choice.finish_reason;
      const stopReason: StopReason =
        finishReason === "tool_calls" ? "tool_use"
        : finishReason === "length"   ? "max_tokens"
        : "end_turn";

      return {
        content: this.fromOpenAIMessage(choice.message),
        stopReason,
      };
    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        throw new ProviderError(
          err.message,
          err.status,
          (err.status ?? 0) >= 500 || err.status === 429
        );
      }
      throw err;
    }
  }

  model(): string { return this.currentModel; }
  setModel(name: string): void { this.currentModel = name; }

  private toOpenAIMessages(messages: Message[]): OpenAI.ChatCompletionMessageParam[] {
    const result: OpenAI.ChatCompletionMessageParam[] = [];

    for (const msg of messages) {
      if (msg.role === "user") {
        // §06: Harness packs tool results into user-role messages.
        // OpenAI requires tool results as role="tool" messages.
        const toolResults = msg.content.filter(
          (b): b is Extract<Block, { type: "tool_result" }> => b.type === "tool_result"
        );
        const textBlocks = msg.content.filter(
          (b): b is Extract<Block, { type: "text" }> => b.type === "text"
        );

        for (const b of toolResults) {
          result.push({
            role: "tool",
            tool_call_id: b.toolUseId,
            content: b.toolResult,
          });
        }
        if (textBlocks.length > 0) {
          result.push({
            role: "user",
            content: textBlocks.map((b) => b.text).join("\n"),
          });
        }
      } else {
        // Assistant messages may contain both text and tool_use blocks
        const textBlocks = msg.content.filter(
          (b): b is Extract<Block, { type: "text" }> => b.type === "text"
        );
        const toolUseBlocks = msg.content.filter(
          (b): b is Extract<Block, { type: "tool_use" }> => b.type === "tool_use"
        );

        result.push({
          role: "assistant",
          // OpenAI requires null (not "") when content is empty and tool_calls are present
          content: textBlocks.map((b) => b.text).join("\n") || null,
          tool_calls: toolUseBlocks.length > 0
            ? toolUseBlocks.map((b) => ({
                id: b.toolUseId,
                type: "function" as const,
                function: {
                  name: b.toolName,
                  arguments: b.toolInput,
                },
              }))
            : undefined,
        });
      }
    }
    return result;
  }

  private toOpenAITools(tools: ToolDef[]): OpenAI.ChatCompletionTool[] {
    return [...tools]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((t) => ({
        type: "function" as const,
        function: {
          name: t.name,
          description: t.description,
          parameters: {
            type: "object",
            properties: t.inputSchema,
            required: t.required ?? [],
          },
        },
      }));
  }

  private fromOpenAIMessage(msg: OpenAI.ChatCompletionMessage): Block[] {
    const blocks: Block[] = [];
    if (msg.content) blocks.push({ type: "text", text: msg.content });
    for (const call of msg.tool_calls ?? []) {
      blocks.push({
        type: "tool_use",
        toolUseId: call.id,
        toolName: call.function.name,
        toolInput: call.function.arguments,
      });
    }
    return blocks;
  }
}
