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
Next.js 15 harness for a **parallel bug-fix backlog** demo. A single `/fix-backlog` prompt dispatches an Orchestrator that reads a small backlog of independent, planted bugs, dispatches one Fix Subagent per ticket (each in an isolated git worktree), runs 3 parallel Reviewers, and opens GitHub PRs for tickets that pass all quality gates. AI setup: Claude Code (`.claude/`), Copilot (`.github/`), opencode (`.opencode/`).

### `harness-example-qa`
AI harness for **QA engineers**. Configures Claude and Copilot for read-only PR reviews: fetches Jira acceptance criteria, runs parallel subagent analysis (AC coverage, accessibility, contrast, tests, regression risk), and produces a structured QA Review Report. AI setup: Claude Code (`.claude/`), Copilot (`.github/`).

### `mcp-example`
Minimal MCP (Model Context Protocol) server implementation showing how to expose custom tools to AI coding assistants.

### `ci-subagents-claude`
Demo of a PR review *pipeline* wired into GitHub Actions using Anthropic's official `claude-code-action`. A `pr-review` skill coordinates three reviewer subagents (`react-reviewer`, `accessibility-reviewer`, `4r-reviewer`) that run in parallel over the changed files; every finding lands as an inline PR review comment. Shows both an automatic PR review trigger and an on-demand `@claude`-comment trigger, authenticated via a Claude Pro/Max subscription (no metered API spend).

### `ci-subagents-opencode`
Same demo as `ci-subagents-claude`, using opencode's official GitHub Action (`anomalyco/opencode/github`) instead. Same `pr-review` coordinator skill, same three reviewer agents, same planted issues in a byte-identical sample app, same inline-comment output. Authenticated via whatever provider key you already have opencode configured with. Both demos carry the 4R criteria inline in their `4r-reviewer` agent definition, so each reviewer is self-contained.

Both demos keep a portable copy of their agent and skill definitions in `.github/agents/*.agent.md` and `.github/skills/<name>/SKILL.md`, and each workflow stages that into the layout its tool actually reads — Claude Code gets a `.claude/` copy, opencode additionally ships an opencode-native `.opencode/` copy which is staged to the repo root (`opencode.ci.json` is then just the provider plus `default_agent`). Neither tool reads `.github/` by discovery, so the staging is explicit rather than magic. Both READMEs document the wiring.

The sample apps in both folders are **written with errors on purpose, for educational reasons** — each file says so in a banner, and each planted mistake is marked with an `Issue (...)` comment so the agents have something to find.

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
