import type { BaseMessage } from "@langchain/core/messages";
import type { ChatOllama } from "@langchain/ollama";
import { CONDENSE_PROMPT_TEMPLATE } from "../prompts.js";

// Rewrite a follow-up question into a standalone question using prior history.
// On first turn (empty history) the prompt is written to return the input
// unchanged, so this function still runs but produces the same string back.
export async function condenseQuestion(
	model: ChatOllama,
	history: BaseMessage[],
	question: string,
): Promise<string> {
	const promptTemplate = await CONDENSE_PROMPT_TEMPLATE.formatMessages({
		history,
		question,
	});
	console.log(
		"===> condenseQuestion: messages",
		promptTemplate,
		"==============",
	);
	// Here we send the template to AI and
	const response = await model.invoke(promptTemplate);
	console.log("===> condenseQuestion:", response.content);
	// console.log("===> condenseQuestion: response", response);

	// ChatOllama returns AIMessage. `.content` is typed as
	// `string | MessageContentComplex[]`. In practice the chat model returns a
	// string for text-only responses, so we coerce defensively and trim.
	const condensedResponse =
		typeof response.content === "string"
			? response.content
			: String(response.content);

	return condensedResponse.trim();
}
