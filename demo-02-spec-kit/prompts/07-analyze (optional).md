# Step 7 — Analyze *(full path only)*

**Command:** `/speckit.analyze`

Cross-check the spec, plan, and tasks for consistency before any code is written. Catches missing pieces, incomplete task sequences, plan decisions that contradict the spec, and over-engineered components.

---

## Prompt

```
/speckit-analyze specs/task-manager/
```

The agent reads all artifacts in the folder:
- `spec.md` — the requirements
- `plan.md` — the architecture
- `data-model.md` — the entity definitions
- `tasks.md` — the execution plan

---

## What the agent checks

| Check | What it looks for |
|---|---|
| Spec ↔ Plan alignment | Every user story in the spec has a corresponding set of tasks |
| Plan ↔ Tasks completeness | Every architectural decision in the plan is reflected in at least one task |
| Data model coverage | Every entity field in `data-model.md` is used somewhere in the plan |
| Constitution compliance | No plan decision contradicts `.specify/memory/constitution.md` |
| Missing sequences | Tasks that depend on each other are in the correct order |
| Over-engineering | Components or abstractions with no corresponding user story |

---

## Example output

```
Analysis: specs/task-manager/

✅ P1 (Add a task) — fully covered by T05–T09
✅ P2 (Mark a task done) — fully covered by T10–T14
✅ P3 (Delete a task) — fully covered by T15–T21

⚠️  data-model.md defines a `createdAt` timestamp field — no task references it
    and no user story requires it. Remove it or add a story that uses it.

✅ Constitution compliance — all 5 articles satisfied in plan.md

1 issue found. Resolve before running /speckit.implement.
```

---

## When to skip this step

Use the lean path (skip Analyze) when:
- The spec, plan, and tasks were generated in the same session with no external edits
- The feature is small enough that inconsistencies are unlikely
- You reviewed the artifacts manually and are confident they align
