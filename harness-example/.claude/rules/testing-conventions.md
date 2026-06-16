---
description: Testing conventions for Vitest and @testing-library/react — query priority (getByRole first), userEvent over fireEvent, one behavior per test. Applies to all test files.
alwaysApply: true
---

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
