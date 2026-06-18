# Dynamic Imports

## Category
bundle

## Description
Use dynamic imports for code that isn't needed on initial render.

## Code Example
```tsx
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), { ssr: false })
```

## Why
Reduces initial bundle size by deferring non-critical code.