import type { BaseMessage } from "@langchain/core/messages";
import type { ChatOllama } from "@langchain/ollama";
import { ANSWER_PROMPT_TEMPLATE } from "../prompts.js";

// Generate the final answer given the retrieved context, the standalone
// question, and the chat history.
export async function answer(
	model: ChatOllama,
	context: string,
	standalone: string,
	history: BaseMessage[],
): Promise<string> {
	const messages = await ANSWER_PROMPT_TEMPLATE.formatMessages({
		history,
		context,
		standalone,
	});
	const response = await model.invoke(messages);

	const text =
		typeof response.content === "string"
			? response.content
			: String(response.content);

	return text.trim();
}
