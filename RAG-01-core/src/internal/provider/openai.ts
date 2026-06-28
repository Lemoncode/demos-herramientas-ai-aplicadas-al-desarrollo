import OpenAI from "openai";
import type { LLMResponse, Message } from "../api/types.js";
import type { Provider } from "./index.js";
import { ProviderError } from "./index.js";

export class OpenAIProvider implements Provider {
	private client: OpenAI;
	private currentModel: string;
	private systemPrompt: string;

	constructor(
		systemPrompt: string,
		modelId: string,
		apiKey?: string,
		baseURL?: string,
	) {
		this.client = new OpenAI({ apiKey: apiKey ?? "ollama", baseURL });
		this.currentModel = modelId;
		this.systemPrompt = systemPrompt;
	}

	async send(messages: Message[]): Promise<LLMResponse> {
		try {
			const resp = await this.client.chat.completions.create({
				model: this.currentModel,
				messages: [
					{ role: "system", content: this.systemPrompt },
					...messages.map((msg) => ({
						role: msg.role as "user" | "assistant",
						content: msg.content.map((b) => b.text).join("\n"),
					})),
				],
			});

			const choice = resp.choices[0];
			const text = choice.message.content ?? "";
			const stopReason =
				choice.finish_reason === "length" ? "max_tokens" : "end_turn";

			return {
				content: text ? [{ type: "text" as const, text }] : [],
				stopReason,
			};
		} catch (err) {
			if (err instanceof OpenAI.APIError) {
				throw new ProviderError(
					err.message,
					err.status,
					(err.status ?? 0) >= 500 || err.status === 429,
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
}
