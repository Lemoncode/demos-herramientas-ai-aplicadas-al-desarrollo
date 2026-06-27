# Step 3 — Clarify *(full path only)*

**Command:** `/speckit.clarify`

Before technical planning, resolve every ambiguity in the spec. The agent surfaces questions the spec doesn't answer and records the resolved answers in a dedicated Clarifications section.

---

## Prompt

```
/speckit-clarify specs/task-manager/spec.md

Focus on: task ordering, maximum list length, and what happens to tasks on page reload.
```

You can also let the agent decide what to ask:

```
/speckit.clarify specs/task-manager/spec.md
```

---

## What the agent does

1. Reads `specs/task-manager/spec.md`
2. Identifies every `[NEEDS CLARIFICATION]` marker and any implicit assumptions
3. Asks targeted questions one area at a time
4. Records your answers in the spec

---

## Example questions the agent might ask

> **Task ordering:** The spec says new tasks appear "at the bottom of the list" — should tasks be reorderable, or is insertion order fixed?

> **Empty state:** When all tasks are deleted, should the empty state appear immediately or after a short delay?

> **Done tasks:** Should done tasks move to the bottom of the list, stay in place, or be visually separated?

> **Input length:** Is there a maximum length for a task description? What happens if the user pastes a very long string?

---

## What gets updated

The spec gains a Clarifications section:

```md
## Clarifications

- **Task ordering:** Insertion order is fixed. No drag-and-drop reordering in scope.
- **Page reload:** Tasks are not persisted. Reloading the page resets the list. This is acceptable for the demo.
- **Done tasks:** Done tasks stay in place; they are not moved to the bottom.
- **Input length:** No explicit maximum. The UI should not truncate input.
```

---

## When to skip this step

Use the lean path (skip Clarify) when:
- The spec was written with enough detail that no `[NEEDS CLARIFICATION]` markers exist
- You are prototyping and the answers don't yet matter
- You are the only stakeholder and have all the answers already
