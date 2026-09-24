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

### AI setup examples (the depth ladder)

Three self-contained, runnable examples that trace how far an AI setup can go — each is named after its **technique**, and each ships its own codebase plus a per-tool setup for Claude Code (`.claude/`), Copilot (`.github/`) and opencode (`.opencode/` / `opencode.jsonc`), scoped to the mechanisms it actually uses. Read them in order: each rung adds one idea.

#### `ai-setup-example-instructions-first`
Instructions-first — the minimum viable setup: an `AGENTS.md` plus path-scoped rules, and nothing else. No agents, no hooks, no commands, no MCP. Use case: add a feature to a greenfield Vite + React app. Teaches that a precise instruction set is often enough, and how the same rules reach all three tools.

#### `ai-setup-example-subagents-first`
Subagents-first — delegation. One `/migrate-react-to-astro` prompt fans a React → Astro migration out to one `component-migrator` subagent per source file, then verifies the result with a read-only `astro-verifier`. Teaches parallel fan-out, file-ownership isolation (no worktree needed when units don't share files), and a structured contract between orchestrator and subagent.

#### `ai-setup-example-mcp-first`
MCP-first — external context as tools. A small MCP server exposes a legacy Users API and a new Customers API to the assistant as tools (`get_contract`, `search_contract`, `read_route_handler`) so a service swap is planned against the real contracts, not a prose summary. Teaches that when *knowledge* is the bottleneck, tools beat instructions. No command and no subagents — the tool is the setup.

### `ci-subagents-opencode`
Demo of a PR review *pipeline* wired into GitHub Actions using opencode's official GitHub Action (`anomalyco/opencode/github`). A `pr-review` skill coordinates three reviewer subagents (`react-reviewer`, `accessibility-reviewer`, `4r-reviewer`) that run in parallel over the changed files; every finding lands as an inline PR review comment. Shows both an automatic PR review trigger and an on-demand `/opencode`-comment trigger, the latter also able to apply a fix and commit it back to the PR. Authenticated via whatever provider key you already have opencode configured with. The 4R criteria live inline in the `4r-reviewer` agent definition, so each reviewer is self-contained.

The demo keeps a portable copy of its agent and skill definitions in `.github/agents/*.agent.md` and `.github/skills/<name>/SKILL.md`, and the workflow stages that into the layout opencode actually reads (`.opencode/`, staged to the repo root; `opencode.ci.json` is then just the provider plus `default_agent`). opencode does not read `.github/` by discovery, so the staging is explicit rather than magic. The README documents the wiring.

The sample app is **written with errors on purpose, for educational reasons** — each file says so in a banner, and each planted mistake is marked with an `Issue (...)` comment so the agents have something to find.

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
