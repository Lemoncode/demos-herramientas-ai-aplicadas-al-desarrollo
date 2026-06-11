# Harness Example Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite + React + TypeScript scaffold with a fully configured Claude Code harness that enforces TDD, code quality, accessibility, and git workflow best practices.

**Architecture:** A minimal app scaffold (Vite + React + TS) serves as the demo target; the real value is `.claude/` — hooks, skills, agents, rules, and commands. Quality enforcement happens via strict hooks (exit code 2 = block Claude) wired in `.claude/settings.json`.

**Tech Stack:** React 18, TypeScript strict, Vite 6, Vitest 2, @testing-library/react, ESLint 9 flat config, eslint-plugin-jsx-a11y, jq (for hook JSON parsing — `brew install jq` on macOS)

---

## File Map

| File | Responsibility |
|---|---|
| `CLAUDE.md` | Entry point — stack, mandatory workflows, gate summary, agent/skill pointers |
| `.claude/settings.json` | Hook wiring (PostToolUse, PreToolUse, Stop) |
| `.claude/hooks/quality-gate.sh` | Runs ESLint + tsc after every Write/Edit/MultiEdit |
| `.claude/hooks/commit-guard.sh` | Runs tests before any `git commit` command |
| `.claude/hooks/status-summary.sh` | Prints lint/type/test snapshot on Stop |
| `.claude/commands/test.md` | `/test` slash command |
| `.claude/commands/lint.md` | `/lint` slash command |
| `.claude/commands/typecheck.md` | `/typecheck` slash command |
| `.claude/commands/ship.md` | `/ship` slash command — full quality gate |
| `.claude/skills/react-component/SKILL.md` | Rigid skill for creating typed, tested, accessible components |
| `.claude/skills/vitest-tdd/SKILL.md` | Rigid TDD loop skill (red→green→refactor) |
| `.claude/agents/react-review-agent.md` | Read-only agent — structured component review |
| `.claude/rules/react-conventions.md` | Always-loaded: component/naming/export conventions |
| `.claude/rules/testing-conventions.md` | Always-loaded: Vitest + Testing Library patterns |
| `src/main.tsx` | App entry point (named import from App) |
| `src/App.tsx` | Minimal root component — named export |
| `src/App.test.tsx` | Proves the test pipeline works on first run |
| `src/test-setup.ts` | Imports @testing-library/jest-dom matchers globally |
| `vite.config.ts` | Vite config + Vitest test environment |
| `eslint.config.js` | ESLint flat config with TS + hooks + jsx-a11y |
| `package.json` | Scripts: dev, build, lint, test, test:watch |

---

### Task 1: Scaffold Vite + React + TypeScript app

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

- [ ] **Step 1: Scaffold into a temp directory to avoid interactive prompts**

```bash
npm create vite@latest /tmp/harness-vite-scaffold -- --template react-ts
```

Expected output ends with: `Done. Now run: cd /tmp/harness-vite-scaffold && npm install`

- [ ] **Step 2: Copy scaffold files into the project root**

```bash
cp -r /tmp/harness-vite-scaffold/. /Users/aridanemartin/workspace/demos-herramientas-ai-aplicadas-al-desarrollo/
rm -rf /tmp/harness-vite-scaffold
```

- [ ] **Step 3: Replace App.tsx with a minimal, convention-compliant version**

Create `src/App.tsx`:

```tsx
import './App.css'

export function App() {
  return (
    <main>
      <h1>Vite + React</h1>
      <p>Configured with Claude Code best practices.</p>
    </main>
  )
}
```

- [ ] **Step 4: Update main.tsx to use named import**

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: installs without errors.

- [ ] **Step 6: Verify the build compiles**

```bash
npm run build
```

Expected: exits 0, outputs a `dist/` directory.

- [ ] **Step 7: Commit**

```bash
git add index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json package.json package-lock.json src/ public/
git commit -m "feat: scaffold vite react typescript app"
```

---

### Task 2: Add Vitest testing infrastructure

**Files:**
- Modify: `vite.config.ts`, `tsconfig.app.json`, `package.json`
- Create: `src/test-setup.ts`, `src/App.test.tsx`

