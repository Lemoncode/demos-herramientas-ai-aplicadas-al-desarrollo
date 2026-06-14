// Entry point for RAG-03.
// Per-turn pipeline:
//   user query → condenseQuestion(history, query) → standalone
//              → printStandalone(standalone)
//              → BM25 search(index, standalone, 3)
//              → answer(model, context, standalone, history)
//              → history.push(HumanMessage(query), AIMessage(response))

import * as readline from "readline";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { BaseMessage } from "@langchain/core/messages";
import { answer } from "./chains/answer.js";
import { condenseQuestion } from "./chains/condense.js";
import {
  printError,
  printInfo,
  printPrompt,
  printRag,
  printStandalone,
  printText,
} from "./internal/ui/output.js";
import type { Index } from "./rag/retriever.js";
import { search } from "./rag/retriever.js";
import { buildChatModel, buildRagIndex } from "./setup.js";

async function main(): Promise<void> {
  printText("\x1b[1m\x1b[36m╔══════════════════════════════════╗\x1b[0m");
  printText("\x1b[1m\x1b[36m║  RAG-03 — LangChain Intro        ║\x1b[0m");
  printText("\x1b[1m\x1b[36m╚══════════════════════════════════╝\x1b[0m");

  // ── 1. Build the RAG index ─────────────────────────────────────────────────
  printInfo("Loading CV and building BM25 index…");
  const index: Index = await buildRagIndex();
  printInfo(`Index ready. ${index.chunks.length} chunks indexed.`);
  printText("");

  // ── 2. Build the LangChain ChatOllama model ────────────────────────────────
  const model = buildChatModel();
  printInfo(
    `Model: ${process.env.OLLAMA_MODEL ?? "llama3.2"} @ ${process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"}`,
  );
  printInfo("Type your question. /clear to reset, /exit to quit.");
  printText("");

  const history: BaseMessage[] = [];

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
      history.length = 0;
      printInfo("Conversation cleared.");
      printPrompt();
      continue;
    }

    try {
      // ── 3. Condense follow-up into a standalone question ────────────────────
      const standalone = await condenseQuestion(model, history, query);
      printStandalone(standalone);

      // ── 4. BM25 retrieval using the standalone question ─────────────────────
      const hits = search(index, standalone, 3);

      if (hits.length === 0) {
        printRag("No matching chunks found — sending question without context.");
      } else {
        printRag(
          `Retrieved ${hits.length} chunk(s): ${hits.map((c) => `"${c.title}"`).join(", ")}`,
        );
      }

      const context = hits
        .map((c) => `## ${c.title}\n${c.content}`)
        .join("\n\n---\n\n");

      // ── 5. Generate the final answer ────────────────────────────────────────
      const response = await answer(model, context, standalone, history);
      printText(response);

      // ── 6. Update history with the ORIGINAL user query and AI response ──────
      history.push(new HumanMessage(query));
      history.push(new AIMessage(response));
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
