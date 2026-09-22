# Harness Example — Backlog Fix Demo

Demo harness for the "AI tools applied to development" course. A single prompt dispatches **parallel autonomous subagents** that each fix one ticket from a small, real bug backlog, isolated in its own git worktree, with TDD enforced and a three-Reviewer quality gate.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript strict · Vitest 4 · @testing-library/react · ESLint 9 (jsx-a11y)

---

## How to run the demo

Use the `fix-backlog` prompt (or the `/fix-backlog` Copilot Chat slash command). One prompt. The Orchestrator runs three phases and prints a Final Report when done.

| Phase | What happens |
|---|---|
| **1. Fix** | Orchestrator dispatches one Fix Subagent per ticket in parallel, each owning one file, running Red→Green→Refactor. |
| **2. Review** | Orchestrator dispatches `react-reviewer`, `accessibility-reviewer`, and `4r-reviewer` in parallel. |
| **3. Ship & Report** | Orchestrator opens one PR per passing ticket, then prints the Final Report. HALT. |

---

## Agents

| Agent | Dispatched when | Mode |
|---|---|---|
| `ticket-fixer` | Phase 1, one per ticket in parallel | subagent |
| `react-reviewer` | Phase 2, once | subagent |
| `accessibility-reviewer` | Phase 2, once | subagent |
| `4r-reviewer` | Phase 2, once | subagent |

---

## Prompts (reusable slash commands)

| Prompt | Use when |
|---|---|
| `fix-backlog` | Running the full backlog workflow |
| `ticket-fixer` | Acting as a Fix Subagent |
| `react-reviewer` | Reviewing React patterns in a set of files |
| `accessibility-reviewer` | Reviewing accessibility in a set of files |
| `4r-reviewer` | Reviewing Risk/Readability/Reliability/Resilience |
| `git-create-pr` | Creating a pull request from the current branch |
| `git-review-pr` | Reviewing the current open PR |

---

## Instructions (auto-loaded by file pattern)

| File | Applied to |
|---|---|
| `components.instructions.md` | `src/components/**/*.{tsx,ts}` |
| `testing-conventions.instructions.md` | `**/*.test.{ts,tsx}` |

---

## Skills

Skills are referenced by agents and prompts. They live in `.github/skills/<name>/SKILL.md`.

| Skill | Used by |
|---|---|
| `fix-backlog` | The Orchestrator |
| `fix-ticket` | `ticket-fixer` agent |
| `vitest-tdd` | `fix-ticket` |
| `git-branch` | Any new work branch |
| `git-commit` | Any commit step |
| `git-create-pr` | Opening PRs |
| `git-pr-description` | Generating PR bodies |
| `web-design-guidelines` | UI review |
| `vercel-react-best-practices` | React/Next.js review |

---

## Prerequisites

- `gh` authenticated against this repo's `origin` remote (Phase 3 opens PRs).
- `node` and `npm` installed; `npm install` run within the last day.
- Start from `main` with a clean working tree.
