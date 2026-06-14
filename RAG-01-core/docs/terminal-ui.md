# Terminal UI

The terminal-facing pieces live in:

- `src/main.ts`
- `src/internal/ui/output.ts`
- `src/internal/ui/confirm.ts`

## Startup Banner

`main.ts` prints a banner, selected provider, and active model when the process
starts.

It then prints:

```text
Type your message. /clear to reset, /exit to quit.
```

## Prompt

The prompt is printed by `printPrompt()`:

```text
>
```

The prompt is printed after startup, after blank input, after slash commands, and
after each completed assistant turn.

## Slash Commands

Handled directly in `main.ts`:

- `/exit`
- `/quit`
- `/clear`
- `/help`

The current command system is intentionally minimal. Comments in the source note
that a fuller slash command system belongs in a later harness.

## Output Helpers

File: `src/internal/ui/output.ts`

All terminal output goes through small helper functions:

- `printText(text)`
- `printError(message)`
- `printToolCall(name, input)`
- `printToolResult(result, isError)`
- `printInfo(message)`
- `printPrompt()`

Tool calls are printed before execution. Tool results are printed after
execution and truncated to 200 characters to keep the REPL readable.

ANSI colors are used for labels:

- Red for errors.
- Yellow for tool calls and confirmation prompts.
- Green for successful tool results.
- Cyan for informational messages.

## Confirmation Prompt

File: `src/internal/ui/confirm.ts`

`confirm(prompt)` creates a short-lived `readline` interface and asks:

```text
approve <tool>? [y/n]
```

Only `y` and `yes` approve. Empty input, EOF, and unrecognized answers deny.

The function creates a fresh `readline` reader for each prompt. This works
because the outer REPL is awaiting the agent loop while confirmation is active.
