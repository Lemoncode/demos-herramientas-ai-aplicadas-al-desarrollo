---
name: pr-qa-review
description: Review a GitHub PR from a QA perspective using Jira acceptance criteria, PR diff, CI status, tests, accessibility and regression risk.
compatibility: opencode
metadata:
  workflow: github-jira-qa
---

## Purpose

Use this skill when the user asks to review a PR for QA issues.

## Inputs to collect

- PR number or URL.
- Repository.
- PR title and description.
- PR diff.
- Changed files.
- CI/check status.
- Linked Jira issue.
- Jira acceptance criteria.
- Existing tests affected by the change.

## Review checklist

### Functional QA

- Does the implementation satisfy every acceptance criterion?
- Are negative cases covered?
- Are permissions/roles handled?
- Are empty, loading and error states handled?
- Are feature flags respected?
- Are analytics/tracking requirements implemented if mentioned?
- Are translations/i18n keys present if UI copy changed?

### Frontend QA

- Does UI behavior match the ticket?
- Are forms validated correctly?
- Are client and server validation errors displayed?
- Is state reset correctly after submit/cancel/navigation?
- Are responsive states considered?

### Accessibility

- Keyboard-only usage.
- Focus order and focus trapping where relevant.
- Labels and accessible names.
- Error messages associated with fields.
- No clickable divs when buttons/links are expected.
- No ARIA misuse.

### Tests

- Unit tests for logic.
- Component tests for UI behavior.
- Integration/e2e tests for critical flows.
- Regression tests for fixed bugs.
- Tests for acceptance criteria, not only implementation details.

## Output format

Produce:

1. Executive summary.
2. Acceptance criteria coverage matrix.
3. Blocking issues.
4. Non-blocking issues.
5. Missing tests.
6. Manual QA scenarios.
7. Suggested GitHub PR comments.
8. Questions for QA/Product/Dev.
