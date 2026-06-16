# QA AI Review Instructions

**Objective**: Create a comprehensive summary of all findings organized by categories such as accessibility, bugs, UI/UX issues, and test coverage. This is a dedicated harness for QA engineers in a Frontend (FE) project.

This repository uses AI assistants for read-only QA review of frontend PRs against Jira acceptance criteria and UI/UX best practices.

## Hard rules

- Never edit files unless the user explicitly asks for an implementation task.
- Never run destructive commands.
- Never run `git push`, `git reset`, `rm`, deployment commands, package publishing commands, or migration commands.
- Never read `.env`, credentials, secrets, tokens, private keys, or local files outside the repository.
- Prefer reviewing PR diffs, linked Jira issues, acceptance criteria, tests, and user-facing behavior.
- When uncertain, report uncertainty instead of inventing project behavior.

## PR review workflow

For every PR QA review:

1. Identify the PR number, branch, title, author, changed files and CI status.
2. Infer or find the Jira issue key from branch name, PR title or PR description.
3. Fetch the Jira issue.
4. Extract:
   - Summary
   - Description
   - Acceptance Criteria
   - Designs or UX links
   - QA notes
   - Out-of-scope notes
5. Compare the PR diff against the acceptance criteria.
6. Review accessibility, tests, edge cases, i18n, error states, loading states and responsive behavior.
7. Produce a report organized by:
   - Bugs / Blocking Issues
   - UI/UX & Non-blocking Issues
   - Accessibility Findings
   - Missing Tests
   - Manual QA Scenarios
   - Questions for Product/QA/Frontend
   - Suggested GitHub PR Comments
