# Step 2 — Specify

**Command:** `/speckit.specify`

Describe *what* you want to build and *why* — no technology decisions yet. The agent creates a numbered feature spec with prioritised user stories and acceptance criteria in Given-When-Then format.

---

## Prompt

```
/speckit-specify

I want to build a Task Manager widget for the app. Users need to be able to create tasks, track which ones are done, and remove tasks they no longer need. Everything lives in the browser — no backend.

The goal is to help a single user manage a short list of personal tasks during a session.
```

---

## What the agent produces

`specs/[feature-id]/spec.md` — for example `specs/task-manager/spec.md`:

```md
# Feature Specification: Task Manager

## Overview
A client-side widget that lets a single user create, complete, and delete tasks
during a browser session. No persistence across page reloads.

## User Stories

### P1 — Add a task
As a user, I want to type a task description and add it to my list
so that I can keep track of what I need to do.

**Acceptance scenarios:**
- Given I have typed text in the input field
  When I click the Add button or press Enter
  Then a new task appears at the bottom of the list and the input clears
- Given the input field is empty
  When I click Add or press Enter
  Then nothing happens and no task is created

### P2 — Mark a task done
As a user, I want to mark a task as done
so that I can see my progress at a glance.

**Acceptance scenarios:**
- Given a task exists in the list
  When I check its checkbox
  Then the task text shows with a visual done indicator
- Given a task is already marked done
  When I uncheck its checkbox
  Then the done indicator is removed

### P3 — Delete a task
As a user, I want to remove a task from the list
so that I can keep my list relevant.

**Acceptance scenarios:**
- Given a task exists in the list
  When I click the delete button for that task
  Then the task disappears from the list
- Given the list becomes empty after deletion
  Then an empty state message is shown

## Success Criteria
- A user can complete the full add → done → delete cycle without confusion
- All interactions work with keyboard only (no mouse required)
- Empty state is clearly communicated
```

---

## Key rules for this step

- Describe **what** users need, not **how** to build it
- No technology names in the spec (no React, no TypeScript, no CSS)
- Every user story must be independently testable
- Use `[NEEDS CLARIFICATION]` for anything uncertain — don't guess
