# Harness Example — Backlog Fix Demo

Demo harness for the "AI tools applied to development" course. Shows how a single `/fix-backlog` prompt dispatches **parallel autonomous subagents** that each fix one real, independent bug from a small backlog, with TDD enforced by an explicit quality-gate step and a three-Reviewer quality gate.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript strict · Vitest 4 · @testing-library/react · ESLint 9 (jsx-a11y)

For the vocabulary behind every term below, see `CONTEXT.md`. For the "why", see Design notes at the bottom of this file.

---

## How to run the demo

```
/fix-backlog
```

One prompt. The Orchestrator runs three phases and prints a Final Report when done. Pass ticket ids to fix a subset, e.g. `/fix-backlog B1 B3`.

| Phase | What happens | Visible to audience |
|---|---|---|
| **1. Fix** | Orchestrator reads `docs/backlog.md`, creates one `git worktree` per ticket itself, then dispatches one `ticket-fixer` per ticket (each told which worktree to `cd` into). Each fixes its one owned file, running Red→Green→Refactor. | 5 transcripts running concurrently |
| **2. Review** | Orchestrator dispatches `react-reviewer`, `accessibility-reviewer`, and `4r-reviewer` in parallel. Each reads across all fixed worktrees and emits per-ticket verdicts. | 3 review reports + 3 markdown files in `docs/reports/` |
| **3. Ship & Report** | Orchestrator opens one PR per ticket that passed Build + Tests, removes every worktree, then prints the Final Report (status matrix + PR URLs). HALT. | Final Report on screen |

Stop condition: the Final Report prints. Nothing else happens.

---

## The backlog

`docs/backlog.md` lists five tickets against `src/components/directory/` (a small Team Directory page):

| Ticket | File | Kind |
|---|---|---|
| B1 | `DirectoryList.tsx` | Accessibility — icon-only button has no real accessible name |
| B2 | `PersonRow.tsx` | Correctness — tenure calculation ignores the anniversary date |
| B3 | `DirectorySearch.tsx` | React/perf — filtering isn't memoized, recomputes every render |
| B4 | `StatusBadge.tsx` | Test gap — correct component, zero test coverage |
| B5 | `DirectoryList.tsx` | Accessibility — filtered result count isn't announced (`aria-live`) |

Four of the five own a file no other ticket touches. **B1 and B5 are the deliberate exception** — both target `DirectoryList.tsx`, to demonstrate that worktree isolation doesn't require file-exclusive tickets, only a separate checkout per ticket. See the note at the top of `docs/backlog.md`.

---

## Skills

Invoke a skill before any task it matches. Skills are rigid — follow every step in order.

| Skill | Invoke when | Used by |
|---|---|---|
| `fix-backlog` | Running `/fix-backlog` | the Orchestrator (you, in the main session) |
| `fix-ticket` | Dispatched as a Fix Subagent | `ticket-fixer` agent |
| `vitest-tdd` | Implementing any feature or bugfix | `fix-ticket` references this for Red→Green→Refactor discipline |

---

## Commands

| Command | What it does |
|---|---|
| `/fix-backlog` | Runs the full backlog workflow against `docs/backlog.md` (or a ticket-id filter you pass as arguments). |

---

## Agents

| Agent | Dispatched when | Tools |
|---|---|---|
| `ticket-fixer` | Phase 1, one per ticket in parallel, each pointed at a worktree the Orchestrator already created | Read, Write, Edit, Bash, Glob, Grep |
| `react-reviewer` | Phase 2, once | Read, Glob, Grep |
| `accessibility-reviewer` | Phase 2, once | Read, Glob, Grep, Write |
| `4r-reviewer` | Phase 2, once | Read, Glob, Grep, Write |

---

## Rules (auto-loaded)

| Rule file | Scope | Covers |
|---|---|---|
| `components.md` | `src/components/**` | One component per file, named exports, props ≤ 6, semantic HTML, accessibility, per-ticket file ownership instead of import restrictions |
| `testing-conventions.md` | All test files | Query priority (`getByRole` first), `userEvent` over `fireEvent`, one behavior per test |

---

## Hooks (auto-enforced)

| Hook | Trigger | What it enforces |
|---|---|---|
| `commit-guard.sh` | PreToolUse on Bash containing `git commit` | All tests must pass before the commit is allowed. |
| `destructive-guard.sh` | PreToolUse on Bash | Blocks destructive commands (`rm -rf`, `git reset --hard`, `git push --force`, etc.) unless explicitly overridden. |

These are the only two hooks in this harness. Per-ticket file ownership is *not* hook-enforced — it's a discipline `fix-ticket` documents explicitly, backed by the fact that each ticket runs in its own `git worktree` so a Fix Subagent physically cannot see another ticket's in-progress edits, even on the two tickets (B1, B5) that share a file. The typecheck/lint quality gate is likewise an explicit step inside `fix-ticket`, not a hidden `PostToolUse` hook — visible discipline over invisible enforcement.

