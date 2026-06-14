# Harness 01 Core Documentation

This folder documents how `harness-01-core` works from the command line entry
point down to provider adapters, tools, conversation state, and terminal output.

The harness is a small TypeScript coding-agent shell. It runs a REPL, sends the
conversation history to an LLM provider, lets the model request tools, asks the
user for permission before executing those tools, appends tool results back into
the conversation, and repeats until the model finishes its turn.

## Documentation Map

- [Getting started](./getting-started.md): installation, environment variables,
  scripts, and provider selection.
- [Architecture](./architecture.md): module layout and end-to-end request flow.
- [Message protocol](./message-protocol.md): shared message, block, tool, and
  provider response types.
- [Agent loop](./agent-loop.md): the prompt -> provider -> tool -> result loop.
- [Providers](./providers.md): Anthropic, OpenAI, and Ollama-compatible adapters.
- [Tools and registry](./tools-and-registry.md): built-in tools, tool schemas,
  execution contracts, and registration.
- [Terminal UI](./terminal-ui.md): REPL commands, output helpers, and confirmation
  prompts.
- [Extending the harness](./extending.md): adding providers, tools, commands, and
  guardrails.
- [Known limitations](./known-limitations.md): intentional simplifications in
  this first harness.

## Source Map

```text
src/main.ts                         REPL entry point and dependency wiring
src/internal/api/types.ts            Provider-neutral message/tool types
src/internal/agent/loop.ts           Core agent loop
src/internal/provider/index.ts       Provider interface and ProviderError
src/internal/provider/anthropic.ts   Anthropic SDK adapter
src/internal/provider/openai.ts      OpenAI and Ollama-compatible adapter
src/internal/tool/registry.ts        Tool interface and dispatcher
src/internal/tool/bash.ts            Shell command tool
src/internal/tool/read-file.ts       File read tool
src/internal/tool/write-file.ts      File write tool
src/internal/ui/output.ts            Terminal formatting helpers
src/internal/ui/confirm.ts           Interactive approval prompt
```

## Mental Model

There are three important boundaries:

1. `main.ts` owns process setup, provider selection, tool registration, and the
   outer REPL.
2. `runAgentLoop()` owns one assistant turn, including all provider calls and
   tool execution needed to complete that turn.
3. Provider adapters translate between the harness protocol and SDK-specific
   request/response formats.

The rest of the code stays deliberately narrow: tools only execute work,
providers only translate and send model requests, and UI helpers only print to
the terminal.
