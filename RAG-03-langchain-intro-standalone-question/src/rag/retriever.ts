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

export interface RAGIndex {
	chunks: IndexedChunk[];
	wordRarity: Map<string, number>;
	avgChunkLength: number;
}

// Break a piece of text into lowercase words, stripping punctuation.
function tokenize(text: string): string[] {
	return text
		.toLowerCase()
		.replace(/[^a-záéíóúüñ0-9\s]/g, " ")
		.split(/\s+/)
		.filter(Boolean);
}

// Build an in-memory search index from the list of chunks.
// This runs once at startup — the result is reused for every query.
export function buildIndex(chunks: Chunk[]): RAGIndex {
	// We create an object with Title / Id / Content / Tokens
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
	console.log(
		`[RETRIEVER] Found ${chunksContainingWord.size} unique words across all chunks.`,
		JSON.stringify(
			Array.from(chunksContainingWord.entries()).slice(0, 5),
			null,
			2,
		),
	);

	// Compute word rarity (IDF — Inverse Document Frequency).
	// Words that appear in almost every chunk (e.g. "and", "the") get a low score.
	// Words that appear in only one or two chunks get a high score.
	const totalChunks = indexedChunks.length;
	const wordRarity = new Map<string, number>();
	for (const [word, wordFrequency] of chunksContainingWord) {
		wordRarity.set(
			word,
			Math.log((totalChunks - wordFrequency + 0.5) / (wordFrequency + 0.5) + 1),
		);
	}
	console.log(
		`[RETRIEVER] Computed rarity for ${wordRarity.size} words.`,
		JSON.stringify(Array.from(wordRarity.entries()).slice(0, 5), null, 2),
	);
	return { chunks: indexedChunks, wordRarity, avgChunkLength };
}

// Score every chunk against the query and return the top-k matches.
export function search(
	index: RAGIndex,
	query: string,
	topK = 3,
): IndexedChunk[] {
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
