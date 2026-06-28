import OpenAI from "openai";
import type { Provider } from "./index.js";
import { ProviderError } from "./index.js";
import type { Message, ToolDef, LLMResponse, Block, StopReason } from "../api/types.js";

export class OpenAIProvider implements Provider {
  private client: OpenAI;
  private currentModel: string;
  private system: string;
  private textToolCallCounter = 0;

  /**
   * Creates an OpenAI-compatible provider adapter.
   *
   * @param system System prompt inserted as the first chat message.
   * @param modelId Chat model identifier.
   * @param apiKey API key, or a placeholder for local Ollama.
   * @param baseURL OpenAI-compatible API base URL.
   */
  constructor(system: string, modelId = "gpt-4o", apiKey?: string, baseURL?: string) {
    this.client = new OpenAI({ apiKey: apiKey ?? "ollama", baseURL });
    this.currentModel = modelId;
    this.system = system;
  }

  /**
   * Sends harness messages and tools to an OpenAI-compatible chat endpoint.
   *
   * @param messages Harness-format conversation messages.
   * @param tools Tool definitions exposed to the model.
   * @returns Harness-format model response.
   */
  async send(messages: Message[], tools: ToolDef[]): Promise<LLMResponse> {
    try {
      const resp = await this.client.chat.completions.create({
        model: this.currentModel,
        messages: [
          { role: "system", content: this.system },
          ...this.toOpenAIMessages(messages),
        ],
        tools: tools.length > 0 ? this.toOpenAITools(tools) : undefined,
        tool_choice: tools.length > 0 ? "auto" : undefined,
      });

      const choice = resp.choices[0];
      const content = this.fromOpenAIMessage(choice.message);
      const finishReason = choice.finish_reason;
      const stopReason: StopReason =
        content.some((b) => b.type === "tool_use") ? "tool_use"
        : finishReason === "tool_calls" ? "tool_use"
        : finishReason === "length" ? "max_tokens"
        : "end_turn";

      return { content, stopReason };
    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        throw new ProviderError(err.message, err.status, (err.status ?? 0) >= 500 || err.status === 429);
      }
      throw err;
    }
  }

  /**
   * Returns the configured chat model name.
   *
   * @returns Current model identifier.
   */
  model(): string { return this.currentModel; }

  /**
   * Updates the chat model name for future requests.
   *
   * @param name New model identifier.
   */
  setModel(name: string): void { this.currentModel = name; }

  /**
   * Converts harness messages into OpenAI chat messages.
   *
   * @param messages Harness-format messages.
   * @returns OpenAI-compatible chat messages.
   */
  private toOpenAIMessages(messages: Message[]): OpenAI.ChatCompletionMessageParam[] {
    const result: OpenAI.ChatCompletionMessageParam[] = [];
    for (const msg of messages) {
      if (msg.role === "user") {
        const toolResults = msg.content.filter((b): b is Extract<Block, { type: "tool_result" }> => b.type === "tool_result");
        const textBlocks = msg.content.filter((b): b is Extract<Block, { type: "text" }> => b.type === "text");
        for (const b of toolResults) result.push({ role: "tool", tool_call_id: b.toolUseId, content: b.toolResult });
        if (textBlocks.length > 0) result.push({ role: "user", content: textBlocks.map((b) => b.text).join("\n") });
      } else {
        const textBlocks = msg.content.filter((b): b is Extract<Block, { type: "text" }> => b.type === "text");
        const toolUseBlocks = msg.content.filter((b): b is Extract<Block, { type: "tool_use" }> => b.type === "tool_use");
        result.push({
          role: "assistant",
          content: textBlocks.map((b) => b.text).join("\n") || null,
          tool_calls: toolUseBlocks.length > 0
            ? toolUseBlocks.map((b) => ({ id: b.toolUseId, type: "function" as const, function: { name: b.toolName, arguments: b.toolInput } }))
            : undefined,
        });
      }
    }
    return result;
  }

  /**
   * Converts harness tool definitions into OpenAI function-tool schemas.
   *
   * @param tools Harness tool definitions.
   * @returns OpenAI-compatible tool definitions sorted by name.
   */
  private toOpenAITools(tools: ToolDef[]): OpenAI.ChatCompletionTool[] {
    return [...tools].sort((a, b) => a.name.localeCompare(b.name)).map((t) => ({
      type: "function" as const,
      function: { name: t.name, description: t.description, parameters: { type: "object", properties: t.inputSchema, required: t.required ?? [] } },
    }));
  }

  /**
   * Converts one OpenAI assistant message into harness blocks.
   *
   * @param msg OpenAI-compatible assistant message.
   * @returns Harness-format text and tool-use blocks.
   */
  private fromOpenAIMessage(msg: OpenAI.ChatCompletionMessage): Block[] {
    const blocks: Block[] = [];
    const textToolCalls = msg.tool_calls?.length ? [] : this.parseTextToolCalls(msg.content ?? "");
    const textWithoutToolCalls = textToolCalls.length ? this.removeTextToolCalls(msg.content ?? "").trim() : msg.content;
    if (textWithoutToolCalls) blocks.push({ type: "text", text: textWithoutToolCalls });
    for (const call of msg.tool_calls ?? []) {
      blocks.push({ type: "tool_use", toolUseId: call.id, toolName: call.function.name, toolInput: call.function.arguments });
    }
    blocks.push(...textToolCalls);
    return blocks;
  }

  /**
   * Parses XML-like text tool calls emitted by some local models.
   *
   * @param content Assistant text that may contain `<function=...>` blocks.
   * @returns Tool-use blocks extracted from the text.
   */
  private parseTextToolCalls(content: string): Block[] {
    const blocks: Block[] = [];
    const functionRe = /<function=([A-Za-z0-9_-]+)>\s*([\s\S]*?)<\/function>\s*(?:<\/tool_call>)?/g;
    for (const match of content.matchAll(functionRe)) {
      const [, toolName, body] = match;
      const params: Record<string, string> = {};
      const parameterRe = /<parameter=([A-Za-z0-9_-]+)>\s*([\s\S]*?)\s*<\/parameter>/g;
      for (const paramMatch of body.matchAll(parameterRe)) {
        const [, name, value] = paramMatch;
        params[name] = value.trim();
      }
      blocks.push({ type: "tool_use", toolUseId: `text_tool_${this.textToolCallCounter++}`, toolName, toolInput: JSON.stringify(params) });
    }
    return blocks;
  }

  /**
   * Removes XML-like text tool calls from assistant text after parsing them.
   *
   * @param content Assistant text that may contain text tool calls.
   * @returns Remaining assistant text.
   */
  private removeTextToolCalls(content: string): string {
    return content.replace(/<function=([A-Za-z0-9_-]+)>\s*[\s\S]*?<\/function>\s*(?:<\/tool_call>)?/g, "");
  }
}
