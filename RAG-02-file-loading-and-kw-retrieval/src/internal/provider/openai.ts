import OpenAI from "openai";
import type { Provider } from "./index.js";
import { ProviderError } from "./index.js";
import type { Message, ToolDef, LLMResponse, Block, StopReason } from "../api/types.js";

export class OpenAIProvider implements Provider {
  private client: OpenAI;
  private currentModel: string;
  private system: string;
  private textToolCallCounter = 0;

  constructor(system: string, modelId = "gpt-4o", apiKey?: string, baseURL?: string) {
    this.client = new OpenAI({ apiKey: apiKey ?? "ollama", baseURL });
    this.currentModel = modelId;
    this.system = system;
  }

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

  model(): string { return this.currentModel; }
  setModel(name: string): void { this.currentModel = name; }

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

  private toOpenAITools(tools: ToolDef[]): OpenAI.ChatCompletionTool[] {
    return [...tools].sort((a, b) => a.name.localeCompare(b.name)).map((t) => ({
      type: "function" as const,
      function: { name: t.name, description: t.description, parameters: { type: "object", properties: t.inputSchema, required: t.required ?? [] } },
    }));
  }

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

  private removeTextToolCalls(content: string): string {
    return content.replace(/<function=([A-Za-z0-9_-]+)>\s*[\s\S]*?<\/function>\s*(?:<\/tool_call>)?/g, "");
  }
}
