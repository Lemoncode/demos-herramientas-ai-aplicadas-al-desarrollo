# RAG-03 — How to Start

RAG-03 uses LangChain, Ollama, BM25 retrieval, and a question-rewriting chain for conversational follow-ups.

## 1. Install dependencies

From the module folder:

```bash
cd RAG-03-langchain-intro-standalone-question
npm install
```

## 2. Start Ollama

Make sure Ollama is installed and running:

```bash
ollama --version
curl http://localhost:11434/api/tags
```

Pull the chat model if needed:

```bash
ollama pull llama3.2
```

## 3. Create the environment file

```bash
cp .env.example .env
```

The default `.env` should look like this:

```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Important: RAG-03 uses LangChain's native Ollama integration, so `OLLAMA_BASE_URL` does not include `/v1`.

## 4. Run the demo

```bash
npm run dev
```

Try a first question:

```text
Where did Aridane work in 2022?
```

Then try a follow-up:

```text
What about the e-commerce one?
```

You should see the rewritten question before retrieval:

```text
[condense] Rewritten -> standalone: "What was Aridane's experience building the e-commerce platform?"
[rag] Retrieved 2 chunk(s): "Experience at Douglas", "Experience at Secret Source"
```

## 5. Verify TypeScript

```bash
npm run typecheck
```
