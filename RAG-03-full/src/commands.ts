// §05 Slash Commands — registry and dispatcher.
// Commands are registered by name with a description, usage hint, and handler.
// The REPL calls handleCommand() before passing input to the agent loop.
//
// §05 Design: returning true for unknown commands prevents typos from being sent
// to the model, which would confuse it about whether the command was recognized.

import type { Agent } from "./internal/agent/agent.js";
import type { Provider } from "./internal/provider/index.js";
import { printText, printInfo, printError } from "./internal/ui/output.js";

interface Command {
  description: string;
  usage: string;
  run: (args: string, ctx: CommandContext) => void | Promise<void>;
}

export interface CommandContext {
  agent: Agent;
  provider: Provider;
}

const commands = new Map<string, Command>();

function register(name: string, cmd: Command): void {
  commands.set(name, cmd);
}

register("clear", {
  description: "Clear the conversation history",
  usage: "/clear",
  run: (_args, ctx) => {
    ctx.agent.clearHistory();
    printInfo("Conversation cleared.");
  },
});

register("model", {
  description: "Show the current model or switch to a new one",
  usage: "/model [model-id]",
  run: (args, ctx) => {
    if (!args) {
      printInfo(`Current model: ${ctx.provider.model()}`);
      printText("Examples: claude-opus-4-7-20251101, gpt-4o, llama3.2");
    } else {
      ctx.provider.setModel(args.trim());
      printInfo(`Switched to model: ${args.trim()}`);
    }
  },
});

register("compact", {
  description: "Show compaction info",
  usage: "/compact",
  run: () => {
    printInfo("Compaction runs automatically. Configure via COMPACTION env var.");
    printText("Strategies: none | sliding | summarize");
  },
});

register("help", {
  description: "List all available slash commands",
  usage: "/help",
  run: () => {
    printText("\n\x1b[1mAvailable commands:\x1b[0m");
    const sorted = [...commands.entries()].sort(([a], [b]) => a.localeCompare(b));
    for (const [name, cmd] of sorted) {
      printText(`  \x1b[36m/${name}\x1b[0m — ${cmd.description}`);
      printText(`         Usage: ${cmd.usage}`);
    }
    printText("");
  },
});

register("exit", {
  description: "Exit the agent",
  usage: "/exit",
  run: () => {
    printText("Goodbye.");
    process.exit(0);
  },
});

// Attempt to handle a line as a slash command.
// Returns true if the line was a command (known OR unknown slash command).
// Returns false if the line does not start with /.
// §05: Returning true for unknown commands prevents typos going to the model.
export async function handleCommand(
  line: string,
  ctx: CommandContext
): Promise<boolean> {
  if (!line.startsWith("/")) return false;

  // §05: SplitN equivalent — preserve spaces within arguments
  const spaceIdx = line.indexOf(" ");
  const name = (spaceIdx === -1 ? line.slice(1) : line.slice(1, spaceIdx)).toLowerCase();
  const args = spaceIdx === -1 ? "" : line.slice(spaceIdx + 1).trim();

  const cmd = commands.get(name);
  if (!cmd) {
    printError(`unknown command: /${name}. Type /help for a list.`);
    return true;
  }

  await cmd.run(args, ctx);
  return true;
}
