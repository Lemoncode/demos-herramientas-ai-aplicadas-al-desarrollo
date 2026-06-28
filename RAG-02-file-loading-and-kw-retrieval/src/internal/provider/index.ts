import type { LLMResponse, Message, ToolDef } from "../api/types.js";

export interface Provider {
	send(messages: Message[], tools: ToolDef[]): Promise<LLMResponse>;
	model(): string;
	setModel(name: string): void;
}

export class ProviderError extends Error {
	/**
	 * Creates an error wrapper for provider API failures.
	 *
	 * @param message Error message from the provider.
	 * @param statusCode Optional HTTP status code.
	 * @param retryable Whether retry logic could reasonably try again.
	 */
	constructor(
		message: string,
		public readonly statusCode?: number,
		public readonly retryable: boolean = false,
	) {
		super(message);
		this.name = "ProviderError";
	}
}
