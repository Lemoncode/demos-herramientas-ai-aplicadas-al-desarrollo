// In-memory semantic retrieval.
//
// RAG-02 and RAG-03 used BM25: a chunk matched only when the same words
// appeared in both the query and the chunk. This file uses vectors instead:
// each chunk gets an embedding, the query gets an embedding, and cosine
// similarity tells us which chunks point in a similar semantic direction.

import type { Chunk } from "./chunker.js";

export interface EmbeddedChunk extends Chunk {
	id: number;
	embedding: number[];
}

export interface RAGIndex {
	chunks: EmbeddedChunk[];
}

export interface MatchingChunk extends EmbeddedChunk {
	score: number;
}

/**
 * Measures how similar two vectors are by comparing their direction.
 *
 * Cosine similarity ignores vector magnitude and returns a higher value when
 * vectors point in a similar direction. For embeddings, that usually means the
 * texts are semantically related even if they use different words.
 *
 * @param a First vector.
 * @param b Second vector. Must have the same number of dimensions as `a`.
 * @returns Similarity score. `1` means same direction, `0` means no alignment.
 * @throws When the vectors have different dimensions.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
	if (a.length !== b.length) {
		throw new Error(
			`Cannot compare vectors with different dimensions: ${a.length} and ${b.length}`,
		);
	}

	let dotProduct = 0;
	let aLengthSquared = 0;
	let bLengthSquared = 0;

	for (let i = 0; i < a.length; i++) {
		dotProduct += a[i] * b[i];
		aLengthSquared += a[i] * a[i];
		bLengthSquared += b[i] * b[i];
	}

	if (aLengthSquared === 0 || bLengthSquared === 0) return 0;

	return dotProduct / (Math.sqrt(aLengthSquared) * Math.sqrt(bLengthSquared));
}

/**
 * Builds the in-memory semantic index used by RAG-04.
 *
 * Each chunk must have exactly one embedding in the same array position. This
 * function joins those two lists into one structure so query-time search can
 * compare the query vector against each stored chunk vector.
 *
 * @param chunks Source chunks produced by `chunkByHeaders`.
 * @param embeddings Embedding vectors generated from the chunk texts.
 * @returns In-memory vector index.
 * @throws When the number of chunks and embeddings does not match.
 */
export function buildIndex(chunks: Chunk[], embeddings: number[][]): RAGIndex {
	if (chunks.length !== embeddings.length) {
		throw new Error(
			`Cannot build semantic index: received ${chunks.length} chunks but ${embeddings.length} embeddings`,
		);
	}

	const embeddedChunks = chunks.map((chunk, id): EmbeddedChunk => {
		const embedding = embeddings[id];

		return {
			...chunk,
			id,
			embedding,
		};
	});

	return { chunks: embeddedChunks };
}

/**
 * Finds the chunks whose embeddings are closest to the query embedding.
 *
 * This is a simple linear scan: score every chunk with cosine similarity, drop
 * zero-score matches, sort best-first, and keep the top K. That is intentionally
 * easy to inspect for a teaching demo; larger systems usually move this work
 * into a vector database.
 *
 * @param index In-memory semantic index from `buildIndex`.
 * @param queryEmbedding Vector generated from the user's question.
 * @param topK Maximum number of chunks to return.
 * @returns Matching chunks sorted by descending cosine similarity.
 */
export function search(
	index: RAGIndex,
	queryEmbedding: number[],
	topK = 3,
): MatchingChunk[] {
	return index.chunks
		.map((chunk): MatchingChunk => {
			const score = cosineSimilarity(queryEmbedding, chunk.embedding);
			return { ...chunk, score };
		})
		.filter((chunk) => chunk.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, topK);
}
