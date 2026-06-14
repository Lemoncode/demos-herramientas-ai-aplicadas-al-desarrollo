// §00 Introduction + §10 + §11 + §14 + §15 + §19 — full harness wiring.
//
// This file:
//   1. Loads system prompt from AGENTS.md (§15) with fallback
//   2. Builds provider, registry, compactor, permission policy
//   3. Connects MCP server if configured (§14)
//   4. Registers memory tools (§19)
//   5. Registers subagents as DelegateTools (§11)
//   6. Creates the Agent and starts the REPL

import * as readline from "readline";
import * as fs from "fs/promises";
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
import { McpClient } from "./internal/mcp/client.js";
import { registerMcpTools } from "./internal/mcp/tool-adapter.js";
import { ReadMemoryTool, WriteMemoryTool } from "./internal/memory/file-memory.js";
import { handleCommand } from "./commands.js";
import { printText, printError, printInfo, printPrompt } from "./internal/ui/output.js";

dotenv.config();

const BASE_SYSTEM_PROMPT = `You are a helpful coding assistant with access to tools for
reading/writing files and running shell commands.

When you need to research multiple files without modifying them, use the
delegate_research tool rather than reading files yourself.

Call read_memory at the start of each conversation to recall previous context.
Use write_memory to save user preferences or project context for future sessions.`;

// §15 AGENTS.md: load agent behavior config from file if present.
// Falls back to the base prompt if AGENTS.md is not found.
async function loadSystemPrompt(): Promise<string> {
  try {
    const agentsMd = await fs.readFile("AGENTS.md", "utf-8");
    return `${agentsMd}\n\n---\n\n${BASE_SYSTEM_PROMPT}`;
  } catch {
    return BASE_SYSTEM_PROMPT;
  }
}

// §11 DelegateTool — wraps a Subagent as a Tool.
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
        task: { type: "string", description: "The task to delegate to the sub-agent" },
      },
      required: ["task"],
    };
  }

  async execute(rawInput: string): Promise<{ result: string; isError: boolean }> {
    try {
      const parsed = JSON.parse(rawInput) as { task?: string };
      const result = await this.runFn(parsed.task ?? rawInput);
      return { result, isError: false };
    } catch (err: unknown) {
      return { result: err instanceof Error ? err.message : String(err), isError: true };
    }
  }
}

function buildProvider(system: string): Provider {
  const name = (process.env.PROVIDER ?? "anthropic").toLowerCase();
  switch (name) {
    case "anthropic": return new AnthropicProvider(system);
    case "openai":
      return new OpenAIProvider(system, process.env.OPENAI_MODEL ?? "gpt-4o",
        process.env.OPENAI_API_KEY, process.env.OPENAI_BASE_URL);
    case "ollama":
      return new OpenAIProvider(system, process.env.OLLAMA_MODEL ?? "llama3.2",
        "ollama", process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1");
    default:
      throw new Error(`Unknown provider: ${name}. Use anthropic, openai, or ollama.`);
  }
}

function buildCompactor(provider: Provider): CompactionStrategy {
  switch ((process.env.COMPACTION ?? "none").toLowerCase()) {
    case "sliding":   return new SlidingWindow(20);
    case "summarize": return new Summarize(provider);
    default:          return new NoCompaction();
  }
}

function buildPermissionPolicy(
  confirmFn: (prompt: string) => Promise<boolean>
): PermissionPolicy {
  switch ((process.env.PERMISSION_POLICY ?? "always-ask").toLowerCase()) {
    case "always-allow": return new AlwaysAllow();
    case "allow-list": {
      const tools = (process.env.ALLOW_LIST_TOOLS ?? "read_file,read_memory")
        .split(",").map((s) => s.trim());
      return new AllowList(tools);
    }
    default: return new AlwaysAsk(confirmFn);
  }
}

async function main(): Promise<void> {
  printText("\x1b[1m\x1b[36m╔════════════════════════════════════╗\x1b[0m");
  printText("\x1b[1m\x1b[36m║   Harness 03 — Full Agent          ║\x1b[0m");
  printText("\x1b[1m\x1b[36m╚════════════════════════════════════╝\x1b[0m");

  const systemPrompt = await loadSystemPrompt();

  const provider = (() => {
    try {
      return buildProvider(systemPrompt);
    } catch (err: unknown) {
      printError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  })();

  // Build registry with core tools
  const registry = new Registry();
  registry.register(new BashTool());
  registry.register(new ReadFileTool());
  // §18: WriteFileTool reads DIFF_APPROVAL env var in its constructor
  registry.register(new WriteFileTool());

  // §14: Connect MCP server if configured
  let mcpClient: McpClient | null = null;
  const mcpCmd = process.env.MCP_SERVER_CMD?.trim();
  if (mcpCmd) {
    mcpClient = new McpClient();
    try {
      await mcpClient.connectStdio(mcpCmd);
      const count = await registerMcpTools(mcpClient, registry);
      printInfo(`MCP: registered ${count} tools`);
    } catch (err: unknown) {
      printError(`MCP connection failed: ${err instanceof Error ? err.message : String(err)}`);
      mcpClient = null;
    }
  }

  // §19: Register memory tools
  registry.register(new ReadMemoryTool());
  registry.register(new WriteMemoryTool());

  // §11: Register subagents as DelegateTools
  const researchSubagent = new ResearchSubagent(provider, registry.subset("read_file"));
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

  const agent = new Agent({ provider, registry, compactor, permissionPolicy, maxTurns: 50 });

  printInfo(`Provider: ${process.env.PROVIDER ?? "anthropic"} / Model: ${provider.model()}`);
  printInfo(`Compaction: ${process.env.COMPACTION ?? "none"} / Permissions: ${process.env.PERMISSION_POLICY ?? "always-ask"}`);
  printInfo(`Diff approval: ${process.env.DIFF_APPROVAL !== "false" ? "enabled" : "disabled"}`);
  printInfo("Type /help for commands. Ctrl+C or /exit to quit.");
  printText("");

  // Graceful shutdown — disconnect MCP server on Ctrl+C
  process.on("SIGINT", async () => {
    await mcpClient?.disconnect();
    process.exit(0);
  });

  printPrompt();

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) { printPrompt(); continue; }

    const handled = await handleCommand(trimmed, { agent, provider });
    if (!handled) {
      await agent.send(trimmed);
      printText("");
    }
    printPrompt();
  }

  await mcpClient?.disconnect();
  rl.close();
}

main().catch((err: unknown) => {
  printError(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
