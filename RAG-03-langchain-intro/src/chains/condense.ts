import type { BaseMessage } from "@langchain/core/messages";
import type { ChatOllama } from "@langchain/ollama";
import { CONDENSE_PROMPT } from "../prompts.js";

// Rewrite a follow-up question into a standalone question using prior history.
// On first turn (empty history) the prompt is written to return the input
// unchanged, so this function still runs but produces the same string back.
export async function condenseQuestion(
	model: ChatOllama,
	history: BaseMessage[],
	question: string,
): Promise<string> {
	const messages = await CONDENSE_PROMPT.formatMessages({ history, question });
	// console.log("===> condenseQuestion: messages", messages);
	const response = await model.invoke(messages);
	// console.log("===> condenseQuestion: response", response);

	// ChatOllama returns AIMessage. `.content` is typed as
	// `string | MessageContentComplex[]`. In practice the chat model returns a
	// string for text-only responses, so we coerce defensively and trim.
	const text =
		typeof response.content === "string"
			? response.content
			: String(response.content);

	return text.trim();
}
