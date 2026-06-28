import type { BaseMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { ChatOllama } from "@langchain/ollama";
import { ANSWER_PROMPT_TEMPLATE } from "../prompts.js";

/**
 * Generates the final grounded answer from retrieved context and chat history.
 *
 * The answer prompt receives the rewritten standalone question for precision,
 * while the history remains available so the response can preserve conversational
 * tone and continuity.
 *
 * @param model LangChain Ollama chat model used for generation.
 * @param context Retrieved CV chunks formatted as markdown.
 * @param standalone Search-ready question produced by `condenseQuestion`.
 * @param history Prior conversation messages.
 * @returns Trimmed model answer text.
 */
export async function answer(
	model: ChatOllama,
	context: string,
	standalone: string,
	history: BaseMessage[],
): Promise<string> {
	const chain = ANSWER_PROMPT_TEMPLATE.pipe(model).pipe(
		new StringOutputParser(), // This parser will return the model's output as a string, without any extra formatting
	);
	return (await chain.invoke({ history, context, standalone })).trim();
}
