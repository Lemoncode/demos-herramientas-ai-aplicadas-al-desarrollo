---
applyTo: "legacy-service/**"
---

# Legacy Service Is Read-Only

`legacy-service/` is the thing being replaced — a frozen input, not a workspace.

- **Never edit** `server.mjs`, `openapi.yaml` or anything else under `legacy-service/`.
- Read it freely; it is the reference the new service must reproduce.
- If the swap seems to require a legacy-service change, stop and report it instead.

The same applies to `new-service/` during discovery — the task is a client migration plan,
not a service redesign.
