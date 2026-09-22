---
description: Run the backlog workflow (Fix → Review → Ship & Report) against docs/backlog.md.
agent: build
---

Run the `fix-backlog` skill and follow it exactly. Pass along anything typed after this command as a ticket filter (e.g. `/fix-backlog B1 B3` fixes only those two); if nothing was given, the skill reads every ticket in `docs/backlog.md`.

$ARGUMENTS
