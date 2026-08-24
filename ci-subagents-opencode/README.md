# ci-subagents-opencode

Demo of an AI code reviewer wired into a GitHub Actions pipeline using
[opencode's official GitHub Action](https://opencode.ai/docs/github)
(`anomalyco/opencode/github`).

Two workflows show two trigger styles against the same tiny sample app:

- **Automatic** (`.github/workflows/opencode-auto-review.yml`) — reviews
  every PR the moment it's opened or updated. No human action required.
- **On-demand** (`.github/workflows/opencode-on-demand.yml`) — only reviews
  when someone comments `/oc` or `/opencode` on the PR. Human-in-the-loop.

## Cost

This costs nothing beyond whatever provider/API key you already have
opencode configured with locally. GitHub Actions minutes are free for
public repos (and included free minutes on private repos).

**Important:** the example workflows default to `ANTHROPIC_API_KEY` with
`model: anthropic/claude-sonnet-4-5`, matching opencode's own documented
default. If your local opencode setup uses a different provider (e.g.
OpenRouter), rename the secret/env var and the `model` input in both
workflow files to match — do not add a second, unrelated key.

## One-time setup

1. Take the same API key your local `opencode` CLI is already configured
   with (check `opencode auth login` / your opencode config for which
   provider and key you use).
2. In the GitHub repo, add it as a repository secret named
   `ANTHROPIC_API_KEY` (or rename to match your provider — see above)
   under Settings → Secrets and variables → Actions → New repository
   secret. Never commit the key to the repo.

## Running the demo live

1. Push a branch that changes `sample-app/src/index.ts` (or open a PR as-is
   against `main` — the sample app already has 3 planted issues).
2. Open a PR. `opencode-auto-review.yml` fires automatically and posts a
   review comment within a minute or two.
3. On the same PR, comment `/opencode take another look at the security
   issue`. `opencode-on-demand.yml` fires and responds directly to your
   comment.

## What's planted in the sample app

`sample-app/src/index.ts` intentionally contains the same 3 issues as
`ci-subagents-claude/sample-app` (a hardcoded API key, an off-by-one bug,
an unhandled promise rejection) — so you can compare how differently the
two tools review identical code.
