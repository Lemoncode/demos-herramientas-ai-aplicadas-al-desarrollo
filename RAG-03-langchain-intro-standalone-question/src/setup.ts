// Wires up the two pieces that main.ts needs:
//   buildChatModel() — a LangChain ChatOllama instance configured via env vars
//   buildRagIndex()  — load → chunk → BM25 index (same as RAG-02)

import { ChatOllama } from "@langchain/ollama";
import { chunkByHeaders } from "./rag/chunker.js";
import { loadCV } from "./rag/loader.js";
import type { RAGIndex } from "./rag/retriever.js";
import { buildIndex } from "./rag/retriever.js";

/**
 * Builds the LangChain Ollama chat model used by both chains.
 *
 * @returns Deterministic `ChatOllama` instance configured from environment variables.
 */
export function buildChatModel(): ChatOllama {
	return new ChatOllama({
		model: process.env.OLLAMA_MODEL ?? "llama3.2",
		baseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
		temperature: 0,
	});
}

/**
 * Loads the CV, splits it into chunks, and builds the BM25 retrieval index.
 *
 * This mirrors RAG-02 so RAG-03 can focus on the new LangChain/question-rewrite
 * behavior rather than changing retrieval at the same time.
 *
 * @returns In-memory BM25 index for the CV.
 */
export async function buildRagIndex(): Promise<RAGIndex> {
	const markdown = await loadCV();
	const chunks = chunkByHeaders(markdown);
	return buildIndex(chunks);
}
