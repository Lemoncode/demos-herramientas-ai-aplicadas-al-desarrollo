# git-commit

**Type: Rigid** — follow every step in order.

Use this skill every time you need to commit changes. Do not run `git commit` manually.

---

## Step 1: Check what will be committed

```bash
git status
git diff --staged
```

If nothing is staged, check unstaged changes:

```bash
git diff
```

If there are no changes at all, stop and report "Nothing to commit."

## Step 2: Stage files if needed

If there are unstaged changes, stage only the files relevant to this commit:

```bash
git add <specific-files>
```

Never run `git add .` or `git add -A` — stage files explicitly by name to avoid including unintended changes (secrets, build artifacts, unrelated edits).

## Step 3: Determine the commit type

Choose the conventional commit type that best matches the changes:

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code change that is not a fix or feature |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Build config, dependencies, tooling |
| `style` | Formatting only (no logic change) |

## Step 4: Write the commit message

Format:

```
<type>(<optional-scope>): <short description in imperative mood>
```

Rules:
- Description is imperative: "add button" not "added button" or "adds button"
- Maximum 72 characters on the first line
- No period at the end
- Scope is optional — use it when the change is confined to one area: `feat(auth):`, `fix(Button):`, `test(App):`

Examples:
```
feat(Button): add disabled state with aria-disabled
fix(useAuth): clear token on 401 response
test(UserCard): add test for empty name prop
chore: upgrade vitest to v4
```

## Step 5: Commit

```bash
git commit -m "<type>(<scope>): <description>"
```

If the commit is blocked by the commit-guard hook (tests failing), fix the tests first — do not bypass the hook.

## Step 6: Verify

```bash
git log --oneline -1
```

Confirm the commit message looks correct.
