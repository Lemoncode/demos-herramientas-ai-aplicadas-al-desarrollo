# Getting Started

## Requirements

- Node.js with ESM support.
- npm.
- A local Ollama server.

Dependencies are declared in `package.json`:

- Runtime: `@anthropic-ai/sdk`, `openai`.
- Development: `tsx`, `typescript`, `@types/node`.

## Install

```sh
npm install
```

The repository currently includes `package-lock.json`, so npm will install the
same dependency graph recorded in the lockfile.

## Configure Ollama

Start Ollama and make sure the model is available:

```sh
ollama pull qwen3-coder:30b
```

The harness uses Ollama by default:

- `OLLAMA_MODEL`: overrides the default Ollama model, `qwen3-coder:30b`.
- `OLLAMA_BASE_URL`: defaults to `http://localhost:11434/v1`.

## Run

```sh
npm run dev
```

This executes:

```sh
tsx src/main.ts
```

At startup, the CLI prints the Ollama model, then waits for user input at a `>`
prompt.

## Typecheck

```sh
npm run typecheck
```

This runs:

```sh
tsc --noEmit
```

## REPL Commands

- `/help`: prints the available commands.
- `/clear`: clears the in-memory conversation history.
- `/exit` or `/quit`: closes the REPL.

Any other non-empty line is appended to the conversation as a user message and
sent through the agent loop.
