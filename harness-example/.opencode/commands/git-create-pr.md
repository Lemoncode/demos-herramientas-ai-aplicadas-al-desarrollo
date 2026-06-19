---
description: Create a pull request for the current branch — syncs with main, commits any staged changes, pushes, and opens the PR via gh CLI.
---

Create a pull request for the current branch. Follow these steps in order:

## 1. Verify you are not on main

Run: `git branch --show-current`

If the result is `main` or `master`, stop and tell the user: "You are on the base branch. Create a feature branch first."

## 2. Sync with main

Fetch the latest main and rebase on top of it:

```bash
git fetch origin
git rebase origin/main
```

If the rebase reports conflicts, resolve them file by file:
- Open each conflicted file, read both sides, and apply the correct resolution
- After resolving each file: `git add <file>`
- Continue: `git rebase --continue`
- Repeat until the rebase completes cleanly

Never use `git rebase --skip` — it discards commits silently.

## 3. Stage all changes

```bash
git add .
```

## 4. Commit if there are staged changes

Check: `git status`

If there are staged changes, invoke the `git-commit` skill to write a proper conventional commit message and commit them.

If there is nothing to commit, skip this step.

## 5. Push the branch

```bash
git push origin HEAD
```

If the push is rejected because the remote has diverged (force push needed after rebase), run:

```bash
git push origin HEAD --force-with-lease
```

Never use `--force` without `--with-lease`.

## 6. Create the pull request

Invoke the `git-pr-description` skill to generate the PR body from the branch diff.

Then create the PR:

```bash
gh pr create --title "<conventional-title>" --body "<description from git-pr-description>"
```

PR title format: `<type>: <short imperative description>` (max 72 chars).

## 7. Confirm

Print the PR URL from the `gh pr create` output.