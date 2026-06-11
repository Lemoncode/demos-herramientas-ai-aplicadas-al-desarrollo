# git-branch

**Type: Rigid** — follow every step in order.

Use this skill to create a feature branch before starting any new piece of work. Never work directly on `main`.

---

## Step 1: Sync with main

```bash
git checkout main
git pull origin main
```

Ensure you are starting from the latest state.

## Step 2: Name the branch

Format: `<type>/<short-description-in-kebab-case>`

Use the same types as conventional commits:

| Branch prefix | When to use |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `refactor/` | Refactor |
| `test/` | Tests only |
| `chore/` | Tooling, dependencies, config |
| `docs/` | Documentation |

Examples:
```
feat/user-card-component
fix/auth-token-refresh
refactor/form-validation
chore/upgrade-vitest
```

Rules:
- All lowercase
- Words separated by hyphens, not underscores
- Descriptive but concise (3–5 words maximum)
- No ticket numbers unless the team convention requires them

## Step 3: Create and switch to the branch

```bash
git checkout -b <type>/<short-description>
```

## Step 4: Confirm

```bash
git branch --show-current
```

Expected: the new branch name.

You are now ready to implement. Use `git-commit` to commit work, and `git-create-pr` when the work is done.
