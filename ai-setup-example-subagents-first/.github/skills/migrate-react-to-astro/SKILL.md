---
name: migrate-react-to-astro
description: Use this skill when running the /migrate-react-to-astro command. Orchestrates the full React → Astro migration in three phases — parallel per-file conversion by component-migrator subagents, a read-only astro-verifier pass, then a Migration Report — and does not migrate any file itself.
---

# migrate-react-to-astro

**Type: Rigid.** Every step runs in order. Do not merge phases, do not migrate files yourself.

You are the Orchestrator. You read the plan, dispatch one Migrator per conversion unit, then
the Verifier, then print the Migration Report. The report printing is the stop condition.

---

## Step 0 — Pre-flight

1. Read `docs/migration-plan.md`. It is the authoritative list of conversion units and the
   acceptance criteria — do not invent units or change target paths.
2. Confirm the target app can build before you touch it:

   ```bash
   cd astro-site && npm install && npm run check && npm run build
   ```

   It should already pass on the placeholder `index.astro`. If it does not, stop and report
   `blocked_by: baseline astro-site does not build`.
3. Apply any argument filter from the command (`M1 M3` → only those units). No arguments → all units.
4. Confirm the working tree is clean and `react-app/` is untouched.

---

## Step 1 — Convert (parallel, one Migrator per unit)

For every unit in scope, dispatch a `component-migrator` subagent **in parallel** — one
dispatch per unit, all in the same message. Give each migrator exactly:

| Field | Value |
|---|---|
| `unit_id` | `M1`…`M6` from the plan |
| `source` | the source path from the plan |
| `target` | the target path from the plan |
| `brief` | verbatim notes cell for that unit from `docs/migration-plan.md` |

Do **not** tell migrators about each other. Each owns one target file; there is no shared
file between units, so no worktree isolation is required — different files, different owners.

Wait for **all** migrators to return a contract before continuing. If any returns
`migrated: false`, stop and report the failure verbatim — do not attempt the conversion
yourself.

---

## Step 2 — Verify (once, read-only)

Dispatch the `astro-verifier` subagent. Give it the list of expected target paths from the
plan and the acceptance criteria. The verifier:

- runs `cd astro-site && npm run check` and `npm run build`,
- checks every target file exists and renders the expected structure,
- confirms `react-app/` is unchanged.

The verifier must not edit anything. It returns findings, not fixes.

---

## Step 3 — Report

Print the Migration Report and stop:

```
# Migration Report

| Unit | Source | Target | Migrated |
|------|--------|--------|----------|
| M1 | ... | ... | ✅ / ❌ |

## Verify
- astro check: <pass/fail>
- astro build: <pass/fail>

## Findings
- <verifier findings, or "none">

## Verdict
PASS / FAIL — <one line>
```

If the verdict is FAIL, report the exact failing evidence. Do not open a PR, do not commit.
The Orchestrator's job ends at the report.

---

## Why this skill is rigid

The Migration Report is assembled from the migrator contracts and the verifier findings. Skip
the parallel fan-out and you are not demonstrating delegation. Skip the verifier and no
acceptance criterion is actually checked — the report would be asserting success it never
measured. **The discipline is the deliverable.**
