// Wires up the two pieces that main.ts needs:
//   buildProvider()  — same pattern as RAG-01, reads PROVIDER env var
//   buildRagIndex()  — new in RAG-02: load → chunk → index (async because of fs I/O)

import { AnthropicProvider } from "./internal/provider/anthropic.js";
import type { Provider } from "./internal/provider/index.js";
import { OpenAIProvider } from "./internal/provider/openai.js";
import { printError } from "./internal/ui/output.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { chunkByHeaders } from "./rag/chunker.js";
import { loadCV } from "./rag/loader.js";
import type { Index } from "./rag/retriever.js";
import { buildIndex } from "./rag/retriever.js";

export function buildProvider(): Provider {
	const name = (process.env.PROVIDER ?? "ollama").toLowerCase();
	try {
		switch (name) {
			case "anthropic":
				return new AnthropicProvider(SYSTEM_PROMPT);
			case "openai":
				return new OpenAIProvider(
					SYSTEM_PROMPT,
					process.env.OPENAI_MODEL ?? "gpt-4o",
					process.env.OPENAI_API_KEY,
					process.env.OPENAI_BASE_URL,
				);
			default:
				return new OpenAIProvider(
					SYSTEM_PROMPT,
					process.env.OLLAMA_MODEL ?? "llama3.2",
					"ollama",
					process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
				);
		}
	} catch (err: unknown) {
		printError(err instanceof Error ? err.message : String(err));
		process.exit(1);
	}
}

export async function buildRagIndex(): Promise<Index> {
	const markdown = await loadCV();
	// Break the markdown into chunks separating by ## headers.
	const chunks = chunkByHeaders(markdown);
	// Build an in-memory search index from the chunks, using BM25 scoring.
	// BM25 is an algorythm that scores a word by how rare it is across the whole collection of chunks.
	return buildIndex(chunks);
}
