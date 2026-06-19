# Harness Example — Autonomous Fleet Demo

Demo harness for the "AI tools applied to development" course. Shows how a single `/goal` prompt dispatches a **fleet of parallel autonomous agents** that build a marketing landing page section by section, with TDD enforced by hooks and a two-Reviewer quality gate.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript strict · Vitest 4 · @testing-library/react · ESLint 9 (jsx-a11y)

For the architectural reasoning behind every choice below, see `CONTEXT.md` (vocabulary) and `docs/adr/` (six accepted decisions).

---

## How to run the demo

```
/goal
```

One prompt. The Orchestrator runs four phases and prints a Final Report when done.

| Phase | What happens | Visible to audience |
|---|---|---|
| **1. Foundation** | Orchestrator generates tokens, primitives (`Heading`, `Button`, `Card`, `Section`), app shell, Section stubs. Commits to main. | ~90s sequential output |
| **2. Fleet** | Orchestrator dispatches 6 Workers in parallel via `Agent(isolation: "worktree")`. Each Worker owns one Section folder, runs Red→Green→Refactor, returns a structured contract. | 6 transcripts running concurrently |
| **3. Review** | Orchestrator dispatches `react-reviewer`, `accessibility-reviewer`, and `4r-reviewer` in parallel. Each reads all 6 worktrees and emits per-Section verdicts. | 3 review reports + 3 markdown files in `docs/reports/` |
| **4. Ship & Report** | Orchestrator opens one PR per Section that passed Build + Tests, then prints the Final Report (6×4 matrix + PR URLs). HALT. | Final Report on screen |

Stop condition: the Final Report prints. Nothing else happens.

---

## Skills

Invoke a skill before any task it matches. Skills are rigid — follow every step in order.

| Skill | Invoke when | Used by |
|---|---|---|
| `orchestrate-fleet` | Running `/goal` | the Orchestrator (you, in the main session) |
| `build-section` | Dispatched as a Section Worker | `section-worker` agent |
| `vitest-tdd` | Implementing any feature or bugfix | `build-section` references this for Red→Green→Refactor discipline |
| `frontend-design` | Generating tokens + primitives in Foundation Phase | `orchestrate-fleet` invokes it once with Editorial Energy constraints |

---

## Commands

| Command | What it does |
|---|---|
| `/goal` | Runs the full Fleet workflow against `docs/demo/goal-prompt.md` (or the argument you pass). |

---

## Agents

| Agent | Dispatched when | Tools |
|---|---|---|
| `section-worker` | Phase 2, 6× in parallel (`isolation: "worktree"`) | Read, Write, Edit, Bash, Glob, Grep |
| `react-reviewer` | Phase 3, once | Read, Glob, Grep, Write |
| `accessibility-reviewer` | Phase 3, once | Read, Glob, Grep, Write |
| `4r-reviewer` | Phase 3, once | Read, Glob, Grep, Write |

---

## Rules (auto-loaded)

| Rule file | Scope | Covers |
|---|---|---|
| `react-conventions.md` | All `.ts` / `.tsx` files | Folder layout (`src/app`, `src/components`), server vs client components, naming, strict TypeScript, imports |
| `components.md` | `src/components/**` | One component per file, named exports, props ≤ 6, semantic HTML, accessibility, no cross-Section imports |

---

## Hooks (auto-enforced)

| Hook | Trigger | What it enforces |
|---|---|---|
| `section-ownership.sh` | PreToolUse on Write / Edit / MultiEdit | When the current branch is `fleet/<id>`, writes are restricted to `src/components/<id>/`. Foundation Phase (main branch) is unrestricted. |
| `commit-guard.sh` | PreToolUse on Bash containing `git commit` | All tests must pass. |
| `quality-gate.sh` | PostToolUse on Write / Edit / MultiEdit | ESLint zero errors + TypeScript zero type errors. |
| `status-summary.sh` | Stop (after each turn) | Prints lint / type / test status — informational only. |

---

## Folder layout

```
harness-example/
├── CLAUDE.md                       ← this file
├── CONTEXT.md                      ← vocabulary (Mission, Worker, Fleet, etc.)
├── docs/
│   ├── adr/                        ← 6 accepted architectural decisions
│   ├── demo/goal-prompt.md         ← the canonical Goal prompt for /goal
│   ├── references/4r-framework.md  ← Cristian's 4Rs — read by 4r-reviewer
│   └── reports/                    ← Reviewer outputs land here per run
├── .claude/
│   ├── commands/goal.md
│   ├── agents/                     ← section-worker, react-reviewer, accessibility-reviewer, 4r-reviewer
│   ├── skills/                     ← orchestrate-fleet, build-section, vitest-tdd, frontend-design
│   ├── rules/                      ← react-conventions, components
│   ├── hooks/                      ← section-ownership, commit-guard, quality-gate, status-summary
│   └── settings.json
└── src/
    ├── app/                        ← Next.js App Router (layout, page, globals.css)
    └── components/                 ← All components, each in its own folder
        ├── tokens.ts               ← shared design tokens
        ├── heading/                 ← Foundation primitive
        │   ├── Heading.tsx
        │   └── Heading.test.tsx
        ├── button/
        ├── card/
        ├── section/
        ├── hero/                    ← Section (one per Worker)
        ├── catalog/
        ├── sustainability/
        ├── faq/
        ├── certifications/
        └── contact/
```

---

## Prerequisites

- `gh` authenticated against this repo's `origin` remote (Phase 4 opens PRs).
- `node` and `npm` installed; `npm install` run within the last day.
- Start `/goal` from `main` with a clean working tree.

---

## Architectural reasoning

The non-obvious choices are captured in `docs/adr/`:

| ADR | Decision |
|---|---|
| 0001 | Editorial Energy via the `frontend-design` skill |
| 0002 | Dispatch via `Agent(isolation: "worktree")` for native worktree forking |
| 0003 | Migrated from Vite to Next.js 15 App Router |
| 0004 | The Goal prompt is the full spec — no external fetch |
| 0005 | Four-phase orchestration with measurable stop and a dedicated Review phase |
| 0006 | `build-section` is strict; file ownership enforced by a hook |
