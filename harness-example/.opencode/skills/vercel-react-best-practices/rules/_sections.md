# Vercel React Best Practices — Rule Sections

## rendering
Component rendering optimization: hydration, conditional rendering, SVG, content visibility, resource hints, script loading, useTransition, animations.

## async
Data fetching patterns: parallelism, suspense boundaries, deferring await, cheap conditions, dependencies, API routes.

## bundle
Bundle optimization: barrel imports, conditional loading, dynamic imports, preloading, analyzable paths, defer third-party.

## client
Client-side patterns: event listeners, localStorage schema, passive events, SWR deduplication.

## server
Server-side patterns: caching, parallel fetching, serialization, module state, auth actions, non-blocking after, dedup props, hoist static IO.

## js
Vanilla JS patterns: early exit, flatmap filter, hoist regexp, index maps, length check, min-max loop, requestIdleCallback, set/map lookups, cache results, cache property access, cache storage, combine iterations, batch DOM CSS, toSorted immutable.

## rerender
Re-render prevention: memoization, dependencies, derived state, functional setState, lazy state init, inline components, useEffect event handlers, transitions, useDeferredValue, useRef transient values, split hooks, simple expressions in memo.