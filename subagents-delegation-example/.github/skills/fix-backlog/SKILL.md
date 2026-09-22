---
name: fix-backlog
description: Use this skill when running /fix-backlog — orchestrates the three-phase backlog workflow (Fix → Review → Ship & Report). Prints the Final Report as the explicit stop condition. Do not fix tickets yourself; dispatch Fix Subagents.
---

# fix-backlog

**Type: Rigid** — three phases in fixed order. You are the Orchestrator. You dispatch Fix Subagents, dispatch Reviewers, ship PRs, and print the Final Report. **You do not fix tickets yourself.**

---

## Step 0 — Read the Backlog

Your prompt may contain a ticket filter as `$ARGUMENTS` (e.g. `B1 B3` to fix only those two). If empty, read every ticket in `docs/backlog.md`.

Each `## <id> — <title>` heading is one ticket. Parse it into a list with:

| Field | Source |
|---|---|
| `ticket_id` | the heading id (e.g. `B1`) |
| `title` | the rest of the heading |
| `file` | the `**File:**` line |
| `brief` | the entire ticket block verbatim (current behavior + acceptance criteria) |

Save the parsed tickets in memory for the rest of the run. **Do not** write them to disk.

### Pre-flight

```bash
cd "$(git rev-parse --show-toplevel)/subagents-delegation-example"
git status
git branch --show-current  # expect: main
```

If branch is not `main`, halt with: `"fix-backlog must start from main. Current branch: <X>. Reset and re-run /fix-backlog."`

---

## Phase 1 — Fix (parallel: you create isolation yourself, then dispatch one subagent per ticket)

Your subagent-dispatch tool (Claude Code's `Agent` tool, opencode's `Task` tool, Copilot's agent dispatch, or whatever your harness calls it) does not create git worktrees for you. You create them yourself, explicitly, with plain `git worktree` commands, before dispatching anyone. This works identically no matter which of the three providers is reading this skill.

### 1.1 Create one worktree per ticket

From the repo root, for every ticket:

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
git worktree add "$REPO_ROOT/.worktrees/fix-<ticket_id>" -b fix/<ticket_id>
```

Record `worktree_path = $REPO_ROOT/.worktrees/fix-<ticket_id>` per ticket — Phase 2 and Phase 3 both need it. Do this for every ticket before dispatching anyone; don't interleave worktree creation with dispatch.

Most tickets own a file no other ticket touches, but not all — `docs/backlog.md` currently has two (B1 and B5) that both target `DirectoryList.tsx` on purpose. Create both worktrees exactly the same way as any other ticket. Worktree isolation means the two Fix Subagents never clobber each other's `git checkout` or edits while working — each gets its own independent copy of the file. It does **not** mean their diffs are pre-reconciled: both branches touch the same file, so whichever of the two PRs merges second will show a normal GitHub merge conflict in Phase 3. That's expected, not a bug in this skill — merging is outside `/fix-backlog`'s scope.

### 1.2 Dispatch one subagent per ticket, in parallel

Dispatch all Fix Subagents in **one single message/turn** — one subagent-dispatch call per ticket (Claude Code: one message containing N `Agent` calls; opencode: one message containing N `Task` calls). Sequential dispatch is forbidden — parallelism is the demo's point.

For each ticket, dispatch a `ticket-fixer` subagent with this prompt:

```
You are the Fix Subagent for ticket <ticket_id>.

Your worktree is at <worktree_path>. Run `cd <worktree_path>/subagents-delegation-example` as your very first command, before anything else — everything you do happens inside that directory, not the main checkout. Then invoke the `fix-ticket` skill and follow it exactly.

Ticket
------
ticket_id:     <ticket_id>
file:          <file>
worktree_path: <worktree_path>

brief: |
  <verbatim ticket block from docs/backlog.md>

Return the structured JSON contract specified by fix-ticket.
```

Collect one result per ticket. Each is either a success contract (`fix_pass: true`) or a failure contract (`fix_pass: false`, with `blocked_by`).

If a Fix Subagent returns malformed JSON or times out, record it as a failure with `blocked_by: "no result returned"` and continue. Do not retry.

---

## Phase 2 — Review (parallel, one message containing three subagent-dispatch calls)

After all Fix Subagent results are in, dispatch **three Reviewers in one message** (same rule as Phase 1: one message, three calls, not three separate turns). Reviewers are read-only and do not need their own worktree — they read the worktrees Phase 1 already created.

Example using Claude Code's `Agent` tool (opencode: the same three calls via the `Task` tool, `subagent_type` → `subagent`):

```
Agent(
  subagent_type: "accessibility-reviewer",
  description: "a11y review of all fixed worktrees",
  prompt: |
    Review accessibility for these Fix Subagent worktrees. For each ticket, return a verdict (pass / warning / fail) and structured findings.

    Worktrees:
      <ticket_id>: <worktree_path from Phase 1>/subagents-delegation-example/<file>
      ... (one line per ticket)
)

Agent(
  subagent_type: "4r-reviewer",
  description: "4R review of all fixed worktrees",
  prompt: |
    Review Risk / Readability / Reliability / Resilience for these Fix Subagent worktrees against docs/references/4r-framework.md.

    Worktrees: <same list>
)

Agent(
  subagent_type: "react-reviewer",
  description: "React review of all fixed worktrees",
  prompt: |
    Review React component patterns (TS strictness, hook rules, prop drilling) for these Fix Subagent worktrees.

    Worktrees: <same list>
)
```

Each Reviewer returns a per-ticket verdict map. Save the raw outputs to disk:

```bash
mkdir -p docs/reports
echo "<React report>" > docs/reports/$(date +%Y-%m-%d)-react.md
echo "<a11y report>"  > docs/reports/$(date +%Y-%m-%d)-a11y.md
echo "<4R report>"    > docs/reports/$(date +%Y-%m-%d)-4r.md
```

If a ticket was blocked in Phase 1, the Reviewer skips it (verdict: `—`).

---

## Phase 3 — Ship & Report

### 3.1 Open PRs

For each ticket where `fix_pass && tests_pass`:

```bash
cd <worktree_path>/subagents-delegation-example
git push -u origin fix/<ticket_id>
gh pr create \
  --title "fix(<ticket_id>): <title>" \
  --body "$(cat <<'EOF'
## Ticket <ticket_id>: <title>

Fixed by the fix-backlog Orchestrator on <date>.

### Acceptance criteria
<acceptance bullets from the ticket>

### Reviews
- React verdict: <pass|warning|fail>
- a11y verdict: <pass|warning|fail>
- 4R verdict:   <pass|warning|fail>
<findings if any>

### TDD evidence
- Red:      ✓ (failing test captured)
- Green:    ✓ (passing test captured)
- Refactor: <yes|skipped>

🤖 Fixed by a ticket-fixer subagent under /fix-backlog.
EOF
)"
```

Capture each PR URL.

For tickets where `fix_pass` is false: no PR is opened. Record the blocker in the report.

### 3.2 Clean up worktrees

For every ticket, regardless of outcome:

```bash
cd "$REPO_ROOT"
git worktree remove "$worktree_path" --force
```

The branch itself (`fix/<ticket_id>`) stays — it's what the PR points at (or, for a blocked ticket, what's left for a human to pick up). Only the worktree checkout is disposable.

### 3.3 Print the Final Report

Print this exact format, populated with real data:

```
SUBAGENTS-DELEGATION-EXAMPLE — BACKLOG COMPLETE

