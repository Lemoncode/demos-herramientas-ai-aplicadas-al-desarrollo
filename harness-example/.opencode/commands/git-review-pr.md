---
description: Review the current pull request — dispatches a subagent that checks test coverage and rule compliance against project conventions.
---

Review the current pull request by dispatching a subagent that checks test coverage and rule compliance.

## 1. Identify the PR

Run: `gh pr view --json number,title,baseRefName,headRefName,body`

If no open PR exists for the current branch, stop and tell the user: "No open PR found for this branch. Create one first with /git-create-pr."

## 2. Get the diff

```bash
gh pr diff
```

Also get the commit list:
```bash
gh pr view --json commits --jq '.commits[].messageHeadline'
```

## 3. Dispatch a reviewer subagent

Use the Agent tool to spawn a general-purpose subagent with the following prompt (fill in the placeholders before dispatching):

---

You are a code reviewer for a React + TypeScript project. Review this pull request for two things only: test coverage and rule compliance. Be specific and cite file:line references for every finding.

## PR Details

**Title:** [PR title]
**Branch:** [head branch] → [base branch]
**Description:**
[PR body]

## Diff to Review

[paste full output of `gh pr diff`]

## Project Rules to Check

Read these rule files before reviewing:
- `.opencode/rules/react-conventions.md`
- `.opencode/rules/testing-conventions.md`
- `.opencode/rules/components.md` (applies to files in `src/components/`)

## What to Check

### Test Coverage

For every new or modified source file (`.ts`, `.tsx`) in the diff:
- Does a colocated `.test.tsx` file exist?
- Does the test cover the primary behavior introduced or changed?
- Are tests using `getByRole` / `getByLabelText` as the first query choice (not `getByTestId`)?
- Is `userEvent` used instead of `fireEvent` for interactions?

Flag any new source file that has no test, or any changed behavior that has no corresponding test change.

### Rule Compliance

For every file in the diff, check whether the project rules were followed:

**For all `.tsx`/`.ts` files** (from `react-conventions.md`):
- Named exports only (no `export default` except in `main.tsx`)
- `interface` used for object shapes (not `type`)
- No `any` types
- Custom hooks named with `use` prefix and placed in `src/hooks/`
- `useCallback`/`useMemo` only where justified

**For files in `src/components/`** (from `components.md`):
- One component per file
- Semantic HTML (no `<div onClick>`, no `<span onClick>`)
- All interactive elements have accessible names
- All `<img>` have `alt`
- Form inputs are associated with `<label htmlFor>`

**For test files** (from `testing-conventions.md`):
- Tests colocated next to source files
- No snapshot tests for business logic
- Each `it()` tests one behavior

## Output Format

### Test Coverage

| File | Has test? | Coverage verdict |
|---|---|---|
| `src/components/Foo.tsx` | ✅ `Foo.test.tsx` | Primary behavior covered |
| `src/components/Bar.tsx` | ❌ missing | No test file |

List every finding with `file:line` references.

### Rule Violations

List each violation:
- **File:line** — rule violated — suggested fix

### Summary

**Verdict:** ✅ Ready to merge | ⚠ Merge with fixes | ❌ Do not merge

**Reason:** [1–2 sentence summary]

---

## 4. Report findings

Present the subagent's full report to the user.

If there are violations or missing tests, ask: "Would you like me to fix these issues before merging?"