- [ ] **Step 1: Install testing dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Expected: installs without errors.

- [ ] **Step 2: Update vite.config.ts to add Vitest config**

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 3: Add vitest globals to TypeScript config**

In `tsconfig.app.json`, add `"vitest/globals"` to the `compilerOptions.types` array. Merge into the existing object — do not replace the whole file. The result should have:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

- [ ] **Step 4: Create test setup file**

Create `src/test-setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Update scripts in package.json**

Set the full `scripts` section to:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint . --max-warnings=0",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 6: Write App.test.tsx**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the app heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /vite \+ react/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 7: Run tests and verify they pass**

```bash
npm test
```

Expected: prints `1 passed` and exits 0. If it fails with "Cannot find module '@testing-library/jest-dom'", verify `src/test-setup.ts` was created correctly.

- [ ] **Step 8: Commit**

```bash
git add vite.config.ts tsconfig.app.json package.json package-lock.json src/test-setup.ts src/App.test.tsx
git commit -m "feat: add vitest testing infrastructure"
```

---

### Task 3: Configure ESLint with jsx-a11y

**Files:**
- Modify: `eslint.config.js`, `package.json`, `package-lock.json`

- [ ] **Step 1: Install eslint-plugin-jsx-a11y**

```bash
npm install -D eslint-plugin-jsx-a11y
```

- [ ] **Step 2: Replace eslint.config.js**

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
)
```

- [ ] **Step 3: Run lint and verify it passes**

```bash
npm run lint
```

Expected: exits 0 with no output. If `@typescript-eslint/no-explicit-any` errors appear in any file, fix them before committing.

- [ ] **Step 4: Commit**

```bash
git add eslint.config.js package.json package-lock.json
git commit -m "feat: configure eslint with jsx-a11y and strict typescript rules"
```

---

### Task 4: Write CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md at the project root**

```markdown
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

### Committing

Use the `write-commit` skill. Do **not** run `git commit` manually — the commit-guard hook will run tests for you either way, but the skill also generates a conventional commit message.

### Opening a pull request

Use the `create-pr` skill.

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
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "feat: add CLAUDE.md with mandatory workflows and quality gate documentation"
```

---

### Task 5: Write rules files

**Files:**
- Create: `.claude/rules/react-conventions.md`, `.claude/rules/testing-conventions.md`

- [ ] **Step 1: Create the rules directory**

```bash
mkdir -p .claude/rules
```

- [ ] **Step 2: Create react-conventions.md**

Create `.claude/rules/react-conventions.md` with this exact content (the tsx examples inside are literal content of the file, not fenced blocks in this plan):

```text
# React Conventions

These rules apply to all React component files in this project. Claude Code loads this file automatically in every session.

## Component Rules

- **Functional components only** — no class components
- **Named exports only** — never `export default` from a component file (exception: `src/main.tsx` app entry)
- **Props typed with `interface`** — not `type` alias

  ```tsx
  // correct
  interface ButtonProps {
    label: string
    onClick: () => void
  }

  // wrong — use interface instead
  type ButtonProps = { label: string; onClick: () => void }
  ```

- **No `any`** — use `unknown` + a type guard if the shape is truly unknown
- **`useCallback`/`useMemo` only with justification** — not as a default pattern; only when a profiler shows a measurable issue

## File Naming

- Component files: `PascalCase.tsx` — e.g., `UserCard.tsx`
- Utility/hook files: `camelCase.ts` — e.g., `useAuth.ts`, `formatDate.ts`
- Test files: colocated, same name with `.test.tsx` suffix — e.g., `UserCard.test.tsx`

## Semantic HTML

Use the correct element for the job:
- `<button>` for clickable actions — not `<div onClick>`
- `<nav>`, `<main>`, `<header>`, `<footer>` for layout landmarks
- `<ul>`/`<ol>` for lists, even if visually styled differently
- `<a href>` for navigation — not `<button>` that programmatically navigates
```

- [ ] **Step 3: Create testing-conventions.md**

Create `.claude/rules/testing-conventions.md` with this exact content:

