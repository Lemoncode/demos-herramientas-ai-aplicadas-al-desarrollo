# RAG-03-langchain-intro — Design

**Date:** 2026-06-14
**Status:** Draft for review
**Predecessor:** RAG-02-file-loading-and-kw-retrieval

## Goal

Extend RAG-02 with two changes that introduce LangChain.js to the demo series:

1. Replace the hand-rolled `Provider` abstraction with a LangChain `ChatModel` (Ollama only).
2. Insert a **condense-question** step that rewrites each user turn into a standalone question, using LangChain prompts. The standalone question is logged as `[Standalone]: <question>` and then used for **both** BM25 retrieval and the final answer call.

This is an *intro* example — the surface area kept small on purpose so the LangChain concepts (`ChatModel`, `ChatPromptTemplate`, `MessagesPlaceholder`, message history) are clearly visible.

## Non-goals

- LCEL pipe-composition (`prompt.pipe(model).pipe(parser)`). Plain async calls only.
- Multi-provider support. Anthropic/OpenAI are removed; only Ollama remains.
- Memory abstractions (`BufferMemory`, `RunnableWithMessageHistory`). History is a plain `BaseMessage[]`.
- Streaming, callbacks/tracing, `LangSmith`, agents, tools.
- Changing the BM25 retriever — `loader`, `chunker`, `retriever` are copied verbatim from RAG-02.

## Architecture

```
RAG-03-langchain-intro/
├── package.json              langchain, @langchain/core, @langchain/ollama, tsx, typescript
├── tsconfig.json             same as RAG-02
├── .env.example              OLLAMA_MODEL, OLLAMA_BASE_URL
├── .gitignore
├── data/
│   └── cv.md                 copied from RAG-02
├── docs/
│   └── README.md             short walkthrough (mirrors RAG-02 style)
└── src/
    ├── main.ts               REPL loop, orchestrates the pipeline
    ├── setup.ts              buildChatModel() + buildRagIndex()
    ├── prompts.ts            CONDENSE_PROMPT + ANSWER_SYSTEM_PROMPT
    ├── chains/
    │   ├── condense.ts       condenseQuestion(model, history, question) → string
    │   └── answer.ts         answer(model, context, standalone, history) → string
    ├── rag/
    │   ├── loader.ts         (copy from RAG-02)
    │   ├── chunker.ts        (copy from RAG-02)
    │   └── retriever.ts      (copy from RAG-02)
    └── internal/ui/output.ts (copy + new printStandalone helper)
```

The `internal/provider/*` and `internal/api/types.ts` directories from RAG-02 are **removed** — LangChain owns those concerns now.

## Per-turn flow

```
user types "query"
   │
   ├─► condenseQuestion(model, history, query)  ── LangChain call #1
   │      returns "standalone"
   │
   ├─► printStandalone(standalone)              ── logs "[Standalone]: <standalone>"
   │
   ├─► search(index, standalone, 3)             ── BM25 on the standalone question
   │      returns hits
   │
   ├─► printRag(...)                            ── existing helper, lists retrieved chunks
   │
   ├─► answer(model, context, standalone, history) ── LangChain call #2
   │      returns response text
   │
   ├─► print response
   │
   └─► history.push(new HumanMessage(query))    ── original user text, not standalone
       history.push(new AIMessage(response))
```

**Why store the original user text in history, not the standalone?** History is what the condense step reads next turn to disambiguate. Keeping the original preserves the user's actual phrasing for that purpose. The standalone is a derived artifact, used only for the current turn.

**First turn (empty history)** — the condense step still runs. The prompt is written to return the question unchanged when there is no prior context, so the first standalone equals the first user query. No special-case branching in `main.ts`.

## Component contracts

### `setup.ts`

```ts
export function buildChatModel(): ChatOllama
export async function buildRagIndex(): Promise<Index>
```

- `buildChatModel()` reads `OLLAMA_MODEL` (default `llama3.2`) and `OLLAMA_BASE_URL` (default `http://localhost:11434`) and returns a `ChatOllama` instance from `@langchain/ollama`.
- `buildRagIndex()` is identical to RAG-02's.

