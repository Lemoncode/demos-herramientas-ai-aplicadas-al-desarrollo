# Step 1 — Constitution

**Command:** `/speckit.constitution`

Run this once when starting a new project. The agent will ask about your principles and produce `.specify/memory/constitution.md`. Every subsequent step will check all decisions against this document.

---

## Prompt

```
/speckit-constitution

This is a React + TypeScript web application. These are the principles I want enforced across the entire project:

- Test-first: no implementation code may be written before a failing test exists and has been confirmed to fail
- One component per file, named exports only
- No external state libraries — React built-ins only (useState, useReducer, useContext)
- Accessibility: all interactive elements must have accessible names and be keyboard-operable
- No API calls or backend dependencies in this demo
- Components live in src/components/[feature]/ — one folder per feature
- TypeScript strict mode; no `any`
```

---

## What the agent produces

`.specify/memory/constitution.md` — a permanent reference document that looks like:

```md
# Project Constitution

## Article I — Test-First Imperative
No implementation code shall be written before:
1. A test is written that describes the behaviour
2. The test is confirmed to FAIL
3. The minimum implementation is written to make it pass

## Article II — Component Structure
- One component per file
- Named exports only
- Components live in src/components/[feature]/

## Article III — State Management
React built-ins only. No Zustand, Redux, Jotai, or equivalent.

## Article IV — Accessibility
Every interactive element must have an accessible name.
All interactions must be keyboard-operable.

## Article V — TypeScript
Strict mode enabled. `any` is forbidden.
```

---

## Why this step matters

The constitution is loaded by the agent in every subsequent step. It acts as an automatic quality gate — if a plan violates Article I (test-first), the agent calls it out before generating code.
