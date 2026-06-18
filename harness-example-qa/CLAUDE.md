# QA Harness — Claude Code

**Objective**: Create a comprehensive summary of all findings organized by categories such as accessibility, bugs, UI/UX issues, and test coverage. This is a dedicated harness for QA engineers in a Frontend (FE) project.

Read-only QA review of frontend PRs against Jira acceptance criteria and UI/UX best practices.

## Hard rules

- Never edit files unless the user explicitly asks for an implementation task.
- Never read `.env`, credentials, secrets or files outside the repository.
- When uncertain, report uncertainty instead of inventing project behavior.

## Skills

Invoke a skill before starting any task that matches its description.

| Skill | Invoke when |
|---|---|
| `pr-qa-review` | User asks to review a PR for QA issues |
| `jira-fetch` | Retrieving a Jira issue and its acceptance criteria |
| `contrast-review` | PR diff touches colors, backgrounds, design tokens, SVG fill/stroke or Tailwind color classes |

## Commands

| Command | What it does |
|---|---|
| `/qa-pr` | Full QA review of a PR number against Jira AC, accessibility and tests |

## Workflow

**Always follow this order:**

1. Extract the Jira issue key automatically from the branch name, PR title, or description. Do not ask the user. If not found, proceed without AC coverage.
2. Use `jira-fetch` to retrieve the issue — summary, AC, QA notes, out-of-scope, design links.
3. Fetch the PR diff and CI status via `gh pr`.
4. Dispatch subagents in parallel for: AC coverage, accessibility, contrast (if colors changed), tests, regression risk.
5. Compile and present the final QA Review Report.

## Allowed read-only commands

These are the only bash commands permitted in this project:

```
git status
git diff
git log
gh pr view
gh pr diff
gh pr checks
curl https://*.atlassian.net (Jira API only)
npm test / npm run test / npm run lint / npm run typecheck  ← allowed automatically
```

## Output format

Every review must produce:

# QA Review Report

## Summary
## Jira / Acceptance Criteria Coverage
## Bugs / Blocking Issues
## UI/UX & Non-blocking Issues
## Accessibility Findings
### General Accessibility
### Color Contrast (WCAG 1.4.3 / 1.4.6 / 1.4.11 / 1.4.1)
## Test Coverage Findings
## Manual QA Scenarios
## Suggested GitHub PR Comments
## Open Questions
