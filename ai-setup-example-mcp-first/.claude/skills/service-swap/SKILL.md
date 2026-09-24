---
name: service-swap
description: Use this skill when asked anything about the legacy Users API, the new Customers API, or the swap between them. Grounds every answer in the `service-contracts` MCP tools instead of the prose summary, then produces a migration plan.
---

# service-swap

**Type: Rigid** — the tool calls happen before any claim does. Do not answer from memory.

You have an MCP server called `service-contracts` with three tools. They are your only
acceptable source of truth for what the two services do.

| Tool | Call it to |
|---|---|
| `get_contract({ service })` | read the full OpenAPI text for `legacy` or `new` |
| `search_contract({ service, query })` | locate a path, field or operationId |
| `read_route_handler({ service, path })` | see the actual `server.mjs` handler for a route |

`service` is `"legacy"` (Users API v1) or `"new"` (Customers API v2).

---

## Step 1 — Read both contracts

Call `get_contract({ service: "legacy" })` and `get_contract({ service: "new" })`. You now
hold both contracts in full.

If the tools are unavailable, stop and say so. **Do not** fall back to
`docs/service-swap.md` — that file is a summary and may be stale; that is the entire premise
of this example.

---

## Step 2 — Verify every difference against the tools

`docs/service-swap.md` lists the expected differences (path renames, field renames, the
`data` envelope, the error shape). For each one you intend to act on:

1. Confirm the legacy side with `search_contract({ service: "legacy", query })`.
2. Confirm the new side with `search_contract({ service: "new", query })`.
3. If it can be seen only at runtime, confirm with `read_route_handler`.

Any row you cannot confirm from tool output is **unverified** — mark it and do not build on it.

---

## Step 3 — Produce the migration plan

For each legacy call the client makes, output:

- the legacy call,
- the new call it becomes,
- the exact response transformation: field renames (`name` → `fullName`,
  `email` → `emailAddress`) and envelope unwrapping (`body` → `body.data`),
- the error-shape change on 404,
- the tool call(s) that verified this row.

End with a short "Unverified / open questions" section.

---

## Hard constraints

- Never edit anything under `legacy-service/` or `new-service/` — both are read-only inputs.
- Never claim a contract detail you did not read from a tool in this session.
- Keep the plan about the *client* migration; do not propose changes to either service.
- No slash command and no subagents — this is a pure tool-first task.
