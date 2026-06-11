# React Conventions

General conventions for all React and TypeScript files in this project. Loaded every session.

For rules specific to `src/components/`, see `.claude/rules/components.md` — it loads automatically when you work with files in that directory.

## File Naming

- Component files: `PascalCase.tsx` — e.g., `UserCard.tsx`
- Utility/hook files: `camelCase.ts` — e.g., `useAuth.ts`, `formatDate.ts`
- Test files: colocated, same name with `.test.tsx` suffix — e.g., `UserCard.test.tsx`

## TypeScript

- Strict mode is on — no `any`, no type assertions without a comment explaining why
- Prefer `interface` over `type` alias for object shapes
- Prefer named exports over default exports across the codebase

## Hooks

- Custom hooks go in `src/hooks/` and are named with the `use` prefix
- Do not call hooks conditionally or inside loops
- `useEffect` deps arrays must be complete — lint will catch missing deps
- `useCallback`/`useMemo` only with a measurable performance justification

## Imports

- Group imports: React → external packages → internal modules → styles
- Use path aliases (`@/`) over relative `../../` paths when available
