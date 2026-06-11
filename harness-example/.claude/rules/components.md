---
paths:
  - "src/components/**/*.tsx"
  - "src/components/**/*.ts"
---

# Component Rules

These rules apply **only** to files inside `src/components/`. Claude Code loads this file automatically when working with files that match the path pattern above.

## Structure

- **Functional components only** — no class components
- **Named exports only** — never `export default` from a component file

  ```tsx
  // correct
  export function Button({ label, onClick }: ButtonProps) { ... }

  // wrong
  export default function Button(...) { ... }
  ```

- **One component per file** — if a file needs a second component, extract it to its own file
- Each component file must have a colocated test file: `Button.tsx` → `Button.test.tsx`

## Props

- Type props with `interface`, not `type` alias:

  ```tsx
  // correct
  interface ButtonProps {
    label: string
    onClick: () => void
    disabled?: boolean
  }

  // wrong
  type ButtonProps = { label: string; onClick: () => void }
  ```

- No `any` — use `unknown` + type guard if the shape is truly unknown
- Do not use `React.FC` — type the function signature directly
- Optional props use `?` suffix, not union with `undefined`

## Semantic HTML

Use the element that matches the meaning:

| Intent | Use | Avoid |
|---|---|---|
| Clickable action | `<button>` | `<div onClick>`, `<span onClick>` |
| Navigation link | `<a href>` | `<button onClick={() => navigate(...)}>`  |
| Page section | `<main>`, `<section>`, `<nav>` | `<div className="main">` |
| List of items | `<ul>`/`<ol>` + `<li>` | `<div>` wrappers |
| Form field label | `<label htmlFor>` | `<span>` next to input |

## Accessibility

- Every interactive element must have an accessible name:
  - Visible text is preferred: `<button>Save</button>`
  - Use `aria-label` when there is no visible text: `<button aria-label="Close dialog">✕</button>`
  - Use `aria-labelledby` to point to an existing element: `<input aria-labelledby="title-id" />`
- Images must have `alt` attributes — empty string `alt=""` for decorative images
- No `onClick` on non-interactive elements (`div`, `span`) without adding `role` and `onKeyDown`
- Form inputs must be associated with a `<label>` via `htmlFor`/`id`

## Performance

- `useCallback` and `useMemo` only when a profiler shows a measurable issue — not by default
- Avoid inline object/array literals in JSX props when the component re-renders frequently:

  ```tsx
  // avoid — creates a new object on every render
  <Chart options={{ color: 'red' }} />

  // prefer — stable reference
  const chartOptions = useMemo(() => ({ color: 'red' }), [])
  <Chart options={chartOptions} />
  ```
