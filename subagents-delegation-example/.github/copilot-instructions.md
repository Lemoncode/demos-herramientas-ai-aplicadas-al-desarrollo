# Harness Example — Autonomous Fleet Demo

Demo harness for the "AI tools applied to development" course. A single prompt dispatches a **fleet of parallel autonomous agents** that build a marketing landing page section by section, with TDD enforced and a two-Reviewer quality gate.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript strict · Vitest 4 · @testing-library/react · ESLint 9 (jsx-a11y)

---

## How to run the demo

Use the `orchestrate-fleet` prompt (or the `/orchestrate-fleet` Copilot Chat slash command). One prompt. The Orchestrator runs four phases and prints a Final Report when done.

| Phase | What happens |
|---|---|
| **1. Foundation** | Orchestrator generates tokens, primitives, app shell, Section stubs. Commits to main. |
| **2. Fleet** | Orchestrator dispatches 6 Workers in parallel, each owning one Section folder, running Red→Green→Refactor. |
| **3. Review** | Orchestrator dispatches `react-reviewer`, `accessibility-reviewer`, and `4r-reviewer` in parallel. |
| **4. Ship & Report** | Orchestrator opens one PR per passing Section, then prints the Final Report. HALT. |

---

## Agents

| Agent | Dispatched when | Mode |
|---|---|---|
| `section-worker` | Phase 2, 6× in parallel | subagent |
| `react-reviewer` | Phase 3, once | subagent |
| `accessibility-reviewer` | Phase 3, once | subagent |
| `4r-reviewer` | Phase 3, once | subagent |

---

## Prompts (reusable slash commands)

| Prompt | Use when |
|---|---|
| `orchestrate-fleet` | Running the full Fleet workflow |
| `section-worker` | Acting as a Section Worker |
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
| `orchestrate-fleet` | The Orchestrator |
| `build-section` | `section-worker` agent |
| `vitest-tdd` | `build-section` |
| `git-branch` | Any new work branch |
| `git-commit` | Any commit step |
| `git-create-pr` | Opening PRs |
| `git-pr-description` | Generating PR bodies |
| `web-design-guidelines` | UI review |
| `vercel-react-best-practices` | React/Next.js review |

---

## Prerequisites

- `gh` authenticated against this repo's `origin` remote (Phase 4 opens PRs).
- `node` and `npm` installed; `npm install` run within the last day.
- Start from `main` with a clean working tree.
