# MCP-First — Backend Service Swap

Demo setup for the "AI tools applied to development" course. Shows the **mcp-first**
approach: the legacy and new services are exposed to the assistant as **tools** via an MCP
server, so it looks the contract up instead of remembering it.

**Stacks:** `legacy-service/` + `new-service/` zero-dependency Node HTTP servers ·
`mcp-server/` TypeScript MCP server (SDK 1.x + Zod 3.x)

---

## How to run the demo

There is **no slash command** — the assistant chooses to call the tools. Ask in plain
language:

> Read `docs/service-swap.md`, then use the contract tools to verify it and produce a
> migration plan for the frontend.

---

## The tools

| Tool | Purpose |
|---|---|
| `get_contract({ service })` | Full OpenAPI text for `legacy` or `new` |
| `search_contract({ service, query })` | Matching lines with line numbers |
| `read_route_handler({ service, path })` | The `server.mjs` snippet handling a route |

`service` is `"legacy"` or `"new"`.

---

## MCP server registration

| Client | File | Key |
|---|---|---|
| Claude Code | `.mcp.json` | `mcpServers` |
| VS Code / Copilot | `.vscode/mcp.json` | `servers` |
| opencode | `opencode.jsonc` | `mcp` |

Same server, three spellings.

---

## Skills

| Skill | Used by |
|---|---|
| `service-swap` | The assistant, for any question about the two services |

## Instructions (auto-loaded by file pattern)

| File | Applied to |
|---|---|
| `new-service-conventions.instructions.md` | `new-service/**` |
| `legacy-readonly.instructions.md` | `legacy-service/**` |

---

## Prerequisites

- Node 20+ and npm.
- `cd mcp-server && npm install` (the MCP server's dependencies).
- Optional: `cd legacy-service && npm start` / `cd new-service && npm start` to see the real
  responses. The MCP tools read the contract files directly and do not need the services up.
