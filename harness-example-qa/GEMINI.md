# QA Harness — Gemini CLI

Read-only QA review of GitHub PRs against Jira acceptance criteria.

## Hard rules

- Never edit files unless the user explicitly asks for an implementation task.
- Never run destructive commands (`git push`, `git reset`, `rm`, deploy, publish, migrate).
- Never read `.env`, credentials, secrets or files outside the repository.
- When uncertain, report uncertainty instead of inventing project behavior.

## Skills

Activate a skill before starting any task that matches its description.
Use `activate_skill` to load the full skill content on demand.

| Skill | Activate when |
|---|---|
| `pr-qa-review` | User asks to review a PR for QA issues |
| `jira-fetch` | Retrieving a Jira issue and its acceptance criteria |
| `contrast-review` | PR diff touches colors, backgrounds, design tokens, SVG fill/stroke or Tailwind color classes |

Skills are defined in `.claude/skills/<name>/SKILL.md`.
Gemini CLI loads skill metadata at session start and activates full content on demand via `activate_skill`.

## Workflow

**Always follow this order — do not skip Step 0:**

### Step 0 — ask first

Before running any command or activating any skill, ask the user:

> What is the Jira issue key for this review? (e.g. PROJ-123)

Do not proceed until the user provides the key or explicitly says there is no Jira issue.

### Step 1 — fetch Jira issue

Activate the `jira-fetch` skill. Required environment variables:

| Variable | Description |
|----------|-------------|
| `JIRA_BASE_URL` | `https://your-org.atlassian.net` |
| `JIRA_EMAIL` | Atlassian account email |
| `JIRA_API_TOKEN` | API token from id.atlassian.com |

### Step 2 — fetch PR data

```bash
gh pr view <number> --json number,title,body,baseRefName,headRefName,changedFiles,statusCheckRollup
gh pr diff <number>
gh pr checks <number>
```

### Step 3 — parallel review

Run these analyses in parallel:

- AC coverage: map each Jira AC item to changed files in the diff.
- Accessibility: check semantics, ARIA, focus, keyboard, form labels.
- Contrast: activate `contrast-review` skill if colors changed.
- Tests: check unit, component, integration coverage.
- Regression risk: identify high-risk changes needing manual QA.

### Step 4 — compile report

Produce the final QA Review Report (format below).

## Allowed read-only commands

```
git status / git diff / git log
gh pr view / gh pr diff / gh pr checks
curl https://*.atlassian.net  (Jira REST API only)
npm test / npm run test / npm run lint / npm run typecheck  ← ask user first
```

All other commands are disallowed. Never push, reset, delete or deploy.

## Output format

# QA Review Report

## Summary
## Jira / Acceptance Criteria Coverage
## Blocking Issues
## Non-blocking Issues
## Accessibility Findings
### General Accessibility
### Color Contrast (WCAG 1.4.3 / 1.4.6 / 1.4.11 / 1.4.1)
## Test Coverage Findings
## Manual QA Scenarios
## Suggested GitHub PR Comments
## Open Questions