```text
# Testing Conventions

These rules apply to all test files in this project. Claude Code loads this file automatically in every session.

## Setup

- Tests use Vitest + @testing-library/react
- Test files are colocated next to the component: `Button.test.tsx` lives in the same directory as `Button.tsx`
- Global `@testing-library/jest-dom` matchers are set up in `src/test-setup.ts` — no per-file import needed

## Query Priority

Use the first query method that works:

1. `getByRole` — semantic role + accessible name (preferred)
2. `getByLabelText` — for form inputs with associated labels
3. `getByText` — for visible text content
4. `getByTestId` — last resort only; add a comment explaining why no role/label applies

```tsx
// correct
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email address/i)

// avoid — use role or label if possible
screen.getByTestId('submit-btn')
```

## Interaction

Always use `userEvent` over `fireEvent`:

```tsx
// correct — simulates real browser events
const user = userEvent.setup()
await user.click(screen.getByRole('button', { name: /submit/i }))
await user.type(screen.getByRole('textbox', { name: /name/i }), 'Alice')

// wrong — does not simulate the full event sequence
fireEvent.click(button)
```

## Test Structure

- One behavior per `it()` — do not assert multiple unrelated things in one test
- Name tests in plain English: `it('shows an error when the email is invalid')`
- No snapshot tests for business logic
- Do not test implementation details — if you rename a variable and a test breaks, the test is wrong
```

- [ ] **Step 4: Commit**

```bash
git add .claude/rules/
git commit -m "feat: add react and testing convention rules"
```

---

### Task 6: Write hook scripts

**Files:**
- Create: `.claude/hooks/quality-gate.sh`, `.claude/hooks/commit-guard.sh`, `.claude/hooks/status-summary.sh`

**Prerequisite:** `jq` must be installed. Verify with `jq --version`. Install with `brew install jq` if missing.

- [ ] **Step 1: Create hooks directory**

```bash
mkdir -p .claude/hooks
```

- [ ] **Step 2: Create quality-gate.sh**

Create `.claude/hooks/quality-gate.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

if [ "$TOOL_NAME" = "MultiEdit" ]; then
  FILES=$(echo "$INPUT" | jq -r '.tool_input.edits[].file_path' | sort -u)
else
  FILES=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
fi

TS_FILES=$(echo "$FILES" | grep -E '\.(ts|tsx)$' || true)

if [ -z "$TS_FILES" ]; then
  exit 0
fi

ERRORS=""

if ! LINT_OUTPUT=$(npx eslint --max-warnings=0 $TS_FILES 2>&1); then
  ERRORS+=$'\n--- ESLint ---\n'"$LINT_OUTPUT"
fi

if ! TSC_OUTPUT=$(npx tsc --noEmit 2>&1); then
  ERRORS+=$'\n--- TypeScript ---\n'"$TSC_OUTPUT"
fi

if [ -n "$ERRORS" ]; then
  printf "Quality gate FAILED:%s\n" "$ERRORS"
  exit 2
fi

echo "✓ Quality gate passed"
exit 0
```

- [ ] **Step 3: Create commit-guard.sh**

Create `.claude/hooks/commit-guard.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if ! echo "$COMMAND" | grep -q 'git commit'; then
  exit 0
fi

echo "Commit guard: running tests before commit..."

if ! TEST_OUTPUT=$(npm test 2>&1); then
  printf "Commit blocked — tests are failing:\n\n%s\n" "$TEST_OUTPUT"
  exit 2
fi

echo "✓ Tests passed — proceeding with commit"
exit 0
```

- [ ] **Step 4: Create status-summary.sh**

Create `.claude/hooks/status-summary.sh`:

```bash
#!/usr/bin/env bash

cd "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || exit 0

echo ""
echo "━━━ Quality Status ━━━━━━━━━━━━━━━━━━━━━━━━━"

if npx eslint . --max-warnings=0 --quiet 2>/dev/null 1>/dev/null; then
  echo "  ESLint      ✓  no errors"
else
  echo "  ESLint      ✗  errors found — run /lint"
fi

if npx tsc --noEmit 2>/dev/null 1>/dev/null; then
  echo "  TypeScript  ✓  no type errors"
else
  echo "  TypeScript  ✗  type errors found — run /typecheck"
fi

if npm test 2>/dev/null | grep -q "passed"; then
  echo "  Tests       ✓  all passing"
else
  echo "  Tests       ✗  failures or no tests run — run /test"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
```

