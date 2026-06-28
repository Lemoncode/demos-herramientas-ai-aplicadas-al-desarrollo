// Entry point for RAG-04.
// Per-turn pipeline:
//   user query → embed query with local Ollama
//              → semantic vector search(index, queryEmbedding, 3)
//              → answer(model, context, query)

import * as readline from "node:readline";
import { answer } from "./chains/answer.js";
import {
	printEmbedding,
	printError,
	printInfo,
	printPrompt,
	printRag,
	printText,
} from "./internal/ui/output.js";
import type { RAGIndex } from "./rag/semantic-retriever.js";
import { search } from "./rag/semantic-retriever.js";
import {
	buildChatModel,
	buildEmbeddingModel,
	buildRagIndex,
} from "./setup.js";

/**
 * Starts the RAG-04 terminal demo.
 *
 * Startup embeds the CV chunks into an in-memory vector index. Each user query
 * is embedded directly, searched with cosine similarity, and answered from the
 * retrieved context.
 */
async function main(): Promise<void> {
	printText("\x1b[1m\x1b[36m╔════════════════════════════════════╗\x1b[0m");
	printText("\x1b[1m\x1b[36m║  RAG-04 — Local Semantic Search    ║\x1b[0m");
	printText("\x1b[1m\x1b[36m╚════════════════════════════════════╝\x1b[0m");

	const model = buildChatModel();
	const embeddingModel = buildEmbeddingModel();

	printInfo(`Chat model: ${process.env.OLLAMA_MODEL ?? "llama3.2"}`);
	printInfo(`Embedding model: ${embeddingModel.model()}`);
	printInfo("Loading CV, chunking it, and embedding each chunk locally…");

	const RAGIndex: RAGIndex = await buildRagIndex(embeddingModel);
	printInfo(`RAG Index ready. ${RAGIndex.chunks.length} embedded chunks indexed.`);
	printText("");

	printInfo("Type your question. /clear to reset, /exit to quit.");
	printText("");

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
			printInfo("Nothing to clear: RAG-04 does not keep conversation history.");
			printPrompt();
			continue;
		}

		try {
			const queryEmbedding = await embeddingModel.embedQuery(query);
			printEmbedding(
				`Query embedded into ${queryEmbedding.length} dimensions.`,
			);

			const matchingChunks = search(RAGIndex, queryEmbedding, 3);

			if (matchingChunks.length === 0) {
				printRag(
					"No semantically similar chunks found — sending question without context.",
				);
			} else {
				printRag(
					`Retrieved ${matchingChunks.length} chunk(s): ${matchingChunks
						.map((chunk) => `"${chunk.title}" (${chunk.score.toFixed(3)})`)
						.join(", ")}`,
				);
			}

			const context = matchingChunks
				.map((chunk) => `## ${chunk.title}\n${chunk.content}`)
				.join("\n\n---\n\n");

			const response = await answer(model, context, query);
			printText(response);
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
