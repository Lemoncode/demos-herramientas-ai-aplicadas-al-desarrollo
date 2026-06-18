# Passive Event Listeners

## Category
client

## Description
Use passive event listeners for scroll/touch events.

## Code Example
```tsx
// good
window.addEventListener('scroll', handler, { passive: true })
```

## Why
Prevents the browser from waiting for JS to confirm preventDefault(), improving scroll performance.