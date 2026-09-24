# MCP-First — Backend Service Swap

The **top rung** of the AI-setup ladder. A complete, runnable pair of backend services plus a
small MCP server that exposes both contracts to the assistant as **tools**.

The use case is swapping a frontend off a legacy Users API and onto a new Customers API — a
job where the *contract* matters more than the code. That is where **tools beat prose**: an
`AGENTS.md` that lists field renames is stale the day a field changes; a tool that reads
`openapi.yaml` never is.

> Part of the "AI tools applied to development" course. Sibling examples:
> [`ai-setup-example-instructions-first`](../ai-setup-example-instructions-first) and
> [`ai-setup-example-subagents-first`](../ai-setup-example-subagents-first) (previous rungs).

---

## What this example teaches

| Lesson | Where you see it |
|---|---|
| Expose an external system as **tools** instead of describing it | `mcp-server/src/index.ts` |
| The tool reads the **source of truth at call time** — no staleness | `get_contract`, `search_contract` |
| Real behavior can be checked, not just the spec | `read_route_handler` reads `server.mjs` |
| MCP registration is **three spellings of one server** | `.mcp.json` · `.vscode/mcp.json` · `opencode.jsonc` |
| The setup can be light on instructions *and* delegation — the tool is the setup | `AGENTS.md` + one skill |

---

## The technique: mcp-first

No slash command, no subagents, no hooks. The assistant is handed three tools and told
(when relevant) to trust them over the prose in `docs/service-swap.md`:

```
get_contract({ service })         → the full OpenAPI text
search_contract({ service, query }) → matching lines with line numbers
read_route_handler({ service, path }) → the real server.mjs handler
```

The question you ask the assistant is plain language. The interesting part is watching it
*choose* to call the tools, then ground its migration plan in what they returned.

---

## Folder layout

```
ai-setup-example-mcp-first/
├── AGENTS.md                       ← global setup + tool usage
├── CONTEXT.md                      ← vocabulary
├── .mcp.json                       ← Claude Code: project MCP server
├── .vscode/mcp.json                ← VS Code / Copilot: MCP server
├── opencode.jsonc                  ← opencode: MCP server + always-on instructions
├── docs/service-swap.md            ← the swap summary + the task
├── legacy-service/                 ← Users API v1 (read-only)
├── new-service/                    ← Customers API v2
├── mcp-server/src/index.ts         ← the tool source of truth
├── .claude/
│   ├── skills/service-swap/SKILL.md
│   ├── rules/{new-service-conventions,legacy-readonly}.md
│   └── settings.json
└── .github/                        ← Copilot mirror: skills/, instructions/, copilot-instructions.md
```

---

## Getting started

**Prerequisites:** Node 20+ and npm.

```bash
# MCP server dependencies
cd mcp-server && npm install && cd ..

# optional — run the services by hand
cd legacy-service && npm start      # http://localhost:4001/api/v1/users
cd new-service  && npm start        # http://localhost:4002/v2/customers
```

| Thing | How to run |
|---|---|
| MCP server | spawned automatically by your client, per its config file |
| Legacy service | `cd legacy-service && npm start` |
| New service | `cd new-service && npm start` |

---

## How to run the example

1. Open your assistant in this folder (it picks up `.mcp.json` / `.vscode/mcp.json` /
   `opencode.jsonc` and starts the server).
2. Ask:

   > Read `docs/service-swap.md`, then use the contract tools to verify it and produce a
   > migration plan for the frontend.

3. Watch it call `get_contract`, `search_contract` and `read_route_handler`.
4. Read the migration plan — every row should cite the tool call that verified it.

---

## Minimum viable version (the fork path)

1. Find an external system you keep re-describing in prose.
2. Write **one MCP tool that reads it** (a file, an API, a schema).
3. Register it with each client you use.
4. Add a short skill saying *when* to reach for it.

No subagent, no hook. The tool is the setup.

---

## Providers

| Tool | MCP config | Instructions from |
|---|---|---|
| Claude Code | `.mcp.json` (`mcpServers`) | `AGENTS.md`, `.claude/rules/` (path-conditional) |
| GitHub Copilot (VS Code) | `.vscode/mcp.json` (`servers`) | `.github/copilot-instructions.md`, `.github/instructions/` |
| opencode | `opencode.jsonc` (`mcp`) | `AGENTS.md`, `opencode.jsonc` `instructions` (always-on) |

MCP client config keys differ — `mcpServers` vs `servers` vs `mcp` — but it is the same
server and the same experience once connected.
