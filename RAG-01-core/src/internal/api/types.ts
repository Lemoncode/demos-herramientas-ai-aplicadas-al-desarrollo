// Foundation types shared by every layer. This package depends on nothing.

export type Role = "user" | "assistant";
export type StopReason = "end_turn" | "max_tokens" | string;

export type Block = { type: "text"; text: string };

// A single turn in the conversation.
// Models are stateless — every API call receives the full message history.
// Clearing state = truncating this array to length 0.
export interface Message {
  role: Role;
  content: Block[];
}

// What the provider returns after one API round-trip.
export interface LLMResponse {
  content: Block[];
  stopReason: StopReason;
}
