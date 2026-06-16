---
name: build-section
description: Use this skill when dispatched as a Section Worker in the Fleet Phase. Implements exactly one Section end-to-end via a rigid Red→Green→Refactor cycle, runs the quality gate, commits, and returns a structured contract the Orchestrator aggregates into the Final Report.
---

# build-section

**Type: Rigid** — every step runs in order. Do not skip phases, do not merge them.

You are a Section Worker. The Orchestrator dispatched you with a Mission Brief in your prompt and a fresh git worktree. Your job: implement one Section, produce visible TDD evidence, pass the quality gate, commit, and return a structured result.

---

## Step 0 — Pre-flight

Parse the Mission Brief from your prompt. It MUST contain:

| Field | Example | Required |
|---|---|---|
| `section_id` | `hero` | yes |
| `owned_path` | `src/sections/hero/` | yes |
| `component_name` | `Hero` | yes |
| `copy_spec` | The section's content + structure brief | yes |
| `mock_data` | `src/sections/hero/data.ts` + content | only if the Section uses data |
| `acceptance` | 2–3 bullets describing must-have behavior | yes |

Locate yourself in the harness:
```bash
cd "$(git rev-parse --show-toplevel)/harness-example"
git status
```

**Create your branch immediately — this activates the section-ownership hook:**
```bash
git checkout -b fleet/<section_id>
```

After `fleet/<section_id>` is checked out, every `Write` / `Edit` outside `src/sections/<section_id>/` is hard-blocked by `.claude/hooks/section-ownership.sh`. This is intentional. If the hook ever blocks you, the violation is real — fix the path, do not work around it.

Read the standard the Reviewer will apply to your code:
- `docs/references/4r-framework.md`

---

## Step 1 — Phase R (Red): failing test first

Create `src/sections/<section_id>/<ComponentName>.test.tsx`. Assert **user-visible behavior** from `copy_spec` and `acceptance` — a heading text, a CTA name, list items, accessible labels — using `getByRole` first, then `getByLabelText`, then `getByText`. Never start with `getByTestId`.

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the headline from the copy spec', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { name: /energía sostenible/i }),
    ).toBeInTheDocument()
  })
})
```

Run only your Section's tests:
```bash
npm test -- src/sections/<section_id>
```

The test **must fail** because the component file does not exist yet. Capture the failing output verbatim — this becomes `red_evidence` in your return contract.

If the test passes without an implementation, rewrite it — your assertions are not actually checking the behavior. The Red phase is invalid without a real failure.

---

## Step 2 — Phase G (Green): minimal implementation

Create `src/sections/<section_id>/<ComponentName>.tsx`. The component must:

- Pass the test from Phase R
- Import **only** from `@/design-system/*` (Foundation primitives) and `react` / `next/*`
- Use the `Heading` primitive for every heading — never bare `<h1>` / `<h2>` (this prevents typographic drift across Sections)
- Use the `Section` primitive as the outer wrapper (it owns vertical spacing + container width)
- Use semantic HTML — `<button>` for actions, `<a>` for navigation, `<ul>` for lists
- Give every interactive element an accessible name
- Give every `<img>` / `<Image>` an `alt` attribute (empty string for decorative)
- Default to a server component. Add `"use client"` only when the component uses hooks or browser APIs, and only on the smallest subcomponent that needs it.

Run your tests:
```bash
npm test -- src/sections/<section_id>
```

All tests must pass (new and existing). Capture the output as `green_evidence`.

If existing tests break, your implementation has a regression — fix the implementation. Do not edit existing tests.

---

## Step 3 — Phase Refactor (optional)

Only if there is real duplication or unclear naming:

- Extract magic numbers / strings to named constants at module top
- Rename obscure variables
- Split components only if a clear seam exists (do not pre-emptively abstract)

Re-run `npm test -- src/sections/<section_id>` after every change. Tests stay green throughout.

Do not introduce contexts, new hooks, or new files outside your Section folder in this phase.

---

## Step 4 — Quality gate

```bash
npm run typecheck
npm run lint
```

Both must exit 0. Capture both outputs:

- `quality_gate.typecheck` — the `tsc --noEmit` stdout
- `quality_gate.lint` — the `eslint` stdout

If either fails, fix the issues and re-run. Do not commit code that the gate rejects.

---

## Step 5 — Commit

```bash
git add src/sections/<section_id>
git commit -m "feat(<section_id>): <one-line title from copy_spec>"
```

The `commit-guard.sh` hook runs `npm test` before allowing the commit. If it blocks, you have a regression — fix and retry. Do **not** bypass with `--no-verify`.

---

## Step 6 — Return contract

Emit your result in this exact JSON shape. The Orchestrator parses it directly into the Final Report.

**On success:**

```json
{
  "section": "<section_id>",
  "branch": "fleet/<section_id>",
  "worktree_path": "<absolute path of the worktree>",
  "build_pass": true,
  "tests_pass": true,
  "red_evidence": "<verbatim failing output from Phase R>",
  "green_evidence": "<verbatim passing output from Phase G>",
  "quality_gate": {
    "typecheck": "<verbatim output>",
    "lint": "<verbatim output>"
  },
  "files_changed": [
    "src/sections/<section_id>/<ComponentName>.tsx",
    "src/sections/<section_id>/<ComponentName>.test.tsx"
  ]
}
```

**On unrecoverable failure** (typecheck won't pass, lint won't pass, hook blocked, missing primitive):

```json
{
  "section": "<section_id>",
  "branch": "fleet/<section_id>",
  "build_pass": false,
  "tests_pass": false,
  "blocked_by": "<short reason>",
  "last_output": "<verbatim failing output>"
}
```

Return the JSON and stop. **Do not push. Do not open a PR.** The Orchestrator handles Ship & Report in Phase 4.

---

## Hard constraints

- **Read-only outside `src/sections/<section_id>/`.** Enforced by `section-ownership.sh`.
- **No cross-Section imports.** Never `import` from another `src/sections/*` folder.
- **No Foundation modifications.** Never edit `src/design-system/*`. If a primitive is missing, build a local component inside your own folder.
- **No project-config changes.** Do not edit `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `eslint.config.js`.
- **No remote operations.** No `git push`, no `gh pr create`. Phase 4 is the Orchestrator's.

## Why this skill is rigid

The Final Report is constructed from your return contract. Skip Phase R, `red_evidence` is empty and the Final Report cannot prove TDD ran. Skip the Quality gate, the 4R Reviewer raises Readability / Reliability findings. Skip the commit, the Orchestrator has no branch to ship. **The discipline IS the deliverable.**
