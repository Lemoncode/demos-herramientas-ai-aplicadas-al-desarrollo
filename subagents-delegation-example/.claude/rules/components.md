---
description: Conventions for React component files in src/components/ — functional components, named exports (except Next.js conventions), props interface, semantic HTML, accessibility, and performance. Auto-loaded when editing files in that directory.
paths:
  - "src/components/**/*.tsx"
  - "src/components/**/*.ts"
---

# Component Rules

These rules apply to all files inside `src/components/` — Foundation primitives (Heading, Button, Card, Section, tokens) and Section folders (hero, catalog, etc.).

## Structure

- **Functional components only** — no class components
- **Named exports only** — never `export default` from a component file (Next.js App Router files in `src/app/` are exempt and require default exports)

  ```tsx
  // correct
  export function Button({ label, onClick }: ButtonProps) { ... }

  // wrong
  export default function Button(...) { ... }
  ```

- **One component per file** — if a file needs a second component, extract it
- Every component file must have a colocated test file: `Heading.tsx` → `Heading.test.tsx`

## Section import rules

Files inside `src/components/<id>/` (Section folders) may import from:
- `react`, `next/*`
- `@/components/*` (Foundation primitives only — `Heading`, `Button`, `Card`, `Section`, `tokens`)

Files inside `src/components/<id>/` may **not** import from:
- `@/components/<other_id>/*` (no cross-Section imports — Sections are isolated)
- Any external UI library (no Material, Chakra, etc. — Foundation primitives only)

If a Section needs a UI element that does not exist in the Foundation, build it inside its own folder. Do not extend the Foundation from a Section.

## Props

- Type props with `interface`, not `type` alias:

  ```tsx
  interface ButtonProps {
    label: string
    onClick?: () => void
    variant?: 'primary' | 'secondary'
  }
  ```

- No `any` — use `unknown` + type guard if the shape is truly unknown
- Do not use `React.FC` — type the function signature directly
- Optional props use `?` suffix, not union with `undefined`
- Props interface should have **≤ 6 fields**. If you need more, compose smaller components — this is enforced by the 4R Readability gate.

## Semantic HTML

| Intent | Use | Avoid |
|---|---|---|
| Clickable action | `<button>` | `<div onClick>`, `<span onClick>` |
| Navigation link | `<a href>` or `<Link>` | `<button onClick={() => router.push(...)}>` |
| Page section | `<section>`, `<main>`, `<nav>`, `<footer>` | `<div className="section">` |
| List of items | `<ul>` / `<ol>` + `<li>` | `<div>` wrappers |
| Form field label | `<label htmlFor>` | `<span>` adjacent to input |
| Heading | the `Heading` primitive | bare `<h1>`/`<h2>` (drift risk) |

## Accessibility

- Every interactive element must have an accessible name (visible text preferred; `aria-label` only when there is no visible text)
- All `<img>` and `<Image>` elements have `alt` attributes — empty string `alt=""` for decorative
- No `onClick` on non-interactive elements without `role` and `onKeyDown`
- Form inputs must be associated with a `<label htmlFor>` and `id`
- Color is never the sole means of conveying information (paired with text or icon)

## Performance

- `useCallback` and `useMemo` only when a profiler shows a measurable issue — not by default
- Avoid inline object/array literals as JSX props in components that re-render frequently
- Prefer server components for static Sections; add `"use client"` only at the lowest necessary boundary