### `chains/condense.ts`

```ts
export async function condenseQuestion(
  model: ChatOllama,
  history: BaseMessage[],
  question: string,
): Promise<string>
```

- Formats `CONDENSE_PROMPT` (a `ChatPromptTemplate`) with `{history, question}` to produce `BaseMessage[]`.
- Calls `model.invoke(messages)`.
- Returns `response.content` as a string (trimmed). If the model returns a non-string content array, join text parts.

### `chains/answer.ts`

```ts
export async function answer(
  model: ChatOllama,
  context: string,
  standalone: string,
  history: BaseMessage[],
): Promise<string>
```

- Formats `ANSWER_PROMPT` (exported from `prompts.ts`) with `{history, context, standalone}`. The template is a `ChatPromptTemplate` with:
  - System: `ANSWER_SYSTEM_PROMPT` (string constant)
  - `MessagesPlaceholder("history")`
  - Human: `<context>{context}</context>\n\nQuestion: {standalone}`
- Calls `model.invoke()` and returns the text content.
- If `context` is empty (no BM25 hits), the caller (`main.ts`) passes an empty string and the human message naturally produces empty `<context></context>` tags. Acceptable for an intro example; we do not branch the template.

### `prompts.ts`

```ts
export const CONDENSE_PROMPT: ChatPromptTemplate
export const ANSWER_PROMPT: ChatPromptTemplate
export const ANSWER_SYSTEM_PROMPT: string  // exported for reuse and so the prompt module owns it
```

- **`CONDENSE_PROMPT`** — system instruction roughly:
  > "Given the conversation history and a follow-up question, rephrase the follow-up so it can be understood without the history. Reply with the rephrased question only, in the same language as the user. If the question is already standalone or there is no prior history, return it unchanged."
  Followed by `MessagesPlaceholder("history")` and a human turn `"Follow-up question: {question}\nStandalone question:"`.
- **`ANSWER_SYSTEM_PROMPT`** — copied verbatim from RAG-02's `prompt.ts`.

### `main.ts`

REPL loop with the same UX as RAG-02:

- `/exit` / `/quit` — leave
- `/clear` — empty `history`
- empty input — reprompt
- otherwise — run the per-turn flow above

History is a `BaseMessage[]` declared in `main()` and passed by reference to the chains.

### `internal/ui/output.ts`

Add one helper:

```ts
export function printStandalone(text: string): void {
  process.stdout.write(`\x1b[33m[Standalone]\x1b[0m: ${text}\n`);
}
```

Yellow `[Standalone]` tag to visually distinguish from `[rag]` (magenta) and `[info]` (cyan).

## Dependencies

**Added:**

- `langchain`
- `@langchain/core`
- `@langchain/ollama`

**Removed:**

- `@anthropic-ai/sdk`
- `openai`

Dev dependencies (`tsx`, `typescript`, `@types/node`) unchanged.

## Environment

```
OLLAMA_MODEL=llama3.2
OLLAMA_BASE_URL=http://localhost:11434
```

No `PROVIDER` switch. No API keys.

## Error handling

LangChain throws on transport/model errors. The REPL's top-level `try/catch` (around the per-turn block in `main.ts`) prints the message via `printError()` and reprompts — same UX as RAG-02, just without a custom `ProviderError` wrapper.

## Testing strategy

This is a demo, not a library. Manual verification:

1. `npm run typecheck` passes.
2. `npm run dev` starts the REPL, prints the banner, shows `Index ready. N chunks indexed.`
3. First turn: ask "Who is Aridane?". Expect `[Standalone]: Who is Aridane?` (unchanged), `[rag]` retrieval line, then the answer.
4. Follow-up: ask "What languages does he know?". Expect `[Standalone]:` to include "Aridane" (resolved from history), followed by retrieval + answer.
5. `/clear` then ask a follow-up-style question — should be returned unchanged by condense (empty history).

## Open questions

None — all clarifications resolved during brainstorming (single provider, plain async, log + use standalone for both retrieval and answer).
