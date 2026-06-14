import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

// The system prompt used for the final answer call.
// Same content as RAG-02's prompt.ts.
export const ANSWER_SYSTEM_PROMPT = `You are a virtual assistant that answers questions about Aridane Martín's professional profile.

Before each question you will receive relevant excerpts from his CV as context inside <context> tags. Answer using only the provided context. If the context does not contain enough information to answer, say so clearly.

Be concise. Answer in the same language the user uses.`;

// Rewrites a follow-up question into a standalone question using prior history.
// On the first turn (empty history) the model is instructed to return the
// question unchanged, so main.ts does not need a special-case branch.
export const CONDENSE_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Given the conversation history below and a follow-up question, rewrite the follow-up so it can be understood without the history.

Rules:
- Reply with the rewritten question only — no explanations, no quotes.
- Use the same language as the follow-up question.
- If the question is already standalone, or if there is no prior history, return it unchanged.`,
  ],
  new MessagesPlaceholder("history"),
  ["human", "Follow-up question: {question}\nStandalone question:"],
]);

// Final answer template. Receives the BM25 context, the standalone question,
// and the conversation history for tone/continuity.
export const ANSWER_PROMPT = ChatPromptTemplate.fromMessages([
  ["system", ANSWER_SYSTEM_PROMPT],
  new MessagesPlaceholder("history"),
  ["human", "<context>\n{context}\n</context>\n\nQuestion: {standalone}"],
]);