- [ ] **Step 5: Make all scripts executable**

```bash
chmod +x .claude/hooks/quality-gate.sh .claude/hooks/commit-guard.sh .claude/hooks/status-summary.sh
```

- [ ] **Step 6: Commit**

```bash
git add .claude/hooks/
git commit -m "feat: add quality-gate, commit-guard, and status-summary hooks"
```

---

### Task 7: Configure hooks in settings.json

**Files:**
- Create: `.claude/settings.json`

- [ ] **Step 1: Create .claude/settings.json**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/quality-gate.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/commit-guard.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/status-summary.sh"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Verify the JSON is valid**

```bash
jq . .claude/settings.json
```

Expected: pretty-prints the JSON and exits 0.

- [ ] **Step 3: Commit**

```bash
git add .claude/settings.json
git commit -m "feat: configure pre/post tool use hooks and stop summary"
```

---

### Task 8: Write slash commands

**Files:**
- Create: `.claude/commands/test.md`, `.claude/commands/lint.md`, `.claude/commands/typecheck.md`, `.claude/commands/ship.md`

- [ ] **Step 1: Create commands directory**

```bash
mkdir -p .claude/commands
```

- [ ] **Step 2: Create test.md**

Create `.claude/commands/test.md`:

```markdown
Run all Vitest tests once in non-watch mode and report the results.

Run: `npm test`

Show the full output including test file names, individual test names, and pass/fail status. Report how many tests passed and failed.
```

- [ ] **Step 3: Create lint.md**

Create `.claude/commands/lint.md`:

```markdown
Run ESLint across the entire project and report any errors or warnings.

Run: `npm run lint`

Show all lint violations with file paths, line numbers, rule names, and suggested fixes. If no violations are found, confirm the project is lint-clean.
```

- [ ] **Step 4: Create typecheck.md**

Create `.claude/commands/typecheck.md`:

```markdown
Run TypeScript type checking across the project without emitting output files.

Run: `npx tsc --noEmit`

Show all type errors with file paths, line numbers, and error messages. If no errors are found, confirm the project is type-clean.
```

- [ ] **Step 5: Create ship.md**

Create `.claude/commands/ship.md`:

```markdown
Run the full quality gate in sequence: lint → typecheck → tests. Stop at the first failure.

Steps:
1. Run: `npm run lint`
   - If lint errors found: stop immediately, report the errors, do not run the next step.
2. Run: `npx tsc --noEmit`
   - If type errors found: stop immediately, report the errors, do not run the next step.
3. Run: `npm test`
   - Report test results.

Final report:
- All passed: "✓ Ship check passed — lint, types, and tests are all green."
- Any failed: "✗ Ship check failed at [lint|typecheck|tests]: [brief error summary]"
```

- [ ] **Step 6: Commit**

```bash
git add .claude/commands/
git commit -m "feat: add test, lint, typecheck, and ship slash commands"
```

---

### Task 9: Write skills

**Files:**
- Create: `.claude/skills/react-component/SKILL.md`, `.claude/skills/vitest-tdd/SKILL.md`

- [ ] **Step 1: Create skills directories**

```bash
mkdir -p .claude/skills/react-component .claude/skills/vitest-tdd
```

- [ ] **Step 2: Create react-component SKILL.md**

