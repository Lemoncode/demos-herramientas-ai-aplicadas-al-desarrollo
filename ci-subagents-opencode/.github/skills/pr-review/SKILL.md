---
name: pr-review
description: Coordinate a pull request review end to end — dispatch the react-reviewer, accessibility-reviewer and 4r-reviewer subagents in parallel over the changed files, then publish one inline review comment per finding. Use whenever you are asked to review a pull request in this repository, or when CI triggers a PR review.
---

# PR Review

You are the review coordinator. You do not review the code yourself: you
dispatch the three reviewer subagents, collect their findings, and publish
each one as an inline comment on the pull request.

## 1. Establish the target

You need `REPO` (`owner/name`) and `PR` (number). Use the values in your
prompt. If they were not provided, derive them:

```bash
gh repo view --json nameWithOwner --jq .nameWithOwner
gh pr view --json number --jq .number
```

If there is no pull request for the current branch, stop and say so.

Then capture the commit under review and the files it touches:

```bash
gh pr view <PR> --json headRefOid --jq .headRefOid
gh pr diff <PR> --name-only
```

## 2. Dispatch the three reviewers in parallel

Send **one** message containing three subagent calls (`Task` on Claude Code
1.x, `Agent` on 2.x) so they run concurrently rather than one after another.

The three subagents are:

- `react-reviewer` — TypeScript strictness, hook rules, prop drilling
- `accessibility-reviewer` — semantics, labels, keyboard, images, colour-only signals
- `4r-reviewer` — Risk, Readability, Reliability, Resilience

Give each one this brief, with the file list from step 1 substituted in:

> Review the files changed by pull request `<REPO>#<PR>`:
> `<file list>`.
> Read every file in full before judging it. Return only the JSON contract in
> your instructions: a `findings[]` array where each finding has `file`,
> `line`, `severity`, `issue` and `fix`, and `line` is the 1-based line number
> on the RIGHT side of the diff. Do not comment on files outside that list.

If a subagent does not exist in this session, say so and continue with the
ones that do. Never fall back to reviewing the code yourself — the whole
point of this skill is that the reviewers stay separate from the coordinator.

## 3. Collect the findings

Each subagent returns `{"agent": ..., "findings": [...]}`. Merge the arrays
into one list, remembering which agent produced each finding. Drop any finding
that has no `file` or no `line` — it belongs in the summary instead.

## 4. Publish one inline comment per finding

**Preferred — `gh api`:**

```bash
gh api --method POST "repos/<REPO>/pulls/<PR>/comments" \
  -f commit_id="<head sha from step 1>" \
  -f path="<file>" \
  -F line="<line>" \
  -f side=RIGHT \
  -f body="<body>"
```

**Fallback —** if `gh api` is unavailable or the token cannot write, and a
tool named `mcp__github_inline_comment__create_inline_comment` exists in this
session, call it instead with `confirmed: true`, the finding's `file` as the
path, the finding's `line`, and the same body.

Body format, one comment per finding:

```
**`<agent>` · <severity>** — <issue>

Suggested fix: <fix>
```

If the API rejects a comment because the line is not part of the diff, do not
retry it against another line — move that finding to the summary in step 5.

## 5. Summarise

Post one summary comment:

```bash
gh pr comment <PR> --body "<summary>"
```

The summary groups the findings by agent in a table, and includes
`4r-reviewer`'s verdict when it returned one. If the reviewers found nothing,
say so plainly — a clean review is a valid result, not a failure.

## Hard constraints

- Never edit a file, never commit, never push. This skill reviews, it does not
  fix.
- Never post more than one inline comment per finding.
- Never invent a line number or a file path. No line, no inline comment.
- Label every comment with the agent that produced it. Never present a
  subagent's finding as your own judgement.
