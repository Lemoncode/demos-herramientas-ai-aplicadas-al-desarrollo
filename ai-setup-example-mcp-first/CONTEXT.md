# MCP-First Example

A course example for AI-assisted development. Demonstrates the **mcp-first** approach:
external systems are exposed to the assistant as tools (via an MCP server) rather than
described in prose. The use case is swapping a frontend from one backend service to another.

## Language

**Contract**:
The machine-readable shape of a service — its routes, request parameters, response envelopes
and field names, as written in `openapi.yaml`. The two contracts in play are the legacy
Users API (v1) and the new Customers API (v2).
_Avoid_: API doc (prose), spec (used loosely)

**Service swap**:
Migrating a client off `legacy-service` and onto `new-service` without changing what the
user sees. The swap is a *knowledge* problem before it is a coding problem.
_Avoid_: Migration (reserved for the sibling React→Astro example), upgrade

**MCP tool**:
A capability the assistant can call — here, `get_contract`, `search_contract` and
`read_route_handler`. Each reads the real files, so the answer is never stale.
_Avoid_: Function, endpoint, command

**Source of truth**:
The files the tools read: `legacy-service/openapi.yaml`, `new-service/openapi.yaml` and the
two `server.mjs` implementations. If prose and source disagree, the source wins.
_Avoid_: Reference, ground truth

**Tool-first**:
An approach where the setup's value comes from the tools it exposes, not from instructions or
delegation. This example is deliberately light on both.
_Avoid_: MCP-first (same thing; used in titles), tool-driven
