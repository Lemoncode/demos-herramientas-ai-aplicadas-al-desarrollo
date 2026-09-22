Run the backlog workflow: Fix → Review → Ship & Report.

Invoke the `fix-backlog` skill and follow it exactly. Pass along any arguments the user gave this command as a ticket filter (e.g. `/fix-backlog B1 B3` fixes only those two tickets); if no arguments were given, the skill reads every ticket in `docs/backlog.md`.

$ARGUMENTS
