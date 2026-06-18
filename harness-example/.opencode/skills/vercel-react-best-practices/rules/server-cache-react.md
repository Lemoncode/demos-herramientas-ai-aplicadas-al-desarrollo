# React Cache

## Category
server

## Description
Use React.cache() to deduplicate server data fetches.

## Code Example
```tsx
import { cache } from 'react'

export const getProduct = cache(async (id: string) => {
  const res = await fetch(`/api/products/${id}`)
  return res.json()
})
```

## Why
Deduplicates concurrent requests for the same data within a single render pass.