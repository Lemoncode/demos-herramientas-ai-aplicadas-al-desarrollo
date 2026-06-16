# Demo Setup — Autonomous Subagents from the Start

## State

✅ **Setup prepared for autonomous-first Fleet demo**

The harness is configured to dispatch autonomous subagents from the start (no sequential work in main):

| Config | Status |
|---|---|
| Permissions | ✅ Auto-allow: Agent, Bash, Edit, Write, Read, Glob, Grep |
| Goal command | ✅ Ready (`/goal`) |
| Settings | ✅ Updated for demo (auto-approve permissions) |
| Documentation | ✅ Created (this file + docs/demo/) |
| Main branch | ✅ Clean, no uncommitted changes |

## To run the demo

```bash
/goal
```

The orchestration will:

1. **Phase 1 — Foundation Agent** (~60s)
   - Dispatches one autonomous agent in a worktree
   - Builds: tokens, primitives, app shell, 6 section stubs
   - Commits Foundation to main

2. **Phase 2 — Fleet** (6 Section Workers in parallel, ~5-10 min)
   - Dispatches 6 agents **concurrently** (the dramatic moment)
   - Each agent: Red → Green → Refactor → commit
   - Each agent returns a structured contract

3. **Phase 3 — Review** (2 agents in parallel, ~2-3 min)
   - accessibility-reviewer: WCAG, a11y best practices
   - 4r-reviewer: Risk, Readability, Reliability, Resilience
   - Reports saved to `docs/reports/`

4. **Phase 4 — Ship & Report** (~30s)
   - Open PRs for passing Sections
   - Print Final Report (6×3 matrix + PR URLs)
   - HALT

**Total runtime:** ~10-15 minutes

## Key features visible to audience

✅ **Autonomous** — No "Allow? Y/N" prompts, no manual intervention
✅ **Parallel** — 6 Section agents visible running concurrently
✅ **Isolated** — Each agent works in its own worktree
✅ **Quality gates** — Hooks enforce tests/lint/typecheck
✅ **Transparent** — Final Report is simple, auditable

## Reset for a fresh run

```bash
git reset --hard origin/main
git worktree prune
```

Then `/goal` again.

## Customizing the goal

Edit `docs/demo/goal-prompt.md` to build a different website. The orchestration adapts automatically.

## Notes for course instructors

**Teaching moments:**

1. **Autonomous agent orchestration** — See agents dispatch and self-manage without human intervention
2. **Parallel execution** — 6 agents working concurrently (the Fleet demo's visual centerpiece)
3. **Quality gates** — Tests/lint/types enforced by pre-commit hooks; failures stop the workflow
4. **Practical TDD** — Real Red → Green → Refactor visible in agent transcripts
5. **Code review at scale** — Two independent reviewers examining all Sections
6. **Objective reporting** — Final Report is a simple 6×3 matrix (no ambiguity, no hand-waving)

**Why this design matters:**

- **No sequential bottleneck** — Foundation agent runs once; Section agents all run in parallel
- **No manual approval gates** — Pre-configured permissions mean the demo runs uninterrupted
- **Isolation prevents bugs** — Each agent works in its own worktree; cross-agent interference is impossible
- **Quality is non-negotiable** — Hooks ensure every commit passes tests/lint/types
- **Transparent results** — Final Report shows exactly which Sections passed/failed and why

---

Last updated: 2026-06-16
Ready to demo: ✅ Yes
