# Demos — AI Tools Applied to Development

Course materials and live demos for the "AI tools applied to development" course.

---

## Folders

### `demo-01-superpowers`
React + TypeScript (Vite) playground used to showcase Claude Code superpowers live during the session.

### `demo-02-spec-kit`
Hands-on walkthrough of [Spec-Driven Development](https://github.com/github/spec-kit) using GitHub's Spec Kit CLI. Specs are the primary artifact; the AI generates implementations from them. Covers the full workflow: Constitution → Specify → Clarify → Plan → Tasks → Implement.

### `demo-03-grill-me`
Demo of the **Grill Me** workflow (based on Matt Pocock's workshop). Goes from a vague client brief to AFK agent implementation through a structured sequence: Grill → PRD → Issues → Ralph Loop → QA.

### `subagents-delegation-example`
Next.js 15 harness for the **Autonomous Fleet** demo. A single `/goal` prompt dispatches an Orchestrator that runs four phases: builds UI primitives, dispatches 6 parallel Section Workers (each in an isolated git worktree), runs 3 parallel Reviewers, and opens GitHub PRs for sections that pass all quality gates. AI setup: Claude Code (`.claude/`), Copilot (`.github/`).

### `harness-example-qa`
AI harness for **QA engineers**. Configures Claude and Copilot for read-only PR reviews: fetches Jira acceptance criteria, runs parallel subagent analysis (AC coverage, accessibility, contrast, tests, regression risk), and produces a structured QA Review Report. AI setup: Claude Code (`.claude/`), Copilot (`.github/`).

### `mcp-example`
Minimal MCP (Model Context Protocol) server implementation showing how to expose custom tools to AI coding assistants.

### `RAG-01-core`
Baseline RAG demo — static context injection. The CV is hardcoded in the system prompt; no document loading or vector search involved.

### `RAG-02-file-loading-and-kw-retrieval`
RAG with file loading and BM25 keyword retrieval. Documents are loaded from disk and searched via keyword matching before being injected into the prompt.

### `RAG-03-langchain-intro-standalone-question`
LangChain intro. Adds a standalone-question reformulation step so follow-up questions in a conversation are rewritten as self-contained queries before retrieval.

### `RAG-04-local-semantic-search`
Local semantic search using vector embeddings. Documents are embedded and stored locally; retrieval is similarity-based rather than keyword-based.

### `slides`
Presentation slides for the three course sessions (`day-1`, `day-2`, `day-3`).