Create `.claude/skills/react-component/SKILL.md` with this exact content (inner code fences are part of the file's markdown content):

```text
# react-component

**Type: Rigid** — follow every step in order. Do not skip or reorder steps.

Use this skill every time you create a new React component file.

---

## Step 1: Define the props interface

Before writing the component body, define the props interface at the top of the component file:

```tsx
interface ComponentNameProps {
  // all props explicitly typed — no `any`
}
```

Rules:
- Use `interface`, not `type` alias
- Optional props use `?` suffix
- Do not use `React.FC` — type the function signature directly

## Step 2: Write the test file first (red phase)

Create `ComponentName.test.tsx` in the same directory as the component. Write at least one failing test before implementing anything:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders [describe the primary visible output]', () => {
    render(<ComponentName />)
    expect(screen.getByRole('[role]', { name: /[accessible name]/i })).toBeInTheDocument()
  })
})
```

Run: `npm test`
The test **must fail** (component does not exist yet). If it passes, the test is wrong — fix it before continuing.

## Step 3: Scaffold the component

```tsx
export function ComponentName({ ...props }: ComponentNameProps) {
  return (
    // Use semantic HTML — the right element for the job
    // Add ARIA attributes only where native semantics are insufficient
  )
}
```

Rules:
- **Named export only** — no `export default`
- **Functional component** — no class components
- **Semantic HTML first**: `<button>` not `<div onClick>`, `<nav>` not `<div className="nav">`
- Add `aria-label` on interactive elements with no visible text

## Step 4: Verify types compile

Run: `npx tsc --noEmit`

Expected: zero errors. Fix any type errors before proceeding.

## Step 5: Verify tests pass (green phase)

Run: `npm test`

Expected: all tests pass. Fix the implementation — do not modify the test to make it pass.

## Step 6: Commit

Use the `write-commit` skill to commit the component and its test file together in one commit.
```

- [ ] **Step 3: Create vitest-tdd SKILL.md**

Create `.claude/skills/vitest-tdd/SKILL.md` with this exact content:

```text
# vitest-tdd

**Type: Rigid** — Red → Green → Refactor. Do not skip phases or merge them.

Use this skill when implementing any feature or fixing any bug.

---

## Phase 1 — Red: Write a failing test

Write a test that describes exactly the behavior you are about to implement. It must fail before you write any implementation.

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('[plain-English description of the specific behavior]', async () => {
    const user = userEvent.setup()
    render(<ComponentName />)
    await user.click(screen.getByRole('button', { name: /[button label]/i }))
    expect(screen.getByText(/[expected output]/i)).toBeInTheDocument()
  })
})
```

Run: `npm test`
The test **must fail**. If it passes without any implementation, rewrite the test — it does not cover the behavior.

**Query priority:**
1. `getByRole` — semantic role + accessible name
2. `getByLabelText` — form inputs
3. `getByText` — visible text
4. `getByTestId` — last resort; add a comment explaining why

**Always use `userEvent`**, not `fireEvent`. `userEvent` simulates the full browser event sequence.

## Phase 2 — Green: Write minimal implementation

Write the smallest code change that makes the failing test pass. No more, no less.

Run: `npm test`
All tests (new and existing) must pass. Fix the implementation if existing tests break — do not modify existing tests.

## Phase 3 — Refactor: Clean up without changing behavior

Improve naming, structure, and duplication — without changing what the code does.

Run: `npm test` after every refactor change. Tests must stay green throughout.

## Commit

Use the `write-commit` skill once the full Red→Green→Refactor loop is complete.

---

## Rules

- One behavior per `it()` — one assertion focus
- Test the interface (what renders, what gets called), not internals (state values, refs)
- No snapshot tests for logic
- If renaming a variable makes a test fail, the test is wrong
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/
git commit -m "feat: add react-component and vitest-tdd skills"
```

---

### Task 10: Write react-review-agent

**Files:**
- Create: `.claude/agents/react-review-agent.md`

- [ ] **Step 1: Create agents directory**

```bash
mkdir -p .claude/agents
```

- [ ] **Step 2: Create react-review-agent.md**

Create `.claude/agents/react-review-agent.md`:

