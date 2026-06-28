// Entry point: REPL that wires the RAG pipeline to the terminal.
// - src/prompt.ts  defines what the assistant is told
// - src/setup.ts   builds the provider and the BM25 index
// - src/rag/       loader → chunker → retriever (the "R" in RAG)

import * as readline from "readline";
import type { Message } from "./internal/api/types.js";
import type { Provider } from "./internal/provider/index.js";
import { ProviderError } from "./internal/provider/index.js";
import {
	printError,
	printInfo,
	printPrompt,
	printRag,
	printText,
} from "./internal/ui/output.js";
import type { Index } from "./rag/retriever.js";
import { search } from "./rag/retriever.js";
import { buildProvider, buildRagIndex } from "./setup.js";

/**
 * Sends the current message history to the provider and prints the text answer.
 *
 * RAG-02 has no tools, so this helper always passes an empty tool list. It still
 * appends the assistant response to `messages` so follow-up chat continuity is
 * preserved at the provider level.
 *
 * @param provider LLM provider used for generation.
 * @param messages Mutable conversation history.
 */
async function ask(provider: Provider, messages: Message[]): Promise<void> {
	let response: Awaited<ReturnType<Provider["send"]>>;
	try {
		response = await provider.send(messages, []);
	} catch (err) {
		if (err instanceof ProviderError) {
			printError(`provider error: ${err.message}`);
			return;
		}
		throw err;
	}

	messages.push({ role: "assistant", content: response.content });

	for (const block of response.content) {
		if (block.type === "text") printText(block.text);
	}
}

/**
 * Starts the RAG-02 terminal demo.
 *
 * Startup builds the BM25 index once. Each user question is then searched
 * against that index, augmented with matching chunks, and sent to the provider.
 */
async function main(): Promise<void> {
	printText("\x1b[1m\x1b[36m╔══════════════════════════════════╗\x1b[0m");
	printText("\x1b[1m\x1b[36m║  RAG-02 — Keyword Retrieval      ║\x1b[0m");
	printText("\x1b[1m\x1b[36m╚══════════════════════════════════╝\x1b[0m");

	// ── 1. Build the RAG index at startup ──────────────────────────────────────
	printInfo("Loading CV and building BM25 index…");
	const index: Index = await buildRagIndex();
	printInfo(`Index ready. ${index.chunks.length} chunks indexed.`);
	printText("");

	// ── 2. Build the LLM provider ──────────────────────────────────────────────
	const provider = buildProvider();
	printInfo(
		`Provider: ${process.env.PROVIDER ?? "ollama"} / Model: ${provider.model()}`,
	);
	printInfo("Type your question. /clear to reset, /exit to quit.");
	printText("");

	const messages: Message[] = [];

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: !!process.stdout.isTTY,
	});

	printPrompt();

	for await (const line of rl) {
		const query = line.trim();

		if (!query) {
			printPrompt();
			continue;
		}

		if (query === "/exit" || query === "/quit") {
			printText("Goodbye.");
			break;
		}

		if (query === "/clear") {
			messages.length = 0;
			printInfo("Conversation cleared.");
			printPrompt();
			continue;
		}

		// ── 3. Retrieve relevant chunks via BM25 ──────────────────────────────────
		const hits = search(index, query, 3);

		if (hits.length === 0) {
			printRag("No matching chunks found — sending question without context.");
		} else {
			printRag(
				`Retrieved ${hits.length} chunk(s): ${hits.map((c) => `"${c.title}"`).join(", ")}`,
			);
		}

		// ── 4. Augment the user message with the retrieved context ────────────────
		const context = hits
			.map((c) => `## ${c.title}\n${c.content}`)
			.join("\n\n---\n\n");

		const augmentedPrompt =
			hits.length > 0
				? `<context>\n${context}\n</context>\n\nQuestion: ${query}`
				: query;

		messages.push({
			role: "user",
			content: [{ type: "text", text: augmentedPrompt }],
		});

		// ── 5. Generate ───────────────────────────────────────────────────────────
		await ask(provider, messages);

		printText("");
		printPrompt();
	}

	rl.close();
}

main().catch((err: unknown) => {
	printError((err as Error).message);
	process.exit(1);
});
