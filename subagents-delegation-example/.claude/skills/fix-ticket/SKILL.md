---
name: fix-ticket
description: Use this skill when dispatched as a Fix Subagent in the Fix phase. Resolves exactly one backlog ticket end-to-end via a rigid Red→Green→Refactor cycle, runs the quality gate, commits, and returns a structured contract the Orchestrator aggregates into the Final Report.
---

# fix-ticket

**Type: Rigid** — every step runs in order. Do not skip phases, do not merge them.

You are a Fix Subagent. The Orchestrator dispatched you with one ticket in your prompt and the path to a git worktree it already created for you. Your job: reproduce the bug, fix it, produce visible TDD evidence, pass the quality gate, commit, and return a structured result.

---

## Step 0 — Pre-flight

Parse the ticket from your prompt. It MUST contain:

| Field | Example | Required |
|---|---|---|
| `ticket_id` | `B2` | yes |
| `file` | `src/components/directory/PersonRow.tsx` | yes |
| `worktree_path` | absolute path to the worktree the Orchestrator already created and checked out `fix/<ticket_id>` in | yes |
| `brief` | The ticket's current-behavior + acceptance-criteria text | yes |

Locate yourself in the harness — the worktree and branch already exist, you're only moving into them:
```bash
cd "<worktree_path>/subagents-delegation-example"
git status
git branch --show-current  # expect: fix/<ticket_id>
```

Do not run `git checkout -b` yourself — the Orchestrator already created this worktree on this branch specifically so you and any other Fix Subagent never touch the same working copy at the same time. Everything below happens inside `<worktree_path>/subagents-delegation-example`, never in the main checkout.

Touch only `<file>` and its colocated test file. Most tickets own a file no other ticket touches; a few (see `docs/backlog.md`) deliberately share a file with another ticket to demonstrate exactly this isolation — that's fine, your worktree is still independent, so you'll never see the other ticket's in-progress edits. If your fix genuinely requires touching a *different* file than the one your ticket names, stop and report it as `blocked_by` instead of doing it — that's a sign the ticket was scoped wrong, not something to route around.

Read the standard the Reviewer will apply to your code:
- `docs/references/4r-framework.md`

---

## Step 1 — Phase R (Red): reproduce the bug with a failing (or corrected) test

Look at `<file>`'s colocated test file.

- **If a test already exists and currently passes by asserting the buggy behavior** (this happens — see ticket B2): change the assertion to the *correct* expected value from the ticket's acceptance criteria first. Run it and confirm it now fails against the current implementation.
- **If no test file exists yet** (ticket B4): create one, asserting real user-visible behavior from the ticket's acceptance criteria — a rendered label, an accessible name, filtered results. Use `getByRole` first, then `getByLabelText`, then `getByText`. Never start with `getByTestId`.
- **If a test exists and doesn't cover the bug** (ticket B1, B3, B5): add a new `it()` covering the missing behavior. For B1 and B5 specifically, you're both adding tests to the same `DirectoryList.test.tsx` — that's expected (see Step 0); add yours without touching the other ticket's assertions.

Run only your file's tests:
```bash
npm test -- src/components/directory/<Component>
```

The relevant test **must fail** at this point — either because the implementation is still buggy, or because the assertion was still wrong. Capture the failing output verbatim — this becomes `red_evidence` in your return contract.

If the test passes without any implementation change, your assertion isn't actually checking the behavior described in the ticket — rewrite it.

---

## Step 2 — Phase G (Green): minimal fix

Edit `<file>` to satisfy the ticket's acceptance criteria — nothing more. Do not refactor unrelated code, rename unrelated variables, or touch any other file in `src/components/directory/`.

Run your tests:
```bash
npm test -- src/components/directory/<Component>
```

All tests must pass (new and existing). Capture the output as `green_evidence`.

If existing tests break, your fix has a regression — fix the implementation. Do not edit tests to make them agree with broken behavior.

---

## Step 3 — Phase Refactor (optional)

Only if your own fix left real duplication or unclear naming:

- Extract magic numbers / strings to named constants at module top
- Rename obscure variables
- Do not extract new files, contexts, or hooks — stay inside `<file>` and its test

Re-run `npm test -- src/components/directory/<Component>` after every change. Tests stay green throughout.

---

## Step 4 — Quality gate

```bash
npm run typecheck
npm run lint
```

Both must exit 0. Capture both outputs:

- `quality_gate.typecheck` — the `tsc --noEmit` stdout
- `quality_gate.lint` — the `eslint` stdout

If either fails, fix the issues and re-run. Do not commit code that the gate rejects.

---

## Step 5 — Commit

```bash
git add <file> <file's test>
git commit -m "fix(<ticket_id>): <one-line title from the ticket>"
```

The `commit-guard.sh` hook runs `npm test` before allowing the commit. If it blocks, you have a regression — fix and retry. Do **not** bypass with `--no-verify`.

---

## Step 6 — Return contract

Emit your result in this exact JSON shape. The Orchestrator parses it directly into the Final Report.

**On success:**

```json
{
  "ticket": "<ticket_id>",
  "branch": "fix/<ticket_id>",
  "worktree_path": "<absolute path of the worktree>",
  "fix_pass": true,
  "tests_pass": true,
  "red_evidence": "<verbatim failing output from Phase R>",
  "green_evidence": "<verbatim passing output from Phase G>",
  "quality_gate": {
    "typecheck": "<verbatim output>",
    "lint": "<verbatim output>"
  },
  "files_changed": [
    "<file>",
    "<file's test>"
  ]
}
```

**On unrecoverable failure** (typecheck won't pass, lint won't pass, the fix genuinely needs a second file, missing dependency):

```json
{
  "ticket": "<ticket_id>",
  "branch": "fix/<ticket_id>",
  "fix_pass": false,
  "tests_pass": false,
  "blocked_by": "<short reason>",
  "last_output": "<verbatim failing output>"
}
```

Return the JSON and stop. **Do not push. Do not open a PR.** The Orchestrator handles Ship & Report in Phase 3.

---

## Hard constraints

- **Touch only the one file named in your ticket, plus its colocated test.** No other file in `src/components/directory/`, including `people.ts`.
- **No project-config changes.** Do not edit `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `eslint.config.js`.
- **No remote operations.** No `git push`, no `gh pr create`. Phase 3 is the Orchestrator's.

## Why this skill is rigid

The Final Report is constructed from your return contract. Skip Phase R, `red_evidence` is empty and the Final Report cannot prove the fix was verified. Skip the Quality gate, the 4R Reviewer raises Readability / Reliability findings. Skip the commit, the Orchestrator has no branch to ship. **The discipline IS the deliverable.**
