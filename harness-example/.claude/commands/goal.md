Invoke the `orchestrate-fleet` skill to run the full four-phase Fleet workflow.

## Goal source

- If `$ARGUMENTS` is non-empty, treat its content as the Goal prompt.
- If `$ARGUMENTS` is empty, read `docs/demo/goal-prompt.md` and use that as the Goal prompt.

## Behavior

The `orchestrate-fleet` skill is rigid and self-contained. It will:

1. Generate the Foundation (tokens, primitives, app shell, Section stubs) and commit.
2. Dispatch 6 Workers in parallel via `Agent(isolation: "worktree")` — one per Section.
3. Dispatch 2 Reviewers (`accessibility-reviewer`, `4r-reviewer`) over the 6 worktrees.
4. Open one PR per Section that passed Build + Tests, then print the Final Report.

## Stop condition

This command is complete when the Final Report (a 6×3 matrix plus PR URLs) is printed. After that line, halt. Do not offer further actions, do not poll, do not continue working.

## Prerequisites

- `gh` is authenticated against this repo's origin remote.
- `main` is the current branch and is clean.
- `node_modules/` is up to date (`npm install` was run within the last day).
