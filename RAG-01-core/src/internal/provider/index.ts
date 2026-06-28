// §03 The Provider Interface
// A minimal contract that lets the agent loop call any LLM without knowing
// which SDK is in use. "The only place in the harness that imports [sdk]"
// is the adapter — never the loop or tools.

import type { Message, ToolDef, LLMResponse } from "../api/types.js";

export interface Provider {
  send(messages: Message[], tools: ToolDef[]): Promise<LLMResponse>;
  model(): string;
  setModel(name: string): void;
}

// Thrown by provider adapters when the API returns an unrecoverable error.
// The agent loop catches this, logs to stderr, and returns to the REPL
// without killing the session.
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
    // true for 429 / 5xx — reserved for retry logic (§13+)
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
