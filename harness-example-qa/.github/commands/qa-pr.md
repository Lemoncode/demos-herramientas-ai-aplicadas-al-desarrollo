Review PR $ARGUMENTS from a QA perspective against Jira acceptance criteria.

## Step 0 — ask first

Before doing anything else, ask the user:

> What is the Jira issue key for this review? (e.g. PROJ-123)

Do not run any command until the user provides the key or confirms there is no Jira issue.

## Step 1 — fetch Jira issue

Invoke the `jira-fetch` skill to retrieve the issue and extract:
- Summary
- Acceptance criteria (structured list)
- QA notes
- Out-of-scope notes
- Design / UX links

## Step 2 — fetch PR data

```bash
gh pr view $ARGUMENTS --json number,title,body,baseRefName,headRefName,changedFiles,statusCheckRollup
gh pr diff $ARGUMENTS
gh pr checks $ARGUMENTS
```

## Step 3 — dispatch subagents in parallel

Use the Agent tool to spawn subagents for:

1. **AC coverage** — map each AC item to changed files; mark Covered / Partial / Not covered / Cannot verify.
2. **Accessibility** — semantics, ARIA, focus, keyboard, form labels, screen reader content.
3. **Contrast** — invoke `contrast-review` skill if diff includes color, background, token or SVG changes.
4. **Tests** — unit, component, integration coverage; missing regression tests.
5. **Regression risk** — high-risk files and manual QA cases.

## Step 4 — compile report

Aggregate all subagent findings into the final QA Review Report format from CLAUDE.md.

## Constraints

- Read-only. Do not edit files.
- Do not post GitHub comments unless the user explicitly asks after seeing the report.
