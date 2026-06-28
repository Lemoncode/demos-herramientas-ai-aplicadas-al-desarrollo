// One assistant turn: send the conversation history, print the reply.
// Updates `messages` in place so main.ts keeps the full conversation.

import type { LLMResponse, Message } from "../api/types.js";
import type { Provider } from "../provider/index.js";
import { ProviderError } from "../provider/index.js";
import { printError, printText } from "../ui/output.js";

export async function runAgentLoop(
	provider: Provider,
	messages: Message[],
): Promise<void> {
	let response: LLMResponse;
	try {
		response = await provider.send(messages);
	} catch (err) {
		if (err instanceof ProviderError) {
			printError(`provider error: ${err.message}`);
			return;
		}
		throw err;
	}

	messages.push({ role: "assistant", content: response.content });

	for (const block of response.content) {
		printText(block.text);
	}
}
