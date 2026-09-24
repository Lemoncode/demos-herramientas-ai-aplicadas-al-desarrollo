# MCP-First — Backend Service Swap

Demo setup for the "AI tools applied to development" course. Shows the **mcp-first**
approach: instead of describing the legacy and new services in prose, this setup exposes
them to the assistant as **tools** via a small MCP server. The assistant looks the truth up
instead of remembering it.

The use case is swapping a frontend off one backend service and onto another — a
knowledge-heavy job where the contract matters more than the code.

**Stacks:** `legacy-service/` + `new-service/` zero-dependency Node HTTP servers ·
`mcp-server/` TypeScript MCP server (SDK 1.x + Zod 3.x)

> Sibling examples: [`ai-setup-example-instructions-first`](../ai-setup-example-instructions-first)
> and [`ai-setup-example-subagents-first`](../ai-setup-example-subagents-first) (previous rungs).

---

## How to run the demo

There is **no slash command** — that is the lesson. You ask a question in plain language and
the assistant *chooses* to call the MCP tools.

Open your assistant in this folder and ask something like:

> Read `docs/service-swap.md`, then use the contract tools to verify it and produce a
> migration plan for the frontend.

You should see the assistant call `get_contract`, `search_contract` and
`read_route_handler` — reading the real contracts rather than trusting the prose.

| Phase | What happens |
|---|---|
| **1. Discover** | The assistant registers the `service-contracts` MCP server and its three tools. |
| **2. Call** | It calls `get_contract` / `search_contract` / `read_route_handler` to read the legacy and new contracts. |
| **3. Plan** | It produces a migration plan grounded in tool output. |

---

## The tools

| Tool | Purpose |
|---|---|
| `get_contract({ service })` | Full OpenAPI text for `legacy` or `new` |
| `search_contract({ service, query })` | Matching lines with line numbers |
| `read_route_handler({ service, path })` | The `server.mjs` snippet handling a route |

`service` is `"legacy"` (the service being replaced) or `"new"` (its replacement).

---

## Why tools beat prose here

An `AGENTS.md` that said *"`name` becomes `fullName`"* would be correct the day it is written
and stale the moment a field changes. The MCP server reads the actual `openapi.yaml` and
`server.mjs` at call time, so the assistant is always reasoning about the real contract.
This is the one job in the course where **external context sources**, not instructions or
delegation, are the point.

---

## Folder layout

```
ai-setup-example-mcp-first/
├── AGENTS.md                       ← global setup, tool usage, no command
├── CONTEXT.md                      ← vocabulary
├── .mcp.json                       ← Claude Code: project MCP server
├── .vscode/mcp.json                ← VS Code / Copilot: MCP server
├── opencode.jsonc                  ← opencode: MCP server + always-on instructions
├── docs/service-swap.md            ← the swap summary + the task
├── legacy-service/                 ← the service being replaced (read-only)
│   ├── server.mjs · openapi.yaml · package.json
├── new-service/                    ← the replacement
│   ├── server.mjs · openapi.yaml · package.json
├── mcp-server/                     ← the tool source of truth
│   ├── src/index.ts · package.json · tsconfig.json
├── .claude/
│   ├── skills/service-swap/SKILL.md
│   ├── rules/{new-service-conventions,legacy-readonly}.md
│   └── settings.json
└── .github/                        ← Copilot mirror: skills/service-swap, instructions/, copilot-instructions.md
```

---

## Getting started

**Prerequisites:** Node 20+ and npm.

```bash
# 1. install the MCP server's dependencies (the server itself needs nothing)
cd mcp-server && npm install && cd ..

# 2. (optional) run the two services to poke at them by hand
cd legacy-service && npm start        # http://localhost:4001
cd new-service && npm start           # http://localhost:4002
```

The assistant does not need the services running — the MCP tools read the contract files
directly. Running them is only for you, to see the real responses.

---

## Minimum viable version (the fork path)

To lift this pattern into your own project:

1. Identify the external system whose truth you keep re-describing in prose.
2. Write **one MCP tool that reads it** (a file, an API, a schema).
3. Register that server with each tool you support (`.mcp.json`, `.vscode/mcp.json`,
   `opencode.jsonc`).
4. Add a short skill that tells the assistant *when* to reach for the tool.

You do not need a subagent or a hook. The tool is the setup.

---

## Providers

| Tool | MCP config | Instructions from |
|---|---|---|
| Claude Code | `.mcp.json` (`mcpServers`) | `AGENTS.md`, `.claude/rules/` (path-conditional) |
| GitHub Copilot (VS Code) | `.vscode/mcp.json` (`servers`) | `.github/copilot-instructions.md`, `.github/instructions/` (path-conditional) |
| opencode | `opencode.jsonc` (`mcp`) | `AGENTS.md`, `opencode.jsonc` `instructions` (always-on) |

> Note: MCP config keys differ between clients. Claude Code uses `mcpServers`, VS Code /
> Copilot uses `servers`, opencode uses `mcp`. Same server, three spellings — the assistant
> experience is identical once it is connected.
