# RAG-04 — How to Start

This demo uses two local Ollama models:

- `llama3.2` as the chat model
- `nomic-embed-text` as the embedding model

If the embedding model is missing, startup stops here:

```text
Chat model: llama3.2
Embedding model: nomic-embed-text
Loading CV, chunking it, and embedding each chunk locally…
model "nomic-embed-text" not found, try pulling it first
```

That error means Ollama is running, but the embedding model has not been downloaded yet.

## 1. Start Ollama

Make sure Ollama is installed and running:

```bash
ollama --version
```

Then check that the local API is reachable:

```bash
curl http://localhost:11434/api/tags
```

If the curl command cannot connect, start the Ollama desktop app or run Ollama as a local service before continuing.

## 2. Pull the chat model

RAG-04 uses the same default chat model as RAG-03:

```bash
ollama pull llama3.2
```

You can use another chat model, but then update `OLLAMA_MODEL` in `.env`.

## 3. Pull the embedding model

This is the required step for the error above:

```bash
ollama pull nomic-embed-text
```

After it finishes, confirm both models are installed:

```bash
ollama list
```

You should see entries for:

```text
llama3.2
nomic-embed-text
```

## 4. Prepare the project

From the module folder:

```bash
cd RAG-04-local-semantic-search
npm install
cp .env.example .env
```

The default `.env` should look like this:

```bash
OLLAMA_MODEL=llama3.2
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

Important: `OLLAMA_BASE_URL` does not include `/v1` in this module. The Ollama embedding client talks to the native Ollama API at `http://localhost:11434`.

## 5. Run the demo

```bash
npm run dev
```

Expected startup:

```text
Chat model: llama3.2
Embedding model: nomic-embed-text
Loading CV, chunking it, and embedding each chunk locally…
RAG Index ready. 15 embedded chunks indexed.
```

Now ask a question:

```text
Has Aridane worked on online shops?
```

You should see semantic retrieval logs with similarity scores:

```text
[embedding] Query embedded into 768 dimensions.
[rag] Retrieved 3 chunk(s): "Experience at Douglas" (0.712), ...
```

## Quick fix checklist

If you still see `model "nomic-embed-text" not found`:

```bash
ollama pull nomic-embed-text
ollama list
```

If you see connection errors:

```bash
curl http://localhost:11434/api/tags
```

If your `.env` points to the OpenAI-compatible endpoint, change it:

```bash
OLLAMA_BASE_URL=http://localhost:11434
```

## Verify the module

```bash
npm test
npm run typecheck
```
