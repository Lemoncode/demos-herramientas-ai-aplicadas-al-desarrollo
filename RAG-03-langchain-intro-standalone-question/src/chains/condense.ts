import type { BaseMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { ChatOllama } from "@langchain/ollama";
import { CONDENSE_PROMPT_TEMPLATE } from "../prompts.js";

/**
 * Rewrites a conversational follow-up into a retrieval-ready question.
 *
 * BM25 has no access to the user's previous turns, so short questions such as
 * "what about that one?" usually retrieve poorly. This chain asks the chat model
 * to use the existing message history to produce a self-contained query before
 * keyword search runs. On the first turn, the prompt is designed to return the
 * original question unchanged.
 *
 * @param model LangChain Ollama chat model used for the rewrite.
 * @param history Prior user/assistant messages in the current conversation.
 * @param question Latest user question.
 * @returns A question that can be searched without reading the chat history.
 */
export async function condenseQuestion(
	model: ChatOllama,
	history: BaseMessage[],
	question: string,
): Promise<string> {
	const chain = CONDENSE_PROMPT_TEMPLATE.pipe(model).pipe(
		new StringOutputParser(), // This parser will return the model's output as a string, without any extra formatting
	);

	return (await chain.invoke({ history, question })).trim();
}
