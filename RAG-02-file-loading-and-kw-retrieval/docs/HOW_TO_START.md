# RAG-02 — How to Start

RAG-02 loads `data/cv.md`, splits it into chunks, builds an in-memory BM25 index, and retrieves relevant chunks before each answer.

## 1. Install dependencies

From the module folder:

```bash
cd RAG-02-file-loading-and-kw-retrieval
npm install
```

## 2. Create the environment file

```bash
cp .env.example .env
```

The default provider is Ollama:

```bash
PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.2
```

The example file also supports Anthropic and OpenAI:

```bash
# Anthropic
PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_BASE_URL=https://api.openai.com/v1
```

## 3. Local Ollama option

Make sure Ollama is running:

```bash
curl http://localhost:11434/api/tags
```

Pull the chat model if needed:

```bash
ollama pull llama3.2
```

Important: RAG-02 uses the OpenAI-compatible Ollama endpoint, so `OLLAMA_BASE_URL` includes `/v1`:

```bash
OLLAMA_BASE_URL=http://localhost:11434/v1
```

## 4. Run the demo

```bash
npm run dev
```

Ask a question that should retrieve one or more CV chunks:

```text
Where did Aridane work in 2022?
```

You should see a retrieval log before the answer:

```text
[rag] Retrieved 2 chunk(s): "Experience at Douglas", "Experience at Secret Source"
```

## 5. Verify TypeScript

```bash
npm run typecheck
```
