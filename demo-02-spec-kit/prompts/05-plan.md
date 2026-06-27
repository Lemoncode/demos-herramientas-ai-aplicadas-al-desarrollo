# Step 5 — Plan

**Command:** `/speckit.plan`

Translate the validated spec into a concrete technical plan. This is the first step where technology choices are made. The agent checks every decision against the constitution before committing to it.

---

## Prompt

```
/speckit-plan specs/task-manager/spec.md

Stack: React 19, TypeScript strict, Vitest + @testing-library/react.
No backend. Components in src/components/task-manager/.
```

---

## What the agent produces

Multiple files under `specs/task-manager/`:

### `plan.md`

```md
# Implementation Plan: Task Manager

## Technical Context
- Language: TypeScript (strict)
- Framework: React 19
- Testing: Vitest + @testing-library/react
- State: React useState (no external libraries — constitution Article III)
- Styling: CSS variables from src/index.css

## Constitution Check
- ✅ Article I (test-first): tests written before implementation in all tasks
- ✅ Article II (component structure): one file per component, named exports
- ✅ Article III (state): useState only
- ✅ Article IV (accessibility): all inputs labelled, keyboard interactions specified
- ✅ Article V (TypeScript): strict mode, explicit types for all props

## Component Tree
TaskManager (owns state)
├── TaskInput    (controlled input + Add button)
├── TaskList     (renders TaskItem for each task)
│   └── TaskItem (checkbox + text + delete button)
└── EmptyState   (shown when task list is empty)

## Project Structure
src/components/task-manager/
├── TaskManager.tsx
├── TaskManager.test.tsx
├── TaskInput.tsx
├── TaskInput.test.tsx
├── TaskList.tsx
├── TaskList.test.tsx
├── TaskItem.tsx
├── TaskItem.test.tsx
├── EmptyState.tsx
├── EmptyState.test.tsx
└── types.ts
```

### `data-model.md`

```md
# Data Model

## Task
| Field | Type    | Description                     |
|-------|---------|---------------------------------|
| id    | string  | UUID generated at creation time |
| text  | string  | Task description, non-empty     |
| done  | boolean | Whether the task is completed   |
```

### `research.md`

Notes on any non-obvious decisions: why `crypto.randomUUID()` for IDs, why controlled input over uncontrolled, etc.

### `quickstart.md`

```md
# Quickstart: Task Manager

1. npm install
2. npm test — all tests should pass
3. npm run dev — open http://localhost:5173
4. Add a task, mark it done, delete it
```

---

## Key rules for this step

- Technology decisions are made *here*, not in the spec
- Every architecture choice must pass the constitution check before it appears in the plan
- If the plan requires violating the constitution, explicitly document the justification
