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
