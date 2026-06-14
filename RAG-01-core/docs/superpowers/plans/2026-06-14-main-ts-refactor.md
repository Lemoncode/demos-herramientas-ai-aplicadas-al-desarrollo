# main.ts Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract `SYSTEM_PROMPT`, `buildProvider`, and `buildRegistry` out of `main.ts` into flat helpers so students see `main.ts` as a pure REPL loop.

**Architecture:** Create `src/prompt.ts` (system prompt) and `src/setup.ts` (factory functions). Slim `main.ts` down to banner + setup calls + readline REPL. No logic changes — pure extraction refactor.

**Tech Stack:** TypeScript, Node.js, tsx (dev runner). `npm run typecheck` is the test harness for this refactor.

---

## File Map

| File | Action | Responsibility after |
|---|---|---|
| `src/prompt.ts` | Create | Single `SYSTEM_PROMPT` export |
| `src/setup.ts` | Create | `buildProvider()` + `buildRegistry()` exports |
| `src/main.ts` | Modify | Banner, setup calls, readline REPL loop |

`src/internal/` — untouched.

---

### Task 1: Create `src/prompt.ts`

**Files:**
- Create: `src/prompt.ts`

- [ ] **Step 1: Create the file with SYSTEM_PROMPT extracted from main.ts**

Write `src/prompt.ts` with this exact content:

```ts
export const SYSTEM_PROMPT = `You are a helpful coding assistant.

You have access to tools for reading and writing files and running shell commands.
Use tools only when the user explicitly asks to run a command or when a task
cannot be completed without tools (for example: inspecting files, editing code,
or running a build). For normal conversation, greetings, or questions, respond
directly without calling tools.

Tool-use checklist:
1) Do I need external state (file contents, directory listing, command output)
  to answer correctly? If not, do not use a tool.
2) Did the user explicitly ask to run a command or change a file? If not, ask a
  clarifying question before using a tool.
3) If editing a file, read it first unless the user provided the exact content
  and location to write.

If the user asks about the contents of a file, you MUST call the read_file tool
to read it. Never claim to have read or seen a file unless you used the tool.

If the user input looks like natural language (not a shell command), do not call
the bash tool.`;
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: zero errors. (At this point `main.ts` still defines `SYSTEM_PROMPT` — that's fine, it will be removed in Task 3.)

---

### Task 2: Create `src/setup.ts`

**Files:**
- Create: `src/setup.ts`

- [ ] **Step 1: Create the file with both factory functions**

Write `src/setup.ts` with this exact content:

```ts
import type { Provider } from "./internal/provider/index.js";
import { OpenAIProvider } from "./internal/provider/openai.js";
import { Registry } from "./internal/tool/registry.js";
import { BashTool } from "./internal/tool/bash.js";
import { ReadFileTool } from "./internal/tool/read-file.js";
import { WriteFileTool } from "./internal/tool/write-file.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { printError } from "./internal/ui/output.js";

export function buildProvider(): Provider {
  try {
    return new OpenAIProvider(
      SYSTEM_PROMPT,
      process.env.OLLAMA_MODEL ?? "qwen3-coder:30b",
      "ollama",
      process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
    );
  } catch (err: unknown) {
    printError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

export function buildRegistry(): Registry {
  const registry = new Registry();
  registry.register(new BashTool());
  registry.register(new ReadFileTool());
  registry.register(new WriteFileTool());
  return registry;
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: zero errors.

---

### Task 3: Slim down `src/main.ts`

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Replace main.ts with the slimmed version**

Replace the entire contents of `src/main.ts` with:

```ts
// Entry point: REPL that wires the agent to the terminal.
// - src/prompt.ts  defines what the assistant is told
// - src/setup.ts   builds the provider and tool registry
// - src/internal/agent/loop.ts  handles one assistant turn

import * as readline from "readline";
import { buildProvider, buildRegistry } from "./setup.js";
import { runAgentLoop } from "./internal/agent/loop.js";
import {
  printText,
  printError,
  printInfo,
  printPrompt,
} from "./internal/ui/output.js";
import type { Message } from "./internal/api/types.js";

async function main(): Promise<void> {
  printText("\x1b[1m\x1b[36m╔══════════════════════════════╗\x1b[0m");
  printText("\x1b[1m\x1b[36m║   RAG 01 — Core Agent    ║\x1b[0m");
  printText("\x1b[1m\x1b[36m╚══════════════════════════════╝\x1b[0m");

  const provider = buildProvider();
  const registry = buildRegistry();
  const messages: Message[] = [];

  printInfo(`Provider: ollama / Model: ${provider.model()}`);
  printInfo("Type your message. /clear to reset, /exit to quit.");
  printText("");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: !!process.stdout.isTTY,
  });

  printPrompt();

  for await (const line of rl) {
    const trimmed = line.trim();

    if (!trimmed) {
      printPrompt();
      continue;
    }

    if (trimmed === "/exit" || trimmed === "/quit") {
      printText("Goodbye.");
      break;
    }

    if (trimmed === "/clear") {
      messages.length = 0;
      printInfo("Conversation cleared.");
      printPrompt();
      continue;
    }

    if (trimmed === "/help") {
      printText("Commands: /clear, /exit (/quit), /help");
      printText("Full slash command system available in harness-02.");
      printPrompt();
      continue;
    }

    messages.push({
      role: "user",
      content: [{ type: "text", text: trimmed }],
    });

    await runAgentLoop(provider, registry, messages, {
      requireConfirm: true,
    });

    printText("");
    printPrompt();
  }

  rl.close();
}

main().catch((err: unknown) => {
  printError((err as Error).message);
  process.exit(1);
});
```

**What changed vs the original:**
- Removed `SYSTEM_PROMPT` constant (now in `src/prompt.ts`)
- Removed `buildRegistry()` function (now in `src/setup.ts`)
- Replaced provider IIFE with `buildProvider()` call (now in `src/setup.ts`)
- Removed `confirmWithRl` closure — `runAgentLoop` falls back to the default `confirm` from `internal/ui/confirm.ts`, which is safe because `rl` is suspended while the agent runs
- Added import from `./setup.js`
- Removed imports for `Provider`, `OpenAIProvider`, `Registry`, `BashTool`, `ReadFileTool`, `WriteFileTool`

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/prompt.ts src/setup.ts src/main.ts docs/superpowers/
git commit -m "refactor: extract prompt and setup helpers from main.ts for student clarity"
```

---

## Self-Review Checklist

- Spec requirement "SYSTEM_PROMPT → src/prompt.ts": covered by Task 1
- Spec requirement "buildProvider + buildRegistry → src/setup.ts": covered by Task 2
- Spec requirement "main.ts is just the REPL": covered by Task 3
- Spec requirement "confirmWithRl removed, use default confirm": covered by Task 3 step 1
- Spec requirement "npm run typecheck passes": covered by typecheck steps in each task
- Spec requirement "npm run dev works identically": not automatically tested — manual verification recommended after Task 3
- No placeholders, no TBDs, all code is complete
- Type `Provider` is the interface from `src/internal/provider/index.ts` — used consistently in `setup.ts` return annotation and imported correctly
