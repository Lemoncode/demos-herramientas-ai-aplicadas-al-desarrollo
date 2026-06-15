import Anthropic from "@anthropic-ai/sdk";
import type { Block, LLMResponse, Message, ToolDef } from "../api/types.js";
import type { Provider } from "./index.js";
import { ProviderError } from "./index.js";

export class AnthropicProvider implements Provider {
	private client: Anthropic;
	private currentModel: string;
	private system: string;

	constructor(
		system: string,
		modelId = "claude-opus-4-7-20251101",
		apiKey = process.env.ANTHROPIC_API_KEY,
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
				system: this.system,
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
					err.status >= 500 || err.status === 429,
				);
			}
			throw err;
		}
	}

	model(): string {
		return this.currentModel;
	}
	setModel(name: string): void {
		this.currentModel = name;
	}

	private toAnthropicMessages(messages: Message[]): Anthropic.MessageParam[] {
		return messages.map((msg) => ({
			role: msg.role,
			content: msg.content.map((b): Anthropic.ContentBlockParam => {
				if (b.type === "text") return { type: "text", text: b.text };
				if (b.type === "tool_use") {
					return {
						type: "tool_use",
						id: b.toolUseId,
						name: b.toolName,
						input: JSON.parse(b.toolInput) as Record<string, unknown>,
					};
				}
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
		return [...tools]
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((t) => ({
				name: t.name,
				description: t.description,
				input_schema: {
					type: "object" as const,
					properties: t.inputSchema,
					required: t.required ?? [],
				},
			}));
	}

	private fromAnthropicContent(content: Anthropic.ContentBlock[]): Block[] {
		const blocks: Block[] = [];
		for (const b of content) {
			if (b.type === "text") blocks.push({ type: "text", text: b.text });
			else if (b.type === "tool_use") {
				blocks.push({
					type: "tool_use",
					toolUseId: b.id,
					toolName: b.name,
					toolInput: JSON.stringify(b.input),
				});
			}
		}
		return blocks;
	}
}
