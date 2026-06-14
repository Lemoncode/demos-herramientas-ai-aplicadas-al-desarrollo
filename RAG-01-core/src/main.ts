// §00 Introduction — REPL entry point and harness wiring.
// This file is the only place that instantiates providers, registers tools,
// and starts the read-eval-print loop.
//
// Outer loop (REPL): "read a line → run agent → print → wait for next"
// Inner loop (agent): in src/internal/agent/loop.ts
//
// Provider is selected via PROVIDER env var:
//   PROVIDER=anthropic  →  AnthropicProvider (uses ANTHROPIC_API_KEY)
//   PROVIDER=openai     →  OpenAIProvider    (uses OPENAI_API_KEY)
//   PROVIDER=ollama     →  OpenAIProvider    (uses OLLAMA_BASE_URL, no key)

import * as readline from "readline";
import dotenv from "dotenv";
import type { Provider } from "./internal/provider/index.js";
import { AnthropicProvider } from "./internal/provider/anthropic.js";
import { OpenAIProvider } from "./internal/provider/openai.js";
import { Registry } from "./internal/tool/registry.js";
import { BashTool } from "./internal/tool/bash.js";
import { ReadFileTool } from "./internal/tool/read-file.js";
import { WriteFileTool } from "./internal/tool/write-file.js";
import { runAgentLoop } from "./internal/agent/loop.js";
import { printText, printError, printInfo, printPrompt } from "./internal/ui/output.js";
import type { Message } from "./internal/api/types.js";

dotenv.config();

const SYSTEM_PROMPT = `You are a helpful coding assistant.

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

function buildProvider(): Provider {
  const providerName = (process.env.PROVIDER ?? "anthropic").toLowerCase();

  switch (providerName) {
    case "anthropic":
      return new AnthropicProvider(SYSTEM_PROMPT);
    case "openai":
      return new OpenAIProvider(
        SYSTEM_PROMPT,
        process.env.OPENAI_MODEL ?? "gpt-4o",
        process.env.OPENAI_API_KEY,
        process.env.OPENAI_BASE_URL
      );
    case "ollama":
      return new OpenAIProvider(
        SYSTEM_PROMPT,
        process.env.OLLAMA_MODEL ?? "llama3.2",
        "ollama",
        process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1"
      );
    default:
      throw new Error(
        `Unknown provider: ${providerName}. Use anthropic, openai, or ollama.`
      );
  }
}

function buildRegistry(): Registry {
  const registry = new Registry();
  // §09: Register tools explicitly (TypeScript has no init() equivalent).
  // The registry dispatches by name — order doesn't matter here.
  registry.register(new BashTool());
  registry.register(new ReadFileTool());
  registry.register(new WriteFileTool());
  return registry;
}

async function main(): Promise<void> {
  printText("\x1b[1m\x1b[36m╔══════════════════════════════╗\x1b[0m");
  printText("\x1b[1m\x1b[36m║   Harness 01 — Core Agent    ║\x1b[0m");
  printText("\x1b[1m\x1b[36m╚══════════════════════════════╝\x1b[0m");

  const provider = (() => {
    try {
      return buildProvider();
    } catch (err: unknown) {
      printError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  })();

  const registry = buildRegistry();

  // §06 Conversation State: the full message history for this session.
  // Passed by reference to the agent loop, which appends to it each turn.
  const messages: Message[] = [];

  printInfo(`Provider: ${process.env.PROVIDER ?? "anthropic"} / Model: ${provider.model()}`);
  printInfo("Type your message. /clear to reset, /exit to quit.");
  printText("");

  // §01 The REPL — outer loop reads one line at a time
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: !!process.stdout.isTTY,
  });

  const confirmWithRl = (prompt: string): Promise<boolean> =>
    new Promise((resolve) => {
      rl.question(`\x1b[33m${prompt}\x1b[0m [y/n] `, (answer) => {
        const trimmed = answer.trim().toLowerCase();
        resolve(trimmed === "y" || trimmed === "yes");
      });
    });

  printPrompt();

  for await (const line of rl) {
    const trimmed = line.trim();

    if (!trimmed) {
      printPrompt();
      continue;
    }

    // Minimal slash commands — full system added in harness-02
    if (trimmed === "/exit" || trimmed === "/quit") {
      printText("Goodbye.");
      break;
    }

    if (trimmed === "/clear") {
      // §06: Truncate to length 0 reuses the underlying array storage
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

    // Append the user's message to history
    messages.push({
      role: "user",
      content: [{ type: "text", text: trimmed }],
    });

    // Run the agent loop — mutates messages in place
    await runAgentLoop(provider, registry, messages, {
      requireConfirm: true,
      confirm: confirmWithRl,
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
