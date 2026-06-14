# Design: Extract helpers from main.ts for student clarity

**Date:** 2026-06-14  
**Goal:** Make `src/main.ts` readable as "just the REPL loop" so students can immediately locate and understand each part of the RAG harness.

---

## Problem

`main.ts` currently holds four unrelated concerns:

| Concern | What it is |
|---|---|
| `SYSTEM_PROMPT` | The AI's personality and tool-use rules |
| `buildRegistry()` | Which tools the agent can use |
| Provider IIFE | Wires OpenAIProvider to Ollama env vars |
| REPL loop | readline setup, slash commands, `runAgentLoop` call |

A student opening the file has to scroll past 46 lines of system prompt and setup code before seeing the actual loop logic.

---

## Solution

Extract the first three concerns into dedicated helpers in `src/`, leaving `main.ts` as the REPL.

---

## File Structure (after)

```
src/
  main.ts       ← REPL: readline loop, slash commands, runAgentLoop
  prompt.ts     ← NEW: SYSTEM_PROMPT constant
  setup.ts      ← NEW: buildProvider() + buildRegistry()
  internal/     ← unchanged
```

---

## File Responsibilities

### `src/prompt.ts`

Exports a single `SYSTEM_PROMPT` string. Students who want to change what the assistant is told open this file. No imports needed.

### `src/setup.ts`

Exports two factory functions:

- `buildProvider(): Provider` — reads `OLLAMA_MODEL` and `OLLAMA_BASE_URL` from env, constructs `OpenAIProvider`, exits on failure.
- `buildRegistry(): Registry` — instantiates and registers `BashTool`, `ReadFileTool`, `WriteFileTool`.

Imports: `Provider`, `OpenAIProvider`, `Registry`, all three tool classes, `SYSTEM_PROMPT`, `printError`.

### `src/main.ts` (after)

Imports `buildProvider`, `buildRegistry`, `runAgentLoop`, UI helpers, `Message` type.  
Contains only:
1. Banner print
2. Setup calls (`buildProvider`, `buildRegistry`, `messages` array)
3. `readline.createInterface`
4. The `for await` REPL loop with `/clear`, `/exit`, `/help`, and the `runAgentLoop` call

**Removed:** `confirmWithRl` closure. `runAgentLoop` will use the default `confirm` from `internal/ui/confirm.ts`, which is already safe when the REPL is suspended (the file's own comment confirms this).

---

## What Does NOT Change

- All files under `src/internal/` — no changes.
- No logic changes of any kind — this is a pure extraction refactor.
- Behaviour of the running program is identical.

---

## Success Criteria

- `npm run dev` works identically after the change.
- `npm run typecheck` passes with zero errors.
- A student can open `main.ts` and immediately see: setup → REPL loop → agent call.
- A student can open `prompt.ts` to change the system prompt.
- A student can open `setup.ts` to change the model or registered tools.
