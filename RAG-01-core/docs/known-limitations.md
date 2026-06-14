# Known Limitations

Harness 01 is deliberately minimal. These are current design limits, not
surprises.

## No Tool Sandboxing

`bash`, `read_file`, and `write_file` run with the process permissions available
to Node. The interactive confirmation prompt is the main guardrail.

## No Path Restrictions

The file tools accept absolute paths or paths relative to the current working
directory. They do not enforce a workspace root.

## Minimal Slash Commands

Only `/help`, `/clear`, `/exit`, and `/quit` are implemented.

There is no command registry, command argument parsing, model switching command,
or session export command yet.

## In-Memory Conversation Only

Conversation state is stored in a local array. It is not persisted to disk. When
the process exits, the session is gone.

## Full History Sent Every Time

Every provider call receives the full message array. There is no summarization,
truncation, token budgeting, or context window management.

## No Streaming

Provider responses are handled after the API returns a complete response. The
terminal does not stream assistant text or incremental tool-call deltas.

## Limited Provider Normalization

The provider protocol supports text, tool use, and tool results. Provider-native
features outside that protocol are ignored or unavailable.

Examples:

- Anthropic thinking blocks are skipped.
- Anthropic server tool blocks are skipped.
- OpenAI-specific response metadata is not exposed.

## No Automated Retries

Provider adapters mark 429 and 5xx errors as retryable, but the agent loop does
not retry them yet.

## Basic Terminal UX

The terminal UI uses ANSI labels and a simple readline prompt. There is no
multi-line editor, command history management beyond readline defaults, rich
rendering, or interactive tool result expansion.
