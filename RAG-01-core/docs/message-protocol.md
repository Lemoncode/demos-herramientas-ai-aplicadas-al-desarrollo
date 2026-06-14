# Message Protocol

The shared protocol lives in `src/internal/api/types.ts`. It is the contract
between the REPL, the agent loop, providers, and tools.

## Role

```ts
export type Role = "user" | "assistant";
```

The harness only stores `user` and `assistant` messages. Provider adapters are
responsible for translating this into provider-specific roles. For example,
OpenAI requires tool results to use role `tool`, so `OpenAIProvider` converts
harness `tool_result` blocks into OpenAI tool messages.

## Block

Messages contain content blocks:

```ts
export type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; toolUseId: string; toolName: string; toolInput: string }
  | { type: "tool_result"; toolUseId: string; toolResult: string; isError: boolean };
```

### `text`

Plain assistant or user text.

### `tool_use`

A model request to run a tool. The `toolInput` is a raw JSON string so providers
can preserve the exact function-call argument payload.

Important fields:

- `toolUseId`: provider-generated ID that must be echoed back in the result.
- `toolName`: registry lookup key.
- `toolInput`: JSON string passed to the tool implementation.

### `tool_result`

The result of executing or denying a tool call.

Important fields:

- `toolUseId`: must match the original `tool_use` block.
- `toolResult`: text sent back to the model.
- `isError`: `true` for failures and user denials.

The `isError` flag matters because it tells the model whether it should treat the
result as successful evidence or as feedback to recover from.

## Message

```ts
export interface Message {
  role: Role;
  content: Block[];
}
```

The session conversation is an array of `Message`. The full array is sent on
every provider call because LLM APIs are stateless.

`/clear` works by setting the array length to `0`.

## ToolDef

```ts
export interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  required?: string[];
}
```

`inputSchema` is the JSON Schema `properties` object, not the full schema
wrapper. Provider adapters wrap it into their expected tool format.

The model chooses tools based on `name`, `description`, and schema fields, so
tool descriptions should be explicit and operational.

## LLMResponse

```ts
export interface LLMResponse {
  content: Block[];
  stopReason: StopReason;
}
```

The provider returns one response in harness format. `stopReason` controls
whether the agent loop should continue executing tool calls or return to the
REPL.