---

## Providers

This harness runs under three AI coding tools, each reading the same source of truth with its own discovery rules:

| Tool | Agents from | Skills from | Commands from | Rules from |
|---|---|---|---|---|
| Claude Code | `.claude/agents/` | `.claude/skills/` | `.claude/commands/` | `.claude/rules/` (path-conditional) |
| GitHub Copilot | `.github/agents/` | `.github/skills/` | `.github/prompts/` | `.github/instructions/` (path-conditional) |
| opencode | `.opencode/agents/` | `.claude/skills/` directly (Claude-compat — no separate copy needed) | `.opencode/commands/` (no Claude-compat fallback — must exist here) | `opencode.jsonc`'s `instructions` array (always-on, not path-conditional) |

Two things don't fit that table:
- **`AGENTS.md`** (this file) is read by all three natively — no per-tool copy needed.
- **Agents and commands have no cross-tool fallback anywhere.** opencode reads `.claude/skills/` automatically, but it will *not* find `.claude/agents/` or `.claude/commands/` — hence the separate `.opencode/agents/` and `.opencode/commands/fix-backlog.md`.

To run with opencode: `cd subagents-delegation-example && opencode`, then `/fix-backlog`. opencode discovers project config by walking up from the current directory to the git worktree root, so running it from inside this folder is enough — no staging step required (unlike the CI demos elsewhere in this repo, which run from the monorepo root and have to copy `.opencode/` there first).

---

## Folder layout

```
subagents-delegation-example/
├── AGENTS.md                       ← this file, read natively by all three tools
├── CONTEXT.md                      ← vocabulary (Backlog, Ticket, Fix Subagent, etc.)
├── opencode.jsonc                  ← opencode-only: always-on instructions (component/testing rules)
├── docs/
│   ├── backlog.md                  ← the five tickets — canonical input to /fix-backlog
│   ├── references/4r-framework.md  ← the 4Rs — read by 4r-reviewer
│   └── reports/                    ← Reviewer outputs land here per run
├── .claude/
│   ├── commands/fix-backlog.md
│   ├── agents/                     ← ticket-fixer, react-reviewer, accessibility-reviewer, 4r-reviewer
│   ├── skills/                     ← fix-backlog, fix-ticket, vitest-tdd, plus git-* and review skills (opencode reads these too)
│   ├── rules/                      ← components, testing-conventions
│   ├── hooks/                      ← commit-guard, destructive-guard
│   └── settings.json
├── .github/                        ← Copilot's portable mirror: agents/, skills/, prompts/, instructions/
├── .opencode/
│   ├── agents/                     ← ticket-fixer, react-reviewer, accessibility-reviewer, 4r-reviewer
│   └── commands/fix-backlog.md     ← opencode has no .claude/commands fallback, so this must exist
└── src/
    ├── app/                        ← Next.js App Router (layout, page, globals.css)
    └── components/
        └── directory/              ← the seeded app: people.ts, DirectoryList, PersonRow, DirectorySearch, StatusBadge
```

---

## Prerequisites

- `gh` authenticated against this repo's `origin` remote (Phase 3 opens PRs).
- `node` and `npm` installed; `npm install` run within the last day.
- `opencode` CLI installed if you're running via opencode instead of Claude Code or Copilot.
- Start `/fix-backlog` from `main` with a clean working tree.

---

## Design notes

Why this harness looks the way it does:

- **No design-token / primitive-generation phase.** The seed app (`src/components/directory/`) already exists and already ships — a real team fixing bugs doesn't invent a design system first. The Orchestrator's job starts at Fix, not at scaffolding.
- **Explicit `git worktree add`, not a tool-specific isolation parameter.** Claude Code's `Agent` tool has an `isolation: "worktree"` convenience parameter that creates the worktree for you; opencode's `Task` tool and Copilot's agent dispatch have no equivalent. `fix-backlog` therefore has the Orchestrator run plain `git worktree add` itself in Phase 1, then tells each Fix Subagent which path to `cd` into — the exact same mechanism regardless of which of the three tools is reading the skill. It's more explicit than relying on Claude-only magic, and it's the only version that actually runs correctly on all three.
- **Worktree isolation, no ownership hook — and it doesn't require file-exclusive tickets.** Four of the five tickets happen to own a file no other ticket touches, but B1 and B5 deliberately don't: both target `DirectoryList.tsx`. That's the point — isolation comes from each ticket getting its own worktree, not from the backlog being written to avoid overlap. Two Fix Subagents editing the same file in two different worktrees never see each other's in-progress state; they just might produce two PRs that need a normal merge resolution, exactly like two engineers touching the same file would.
- **Three phases, not four.** Cutting the design-system phase collapses what was a 4-phase flow into Fix → Review → Ship & Report — fewer moving parts to explain, and each phase still demonstrates a distinct delegation pattern (parallel writers, then parallel read-only reviewers, then sequential shipping).
