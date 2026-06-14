// §03 The Provider Interface
// A minimal contract that lets the agent loop call any LLM without knowing
// which SDK is in use. "The only place in the harness that imports [sdk]"
// is the adapter — never the loop or tools.

import type { Message, ToolDef, LLMResponse } from "../api/types.js";

export interface Provider {
  // Send the full conversation history and available tools.
  // Returns the model's response. Throws ProviderError on unrecoverable failure.
  send(messages: Message[], tools: ToolDef[]): Promise<LLMResponse>;

  // The current model identifier (e.g. "claude-opus-4-7-20251101", "gpt-4o")
  model(): string;

  // Switch models at runtime — wired to the /model slash command (§05).
  // No validation here; the API layer rejects unknown models.
  setModel(name: string): void;
}

// Thrown by provider adapters when the API returns an unrecoverable error.
// The agent loop catches this, logs to stderr, and returns to the REPL
// without killing the session.
export class ProviderError extends Error {
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
