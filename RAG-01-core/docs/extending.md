# Extending the Harness

This harness is intentionally small, but the boundaries are designed so new
capabilities can be added without touching every layer.

## Add a Tool

1. Create a class in `src/internal/tool`.
2. Implement the `Tool` interface.
3. Return a clear `ToolDef` from `definition()`.
4. Parse the raw JSON string inside `execute()`.
5. Return `{ result, isError: true }` for expected failures.
6. Register the tool in `buildRegistry()` in `src/main.ts`.

Example shape:

```ts
export class ExampleTool implements Tool {
  definition(): ToolDef {
    return {
      name: "example",
      description: "Do one specific operation.",
      inputSchema: {
        value: { type: "string", description: "Input value" }
      },
      required: ["value"]
    };
  }

  async execute(rawInput: string): Promise<{ result: string; isError: boolean }> {
    // Parse, validate, execute, and return a result.
  }
}
```

Good tool descriptions tell the model when to use the tool, what inputs are
accepted, and what the result means.

## Add a Provider

1. Create a new adapter in `src/internal/provider`.
2. Implement `Provider`.
3. Translate harness `Message[]` into the provider's request format.
4. Translate `ToolDef[]` into the provider's tool/function format.
5. Translate provider responses into harness `Block[]`.
6. Convert provider errors into `ProviderError` where possible.
7. Add a case to `buildProvider()` in `src/main.ts`.

Provider adapters should be the only files that import provider SDKs.

## Add a Slash Command

Slash commands are currently handled inline in the REPL loop in `src/main.ts`.

To add one:

1. Check `trimmed` before appending a user message.
2. Perform the command action.
3. Print any output.
4. Print the prompt.
5. `continue` the REPL loop.

Commands that affect conversation state should operate on the same `messages`
array used by the REPL.

## Add Runtime Policy

The current permission gate is global and interactive. More detailed policy can
be added in a few places:

- Before calling `confirm()` in `runAgentLoop()`.
- Inside individual tools.
- In `Registry.execute()`.
- By replacing `requireConfirm` with a richer policy object.

Common next steps:

- Per-tool approval settings.
- Shell command allowlists or denylists.
- Workspace path restrictions for file tools.
- Non-interactive policy for automated runs.
- Tool execution audit logs.

## Add Retry Logic

`ProviderError` already includes a `retryable` flag. A retry layer could be added
around `provider.send()` in `runAgentLoop()`.

Retry behavior should consider:

- 429 rate limits.
- 5xx provider errors.
- Exponential backoff.
- Maximum retry count.
- Whether duplicate provider calls can repeat tool requests.

Do not retry tool execution blindly unless the tool itself is idempotent.
