// Entry point: REPL that wires the agent to the terminal.
// - src/prompt.ts  defines what the assistant is told
// - src/setup.ts   builds the provider and tool registry
// - src/internal/agent/loop.ts  handles one assistant turn

import * as readline from "readline";
import { runAgentLoop } from "./internal/agent/loop.js";
import type { Message } from "./internal/api/types.js";
import {
	printError,
	printInfo,
	printPrompt,
	printText,
} from "./internal/ui/output.js";
import { buildProvider, buildRegistry } from "./setup.js";

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

	// Create a readline interface for user input
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: !!process.stdout.isTTY,
	});

	printPrompt();

	for await (const line of rl) {
		const trimmed = line.trim();

		// If there's no input, just print the prompt again and continue the loop
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
