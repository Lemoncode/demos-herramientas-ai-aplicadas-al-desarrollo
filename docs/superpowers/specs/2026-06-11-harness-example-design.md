# Harness Example — Design Spec

**Date:** 2026-06-11
**Branch:** `harness-example`
**Purpose:** Course/demo material showing how to configure Claude Code for a React + TypeScript project with enforced best practices.

---

## Context

The workspace `demos-herramientas-ai-aplicadas-al-desarrollo` is empty (fresh git repo). This branch creates a complete, working harness on top of a minimal Vite + React + TypeScript scaffold. The harness is the point — the app code exists only to demo against.

---

## Architecture

### Approach chosen: Layered project-level config (Option B)

All harness files live under `.claude/` at the project root, organized by concern. CLAUDE.md is the single entry point. Each concern (quality, testing, git, conventions) is isolated into its own file so it can be explained independently in a course context.

### Directory layout

```
harness-example/
├── CLAUDE.md
├── .claude/
│   ├── settings.json                  # Hooks configuration (strict — exit 2 blocks Claude)
│   ├── hooks/
│   │   ├── quality-gate.sh            # PostToolUse: ESLint + tsc after every file write
│   │   ├── commit-guard.sh            # PreToolUse: run tests before any git commit
│   │   └── status-summary.sh         # Stop: print lint/type/test snapshot
│   ├── commands/
│   │   ├── test.md                    # /test
│   │   ├── lint.md                    # /lint
│   │   ├── typecheck.md               # /typecheck
│   │   └── ship.md                    # /ship (full quality gate)
│   ├── skills/
│   │   ├── react-component/
│   │   │   └── SKILL.md
│   │   └── vitest-tdd/
│   │       └── SKILL.md
│   ├── agents/
│   │   └── react-review-agent.md
│   └── rules/
│       ├── react-conventions.md
│       └── testing-conventions.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.test.tsx
    └── components/                    # Empty — ready for demos
```

---

## CLAUDE.md

Single entry point. Declares:
- Project stack (React 18, TS strict, Vite, Vitest, ESLint flat config)
- Mandatory skill invocations per workflow (component creation, TDD, commit, PR)
- What the hooks enforce (quality gates)
- Pointers to rules and agents

---

## Hooks

Three hooks, all strict (exit code 2 halts Claude):

### 1. Quality gate — `PostToolUse` on `Write|Edit|MultiEdit`
**Script:** `.claude/hooks/quality-gate.sh`
- Tool input arrives as JSON on stdin; the script parses it with `jq`
- For `Write`/`Edit`: extracts `file_path` — lints that single file
- For `MultiEdit`: extracts all `edits[].file_path` entries — lints each file
- Runs `eslint --max-warnings=0` on all changed files
- Runs `npx tsc --noEmit` (project-wide — catches cross-file type errors)
- Exits 2 with combined error output if either fails
- Exits 0 if both pass

### 2. Commit guard — `PreToolUse` on `Bash`
**Script:** `.claude/hooks/commit-guard.sh`
- Tool input arrives as JSON on stdin; script extracts `.command` with `jq`
- Only activates when the command string contains `git commit`
- Runs `npm test -- --run`
- Exits 2 with test failure output if tests fail
- Exits 0 otherwise (or if command is not a commit)

### 3. Stop summary — `Stop`
**Script:** `.claude/hooks/status-summary.sh`
- Runs lint, tsc, and test in `--passWithNoTests` / `--reporter=verbose` mode
- Prints a compact status table: ✓/✗ per gate
- Always exits 0 (informational only — never blocks)

---

## Skills

### `react-component` (rigid)
Steps Claude must follow to create a component:
1. Define props `interface` with strict types
2. Write the `.test.tsx` file first (red)
3. Scaffold component with semantic HTML + ARIA attributes
4. Verify `tsc --noEmit` passes (green)
5. Verify tests pass
6. Export as named export only

### `vitest-tdd` (rigid)
Red → Green → Refactor loop:
- Red: write failing test using `@testing-library/react`
- Green: minimal implementation to pass
- Refactor: clean up without breaking tests
- Rules: use `userEvent` over `fireEvent`; query by role first; no snapshot tests for logic

---

## Agents

### `react-review-agent`
- **Tools:** Read, Glob, Grep (read-only)
- **Model:** sonnet
- Reviews a component for:
  - TypeScript strictness (no `any`, typed props)
  - Hook rules (deps arrays, conditional hook calls)
  - Prop drilling depth (flag > 2 levels)
  - Missing test coverage
  - Basic a11y (interactive elements have labels, semantic tags used)
- Returns a structured findings list: ✓ pass / ⚠ warning / ✗ error per category

---

## Rules (always loaded)

### `react-conventions.md`
- Functional components only (no class components)
- Props typed with `interface`, not `type` alias
- No `any` — use `unknown` + type guard if needed
- Named exports only from component files
- `useCallback`/`useMemo` only with a measurable justification
- File naming: `PascalCase.tsx` for components, `camelCase.ts` for utilities

### `testing-conventions.md`
- Tests colocated: `ComponentName.test.tsx` next to `ComponentName.tsx`
- Use `@testing-library/react` — no Enzyme, no shallow rendering
- Query priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- No snapshot tests for business logic
- Each test has a single, named `it('...')` assertion focus

---

## Commands

| Command | Runs | Blocks on failure |
|---|---|---|
| `/test` | `npm run test -- --run` | No (informational) |
| `/lint` | `npm run lint` | No (informational) |
| `/typecheck` | `npx tsc --noEmit` | No (informational) |
| `/ship` | lint → typecheck → tests in sequence | Yes — stops chain on first failure |

---

## App scaffold

Minimal Vite + React + TypeScript project created with `npm create vite@latest`. Additions over the default:
- `vitest` + `@testing-library/react` + `jsdom` configured in `vite.config.ts`
- ESLint flat config with `@typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-jsx-a11y`
- A single `App.test.tsx` to prove the test pipeline works on first run

---

## Success criteria

1. `git checkout harness-example && npm install && npm test` — all green
2. Editing a file to introduce a lint error → Claude is blocked by the quality-gate hook
3. Attempting `git commit` with a failing test → Claude is blocked by the commit-guard hook
4. `/ship` command reports pass/fail per gate in one message
5. Invoking `react-component` skill produces a typed, tested, accessible component stub
