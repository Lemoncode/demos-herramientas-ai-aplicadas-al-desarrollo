# Step 8 — Implement

**Command:** `/speckit.implement`

Execute the task list. The agent works through `tasks.md` in dependency order, writes tests before implementation, confirms each test fails before writing code, and marks tasks complete as it goes.

---

## Prompt

```
/speckit-implement specs/task-manager/tasks.md
```

To start from a specific task:

```
/speckit.implement specs/task-manager/tasks.md --start T10
```

---

## What the agent does

For each task in order:

1. **Reads** the task description and the constitution
2. **Writes the test** (if the task is a test task)
3. **Runs the test** and confirms it **FAILS** — stops if it passes without implementation
4. **Writes the minimum implementation** to make the test pass
5. **Runs the test** again and confirms it **PASSES**
6. **Refactors** if needed (Green → clean)
7. **Marks the task `[x]`** in `tasks.md`
8. **Moves to the next task**

---

## Constitution enforcement during implementation

The agent checks the constitution at every task:

```
Article I — Test-First: confirmed failing before T07 implementation
Article II — Component structure: TaskInput.tsx, named export ✅
Article III — State: useState only, no external lib ✅
Article IV — Accessibility: input has aria-label, button has accessible name ✅
Article V — TypeScript: props typed, no `any` ✅
```

If a task would violate the constitution, the agent stops and asks for a decision before proceeding.

---

## Example implementation sequence

```
▶ T05 — Write failing test: TaskInput calls onAdd
  Writing src/components/task-manager/TaskInput.test.tsx...
  Running: npm test TaskInput
  ✅ FAILS as expected (TaskInput does not exist yet)

▶ T06 — Write failing test: TaskInput ignores empty input
  Adding test case to TaskInput.test.tsx...
  Running: npm test TaskInput
  ✅ FAILS as expected

▶ T07 — Implement TaskInput
  Writing src/components/task-manager/TaskInput.tsx...
  Running: npm test TaskInput
  ✅ PASSES (2/2 tests)

▶ T08 — Write failing test: TaskManager renders TaskInput
  Writing src/components/task-manager/TaskManager.test.tsx...
  Running: npm test TaskManager
  ✅ FAILS as expected (TaskManager only renders null)

▶ T09 — Implement task addition in TaskManager
  Updating src/components/task-manager/TaskManager.tsx...
  Running: npm test TaskManager
  ✅ PASSES (1/1 test)
```

---

## Parallel execution

For tasks marked `[P]`, the agent can dispatch sub-agents to run them simultaneously:

```
Dispatching parallel agents for T05, T06, T19 (no shared file dependencies)...
```

This is an advanced pattern — by default, the agent runs tasks sequentially.

---

## What "done" looks like

- All tasks in `tasks.md` are marked `[x]`
- `npm test` passes with zero failures
- `npm run lint` passes with zero errors
- `npx tsc --noEmit` passes with zero type errors
- The feature works in the browser (`npm run dev`)
