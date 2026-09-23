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
  only reviews when someone comments `/oc` or `/opencode` on the PR.
  Human-in-the-loop.

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

## The reviewer agents

Three read-only reviewers live in `.opencode/agents/` (and, portably, in
`.github/agents/`). The auto-review workflow dispatches all three in parallel;
the on-demand workflow runs the same coordinator, so the same three are
available there too.

| Agent | Checks | Permissions |
|---|---|---|
| `react-reviewer` | TypeScript strictness (`any`, unchecked casts), hook rules (conditional hooks, incomplete deps), prop drilling | edit deny, bash deny |
| `accessibility-reviewer` | Semantic HTML, headings, image `alt`, accessible names, form labels, keyboard, ARIA, colour-only signals | edit deny, bash deny |
| `4r-reviewer` | Risk, Readability, Reliability, Resilience — criteria defined inline in the agent | edit deny, bash deny |

None of them can edit a file or run a command. They return findings as JSON —
`file`, `line`, `severity`, `issue`, `fix` — and the coordinator turns each
finding into an inline review comment.

### Who orchestrates them

`.opencode/agents/ci-reviewer.md` is the primary agent the action runs as,
selected with one line of config:

```json
"default_agent": "ci-reviewer"
```

`ci-reviewer` is the only agent allowed to touch the shell, and only for a
narrow allowlist — `gh api`, `gh pr view`, `gh pr diff`, and read-only `git`.
Everything else is denied, so a CI run can post comments but cannot push code:

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

Subagent permissions are declared per file rather than inherited, because
opencode derives a subagent's sandbox from its own config. `ci-reviewer` is
also the on-demand agent, which means **neither entry point can edit code** —
that is deliberate for a review demo, and it is why `require write`-style
requests in a `/oc` comment will be declined.

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

That config is deliberately tiny: provider plus `default_agent`. The agents and
the skill are files under `.opencode/`, not JSON, so nothing has to be kept in
sync between the two.

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
   `nan/qwen3.8-flash` and `nan/mimo-v2.5`; add the model id to
   `opencode.ci.json` first if it isn't listed there.

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
| `OrderToolbar.tsx` | `useMemo` reads `orders` but the dep array is `[]` | `react-reviewer` |
| `OrderToolbar.tsx` | Icon-only `↓` button with no accessible name | `accessibility-reviewer` |
| `OrderToolbar.tsx` | Clickable `<div>` — no role, no keyboard handler | `accessibility-reviewer` |
| `OrderToolbar.tsx` | 7-field props interface | `4r-reviewer` (Readability) |
| `OrderToolbar.tsx` | `setTimeout` created on mount and never cleared | `4r-reviewer` (Resilience) |
| `OrderToolbar.tsx` | Magic number `30000` delay in the effect | `4r-reviewer` (Readability) |
| whole app | no colocated `*.test.tsx` anywhere | `4r-reviewer` (Reliability) |

A good run produces comments from all three agents on the first pass —
useful for judging review quality live, and for comparing the two tools
against identical input.
