# Step 4 — Checklist *(full path only)*

**Command:** `/speckit.checklist`

Validate the spec against a quality rubric before any technical work begins. Catches vague requirements, untestable stories, missing edge cases, and acceptance criteria that can't be verified.

---

## Prompt

```
/speckit.checklist specs/task-manager/spec.md
```

---

## What the agent checks

The agent audits the spec against criteria like:

| Check | Question |
|---|---|
| Independent testability | Can each user story be demonstrated in isolation? |
| Given-When-Then completeness | Does every story have at least one acceptance scenario? |
| Measurable success criteria | Are the success criteria quantifiable or verifiable? |
| No implementation leakage | Does the spec describe *what*, not *how*? |
| Edge cases covered | Are empty states, errors, and boundary inputs addressed? |
| No speculation | Are all stories backed by a concrete user need? |
| Clarifications resolved | Are there any remaining `[NEEDS CLARIFICATION]` markers? |

---

## Example output

```
Checklist results for specs/task-manager/spec.md

✅ P1 (Add a task) — independently testable, 2 scenarios, edge case for empty input covered
✅ P2 (Mark a task done) — independently testable, toggle behaviour specified
⚠️  P3 (Delete a task) — missing edge case: what happens when the user deletes the only task while it is marked done?
❌ Success Criteria — "without confusion" is not measurable. Suggest replacing with a specific interaction metric.

2 issues found. Fix before proceeding to Plan.
```

---

## When to skip this step

Use the lean path (skip Checklist) when:
- The spec is simple and you are confident in its quality
- You are the spec author and have already reviewed it manually
- Time constraints require moving to Plan immediately (accept the risk)
