# Parallel Data Fetching

## Category
async

## Description
Fetch independent data in parallel instead of sequentially.

## Code Example
```tsx
// bad — sequential
const user = await getUser()
const posts = await getPosts()

// good — parallel
const [user, posts] = await Promise.all([getUser(), getPosts()])
```

## Why
Reduces total waterfall time for independent requests.