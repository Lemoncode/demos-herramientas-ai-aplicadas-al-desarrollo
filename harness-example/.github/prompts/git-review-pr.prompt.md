---
name: git-review-pr
description: Review the current open PR — dispatches a subagent that checks test coverage and rule compliance against project instructions.
---

Review the current pull request for test coverage and rule compliance.

## 1. Identify the PR

Run: `gh pr view --json number,title,baseRefName,headRefName,body`

If no open PR exists for the current branch, stop: "No open PR found for this branch. Create one first with the git-create-pr prompt."

## 2. Get the diff

```bash
gh pr diff
gh pr view --json commits --jq '.commits[].messageHeadline'
```

## 3. Review

You are a code reviewer for a React + TypeScript project. Check these two things only:

### Test Coverage

For every new or modified `.ts` / `.tsx` file in the diff:
- Does a colocated `.test.tsx` file exist?
- Does the test cover the primary behavior introduced or changed?
- Are tests using `getByRole` / `getByLabelText` (not `getByTestId`) as the first query choice?
- Is `userEvent` used instead of `fireEvent`?

Flag any new source file with no test, or any changed behavior with no corresponding test change.

### Rule Compliance

Check all diff files against `.github/instructions/`:

**For all `.tsx`/`.ts` files** (from `components.instructions.md`):
- Named exports only (no `export default` except `src/app/`)
- `interface` used for object shapes (not `type`)
- No `any` types
- `useCallback`/`useMemo` only where justified

**For files in `src/components/`** (from `components.instructions.md`):
- One component per file
- Semantic HTML (no `<div onClick>`, no `<span onClick>`)
- All interactive elements have accessible names
- All `<img>` have `alt`
- Form inputs associated with `<label htmlFor>`

**For test files** (from `testing-conventions.instructions.md`):
- Tests colocated next to source files
- No snapshot tests for business logic
- Each `it()` tests one behavior

## 4. Output

### Test Coverage

| File | Has test? | Coverage verdict |
|---|---|---|

List every finding with `file:line` references.

### Rule Violations

List each violation: `file:line — rule violated — suggested fix`

### Summary

**Verdict:** ✅ Ready to merge | ⚠ Merge with fixes | ❌ Do not merge

**Reason:** [1–2 sentence summary]
