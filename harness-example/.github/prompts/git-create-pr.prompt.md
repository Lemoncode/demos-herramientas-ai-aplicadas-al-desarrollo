---
name: git-create-pr
description: Create a pull request for the current branch — syncs with main, generates the PR body, and opens the PR.
---

Create a pull request for the current branch. Follow these steps in order:

## 1. Verify you are not on main

Run: `git branch --show-current`

If the result is `main` or `master`, stop: "You are on the base branch. Create a feature branch first."

## 2. Sync with main

```bash
git fetch origin
git rebase origin/main
```

If the rebase reports conflicts, resolve them file by file, `git add <file>`, then `git rebase --continue`. Never use `git rebase --skip`.

## 3. Stage and commit if needed

Run `git status`. If there are unstaged changes, read `.github/skills/git-commit/SKILL.md` and commit them first.

## 4. Push the branch

```bash
git push origin HEAD
```

If the push is rejected after a rebase:

```bash
git push origin HEAD --force-with-lease
```

Never use `--force` without `--with-lease`.

## 5. Generate the PR description

Read `.github/skills/git-pr-description/SKILL.md` and follow it to generate the PR body.

## 6. Create the PR

```bash
gh pr create --title "<type>: <short imperative description>" --body "<description>"
```

PR title format: `<type>: <description>` (max 72 chars).

## 7. Confirm

Print the PR URL from the `gh pr create` output.
