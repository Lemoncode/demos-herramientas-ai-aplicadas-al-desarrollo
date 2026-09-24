---
description: Conventions for the new Customers API v2 service — envelope responses, camelCase fields, structured errors. Auto-loaded when editing files in new-service/.
paths:
  - "new-service/**"
---

# New Service Conventions (v2)

- **Responses are enveloped.** A successful single resource is `{ "data": { ... } }`; a
  successful collection is `{ "data": [ ... ], "total": <number> }`. Never return a bare
  object or array.
- **Errors are structured.** A failure is
  `{ "error": { "code": "<snake_case>", "message": "<human readable>" } }` with an
  appropriate HTTP status. Never return a bare string.
- **Field names are camelCase** and descriptive: `fullName`, `emailAddress`.
- Keep `openapi.yaml` and `server.mjs` in sync. The contract file is what the MCP tools read,
  so a route that exists only in code is invisible to the assistant.
