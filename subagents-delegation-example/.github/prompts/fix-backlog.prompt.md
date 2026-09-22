---
name: fix-backlog
description: Run the full backlog workflow (Fix → Review → Ship & Report). Prints the Final Report as the explicit stop condition.
---

Use this prompt to run the backlog demo. Read the `fix-backlog` skill from `.github/skills/fix-backlog/SKILL.md` before doing anything else and follow every step in order.

Pass along any arguments given to this prompt as a ticket filter (e.g. `B1 B3` fixes only those two); if none are given, the skill reads every ticket in `docs/backlog.md`.
