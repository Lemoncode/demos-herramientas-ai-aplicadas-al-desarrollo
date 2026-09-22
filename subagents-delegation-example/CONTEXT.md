# Harness Example

Demo harness for a course on AI-assisted development. Illustrates **parallel subagent delegation**: a small backlog of independent, real bugs gets fixed by one subagent per ticket, each isolated in its own git worktree.

## Language

**Backlog**:
The list of open tickets against the current codebase, written in `docs/backlog.md`. Mirrors a real sprint backlog — plain issue descriptions, not a marketing brief.
_Avoid_: Goal, brief, spec

**Ticket**:
One bug or gap, scoped to exactly one file, owned end-to-end by one Fix Subagent. Most tickets own a file no other ticket touches; a few deliberately share a file with another ticket to demonstrate why worktree isolation matters (see `docs/backlog.md`) — each still gets its own git worktree, so the Fix Subagents never collide while working, even though the resulting PRs may still need a normal merge resolution.
_Avoid_: Mission, story, issue (too generic in this doc), task

**Fix Subagent**:
A single autonomous agent instance that resolves one Ticket in its own git worktree: reproduce the bug with a failing test, fix it, run the quality gate, commit, return a structured result. Fix Subagents do not communicate with each other; they coordinate only through the Orchestrator and through merged main.
_Avoid_: Worker, agent (too generic), bot

**Orchestrator**:
The first agent in the session. Reads the Backlog, dispatches one Fix Subagent per Ticket, then dispatches the Reviewers, then ships PRs and prints the Final Report. Does not fix tickets itself.
_Avoid_: Coordinator, dispatcher, manager

**Reviewer**:
A read-only specialist subagent dispatched after all Fix Subagents finish. Reviewers do not write code and do not have their own worktree — they read across the fixed worktrees and emit findings. The harness ships three: `react-reviewer`, `accessibility-reviewer`, and `4r-reviewer`.
_Avoid_: Auditor, checker, linter, critic

**4R Framework**:
External code-review framework adopted as the standard for the `4r-reviewer`. The Rs are Risk, Readability, Reliability, Resilience. The canonical rule set lives at `docs/references/4r-framework.md` — the Reviewer reads it; it does not invent criteria.
_Avoid_: Quality framework, review framework, 4-pillar framework

**Final Report**:
The single printed artifact that closes a `/fix-backlog` run — a table of Ticket × Fix/React/a11y/4R status plus PR URLs. The Orchestrator does not exit until the Final Report is printed; printing it is the explicit stop condition.
_Avoid_: Summary, status, results