```markdown
---
name: react-review-agent
description: Reviews React/TypeScript components for correctness, patterns, and quality. Use when you want a structured review of a component — checks TypeScript strictness, hook rules, prop drilling, test coverage, and accessibility basics. Returns a structured findings list with pass/warning/error per category.
tools: Read, Glob, Grep
model: sonnet
---

# React Component Reviewer

You are a senior React and TypeScript engineer. You review components for correctness, maintainability, and quality. Give structured, actionable feedback — not vague advice.

Always read the full component file and its test file (if it exists) before producing any findings.

## Review Categories

For each component, produce one finding per category using:
- ✓ — passes
- ⚠ — warning (should fix, not blocking)
- ✗ — error (must fix)

### 1. TypeScript Strictness
- No `any` types (explicit or implicit)
- All props typed with `interface`
- No type assertions (`as T`) without a comment explaining why

### 2. Hook Rules
- No hooks called conditionally or inside loops
- `useEffect` deps array is complete — no missing dependencies
- `useCallback`/`useMemo` only where there is a performance justification
- Custom hooks extracted when hook logic exceeds ~10 lines

### 3. Prop Drilling
- Flag if props pass through more than 2 component levels without context or composition
- Suggest the appropriate fix: React context, composition, or state colocation

### 4. Test Coverage
- Check for a colocated `.test.tsx` file
- Verify the test covers the component's primary rendered output and interaction
- Flag if tests use `getByTestId` where `getByRole` or `getByLabelText` would work

### 5. Accessibility
- Every interactive element has an accessible name
- No `onClick` on `<div>` or `<span>` without `role` attribute and keyboard handler
- All `<img>` elements have `alt` attributes
- Form inputs are associated with visible `<label>` elements

## Output Format

Produce output in this exact format:

---
## Review: [ComponentName].tsx

### TypeScript Strictness
[✓/⚠/✗] [finding]

### Hook Rules
[✓/⚠/✗] [finding]

### Prop Drilling
[✓/⚠/✗] [finding]

### Test Coverage
[✓/⚠/✗] [finding]

### Accessibility
[✓/⚠/✗] [finding]

---
[N errors], [N warnings]

---

If the component file does not exist, say so and stop.
```

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/
git commit -m "feat: add react-review-agent for structured component review"
```

---

### Task 11: Verify all success criteria

- [ ] **Step 1: Verify test suite passes from clean install**

```bash
npm install && npm test
```

Expected: `1 passed`, exits 0.

- [ ] **Step 2: Verify lint gate passes**

```bash
npm run lint
```

Expected: exits 0 with no output.

- [ ] **Step 3: Verify TypeScript check passes**

```bash
npx tsc --noEmit
```

Expected: exits 0 with no output.

- [ ] **Step 4: Verify quality-gate hook parses JSON correctly**

```bash
echo '{"tool_name":"Write","tool_input":{"file_path":"src/App.tsx","content":""}}' | bash .claude/hooks/quality-gate.sh
```

Expected: prints `✓ Quality gate passed` and exits 0.

- [ ] **Step 5: Verify commit-guard blocks on test failure**

```bash
echo 'test("broken", () => { expect(1).toBe(2) })' >> src/App.test.tsx
echo '{"tool_name":"Bash","tool_input":{"command":"git commit -m test"}}' | bash .claude/hooks/commit-guard.sh
echo "Exit code: $?"
```

Expected: prints `Commit blocked — tests are failing:` and exits 2.

Restore the file:

```bash
git checkout src/App.test.tsx
```

- [ ] **Step 6: Verify commit-guard passes when tests pass**

```bash
echo '{"tool_name":"Bash","tool_input":{"command":"git commit -m test"}}' | bash .claude/hooks/commit-guard.sh
echo "Exit code: $?"
```

Expected: prints `✓ Tests passed — proceeding with commit`, exits 0.

- [ ] **Step 7: Verify all harness files are present**

```bash
find .claude -type f | sort
```

Expected output:
```
.claude/agents/react-review-agent.md
.claude/commands/lint.md
.claude/commands/ship.md
.claude/commands/test.md
.claude/commands/typecheck.md
.claude/hooks/commit-guard.sh
.claude/hooks/quality-gate.sh
.claude/hooks/status-summary.sh
.claude/rules/react-conventions.md
.claude/rules/testing-conventions.md
.claude/settings.json
.claude/skills/react-component/SKILL.md
.claude/skills/vitest-tdd/SKILL.md
```

- [ ] **Step 8: Confirm git log shows clean commit history**

```bash
git log --oneline
```

Expected: one commit per task (approximately 10 commits), all with conventional commit prefixes (`feat:`, `chore:`).
