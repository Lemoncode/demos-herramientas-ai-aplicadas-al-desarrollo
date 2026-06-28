// Local embedding adapter.
//
// The important idea: embeddings are just arrays of numbers. The model turns
// text into vectors, and the retriever compares those vectors with cosine
// similarity. This module hides the Ollama HTTP call so the rest of the RAG
// code can stay focused on the pipeline.

import { Ollama } from "ollama";

export interface EmbeddingModel {
	model(): string;
	embed(texts: string[]): Promise<number[][]>;
	embedQuery(text: string): Promise<number[]>;
}

/**
 * Small adapter around Ollama's native embedding API.
 *
 * Keeping this behind an interface makes the rest of the module talk in plain
 * vectors (`number[]`) instead of Ollama request/response shapes. Later modules
 * can swap this for hosted embeddings or a database-backed ingestion step
 * without changing the semantic retriever.
 */
export class OllamaEmbeddingModel implements EmbeddingModel {
	private readonly client: Ollama;

	/**
	 * Creates a local Ollama embedding adapter.
	 *
	 * @param modelName Ollama embedding model name.
	 * @param baseUrl Native Ollama base URL, without `/v1`.
	 */
	constructor(
		private readonly modelName: string,
		baseUrl: string,
	) {
		this.client = new Ollama({ host: baseUrl });
	}

	/**
	 * Returns the configured Ollama embedding model name.
	 *
	 * @returns Model name used for embedding requests.
	 */
	model(): string {
		return this.modelName;
	}

	/**
	 * Embeds a batch of texts with the configured local Ollama model.
	 *
	 * The returned array order matches the input order, which is important when
	 * pairing chunk embeddings back to their source chunks in `buildIndex`.
	 *
	 * @param texts Chunk texts or query texts to embed.
	 * @returns One vector per input text.
	 */
	async embed(texts: string[]): Promise<number[][]> {
		const response = await this.client.embed({
			model: this.modelName,
			input: texts,
		});

		return response.embeddings;
	}

	/**
	 * Embeds a single user query.
	 *
	 * This wraps the batch method so the call site can be explicit about the
	 * query-time path while still using the same model and response validation.
	 *
	 * @param text User question to convert into a vector.
	 * @returns Embedding vector for the query.
	 */
	async embedQuery(text: string): Promise<number[]> {
		const embeddings = await this.embed([text]);
		const [embedding] = embeddings;

		if (!embedding) {
			throw new Error("Ollama did not return an embedding for the query.");
		}

		return embedding;
	}
}
