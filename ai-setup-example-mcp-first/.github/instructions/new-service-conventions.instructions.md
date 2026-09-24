---
applyTo: "new-service/**"
---

# New Service Conventions (v2)

- **Responses are enveloped.** Success: `{ "data": { ... } }` for one resource,
  `{ "data": [ ... ], "total": <number> }` for a collection. Never a bare object or array.
- **Errors are structured.** `{ "error": { "code": "<snake_case>", "message": "<text>" } }`
  with an appropriate status. Never a bare string.
- **camelCase fields**: `fullName`, `emailAddress`.
- Keep `openapi.yaml` and `server.mjs` in sync — the MCP tools read the contract file, so a
  route that exists only in code is invisible to the assistant.
