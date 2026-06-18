# useMemo

## Category
rerender

## Description
Memoize expensive computations with useMemo.

## Code Example
```tsx
// bad — recalculated on every render
const sorted = items.sort((a, b) => a.name.localeCompare(b.name))

// good — only recalculated when items change
const sorted = useMemo(() => items.sort((a, b) => a.name.localeCompare(b.name)), [items])
```

## Why
Avoids recomputing expensive values on unrelated re-renders.