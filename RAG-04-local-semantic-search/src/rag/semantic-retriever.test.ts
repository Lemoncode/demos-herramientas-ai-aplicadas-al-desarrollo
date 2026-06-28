import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Chunk } from "./chunker.js";
import { buildIndex, cosineSimilarity, search } from "./semantic-retriever.js";

describe("cosineSimilarity", () => {
	it("returns 1 for identical vectors and 0 for unrelated vectors", () => {
		assert.equal(cosineSimilarity([1, 0], [1, 0]), 1);
		assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
	});
});

describe("semantic search", () => {
	it("ranks chunks by vector similarity instead of keyword overlap", () => {
		const chunks: Chunk[] = [
			{
				title: "Experience at Douglas",
				content: "Built the e-commerce frontend for several countries.",
			},
			{
				title: "Education",
				content: "Studied computer engineering.",
			},
		];

		const RAGIndex = buildIndex(chunks, [
			[1, 0],
			[0, 1],
		]);

		const matchingChunks = search(RAGIndex, [0.95, 0.05], 1);

		assert.equal(matchingChunks.length, 1);
		assert.equal(matchingChunks[0].title, "Experience at Douglas");
		assert.ok(matchingChunks[0].score > 0.9);
	});

	it("filters chunks with zero similarity", () => {
		const chunks: Chunk[] = [
			{
				title: "Education",
				content: "Studied computer engineering.",
			},
		];

		const RAGIndex = buildIndex(chunks, [[0, 1]]);

		const matchingChunks = search(RAGIndex, [1, 0], 3);

		assert.deepEqual(matchingChunks, []);
	});
});
