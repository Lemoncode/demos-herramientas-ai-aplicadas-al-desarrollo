# ci-subagents-claude

Demo of three AI reviewer agents wired into a GitHub Actions pipeline using
Anthropic's official [`claude-code-action`](https://github.com/anthropics/claude-code-action).

Two workflows show two trigger styles against the same tiny React sample app.
They live at the repository root (`.github/workflows/`, not inside this
folder) because that's the only place GitHub Actions will ever run them
from — the auto-review workflow uses a `paths:` filter so it only fires
on changes under `ci-subagents-claude/`, keeping its behavior scoped to
this folder even though the file itself can't physically live here:

- **Automatic** (`.github/workflows/ci-subagents-claude-auto-review.yml`) —
  reviews every PR touching this folder the moment it's opened or
  updated. No human action required.
- **On-demand** (`.github/workflows/ci-subagents-claude-on-demand.yml`) —
  only runs when someone comments `@claude` on the PR. Human-in-the-loop.

## The reviewer agents

Three read-only reviewers live in `.github/agents/` as `*.agent.md` files —
the conventional home for agent definitions, the same layout
`subagents-delegation-example/` uses. The auto-review workflow
dispatches all three in parallel; the on-demand workflow makes the same
three available so you can ask for one by name.

| Agent | Checks | Tools |
|---|---|---|
| `react-reviewer` | TypeScript strictness (`any`, unchecked casts), hook rules (conditional hooks, incomplete deps), prop drilling | Read, Glob, Grep |
| `accessibility-reviewer` | Semantic HTML, headings, image `alt`, accessible names, form labels, keyboard, ARIA, colour-only signals | Read, Glob, Grep |
| `4r-reviewer` | Risk, Readability, Reliability, Resilience — criteria defined inline in the agent | Read, Glob, Grep |

None of them can edit a file or run a command. They return findings as JSON —
`file`, `line`, `severity`, `issue`, `fix` — and the coordinator turns each
finding into an inline review comment.

## The coordinator skill

`.github/skills/pr-review/SKILL.md` is what makes this a review *pipeline*
rather than a prompt. It owns the whole workflow: resolve `REPO` and `PR`, run
`gh pr diff --name-only`, dispatch the three subagents **in one message** so
they run in parallel, merge their JSON findings, publish one inline comment
per finding, then post a summary grouped by agent.

The workflow itself is three lines, because the logic lives in the skill:

```yaml
prompt: |
  REPO: ${{ github.repository }}
  PR NUMBER: ${{ github.event.pull_request.number }}

  Run the `pr-review` skill.
```

That prompt is all the YAML needs. Changing how reviews work — adding a
fourth reviewer, changing the comment format, switching to a review
submission instead of individual comments — is an edit to `SKILL.md`, not to
the workflow.

### Why the workflow stages a copy first

Everything the demo owns lives under `.github/` — `agents/*.agent.md` and
`skills/<name>/SKILL.md` — because that is a convention rather than an
invented folder name, and it is the same shape
`subagents-delegation-example/.github/` uses.

Claude Code, though, only discovers project subagents and skills in
`.claude/agents/*.md` and `.claude/skills/` at the **repository root**. So the
workflow stages a copy there, renaming `*.agent.md` to the `.md` Claude Code
expects:

```yaml
- name: Stage agents and coordinator skill for Claude Code
  run: |
    mkdir -p .claude/agents .claude/skills
    for f in ci-subagents-claude/.github/agents/*.agent.md; do
      cp "$f" ".claude/agents/$(basename "${f%.agent.md}").md"
    done
    cp -R ci-subagents-claude/.github/skills/. .claude/skills/
```

No `.claude/` directory is committed. The source of truth stays in
`.github/`, and the staged copy is job-scoped and thrown away with the runner.

## Inline comments

The skill posts one inline comment per finding with `gh api`, which works in
both tools and keeps the comment body under our control:

```bash
gh api --method POST "repos/$REPO/pulls/$PR/comments" \
  -f commit_id="$SHA" -f path="$FILE" -F line="$LINE" -f side=RIGHT -f body="$BODY"
```

As a fallback — if `gh api` is unavailable or the token cannot write — the
skill uses the GitHub MCP tool that `claude-code-action` ships with:

```
mcp__github_inline_comment__create_inline_comment
```

Both routes are enabled through `claude_args`, alongside the skill, subagent
and read-only `gh` tools:

