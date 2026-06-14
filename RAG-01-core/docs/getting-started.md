# Getting Started

## Requirements

- Node.js with ESM support.
- npm.
- API credentials for the selected provider, unless using an OpenAI-compatible
  local Ollama server.

Dependencies are declared in `package.json`:

- Runtime: `@anthropic-ai/sdk`, `openai`, `dotenv`.
- Development: `tsx`, `typescript`, `@types/node`.

## Install

```sh
npm install
```

The repository currently includes `package-lock.json`, so npm will install the
same dependency graph recorded in the lockfile.

## Configure Environment

Copy `.env.example` to `.env` and fill in the values for the provider you want:

```sh
cp .env.example .env
```

Provider selection is controlled by `PROVIDER`.

```env
PROVIDER=anthropic
```

Supported values:

- `anthropic`: uses `AnthropicProvider` and requires `ANTHROPIC_API_KEY`.
- `openai`: uses `OpenAIProvider` and requires `OPENAI_API_KEY`.
- `ollama`: uses `OpenAIProvider` pointed at an OpenAI-compatible Ollama API.

Useful model variables:

- `OPENAI_MODEL`: overrides the default OpenAI model, `gpt-4o`.
- `OLLAMA_MODEL`: overrides the default Ollama model, `llama3.2`.
- `OLLAMA_BASE_URL`: defaults to `http://localhost:11434/v1`.
- `OPENAI_BASE_URL`: optional override for OpenAI-compatible APIs.

The Anthropic default model is set in `src/internal/provider/anthropic.ts`.

## Run

```sh
npm run dev
```

This executes:

```sh
tsx src/main.ts
```

At startup, the CLI prints the selected provider and model, then waits for user
input at a `>` prompt.

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
