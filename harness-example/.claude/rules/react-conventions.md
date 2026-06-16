---
description: General React + Next.js + TypeScript conventions for this project — file naming, strict TypeScript, hooks rules, import grouping, and the src/ folder layout. Applies to all files.
alwaysApply: true
---

# React + Next.js Conventions

General conventions for all React, Next.js, and TypeScript files. Loaded every session.

For rules specific to UI components (Foundation primitives and Section components), see `.claude/rules/components.md` — it loads automatically when you work with files in `src/design-system/` or `src/sections/`.

## Folder layout

```
src/
  app/                ← Next.js App Router — layout, page, globals.css
  design-system/      ← Foundation primitives (tokens, Button, Card, Section, Heading)
  sections/           ← One folder per homepage Section, owned by one Worker
  test-setup.ts       ← Vitest setup, imports @testing-library/jest-dom
```

Sections may import only from `src/design-system/` (and React / Next.js). Importing across `src/sections/{a}/` → `src/sections/{b}/` is forbidden.

## File naming

- Component files: `PascalCase.tsx` — e.g., `Heading.tsx`, `Hero.tsx`
- Utility / hook files: `camelCase.ts` — e.g., `useScrollLock.ts`, `formatPrice.ts`
- Test files: colocated, same name with `.test.tsx` suffix — e.g., `Heading.test.tsx`
- Next.js conventions take precedence in `src/app/`: `layout.tsx`, `page.tsx`, `error.tsx`, `loading.tsx` (lowercase, required by App Router).

## TypeScript

- Strict mode is on — no `any`, no type assertions without a comment explaining why
- Prefer `interface` over `type` alias for object shapes
- Prefer named exports over default exports, **except** in `src/app/` (Next.js requires default exports for `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`)

## Server vs client components

- Default to server components. Do not add `"use client"` unless the component uses hooks, browser APIs, or interactive event handlers.
- When a Section needs interactivity (form, accordion), put `"use client"` on the smallest possible subcomponent — keep the rest server-rendered.

## Hooks

- Custom hooks go in the consuming folder (e.g., `src/sections/faq/useAccordion.ts`) and start with `use`
- Do not call hooks conditionally or inside loops
- `useEffect` deps arrays must be complete — lint catches missing deps
- `useCallback` / `useMemo` only with a measurable performance justification

## Imports

- Group imports: React → Next.js → external packages → internal modules (`@/`) → styles
- Use `@/` path alias (configured in `tsconfig.json` and `vitest.config.ts`) over relative `../../` paths
