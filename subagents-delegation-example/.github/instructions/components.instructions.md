---
applyTo: "src/components/**/*.{tsx,ts}"
---

# Component Rules

These rules apply to all files inside `src/components/`.

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
- Every component file must have a colocated test file: `PersonRow.tsx` → `PersonRow.test.tsx`

## Composition and ownership

Files inside a feature folder (e.g. `src/components/directory/`) may import sibling files in the same folder — composition across files in one feature is normal and expected (`DirectoryList.tsx` imports `PersonRow.tsx` and `StatusBadge.tsx`).

What's not allowed:
- Importing an external UI library (no Material, Chakra, etc.)
- Editing a file that isn't the one your current backlog ticket names — the boundary the `fix-backlog` workflow relies on is per-ticket file ownership (see `docs/backlog.md`), not an import restriction. Most tickets own a file no other ticket touches; a couple deliberately share one to demonstrate that git worktree isolation, not import restrictions, is what actually keeps two parallel Fix Subagents from colliding while they work.

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
| Heading | `<h1>`–`<h6>` matching document outline order | skipped levels, `<div>` styled to look like a heading |

## Accessibility

- Every interactive element must have an accessible name (visible text preferred; `aria-label` only when there is no visible text)
- All `<img>` and `<Image>` elements have `alt` attributes — empty string `alt=""` for decorative
- No `onClick` on non-interactive elements without `role` and `onKeyDown`
- Form inputs must be associated with a `<label htmlFor>` and `id`
- Color is never the sole means of conveying information (paired with text or icon)

## Performance

- `useCallback` and `useMemo` only when a profiler shows a measurable issue — not by default
- Avoid inline object/array literals as JSX props in components that re-render frequently
- Prefer server components for static content; add `"use client"` only at the lowest necessary boundary