Fix:     <n>/<total> Fix Subagents returned
Review:  3/3 Reviewers returned
Ship:    <n> PRs opened, <n> blocked

┌────────┬──────────────────────────────────┬───────┬───────┬──────┬──────┬──────────────────────────────────┐
│ Ticket │  Title                           │ Fix   │ React │ a11y │  4R  │  PR                              │
├────────┼──────────────────────────────────┼───────┼───────┼──────┼──────┼──────────────────────────────────┤
│ B1     │  Message button accessible name  │  <s>  │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ B2     │  Tenure calculation              │  <s>  │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ B3     │  Search re-filter on every render│  <s>  │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ B4     │  StatusBadge test coverage       │  <s>  │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ B5     │  Announce filtered result count  │  <s>  │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
└────────┴──────────────────────────────────┴───────┴───────┴──────┴──────┴──────────────────────────────────┘

Result:  <n> PRs opened · <n> blocked · <n> warnings
Reports: docs/reports/<date>-react.md, docs/reports/<date>-a11y.md, docs/reports/<date>-4r.md

✓ /fix-backlog complete
```

Cell legend: `✓` = pass, `⚠` = warning (still shipped), `✗` = fail, `—` = not applicable (e.g. Reviewer skipped a blocked ticket).

### 3.4 HALT

After printing the Final Report, **stop immediately**. Do not continue working. Do not offer next steps. Do not poll for changes. The Final Report is the explicit stop condition for `/fix-backlog`.

---

## Hard constraints

- Phase ordering is strict — Fix → Review → Ship & Report. No reordering.
- Every ticket gets its own `git worktree` before dispatch, even when it shares a file with another ticket (B1 and B5 both own `DirectoryList.tsx` — that's intentional, see Phase 1).
- All Fix Subagents dispatched in ONE message in Phase 1. All three Reviewers dispatched in ONE message in Phase 2.
- Phase 3 opens PRs only for tickets with `fix_pass && tests_pass`. Broken code never reaches GitHub.
- Every worktree created in Phase 1 is removed in Phase 3, win or lose. Don't leave stale checkouts under `.worktrees/`.
- The Final Report is printed in exactly the format above. Then HALT.

## Failure handling

- If a Fix Subagent hangs or returns nothing: that ticket's row shows `✗` for Fix, `—` for a11y and 4R, and a blocker note in the PR column.
- If a Reviewer returns nothing: leave its column blank (`—`) for every ticket and proceed to Ship.
- If `gh pr create` fails (auth, network): leave the PR cell as `push only` with the branch name, do not abort the Report.
- Never silently swallow failures. The Final Report is the truth, including the bad cells.
