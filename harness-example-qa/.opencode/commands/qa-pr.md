---
description: Review a GitHub PR against Jira acceptance criteria from a QA perspective.
agent: qa-orchestrator
---

Review PR $ARGUMENTS using the pr-qa-review skill.

Steps:
1. Get PR title, description, changed files, diff and check status.
2. Find Jira issue key from PR title, branch or description.
3. Fetch Jira issue and acceptance criteria.
4. Ask specialist subagents to review:
   - Jira AC coverage.
   - Accessibility.
   - Tests.
   - Regression risk.
5. Produce a final QA review report.

Important:
- Read-only review.
- Do not edit files.
- Do not post comments unless the user explicitly asks.
