---
name: git-pr-description
description: Use when generating a pull request body from the current branch — analyzes commits and diff against main before opening a PR with git-create-pr
---

# git-pr-description

**Type: Rigid** — follow every step in order.

Use this skill to generate a pull request description from the current branch. Run it before `git-create-pr`.

---

## Step 1: Identify the base branch

```bash
git branch -r | grep -E 'origin/(main|master)' | head -1
```

Use `main` unless only `master` exists.

## Step 2: Get the commit list

```bash
git log origin/main..HEAD --oneline
```

This shows all commits that will be included in the PR.

If there are no commits ahead of main, stop: "No commits ahead of main — nothing to PR."

## Step 3: Get the diff summary

```bash
git diff origin/main...HEAD --stat
```

Review which files changed and in what volume.

## Step 4: Write the PR description

Use this structure:

```markdown
## Summary

- <bullet 1: what changed and why>
- <bullet 2: what changed and why>
- <bullet 3: if needed>

## Test Plan

- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] <any manual verification steps specific to this change>
```

Rules:
- Summary bullets describe WHAT changed and WHY, not HOW
- Keep each bullet to one line
- 2–4 bullets maximum — if you need more, the PR is too large
- Test plan checkboxes are for the reviewer, not Claude

## Step 5: Output the description

Print the description in a copyable code block so it can be passed directly to `git-create-pr`.