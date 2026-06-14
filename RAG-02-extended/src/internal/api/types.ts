// §01 The Agent Loop + §03 The Provider Interface
// Foundation types shared by every layer. This package depends on nothing.
// All other internal packages import from here.

export type Role = "user" | "assistant";
export type StopReason = "end_turn" | "tool_use" | "max_tokens" | string;

// §01: Content blocks use a discriminated union on `type`.
// TypeScript enforces which fields are present per block kind —
// accessing toolName on a "text" block is a compile-time error.
//
// "text"        → text (the assistant's prose output)
// "tool_use"    → toolUseId, toolName, toolInput (raw JSON string)
// "tool_result" → toolUseId, toolResult, isError
//
// §02: isError must be true on denials and tool failures — setting it false
// misleads the model into thinking the call succeeded.
export type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; toolUseId: string; toolName: string; toolInput: string }
  | { type: "tool_result"; toolUseId: string; toolResult: string; isError: boolean };

// A single turn in the conversation.
// §06 Conversation State: models are stateless. Every API call receives the
// full message history. Clearing state = truncating this array to length 0.
export interface Message {
  role: Role;
  content: Block[];
}

// Describes a tool the model can invoke.
// §09 Plug-and-Play Tools: the model selects tools based on name + description.
// inputSchema is a JSON Schema "properties" object (NOT the full schema wrapper).
// Each provider adapter wraps it in { type: "object", properties: ..., required: ... }.
// The required field here is lifted into that wrapper by each adapter.
export interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  required?: string[];
}

// What the provider returns after one API round-trip.
// Named LLMResponse (not Response) to avoid shadowing the global Fetch API Response.
export interface LLMResponse {
  content: Block[];
  stopReason: StopReason;
}
