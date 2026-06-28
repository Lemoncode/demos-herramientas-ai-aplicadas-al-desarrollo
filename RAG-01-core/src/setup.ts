import type { Provider } from "./internal/provider/index.js";
import { OpenAIProvider } from "./internal/provider/openai.js";
import { printError } from "./internal/ui/output.js";
import { SYSTEM_PROMPT } from "./prompt.js";

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
