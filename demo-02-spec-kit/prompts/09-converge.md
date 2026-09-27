# Step 9 — Converge

**Command:** `/speckit-converge`

Assess the codebase against the feature's spec, plan, and tasks to confirm nothing was missed. Converge is **append-only** — it never edits or deletes code; its only possible write is appending new tasks to `tasks.md`. Run it only after `/speckit-implement` has run on the current `tasks.md`.

---

## Prompt

```
/speckit-converge
```

---

## What the agent does

1. **Reads** `spec.md`, `plan.md`, and `tasks.md` for the active feature
2. **Inspects the codebase** against those artifacts — every user story, task, and acceptance criterion
3. **Prints a severity-graded findings summary** of anything missing or partial
4. **Resolves to one of two outcomes** (see below)

It never edits or deletes code. When gaps are found, the only write is new tasks appended to `tasks.md` under a Convergence section.

---

## Outcomes

| Outcome | What it means | What you do next |
|---|---|---|
| **Converged** | No gaps found; `tasks.md` is left byte-for-byte unchanged | Done — proceed to review or open a PR |
| **Tasks appended** | Gaps found; new tasks added under a Convergence section in `tasks.md` | Run `/speckit-implement` to complete them, then `/speckit-converge` again |

Each pass finds fewer items. Repeat `Implement → Converge` until it reports **Converged**.

---

## Example output

Converged:

```
✅ Converged — the implementation satisfies the spec, plan, and tasks.
```

Gaps found:

```
Convergence findings (severity: high → low)

⚠️  HIGH  P1 (Add a task) — spec rejects whitespace-only input, but TaskInput
    tests only cover the empty-string case.
    → task appended: T25 Cover whitespace-only input in TaskInput tests

⚠️  MED   P2 (Mark a task done) — tests assert onToggle fires, but nothing
    asserts the done indicator is actually visible.
    → task appended: T26 Assert the done indicator renders when done=true

2 tasks appended to specs/task-manager/tasks.md.
Run /speckit-implement, then /speckit-converge again.
```

---

## Why this step matters

`/speckit-implement` executes the task list it was given — it does not know whether that task list covered everything the spec asked for. Converge closes the loop by checking the code against the **spec**, not just against the tasks, so the gaps it finds are exactly the requirements that would otherwise ship missing.
