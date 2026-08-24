# ci-subagents-claude

Demo of an AI code reviewer wired into a GitHub Actions pipeline using
Anthropic's official [`claude-code-action`](https://github.com/anthropics/claude-code-action).

Two workflows show two trigger styles against the same tiny sample app:

- **Automatic** (`.github/workflows/claude-auto-review.yml`) — reviews every
  PR the moment it's opened or updated. No human action required.
- **On-demand** (`.github/workflows/claude-on-demand.yml`) — only reviews
  when someone comments `@claude` on the PR. Human-in-the-loop.

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

1. Push a branch that changes `sample-app/src/index.ts` (or open a PR as-is
   against `main` — the sample app already has 3 planted issues).
2. Open a PR. `claude-auto-review.yml` fires automatically and posts a
   review comment within a minute or two.
3. On the same PR, comment `@claude take another look at the security
   issue`. `claude-on-demand.yml` fires and responds directly to your
   comment.

## What's planted in the sample app

`sample-app/src/index.ts` intentionally contains:
1. A hardcoded API key.
2. An off-by-one bug that skips the last item in a loop.
3. An unhandled promise rejection on a `fetch()` call.

A good reviewer agent should catch at least the first two on its first
pass — useful for judging review quality live.
