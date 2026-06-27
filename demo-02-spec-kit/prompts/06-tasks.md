# Step 6 — Tasks

**Command:** `/speckit.tasks`

Convert the plan into an ordered, executable task list. Each task maps to a user story. Independent tasks are marked `[P]` for parallel execution. No task writes implementation before its test exists.

---

## Prompt

```
/speckit-tasks specs/task-manager/plan.md
```

---

## What the agent produces

`specs/task-manager/tasks.md`:

```md
# Tasks: Task Manager

## Phase 1 — Setup

- [ ] T01 Install @testing-library/react and @testing-library/user-event
- [ ] T02 Create src/components/task-manager/ directory
- [ ] T03 Create types.ts with the Task type (id, text, done)

## Phase 2 — Foundational

- [ ] T04 Create TaskManager.tsx stub that renders null (required before child components reference it)

## Phase 3 — User Stories

### P1 — Add a task

- [ ] T05 [P] Write failing test: TaskInput calls onAdd with value and clears field on Add click
- [ ] T06 [P] Write failing test: TaskInput does not call onAdd when input is empty
- [ ] T07 Implement TaskInput (unblocked after T05, T06 fail)
- [ ] T08 [P] Write failing test: TaskManager renders TaskInput and passes onAdd handler
- [ ] T09 Implement task addition in TaskManager state (unblocked after T08 fails)

### P2 — Mark a task done

- [ ] T10 [P] Write failing test: TaskItem renders checkbox; checking it fires onToggle with task id
- [ ] T11 [P] Write failing test: TaskItem shows done indicator when done=true
- [ ] T12 Implement TaskItem (unblocked after T10, T11 fail)
- [ ] T13 Write failing test: TaskManager onToggle flips the done field for the correct task
- [ ] T14 Implement toggle handler in TaskManager (unblocked after T13 fails)

### P3 — Delete a task

- [ ] T15 Write failing test: TaskItem delete button fires onDelete with task id
- [ ] T16 Implement delete button in TaskItem (unblocked after T15 fails)
- [ ] T17 Write failing test: TaskManager onDelete removes the correct task from state
- [ ] T18 Implement delete handler in TaskManager (unblocked after T17 fails)
- [ ] T19 [P] Write failing test: EmptyState renders when task list is empty
- [ ] T20 [P] Implement EmptyState component (unblocked after T19 fails)
- [ ] T21 Wire EmptyState into TaskList

## Phase 4 — Polish

- [ ] T22 Integration test: full add → done → delete cycle in TaskManager
- [ ] T23 Keyboard accessibility audit: Enter to add, Tab to navigate, Space to toggle
- [ ] T24 Wire TaskManager into App.tsx

## Execution notes

- `[P]` tasks have no shared file dependencies — they can be run by parallel agents
- Each task must confirm a failing test before any implementation code is written (constitution Article I)
- Run `npm test` after every implementation task before moving to the next
```

---

## Task format

```
T[ID] [P?] Description
```

| Marker | Meaning |
|---|---|
| `[P]` | Can run in parallel — no shared file dependencies |
| No marker | Must run after its predecessors complete |

---

## Implementation strategies

| Strategy | When to use |
|---|---|
| MVP-first | Complete one full user story (P1) before starting P2 |
| Incremental | Add stories sequentially, validate each independently |
| Parallel team | Multiple agents on `[P]` tasks after foundational work is done |
