---
name: jira-ac-analysis
description: Reviews whether a PR satisfies Jira acceptance criteria.
compatibility: claude-code
metadata:
  workflow: github-jira-qa
---

## Purpose

Use this skill to determine if a given Pull Request fulfills the Acceptance Criteria of a Jira issue.

## Inputs needed
- GitHub PR title, description and diff.
- Jira issue summary, description and acceptance criteria.

## Review method
1. Extract each acceptance criterion as a checklist item.
2. Map each criterion to changed files or code paths.
3. Mark each criterion as:
   - Covered
   - Partially covered
   - Not covered
   - Cannot verify from diff
4. Identify missing validation, error states, permissions, feature flags, analytics, translations or edge cases.
5. Do not assume behavior that is not visible in the diff or Jira issue.

## Output format

Produce:

### Acceptance Criteria Matrix

| AC | Status | Evidence | Risk | Comment |
|----|--------|----------|------|---------|
