---
name: jira-fetch
description: Fetch a Jira issue and extract QA-relevant fields — summary, description, acceptance criteria, status, assignee, links and QA notes — using the Jira REST API v3.
compatibility: opencode
metadata:
  workflow: github-jira-qa
---

## Purpose

Use this skill when the orchestrator needs to retrieve a Jira issue to compare against a PR diff.

## Prerequisites

The following environment variables must be set before calling this skill.
If any are missing, ask the user to provide them and do not proceed.

| Variable | Example | Description |
|----------|---------|-------------|
| `JIRA_BASE_URL` | `https://your-org.atlassian.net` | Jira Cloud base URL (no trailing slash) |
| `JIRA_EMAIL` | `user@example.com` | Atlassian account email |
| `JIRA_API_TOKEN` | `ATATTxxxx` | API token from id.atlassian.com/manage-profile/security/api-tokens |

## Fetch the issue

Run this bash command to retrieve the issue. Replace `$ISSUE_KEY` with the actual key (e.g. `PROJ-123`):

```bash
curl -s \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY?fields=summary,description,status,assignee,priority,labels,comment,attachment,issuelinks,subtasks,customfield_10016,customfield_10014"
```

`customfield_10016` is the Story Points field in most Jira Cloud instances.
`customfield_10014` is the Epic Link field. Field names vary per instance — if these return null, discover available fields with:

```bash
curl -s \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY" | jq '[.fields | keys[] | select(startswith("customfield"))]'
```

## Extract acceptance criteria

Jira does not have a native Acceptance Criteria field. Check in this order:

1. **Description body** — look for sections titled "Acceptance Criteria", "AC", "Definition of Done" or a checklist block.
2. **Custom field** — common names: `Acceptance Criteria`, `AC`, `customfield_10034`, `customfield_10035`. Discover with the fields endpoint above.
3. **Comments** — search for a pinned or early comment from Product/QA that lists criteria.
4. **Labels or child issues** — some teams encode AC as sub-tasks or linked issues.

If no structured AC is found, extract the functional requirements from the description and note that formal AC is missing.

## Fields to extract and return

```
Summary:              <text>
Status:               <To Do | In Progress | In Review | Done>
Assignee:             <name>
Priority:             <Highest | High | Medium | Low>
Labels:               <list>
Description:          <full text>
Acceptance Criteria:  <structured list — one item per line>
QA Notes:             <any notes explicitly for QA>
Out-of-scope:         <any explicit out-of-scope notes>
Designs / UX links:   <URLs found in description or attachments>
Linked issues:        <list of keys and link types>
```

## Error handling

| HTTP status | Meaning | Action |
|-------------|---------|--------|
| 401 | Bad credentials | Ask the user to check `JIRA_EMAIL` and `JIRA_API_TOKEN` |
| 403 | No permission | Ask the user to verify read access to the project |
| 404 | Issue not found | Confirm the issue key with the user |
| 429 | Rate limited | Wait a few seconds and retry once |

## Output

Return all extracted fields in a structured block. If a field is missing, write `Not found` — do not invent or infer values.
