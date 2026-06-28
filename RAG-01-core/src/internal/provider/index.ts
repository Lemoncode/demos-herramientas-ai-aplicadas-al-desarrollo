import type { LLMResponse, Message } from "../api/types.js";

export interface Provider {
	send(messages: Message[]): Promise<LLMResponse>;
	model(): string;
	setModel(name: string): void;
}

// Thrown by provider adapters when the API returns an unrecoverable error.
export class ProviderError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
		public readonly retryable: boolean = false,
	) {
		super(message);
		this.name = "ProviderError";
	}
}
