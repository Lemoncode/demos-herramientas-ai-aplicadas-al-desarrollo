# Harness Example — React + TypeScript

Demo project for the "AI tools applied to development" course. Shows how to configure Claude Code for a React+TS project with enforced best practices.

## Stack

- React 18 + TypeScript (strict mode)
- Vite (dev server + build)
- Vitest + @testing-library/react (unit tests)
- ESLint 9 flat config — @typescript-eslint + react-hooks + jsx-a11y

## Mandatory Workflows

### Creating a component

Invoke the `react-component` skill before writing any `.tsx` component file.

### Implementing a feature or fix

Invoke `superpowers:test-driven-development` before writing any implementation code.

### Starting a new piece of work

Invoke the `git-branch` skill to create a properly named feature branch from main. Never work directly on `main`.

### Committing

Invoke the `git-commit` skill. Do **not** run `git commit` manually — it ensures conventional commit format and respects the commit-guard hook.

### Opening a pull request

Invoke `git-pr-description` to generate the PR body, then `git-create-pr` to push and open the PR.

## Quality Gates (enforced by hooks)

These hooks **block Claude** automatically — exit code 2 halts execution:

| Trigger | Gate | Hook |
|---|---|---|
| After any Write/Edit/MultiEdit | ESLint (zero errors) + TypeScript (zero type errors) | `quality-gate.sh` |
| Before any `git commit` | All tests must pass | `commit-guard.sh` |
| After each Claude turn | Quality snapshot printed | `status-summary.sh` |

## Slash Commands

- `/test` — run all tests once
- `/lint` — run ESLint
- `/typecheck` — run TypeScript check
- `/ship` — lint → typecheck → tests in sequence (stops on first failure)

## Code Conventions

See `.claude/rules/react-conventions.md` and `.claude/rules/testing-conventions.md`.

## Agents

- `react-review-agent` — invoke for a structured review of a React/TS component
- `accessibility-agent` (global) — invoke when auditing ARIA, keyboard nav, or contrast