```yaml
claude_args: |
  --allowedTools "Skill,Task,Agent,Read,Glob,Grep,mcp__github_inline_comment__create_inline_comment,Bash(gh api:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(gh pr comment:*),Bash(gh repo view:*)"
```

`Task` is the subagent tool on Claude Code 1.x and `Agent` on 2.x; listing
both keeps the workflow working across versions. `--allowedTools` is
*additive* — it grants these tools on top of the action's defaults, so the
on-demand workflow stays able to edit code when you ask it to.

If a comment is rejected because the line is not part of the diff, the skill
folds that finding into the summary instead of retrying — no silent drops.

## Cost

This costs nothing beyond a Claude Pro/Max subscription you already pay
for. `claude-code-action` authenticates via `claude_code_oauth_token`
instead of a metered `ANTHROPIC_API_KEY`, so review runs ride on the
subscription, not pay-per-token billing. GitHub Actions minutes are free
for public repos (and included free minutes on private repos).

## One-time setup

1. Locally, run:
   ```bash
   claude setup-token
   ```
   This logs in with your existing Claude Pro/Max account and prints an
   OAuth token.
2. In the GitHub repo, add that token as a repository secret named
   `CLAUDE_CODE_OAUTH_TOKEN` (Settings → Secrets and variables → Actions →
   New repository secret).

## Running the demo live

1. Push a branch that changes anything under
   `ci-subagents-claude/sample-app/src/` (or open a PR as-is against `main`
   — the sample app already ships with the planted issues listed below).
2. Open a PR that touches `ci-subagents-claude/`.
   `ci-subagents-claude-auto-review.yml` fires automatically. Three
   reviewers run in parallel and the PR ends up with a batch of inline
   comments plus one summary comment.
3. On the same PR, comment `@claude react-reviewer take another look at the
   hook rules`. `ci-subagents-claude-on-demand.yml` fires, dispatches that
   one agent, and replies on the thread. `@claude run the pr-review skill`
   runs the full coordinator on demand.

## What's planted in the sample app

`sample-app/` is a small order dashboard **written with errors on purpose, for
educational reasons** — the mistakes are the point, and fixing them breaks the
demo. Every file carries a banner saying so, every planted issue is marked
with an `Issue (...)` comment, and `sample-app/README.md` lists them all. Both
this folder and `ci-subagents-opencode/` carry **the same files**, so the two
tools review byte-identical code.

| File | Planted issue | Caught by |
|---|---|---|
| `api.ts` | Live-looking `sk-live-…` key committed to source | `4r-reviewer` (Risk) |
| `api.ts` | `orderTotal` loop bound is `length - 1` — the last item never counts | `4r-reviewer` (Reliability) |
| `api.ts` | `res.json()) as Promise<Order[]>` — unchecked cast on a network payload | `react-reviewer` |
| `api.ts` | `notifySupplier` has no `.catch()` and is never awaited | `4r-reviewer` (Resilience) |
| `OrderList.tsx` | `useEffect` reads `endpoint` but the dep array is `[]` | `react-reviewer` |
| `OrderList.tsx` | Placeholder-only `<input>`, no label | `accessibility-reviewer` |
| `OrderList.tsx` | Sync state signalled by colour alone | `accessibility-reviewer` |
| `OrderList.tsx` | `<div dangerouslySetInnerHTML>` on an unsanitised string | `4r-reviewer` (Risk) |
| `OrderList.tsx` | Clickable `<div>` — no role, no keyboard handler | `accessibility-reviewer` |
| `OrderList.tsx` | Heading jumps `h1` → `h3` | `accessibility-reviewer` |
| `OrderList.tsx` | Magic numbers `24`, `32`, `500`, `13` in JSX | `4r-reviewer` (Readability) |
| `OrderList.tsx` / `OrderTable.tsx` | 7- and 9-field props interfaces | both reviewers |
| `OrderTable.tsx` | `currency` / `locale` / `timezone` threaded through untouched | `react-reviewer` |
| `OrderRow.tsx` | `useState` called inside an `if` block | `react-reviewer` |
| `OrderRow.tsx` | `(order as any).discount` | `react-reviewer` |
| `OrderRow.tsx` | `<img>` with no `alt` | `accessibility-reviewer` |
| `OrderRow.tsx` | `<select>` with no label | `accessibility-reviewer` |
| `OrderRow.tsx` | Icon-only `!` button with no accessible name | `accessibility-reviewer` |
| whole app | no colocated `*.test.tsx` anywhere | `4r-reviewer` (Reliability) |

A good run produces comments from all three agents on the first pass —
useful for judging review quality live.
