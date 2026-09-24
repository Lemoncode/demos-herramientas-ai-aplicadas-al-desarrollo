# Service swap — Users API v1 → Customers API v2

The authoritative context for this example. The assistant is expected to answer questions
about this swap **by calling the MCP tools**, not by reading this file.

## What is changing

The frontend currently talks to the **Legacy Users API** (`legacy-service`, port 4001). We
are replacing it with the **Customers API v2** (`new-service`, port 4002). Same underlying
data, different contract.

## Contract differences

| Concern | Legacy (v1) | New (v2) |
|---|---|---|
| List path | `GET /api/v1/users` | `GET /v2/customers` |
| Single path | `GET /api/v1/users/{id}` | `GET /v2/customers/{id}` |
| List response shape | bare array | `{ data: [...], total }` envelope |
| Single response shape | object | `{ data: { ... } }` envelope |
| "name" field | `name` | `fullName` |
| "email" field | `email` | `emailAddress` |
| Not-found shape | `{ error: "Not found" }` | `{ error: { code, message } }` |

## What the MCP tools answer

This table is a *summary*. The point of the example is that the assistant does not have to
trust it — it can verify every row against the source of truth:

- `get_contract({ service })` — the full OpenAPI text for `legacy` or `new`.
- `search_contract({ service, query })` — find a path, field or operationId.
- `read_route_handler({ service, path })` — the `server.mjs` snippet that handles a route.

If this document and the services ever disagree, **the services win**. That is the lesson:
tools beat prose because prose rots.

## The task for the assistant

Produce a **migration plan** for a frontend client: for each legacy call the client makes,
name the new call it becomes and the exact response-shape transformation (field renames and
envelope unwrapping). Ground every claim in tool output.
