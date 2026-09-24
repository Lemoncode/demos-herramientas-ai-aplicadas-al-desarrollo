---
description: The legacy Users API is a read-only input during the swap. Never edit legacy-service/. Auto-loaded when editing files in legacy-service/.
paths:
  - "legacy-service/**"
---

# Legacy Service Is Read-Only

`legacy-service/` is the thing being replaced. It is a frozen input, not a workspace.

- **Never edit** `server.mjs`, `openapi.yaml` or anything else under `legacy-service/`.
- Read it freely: it is the reference the new service must reproduce.
- If the swap seems to require a change to the legacy service, stop and report it instead.

The same applies to `new-service/` **during discovery** — the task is to plan a client
migration, not to redesign the services.
