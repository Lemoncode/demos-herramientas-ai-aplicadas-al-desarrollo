// Wires up the three pieces that main.ts needs:
//   buildChatModel()      — same LangChain ChatOllama setup as RAG-03
//   buildEmbeddingModel() — local Ollama model that turns text into vectors
//   buildRagIndex()       — load → chunk → embed → semantic index

import { ChatOllama } from "@langchain/ollama";
import {
	type EmbeddingModel,
	OllamaEmbeddingModel,
} from "./rag/embeddings.js";
import { chunkByHeaders } from "./rag/chunker.js";
import { loadCV } from "./rag/loader.js";
import type { RAGIndex } from "./rag/semantic-retriever.js";
import { buildIndex } from "./rag/semantic-retriever.js";

/**
 * Builds the LangChain Ollama chat model used for final answers.
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
 * Builds the local Ollama embedding model used for chunk and query vectors.
 *
 * @returns Embedding model adapter configured from environment variables.
 */
export function buildEmbeddingModel(): EmbeddingModel {
	return new OllamaEmbeddingModel(
		process.env.OLLAMA_EMBEDDING_MODEL ?? "nomic-embed-text",
		process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
	);
}

/**
 * Builds the full semantic retrieval index for the CV.
 *
 * Startup is where RAG-04 pays the embedding cost: load the markdown, split it
 * into chunks, embed each chunk locally, then join chunks and vectors into the
 * in-memory index used by `search`.
 *
 * @param embeddingModel Local embedding model used for chunk vectors.
 * @returns In-memory semantic index ready for query-time retrieval.
 */
export async function buildRagIndex(
	embeddingModel: EmbeddingModel,
): Promise<RAGIndex> {
	const markdown = await loadCV();
	const chunks = chunkByHeaders(markdown);

	// Embed the title and body together. The title gives the vector a compact
	// label, while the body carries the actual facts we will later inject.
	const chunkTexts = chunks.map((chunk) => `## ${chunk.title}\n${chunk.content}`);
	const embeddings = await embeddingModel.embed(chunkTexts);

	return buildIndex(chunks, embeddings);
}
