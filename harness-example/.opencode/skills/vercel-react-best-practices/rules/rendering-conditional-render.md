# Conditional Render

## Category
rendering

## Description
Use conditional rendering to avoid unnecessary work.

## Code Example
```tsx
// bad — component always renders
// good — conditional prevents render
{isOpen && <ExpensiveComponent />}
```

## Why
Prevents wasted renders of expensive subtrees.