# Early Exit

## Category
js

## Description
Return early to avoid unnecessary work.

## Code Example
```tsx
// bad
function process(items) {
  if (items) {
    // lots of logic
  }
}

// good
function process(items) {
  if (!items || items.length === 0) return []
  // lots of logic
}
```

## Why
Reduces nesting and avoids processing empty input.