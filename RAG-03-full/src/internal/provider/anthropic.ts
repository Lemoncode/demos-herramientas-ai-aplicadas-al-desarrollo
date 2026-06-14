// §03 The Provider Interface — Anthropic Claude adapter.
// §17 Prompt Caching — adds cache_control: { type: "ephemeral" } to:
//   1. The system prompt (largest static block — highest cache value)
//   2. The last tool in the sorted list (caches the entire tool prefix)
//   3. The last few user messages (caches the longest matching prefix)
//
// Caching reduces cost ~10% on cached segments.
// §17 Pitfall: Compaction rewrites the message prefix, invalidating the cache.
// Each SlidingWindow or Summarize compaction resets the 5-minute cache TTL.

import Anthropic from "@anthropic-ai/sdk";
import type { Provider } from "./index.js";
import { ProviderError } from "./index.js";
import type { Message, ToolDef, LLMResponse, Block } from "../api/types.js";

export class AnthropicProvider implements Provider {
  private client: Anthropic;
  private currentModel: string;
  private system: string;

  constructor(
    system: string,
    modelId = "claude-opus-4-7-20251101",
    apiKey = process.env.ANTHROPIC_API_KEY
  ) {
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is required");
    this.client = new Anthropic({ apiKey });
    this.currentModel = modelId;
    this.system = system;
  }

  async send(messages: Message[], tools: ToolDef[]): Promise<LLMResponse> {
    try {
      const resp = await this.client.messages.create({
        model: this.currentModel,
        max_tokens: 8096,
        // §17: Cache the system prompt — static across all turns, highest cache value
        system: [
          {
            type: "text",
            text: this.system,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: this.toAnthropicMessages(messages),
        tools: this.toAnthropicTools(tools),
      });

      return {
        content: this.fromAnthropicContent(resp.content),
        stopReason: resp.stop_reason ?? "end_turn",
      };
    } catch (err) {
      if (err instanceof Anthropic.APIError) {
        throw new ProviderError(
          err.message,
          err.status,
          err.status >= 500 || err.status === 429
        );
      }
      throw err;
    }
  }

  model(): string { return this.currentModel; }
  setModel(name: string): void { this.currentModel = name; }

  private toAnthropicMessages(messages: Message[]): Anthropic.MessageParam[] {
    return messages.map((msg, idx) => ({
      role: msg.role,
      content: msg.content.map((b, bIdx): Anthropic.ContentBlockParam => {
        // §17: Cache the last 3 messages — Anthropic caches the longest matching prefix,
        // so caching near the end of history has the most value per call.
        const isRecentMsg = idx >= messages.length - 3;
        const isLastBlock = bIdx === msg.content.length - 1;
        // §17: Caching only applies to text blocks — tool_use/tool_result blocks
        // are not cacheable in this position. Restrict to text to make intent clear.
        const shouldCache = isRecentMsg && isLastBlock && b.type === "text";

        if (b.type === "text") {
          return {
            type: "text",
            text: b.text,
            ...(shouldCache ? { cache_control: { type: "ephemeral" } } : {}),
          };
        }
        if (b.type === "tool_use") {
          return {
            type: "tool_use",
            id: b.toolUseId,
            name: b.toolName,
            input: JSON.parse(b.toolInput) as Record<string, unknown>,
          };
        }
        // tool_result
        return {
          type: "tool_result",
          tool_use_id: b.toolUseId,
          content: b.toolResult,
          is_error: b.isError,
        };
      }),
    }));
  }

  private toAnthropicTools(tools: ToolDef[]): Anthropic.Tool[] {
    const sorted = [...tools].sort((a, b) => a.name.localeCompare(b.name));
    return sorted.map((t, idx) => ({
      name: t.name,
      description: t.description,
      input_schema: {
        type: "object" as const,
        properties: t.inputSchema,
        required: t.required ?? [],
      },
      // §17: Cache the last tool to cache the full sorted tool list as a prefix
      ...(idx === sorted.length - 1
        ? { cache_control: { type: "ephemeral" } }
        : {}),
    }));
  }

  private fromAnthropicContent(content: Anthropic.ContentBlock[]): Block[] {
    const blocks: Block[] = [];
    for (const b of content) {
      if (b.type === "text") {
        blocks.push({ type: "text", text: b.text });
      } else if (b.type === "tool_use") {
        blocks.push({
          type: "tool_use",
          toolUseId: b.id,
          toolName: b.name,
          toolInput: JSON.stringify(b.input),
        });
      }
      // Skip thinking, redacted_thinking, server_tool_use, web_search_tool_result —
      // these are internal SDK block types not part of the harness protocol.
    }
    return blocks;
  }
}
