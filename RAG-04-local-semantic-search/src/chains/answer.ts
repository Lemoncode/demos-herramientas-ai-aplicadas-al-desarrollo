import type { ChatOllama } from "@langchain/ollama";
import { ANSWER_PROMPT_TEMPLATE } from "../prompts.js";

/**
 * Generates the final grounded answer from retrieved semantic context.
 *
 * RAG-04 deliberately uses the original user question, not a rewritten query,
 * so the example stays focused on embeddings and vector retrieval.
 *
 * @param model LangChain Ollama chat model used for generation.
 * @param context Retrieved CV chunks formatted as markdown.
 * @param question Original user question.
 * @returns Trimmed model answer text.
 */
export async function answer(
	model: ChatOllama,
	context: string,
	question: string,
): Promise<string> {
	const messages = await ANSWER_PROMPT_TEMPLATE.formatMessages({
		context,
		question,
	});
	const response = await model.invoke(messages);

	const text =
		typeof response.content === "string"
			? response.content
			: String(response.content);

	return text.trim();
}
