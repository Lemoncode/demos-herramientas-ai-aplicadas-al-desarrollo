# RAG-01 — How to Start

RAG-01 is the static context injection demo. The CV is hardcoded in `src/prompt.ts`, so there is no document loading or indexing step to prepare.

## 1. Install dependencies

From the module folder:

```bash
cd RAG-01-core
npm install
```

## 2. Create the environment file

```bash
cp .env.example .env
```

RAG-01 uses Ollama through its OpenAI-compatible endpoint:

```bash
# Ollama connection
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen3-coder:30b
```

## 3. Start Ollama

Make sure Ollama is running:

```bash
curl http://localhost:11434/api/tags
```

Pull the chat model if needed:

```bash
ollama pull qwen3-coder:30b
```

## 4. Run the demo

```bash
npm run dev
```

Ask a question about the CV:

```text
What is Aridane's current role?
```

## 5. Verify TypeScript

```bash
npm run typecheck
```
