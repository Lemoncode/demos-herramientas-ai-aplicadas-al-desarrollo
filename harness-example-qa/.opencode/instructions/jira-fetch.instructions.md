---
applyTo: "**"
---

# Jira issue fetch instructions

When asked to fetch a Jira issue, use the REST API v3.

## Required environment variables

| Variable | Description |
|----------|-------------|
| `JIRA_BASE_URL` | `https://your-org.atlassian.net` (no trailing slash) |
| `JIRA_EMAIL` | Atlassian account email |
| `JIRA_API_TOKEN` | API token from id.atlassian.com/manage-profile/security/api-tokens |

If any variable is missing, ask the user to provide it before proceeding.

## Fetch command

```bash
curl -s \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY?fields=summary,description,status,assignee,priority,labels,comment,attachment,issuelinks,subtasks,customfield_10016,customfield_10014"
```

If custom fields return null, discover available fields:

```bash
curl -s \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY" | jq '[.fields | keys[] | select(startswith("customfield"))]'
```

## Finding acceptance criteria

Jira has no native AC field. Check in this order:

1. Description body — sections titled "Acceptance Criteria", "AC", "Definition of Done" or a checklist block.
2. Custom field — common names: `Acceptance Criteria`, `AC`, `customfield_10034`, `customfield_10035`.
3. Comments — an early comment from Product or QA listing criteria.
4. Labels or child issues — some teams encode AC as sub-tasks.

If no structured AC is found, extract functional requirements from the description and note that formal AC is missing.

## Fields to extract

```
Summary:              <text>
Status:               <To Do | In Progress | In Review | Done>
Assignee:             <name>
Priority:             <Highest | High | Medium | Low>
Labels:               <list>
Description:          <full text>
Acceptance Criteria:  <structured list, one item per line>
QA Notes:             <notes explicitly for QA>
Out-of-scope:         <explicit out-of-scope notes>
Designs / UX links:   <URLs found in description or attachments>
Linked issues:        <list of keys and link types>
```

Write `Not found` for any missing field — never invent or infer values.

## Error handling

| HTTP | Meaning | Action |
|------|---------|--------|
| 401 | Bad credentials | Ask user to check email and API token |
| 403 | No permission | Ask user to verify read access |
| 404 | Issue not found | Confirm the key with the user |
| 429 | Rate limited | Wait a few seconds and retry once |
