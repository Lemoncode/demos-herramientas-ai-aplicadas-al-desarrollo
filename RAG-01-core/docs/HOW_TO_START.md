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

The example file supports three providers:

```bash
# Provider selection: anthropic | openai | ollama
PROVIDER=anthropic

# Anthropic (required when PROVIDER=anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (required when PROVIDER=openai)
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1

# Ollama (required when PROVIDER=ollama)
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.2
```

## 3. Local Ollama option

If you want to run it locally for free, use Ollama:

```bash
PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.2
```

Make sure Ollama is running:

```bash
curl http://localhost:11434/api/tags
```

Pull the chat model if needed:

```bash
ollama pull llama3.2
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
