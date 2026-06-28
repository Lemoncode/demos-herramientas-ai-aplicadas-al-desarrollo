// BM25 keyword retrieval — the industry-standard algorithm for matching a query
// against a collection of text chunks using exact word overlap.
//
// Two phases:
//   1. buildIndex() — runs once at startup. Tokenises every chunk, then
//      pre-computes how "rare" each word is across the whole collection.
//   2. search()     — runs on every query. Scores each chunk based on how many
//      query words it contains and how rare/important those words are.
//
// The BM25 score for one query word in one chunk is:
//
//   rarity(word) × frequency(word, chunk) × (termSaturation + 1)
//   ──────────────────────────────────────────────────────────────────────────
//   frequency(word, chunk) + termSaturation × (1 − lengthPenalty + lengthPenalty × chunkLength / avgChunkLength)
//
// termSaturation = 1.5  → each extra occurrence of a word matters less and less
// lengthPenalty  = 0.75 → long chunks are slightly penalised so they don't
//                          dominate just because they contain more words

import type { Chunk } from "./chunker.js";

const TERM_SATURATION = 1.5; // k1 in the BM25 formula
const LENGTH_PENALTY = 0.75; // b  in the BM25 formula

export interface IndexedChunk extends Chunk {
	id: number;
	tokens: string[];
}

export interface Index {
	chunks: IndexedChunk[];
	// How rare each word is: words that appear in few chunks score higher
	wordRarity: Map<string, number>;
	avgChunkLength: number;
}

/**
 * Converts free text into the normalized terms used by the BM25 index.
 *
 * This deliberately keeps the tokenizer simple for teaching: lowercase text,
 * remove punctuation, preserve Spanish accented letters, split on whitespace,
 * and drop empty strings. BM25 only understands exact token overlap, so this
 * normalization defines what "the same word" means for the retriever.
 *
 * @param text Text from a chunk title, chunk body, or user query.
 * @returns Normalized tokens used for indexing and scoring.
 */
function tokenize(text: string): string[] {
	return text
		.toLowerCase()
		.replace(/[^a-záéíóúüñ0-9\s]/g, " ")
		.split(/\s+/)
		.filter(Boolean);
}

/**
 * Builds the in-memory BM25 index used by the demo.
 *
 * This runs once at startup. It tokenizes each chunk, computes average chunk
 * length for length normalization, and precomputes IDF-style word rarity so
 * query-time scoring can stay small and easy to inspect.
 *
 * @param chunks Markdown chunks produced by `chunkByHeaders`.
 * @returns Indexed chunks plus BM25 statistics needed by `search`.
 */
export function buildIndex(chunks: Chunk[]): Index {
	// Tokenise every chunk so we can count words later
	const indexedChunks: IndexedChunk[] = chunks.map((chunk, id) => ({
		...chunk,
		id,
		tokens: tokenize(`${chunk.title} ${chunk.content}`),
	}));

	// Average number of words per chunk — used to normalise chunk length
	const avgChunkLength =
		indexedChunks.reduce((sum, chunk) => sum + chunk.tokens.length, 0) /
		indexedChunks.length;

	// Count how many chunks contain each word (called "document frequency")
	const chunksContainingWord = new Map<string, number>();
	for (const chunk of indexedChunks) {
		// Use a Set so each word is counted at most once per chunk
		for (const word of new Set(chunk.tokens)) {
			chunksContainingWord.set(word, (chunksContainingWord.get(word) ?? 0) + 1);
		}
	}

	// Compute word rarity (IDF — Inverse Document Frequency).
	// Words that appear in almost every chunk (e.g. "and", "the") get a low score.
	// Words that appear in only one or two chunks get a high score.
	const totalChunks = indexedChunks.length;
	const wordRarity = new Map<string, number>();
	for (const [word, chunksWithWord] of chunksContainingWord) {
		wordRarity.set(
			word,
			Math.log(
				(totalChunks - chunksWithWord + 0.5) / (chunksWithWord + 0.5) + 1,
			),
		);
	}

	return { chunks: indexedChunks, wordRarity, avgChunkLength };
}

/**
 * Scores every indexed chunk against a query using BM25 and returns the best
 * matches.
 *
 * BM25 rewards rare query words, saturates repeated words so ten mentions are
 * not ten times better than one, and penalizes very long chunks so they do not
 * dominate just because they contain more text.
 *
 * @param index Precomputed BM25 index from `buildIndex`.
 * @param query User question or rewritten retrieval query.
 * @param topK Maximum number of chunks to return.
 * @returns Matching chunks sorted from highest to lowest BM25 score.
 */
export function search(index: Index, query: string, topK = 3): IndexedChunk[] {
	const queryWords = tokenize(query);

	const scoredChunks = index.chunks.map((chunk) => {
		const chunkLength = chunk.tokens.length;

		// Count how many times each word appears in this chunk
		const wordCountInChunk = new Map<string, number>();
		for (const word of chunk.tokens) {
			wordCountInChunk.set(word, (wordCountInChunk.get(word) ?? 0) + 1);
		}

		// Sum up the BM25 score for each query word
		let totalScore = 0;
		for (const queryWord of queryWords) {
			const timesWordAppearsInChunk = wordCountInChunk.get(queryWord) ?? 0;
			if (timesWordAppearsInChunk === 0) continue; // word not in this chunk → skip

			const rarity = index.wordRarity.get(queryWord) ?? 0;
			const lengthNorm =
				1 -
				LENGTH_PENALTY +
				LENGTH_PENALTY * (chunkLength / index.avgChunkLength);

			// BM25 formula: rarity × saturated frequency
			totalScore +=
				(rarity * (timesWordAppearsInChunk * (TERM_SATURATION + 1))) /
				(timesWordAppearsInChunk + TERM_SATURATION * lengthNorm);
		}

		return { chunk, totalScore };
	});

	// Keep only chunks that matched at least one query word, sort best-first
	return scoredChunks
		.filter((s) => s.totalScore > 0)
		.sort((a, b) => b.totalScore - a.totalScore)
		.slice(0, topK)
		.map((s) => s.chunk);
}
