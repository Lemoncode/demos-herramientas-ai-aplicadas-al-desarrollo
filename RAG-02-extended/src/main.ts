// §00 Introduction + §10 Project Structure + §11 Subagents — wiring entry point.
//
// This file:
//   1. Builds the provider, registry, compactor, and permission policy
//   2. Registers subagents and their DelegateTools
//      (DelegateTool lives here to avoid the tool→subagent→agent→tool import cycle)
//   3. Creates the Agent instance
//   4. Runs the REPL with slash command dispatch

import * as readline from "readline";
import dotenv from "dotenv";
import type { Provider } from "./internal/provider/index.js";
import { AnthropicProvider } from "./internal/provider/anthropic.js";
import { OpenAIProvider } from "./internal/provider/openai.js";
import { Registry } from "./internal/tool/registry.js";
import { BashTool } from "./internal/tool/bash.js";
import { ReadFileTool } from "./internal/tool/read-file.js";
import { WriteFileTool } from "./internal/tool/write-file.js";
import type { CompactionStrategy } from "./internal/compact/index.js";
import { NoCompaction } from "./internal/compact/no-compaction.js";
import { SlidingWindow } from "./internal/compact/sliding-window.js";
import { Summarize } from "./internal/compact/summarize.js";
import type { PermissionPolicy } from "./internal/permission/index.js";
import { AlwaysAllow } from "./internal/permission/always-allow.js";
import { AlwaysAsk } from "./internal/permission/always-ask.js";
import { AllowList } from "./internal/permission/allow-list.js";
import { Agent } from "./internal/agent/agent.js";
import { ResearchSubagent } from "./internal/subagent/research.js";
import type { Tool } from "./internal/tool/registry.js";
import type { ToolDef } from "./internal/api/types.js";
import { handleCommand } from "./commands.js";
import { printText, printError, printInfo, printPrompt } from "./internal/ui/output.js";

dotenv.config();

const SYSTEM_PROMPT = `You are a helpful coding assistant with access to tools for
reading/writing files and running shell commands.

When you need to research multiple files without modifying them, use the
delegate_research tool rather than reading files yourself — it spawns a
dedicated read-only sub-agent for the task.

Use tools to help the user with coding tasks. When exploring files, use
read_file or delegate_research rather than guessing at file contents.`;

// §11 DelegateTool — wraps a Subagent as a Tool so the model can invoke it.
// Lives in main.ts to avoid the circular import: tool → subagent → agent → tool.
class DelegateTool implements Tool {
  constructor(
    private readonly subagentName: string,
    private readonly subagentDescription: string,
    private readonly runFn: (task: string) => Promise<string>
  ) {}

  definition(): ToolDef {
    return {
      name: `delegate_${this.subagentName}`,
      description: this.subagentDescription,
      inputSchema: {
        task: {
          type: "string",
          description: "The task to delegate to the sub-agent",
        },
      },
      required: ["task"],
    };
  }

  async execute(rawInput: string): Promise<{ result: string; isError: boolean }> {
    try {
      const parsed = JSON.parse(rawInput) as { task?: string };
      const task = parsed.task ?? rawInput;
      const result = await this.runFn(task);
      return { result, isError: false };
    } catch (err: unknown) {
      return { result: err instanceof Error ? err.message : String(err), isError: true };
    }
  }
}

function buildProvider(system: string): Provider {
  const name = (process.env.PROVIDER ?? "anthropic").toLowerCase();
  switch (name) {
    case "anthropic":
      return new AnthropicProvider(system);
    case "openai":
      return new OpenAIProvider(
        system,
        process.env.OPENAI_MODEL ?? "gpt-4o",
        process.env.OPENAI_API_KEY,
        process.env.OPENAI_BASE_URL
      );
    case "ollama":
      return new OpenAIProvider(
        system,
        process.env.OLLAMA_MODEL ?? "llama3.2",
        "ollama",
        process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1"
      );
    default:
      throw new Error(`Unknown provider: ${name}. Use anthropic, openai, or ollama.`);
  }
}

function buildCompactor(provider: Provider): CompactionStrategy {
  const strategy = (process.env.COMPACTION ?? "none").toLowerCase();
  switch (strategy) {
    case "sliding": return new SlidingWindow(20);
    case "summarize": return new Summarize(provider);
    default: return new NoCompaction();
  }
}

function buildPermissionPolicy(
  confirmFn: (prompt: string) => Promise<boolean>
): PermissionPolicy {
  const policy = (process.env.PERMISSION_POLICY ?? "always-ask").toLowerCase();
  switch (policy) {
    case "always-allow": return new AlwaysAllow();
    case "allow-list": {
      const tools = (process.env.ALLOW_LIST_TOOLS ?? "read_file")
        .split(",")
        .map((s) => s.trim());
      return new AllowList(tools);
    }
    default: return new AlwaysAsk(confirmFn);
  }
}

async function main(): Promise<void> {
  printText("\x1b[1m\x1b[36m╔══════════════════════════════════╗\x1b[0m");
  printText("\x1b[1m\x1b[36m║  Harness 02 — Extended Agent     ║\x1b[0m");
  printText("\x1b[1m\x1b[36m╚══════════════════════════════════╝\x1b[0m");

  const provider = (() => {
    try {
      return buildProvider(SYSTEM_PROMPT);
    } catch (err: unknown) {
      printError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  })();

  // Build tool registry with core tools
  const registry = new Registry();
  registry.register(new BashTool());
  registry.register(new ReadFileTool());
  registry.register(new WriteFileTool());

  // §11: Register subagents and wire them as DelegateTools.
  // Subagents get a read-only tool subset — no bash, no write_file.
  const researchSubagent = new ResearchSubagent(
    provider,
    registry.subset("read_file")
  );
  registry.register(
    new DelegateTool(
      researchSubagent.name(),
      researchSubagent.description(),
      (task) => researchSubagent.run(task)
    )
  );

  const compactor = buildCompactor(provider);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: !!process.stdout.isTTY,
  });

  const confirmWithRl = (prompt: string): Promise<boolean> =>
    new Promise((resolve) => {
      rl.question(`\x1b[33m${prompt}\x1b[0m [y/n] `, (answer) => {
        const t = answer.trim().toLowerCase();
        resolve(t === "y" || t === "yes");
      });
    });

  const permissionPolicy = buildPermissionPolicy(confirmWithRl);

  const agent = new Agent({
    provider,
    registry,
    compactor,
    permissionPolicy,
    maxTurns: 50,
  });

  printInfo(
    `Provider: ${process.env.PROVIDER ?? "anthropic"} / Model: ${provider.model()}`
  );
  printInfo(
    `Compaction: ${process.env.COMPACTION ?? "none"} / Permissions: ${process.env.PERMISSION_POLICY ?? "always-ask"}`
  );
  printInfo("Type /help for commands. Ctrl+C or /exit to quit.");
  printText("");

  printPrompt();

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) {
      printPrompt();
      continue;
    }

    const handled = await handleCommand(trimmed, { agent, provider });
    if (!handled) {
      await agent.send(trimmed);
      printText("");
    }

    printPrompt();
  }

  rl.close();
}

main().catch((err: unknown) => {
  printError(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
