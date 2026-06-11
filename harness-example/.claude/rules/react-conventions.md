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
