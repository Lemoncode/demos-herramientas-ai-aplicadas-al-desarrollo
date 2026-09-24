# ci-subagents-opencode

Demo of three AI reviewer agents wired into a GitHub Actions pipeline using
[opencode's official GitHub Action](https://opencode.ai/docs/github)
(`anomalyco/opencode/github`).

Two workflows show two trigger styles against the same tiny React sample app.
They live at the repository root (`.github/workflows/`, not inside this
folder) because that's the only place GitHub Actions will ever run them
from — the auto-review workflow uses a `paths:` filter so it only fires
on changes under `ci-subagents-opencode/`, keeping its behavior scoped to
this folder even though the file itself can't physically live here:

- **Automatic** (`.github/workflows/ci-subagents-opencode-auto-review.yml`) —
  reviews every PR touching this folder the moment it's opened or
  updated. No human action required.
- **On-demand** (`.github/workflows/ci-subagents-opencode-on-demand.yml`) —
  runs only when someone comments `/oc` or `/opencode` on the PR.
  Human-in-the-loop, and the one entry point that can **write**: whatever the
  comment asks for, the agent edits and the action commits it back to the PR.

## Where the AI setup lives

Definitions are kept in two places, mirroring what `subagents-delegation-example/`
already does for its three tools:

| Location | Format | Read by |
|---|---|---|
| `.opencode/agents/*.md`, `.opencode/skills/<name>/SKILL.md` | opencode-native (`description`, `mode`, `permission`) | opencode, natively |
| `.github/agents/*.agent.md`, `.github/skills/<name>/SKILL.md` | shared/portable (`name`, `description`, `tools`) | Claude Code (staged), VS Code Copilot, anything that reads the `.github` conventions |

The `.opencode/` copy is what actually runs in CI, and it is the one you edit
when you want to change reviewer behaviour. The `.github/` copy keeps the two
demos structurally identical and is what the `ci-subagents-claude` workflow
consumes, so a reader can diff the two demos and see only the wiring differ.

### Why the workflow stages them

opencode finds project agents and skills by walking **up** from the current
working directory to the git worktree root. In CI the working directory is the
repository root, so a `.opencode/` folder inside `ci-subagents-opencode/` is
invisible to it. The workflow therefore stages the demo's setup at the repo
root for the length of the job — the same trick the Claude demo uses with
`.claude/`:

```yaml
- name: Stage opencode AI setup
  run: |
    mkdir -p .opencode
    cp -R ci-subagents-opencode/.opencode/. .opencode/
```

Nothing is committed outside the demo folder; the staged copy dies with the
runner. It also means running `opencode` *inside* `ci-subagents-opencode/`
locally picks up exactly the same agents and skill, with no config gymnastics.

## The agents

Three read-only reviewers live in `.opencode/agents/` (and, portably, in
`.github/agents/`). The auto-review workflow dispatches all three in parallel;
the on-demand workflow can dispatch them too, and additionally ships the one
agent allowed to write.

| Agent | Checks | Permissions |
|---|---|---|
| `react-reviewer` | TypeScript strictness (`any`, unchecked casts), hook rules (conditional hooks, incomplete deps), prop drilling | edit deny, bash deny |
| `accessibility-reviewer` | Semantic HTML, headings, image `alt`, accessible names, form labels, keyboard, ARIA, colour-only signals | edit deny, bash deny |
| `4r-reviewer` | Risk, Readability, Reliability, Resilience — criteria defined inline in the agent | edit deny, bash deny |

None of them can edit a file or run a command. They return findings as JSON —
`file`, `line`, `severity`, `issue`, `fix` — and the coordinator turns each
finding into an inline review comment.

### The one write agent

`ci-pr-fixer` is the only agent that edits anything, and only the on-demand
workflow runs it. It does not review: it takes the comment that triggered the
run as its task, makes the smallest change that satisfies it (scoped to
`ci-subagents-opencode/`), and stops. The action then commits and pushes that
change to the PR branch — see *Fix commits* below.

| Agent | Role | Permissions |
|---|---|---|
| `ci-pr-fixer` | Applies the change a `/opencode …` comment asks for on the PR branch | edit allow (only `ci-subagents-opencode/`), bash read-only |

### Which agent each workflow runs

The action runs **one** primary agent per workflow, picked in the workflow
file, so the two entry points have different powers:

| Workflow | Agent | Can edit? | Commits? |
|---|---|---|---|
| auto-review | `ci-reviewer` | no (`edit: deny`) | no |
| on-demand | `ci-pr-fixer` | yes, under `ci-subagents-opencode/` | yes — the action commits the edits |

`ci-reviewer` (`default_agent` in `opencode.ci.json`) is the review
coordinator. It is allowed to touch the shell only for a narrow allowlist —
`gh api`, `gh pr view`, `gh pr diff`, and read-only `git` — so the auto-review
run can post comments but can never push code:

```yaml
permission:
  edit: deny
  skill: allow
  task:
    "*": allow
  bash:
    "*": deny
    "gh api *": allow
    "gh pr diff*": allow
    "gh pr view*": allow
    "git diff*": allow
    "git log*": allow
    "git status*": allow
```

`ci-pr-fixer` is the on-demand write agent. It keeps the same read-only shell
allowlist but flips `edit`, scoped so it can only change files inside
`ci-subagents-opencode/`:

```yaml
permission:
  edit:
    "*": deny
    "ci-subagents-opencode/**": allow
  skill: allow
  task:
    "*": allow
  bash:
    "*": deny
    # ...same read-only gh/git allowlist as ci-reviewer
```

Subagent permissions are declared per file rather than inherited, because
opencode derives a subagent's sandbox from its own config — the three
reviewers stay read-only no matter which primary agent dispatches them. What
makes a fix commit possible is not the agent alone: the on-demand workflow
grants `contents: write` and sets a git identity, because the action commits
and pushes any change the agent leaves behind (see *Fix commits* below).

## Fix commits

Only the on-demand workflow can change code. When `ci-pr-fixer` leaves the
working tree dirty, the action does the rest itself: `git add .`, a commit on
the PR branch, and `git push`. Four things make that work:

- **`contents: write`** in `ci-subagents-opencode-on-demand.yml` (the
  auto-review workflow stays on `contents: read`).
- **`use_github_token: true`**, instead of the OIDC → opencode App token
  exchange the action defaults to — that exchange returns `502` for this
  repository. Because `GITHUB_TOKEN` skips the action's own actor permission
  check, the job's `if` gates runs on `github.event.comment.author_association`
  so only `OWNER`, `MEMBER` or `COLLABORATOR` comments can trigger a write.
- **Push credentials**: the checkout keeps its token in the local git config
  (`persist-credentials: true`) and the action also receives it in the `TOKEN`
  env its `use_github_token` path reads. Without both, the commit is made and
  then `git push` fails with `could not read Username for 'https://github.com'`.
- A **git identity**, because the runner has none by default and `git commit`
  fails with `Author identity unknown` without it:

  ```yaml
  - name: Configure git identity
    run: |
      git config --global user.name "github-actions[bot]"
      git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
  ```

The staged `.opencode/` copy is gitignored (`/.opencode/` in the repository's
`.gitignore`), so the action's `git add .` never sweeps CI's own setup into the
fix commit.

## The coordinator skill

`.opencode/skills/pr-review/SKILL.md` is what makes this a review *pipeline*
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

The file is byte-identical to
`ci-subagents-claude/.github/skills/pr-review/SKILL.md` — only the mechanism
that finds it differs. The skill name must match its directory name, hence
`skills/pr-review/SKILL.md`.

## Inline comments

Unlike `claude-code-action`, the opencode action has no inline-comment tool —
it posts exactly one summary comment per run. Inline comments are therefore
the skill's job, shelling out to `gh`:

```bash
gh api --method POST \
  repos/$REPO/pulls/$PR/comments \
  -f commit_id="$SHA" -f path="<file>" -F line=<line> -f side=RIGHT \
  -f body="**\`react-reviewer\` · error** — …"
```

That is why the workflow bumps `issues: read` to `issues: write` and keeps
`pull-requests: write`: the first is for the action's own summary comment, the
second is for the skill's review comments. The `gh` CLI is authenticated by the
`GITHUB_TOKEN` the workflow passes into the action's environment — the skill
never sees or handles a token itself.

> **Fork PRs:** `GITHUB_TOKEN` is read-only on pull requests opened from a
> fork, so inline comments will be rejected there. This demo assumes
> same-repository branches.

## Provider: NaN (nan.builders)

Both workflows run `model: nan/deepseek-v4-flash` against
[NaN](https://nan.builders), an OpenAI-compatible endpoint at
`https://api.nan.builders/v1`.

NaN is not a built-in opencode provider, so its definition lives in
`ci-subagents-opencode/opencode.ci.json` and is loaded in CI through the
`OPENCODE_CONFIG` env var:

```json
{
  "provider": {
    "nan": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.nan.builders/v1",
        "apiKey": "{env:NAN_API_KEY}"
      }
    }
  }
}
```

`{env:NAN_API_KEY}` is interpolated from the `NAN_API_KEY` secret, so the
key is never committed. The file sits outside the repo root on purpose, so
it doesn't shadow anyone's local `opencode.json`.

There are two copies of that config, one per workflow, differing only in
`default_agent`:

| Config | `default_agent` | Used by |
|---|---|---|
| `opencode.ci.json` | `ci-reviewer` | auto-review |
| `opencode.on-demand.json` | `ci-pr-fixer` | on-demand |

The on-demand workflow needs its own copy because the action's `agent` input
did not take effect against this opencode version — the run fell back to
`default_agent` — so the write agent has to be selected through the config.

Beyond that they are deliberately tiny: provider plus `default_agent`. The
agents and the skill are files under `.opencode/`, not JSON, so nothing else
has to be kept in sync.

## Cost

This costs nothing beyond the NaN quota you already have. GitHub Actions
minutes are free for public repos (and included free minutes on private
repos).

NaN is billed per token (with per-model caps on your plan), so the
auto-review workflow fires on every push to an open PR touching this
folder. If you're cost-conscious while iterating, rely on the on-demand
workflow instead. Note that four agents run per review — one orchestrator
plus three reviewers — so a review costs roughly 4× a single-agent run.

## One-time setup

1. Store your NaN API key as a repository secret named `NAN_API_KEY`
   under Settings → Secrets and variables → Actions → New repository
   secret. Never commit the key to the repo.
2. Optional — to use a different NaN model, change the `model:` input in
   both workflow files. Options include `nan/glm5.3-flash`,
   `nan/qwen3.8-flash` and `nan/mimo-v2.5`; add the model id to both
   `opencode.ci.json` and `opencode.on-demand.json` first if it isn't
   listed there.

## Running the demo live

1. Push a branch that changes anything under
   `ci-subagents-opencode/sample-app/src/` (or open a PR as-is against
   `main` — the sample app already ships with the planted issues listed
   below).
2. Open a PR that touches `ci-subagents-opencode/`.
   `ci-subagents-opencode-auto-review.yml` fires automatically. Three
   reviewers run in parallel and the PR ends up with a batch of inline
   comments plus the action's summary comment.
3. On the same PR, comment `/opencode run the pr-review skill` to re-run the
   full review on demand, or `/opencode dispatch 4r-reviewer and focus on the
   security issue` to run one reviewer against a specific concern.
   `ci-subagents-opencode-on-demand.yml` fires and replies on the thread.
4. To have the demo *fix* something, comment the change you want — e.g.
   `/opencode fix the off-by-one in shipping.ts` — either as a top-level PR
   comment or as an inline review comment on the line. Same workflow: the
   `ci-pr-fixer` agent edits the file, the action commits and pushes, and the
   PR ends up with a commit containing the fix.

## What's planted in the sample app

`sample-app/` is a small order dashboard **written with errors on purpose, for
educational reasons** — the mistakes are the point, and fixing them breaks the
demo. Every file carries a banner saying so, every planted issue is marked
with an `Issue (...)` comment, and `sample-app/README.md` lists them all. Both
this folder and `ci-subagents-claude/` carry **the same files**, so the two
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
useful for judging review quality live, and for comparing the two tools
against identical input.
