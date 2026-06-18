import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";

// Rewrites a follow-up question into a standalone question using prior history.
// On the first turn (empty history) the model is instructed to return the
// question unchanged, so main.ts does not need a special-case branch.
export const CONDENSE_PROMPT_TEMPLATE = ChatPromptTemplate.fromMessages([
	[
		"system",
		`Given the conversation history below and a follow-up question, rewrite the follow-up so it can be understood without the history. Answer can be only related to Aridane Martín's professional profile. If the follow-up question is already standalone, return it unchanged.

Rules:
- Output ONLY the rewritten question — do NOT answer it, no explanations, no quotes.
- Use the same language as the follow-up question.
- If the question is already standalone, return it word-for-word unchanged.`,
	],
	// OJO! <--- Falseo la conversación, con ejemplos de como debería funcionar la reescritura de preguntas de seguimiento a preguntas independientes
	// Few-shot example 1 — standalone question, return it unchanged
	["human", "Follow-up question: quien es aridane\nStandalone question:"],
	["ai", "quien es aridane"],
	// Few-shot example 2 — follow-up that needs history resolved
	[
		"human",
		"Follow-up question: y cuántos años tiene de experiencia?\nStandalone question:",
	],
	["ai", "¿Cuántos años de experiencia tiene Aridane Martín?"],
	new MessagesPlaceholder("history"),
	["human", "Follow-up question: {question}\nStandalone question:"],
]);

// Final answer template. Receives the BM25 context, the standalone question,
// and the conversation history for tone/continuity.
export const ANSWER_PROMPT_TEMPLATE = ChatPromptTemplate.fromMessages([
	[
		"system",
		`You are a virtual assistant that answers questions about Aridane Martín's professional profile.

Before each question you will receive relevant excerpts from his CV as context inside <context> tags. Answer using only the provided context. If the context does not contain enough information to answer, say so clearly.

Be concise. Answer in the same language the user uses.`,
	],
	new MessagesPlaceholder("history"),
	["human", "<context>\n{context}\n</context>\n\nQuestion: {standalone}"],
]);
