---
name: git-create-pr
description: Use when a feature branch is complete and ready to merge — requires commits ahead of main and a passing quality gate before the PR is opened
---

# git-create-pr

**Type: Rigid** — follow every step in order.

Use this skill to push the current branch and open a pull request. Run `git-pr-description` first to generate the body.

---

## Step 1: Confirm you are NOT on main/master

```bash
git branch --show-current
```

If you are on `main` or `master`, stop: "Cannot create a PR from the base branch. Create a feature branch first using the `git-branch` skill."

## Step 2: Run the quality gate

```bash
npm run lint && npx tsc --noEmit && npm test
```

All three must pass before creating a PR. If any fails, fix it first.

## Step 3: Generate the PR description

Invoke the `git-pr-description` skill to produce the description body.

## Step 4: Determine the PR title

Format: `<type>: <short description>` — same convention as commit messages.

The title should summarize the entire branch in one line (≤72 characters).

Examples:
```
feat: add Button component with disabled state
fix: prevent token refresh loop on 401
test: add integration tests for auth flow
```

## Step 5: Push the branch

```bash
git push -u origin HEAD
```

## Step 6: Create the PR

```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
<paste PR description from git-pr-description here>
EOF
)"
```

## Step 7: Confirm

```bash
gh pr view --web
```

Or print the PR URL from the `gh pr create` output.
