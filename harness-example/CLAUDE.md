# Harness Example — React + TypeScript

Demo project for the "AI tools applied to development" course. Shows how to configure Claude Code for a React+TS project with enforced best practices.

**Stack:** React 18 · TypeScript strict · Vite · Vitest · @testing-library/react · ESLint 9 (jsx-a11y)

---

## Skills

Invoke a skill before starting any task that matches its description. Skills are rigid workflows — follow every step in order.

| Skill | Invoke when |
|---|---|
| `react-component` | Creating any new `.tsx` component file |
| `vitest-tdd` | Implementing a feature or fixing a bug |
| `git-branch` | Starting a new piece of work — creates a properly named branch from main |
| `git-commit` | Committing changes — writes a conventional commit message and stages selectively |
| `git-pr-description` | Generating a PR body from the current branch diff |
| `git-create-pr` | Opening a pull request — use after `git-pr-description` |

---

## Commands

Slash commands run predefined multi-step workflows.

| Command | What it does |
|---|---|
| `/git-create-pr` | Syncs with main, resolves conflicts, commits, pushes, and opens a PR |
| `/git-review-pr` | Dispatches a subagent that reviews the open PR for test coverage and rule compliance |

---

## Agents

Specialized subagents with restricted tool access. Invoke via the Agent tool or by name.

| Agent | Invoke when | Tools |
|---|---|---|
| `react-review-agent` | Reviewing a React/TS component for correctness, patterns, and quality | Read, Glob, Grep |

---

## Rules

Rules load automatically. No invocation needed.

| Rule file | Scope | Covers |
|---|---|---|
| `react-conventions.md` | All files | File naming, TypeScript strictness, hooks, import order |
| `testing-conventions.md` | All files | Vitest setup, query priority, `userEvent`, test structure |
| `components.md` | `src/components/**` only | Named exports, props interface, semantic HTML, accessibility, performance |

---

## Hooks

Hooks run automatically at lifecycle events and block Claude on failure (exit 2).

| Hook | Trigger | What it enforces |
|---|---|---|
| `quality-gate.sh` | After every Write / Edit / MultiEdit | ESLint (zero errors) + TypeScript (zero type errors) |
| `commit-guard.sh` | Before any `git commit` command | All tests must pass |
| `status-summary.sh` | After each Claude turn (Stop) | Prints lint / type / test status — informational only |

---

## Mandatory workflow order

```
git-branch → vitest-tdd (or react-component) → git-commit → /git-create-pr → /git-review-pr
```
