---
name: vitest-tdd
description: Use when implementing any feature or fixing any bug — before writing any implementation code, to enforce Red→Green→Refactor discipline
---

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