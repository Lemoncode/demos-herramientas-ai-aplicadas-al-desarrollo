// Wires up the two pieces that main.ts needs:
//   buildChatModel() — a LangChain ChatOllama instance configured via env vars
//   buildRagIndex()  — load → chunk → BM25 index (same as RAG-02)

import { ChatOllama } from "@langchain/ollama";
import { chunkByHeaders } from "./rag/chunker.js";
import { loadCV } from "./rag/loader.js";
import type { Index } from "./rag/retriever.js";
import { buildIndex } from "./rag/retriever.js";

export function buildChatModel(): ChatOllama {
  return new ChatOllama({
    model: process.env.OLLAMA_MODEL ?? "llama3.2",
    baseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
    temperature: 0,
  });
}

export async function buildRagIndex(): Promise<Index> {
  const markdown = await loadCV();
  const chunks = chunkByHeaders(markdown);
  return buildIndex(chunks);
}
