# Jira Acceptance Criteria Analysis

Apply this instruction when evaluating whether a PR satisfies Jira acceptance criteria.

## Review method

1. Extract each acceptance criterion as a checklist item from the Jira description.
2. Map each criterion to changed files or code paths in the PR diff.
3. Mark each criterion as:
   - Covered
   - Partially covered
   - Not covered
   - Cannot verify from diff
4. Identify missing validation, error states, permissions, feature flags, analytics, translations or edge cases related to the AC.
5. Do not assume behavior that is not visible in the diff or Jira issue.

## Output Format

Always output findings in an Acceptance Criteria Matrix:

### Acceptance Criteria Matrix

| AC | Status | Evidence | Risk | Comment |
|----|--------|----------|------|---------|
