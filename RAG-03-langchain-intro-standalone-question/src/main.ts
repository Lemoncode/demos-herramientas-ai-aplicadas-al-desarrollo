// Entry point for RAG-03.
// Per-turn pipeline:
//   user query → condenseQuestion(history, query) → standalone
//              → printStandalone(standalone)
//              → BM25 search(index, standalone, 3)
//              → answer(model, context, standalone, history)
//              → history.push(HumanMessage(query), AIMessage(response))

import * as readline from "node:readline";
import type { BaseMessage } from "@langchain/core/messages";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { answer } from "./chains/answer.js";
import { condenseQuestion } from "./chains/condense.js";
import {
	printError,
	printInfo,
	printPrompt,
	printRag,
	printStandalone,
	printText,
} from "./internal/ui/output.js";
import type { RAGIndex } from "./rag/retriever.js";
import { search } from "./rag/retriever.js";
import { buildChatModel, buildRagIndex } from "./setup.js";

/**
 * Starts the RAG-03 terminal demo.
 *
 * The demo builds a BM25 index once at startup. Each turn rewrites the user
 * question into a standalone retrieval query, searches BM25, asks the answer
 * chain to respond from retrieved context, and stores the original conversation
 * turns for future rewrites.
 */
async function main(): Promise<void> {
	printText("\x1b[1m\x1b[36m╔══════════════════════════════════╗\x1b[0m");
	printText("\x1b[1m\x1b[36m║  RAG-03 — LangChain Intro        ║\x1b[0m");
	printText("\x1b[1m\x1b[36m╚══════════════════════════════════╝\x1b[0m");

	// ── 1. Build the RAG index ─────────────────────────────────────────────────
	printInfo("Loading CV and building BM25 index…");
	const RAGIndex: RAGIndex = await buildRagIndex();
	printInfo(`RAG Index ready. ${RAGIndex.chunks.length} chunks indexed.`);
	printText("");

	// ── 2. Build the LangChain ChatOllama model ────────────────────────────────
	const model = buildChatModel();
	printInfo("Type your question. /clear to reset, /exit to quit.");
	printText("");

	const messagesHistory: BaseMessage[] = [];

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
			messagesHistory.length = 0;
			printInfo("Conversation cleared.");
			printPrompt();
			continue;
		}

		try {
			// ── 3. Condense follow-up into a standalone question ────────────────────
			const standaloneQuestion = await condenseQuestion(
				model,
				messagesHistory,
				query,
			);
			printStandalone(standaloneQuestion);

			// ── 4. BM25 retrieval using the standalone question ─────────────────────
			const matchingChunks = search(RAGIndex, standaloneQuestion, 3);

			if (matchingChunks.length === 0) {
				printRag(
					"No matching chunks found — sending question without context.",
				);
			} else {
				printRag(
					`Retrieved ${matchingChunks.length} chunk(s): ${matchingChunks.map((c) => `"${c.title}"`).join(", ")}`,
				);
			}

			const context = matchingChunks
				.map((c) => `## ${c.title}\n${c.content}`)
				.join("\n\n---\n\n");

			// ── 5. Generate the final answer ────────────────────────────────────────
			const response = await answer(
				model,
				context,
				standaloneQuestion,
				messagesHistory,
			);
			printText(response);

			// ── 6. Update history with the ORIGINAL user query and AI response ──────
			messagesHistory.push(new HumanMessage(query));
			messagesHistory.push(new AIMessage(response));
		} catch (err) {
			printError(err instanceof Error ? err.message : String(err));
		}

		printText("");
		printPrompt();
	}

	rl.close();
}

main().catch((err: unknown) => {
	printError((err as Error).message);
	process.exit(1);
});
