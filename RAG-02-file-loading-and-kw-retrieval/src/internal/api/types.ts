export type Role = "user" | "assistant";
export type StopReason = "end_turn" | "tool_use" | "max_tokens" | string;

export type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; toolUseId: string; toolName: string; toolInput: string }
  | { type: "tool_result"; toolUseId: string; toolResult: string; isError: boolean };

export interface Message {
  role: Role;
  content: Block[];
}

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  required?: string[];
}

export interface LLMResponse {
  content: Block[];
  stopReason: StopReason;
}
