import type { Provider } from "./internal/provider/index.js";
import { OpenAIProvider } from "./internal/provider/openai.js";
import { Registry } from "./internal/tool/registry.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { printError } from "./internal/ui/output.js";

/**
 * Builds the OpenAI-compatible provider used by the RAG-01 assistant.
 *
 * RAG-01 defaults to Ollama's local OpenAI-compatible endpoint so the rest of
 * the harness can talk to a provider abstraction without knowing which model
 * server is behind it.
 *
 * @returns Configured provider instance for the REPL loop.
 */
export function buildProvider(): Provider {
  try {
    return new OpenAIProvider(
      SYSTEM_PROMPT,
      process.env.OLLAMA_MODEL ?? "qwen3-coder:30b",
      "ollama",
      process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
    );
  } catch (err: unknown) {
    printError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

/**
 * Builds the tool registry for this demo.
 *
 * RAG-01 intentionally registers no tools. The assistant answers only from the
 * hardcoded CV context in the system prompt.
 *
 * @returns Empty registry.
 */
export function buildRegistry(): Registry {
  return new Registry();
}
