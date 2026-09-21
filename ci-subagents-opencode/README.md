# ci-subagents-opencode

Demo of an AI code reviewer wired into a GitHub Actions pipeline using
[opencode's official GitHub Action](https://opencode.ai/docs/github)
(`anomalyco/opencode/github`).

Two workflows show two trigger styles against the same tiny sample app.
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

## Cost

This costs nothing beyond the NaN quota you already have. GitHub Actions
minutes are free for public repos (and included free minutes on private
repos).

NaN is billed per token (with per-model caps on your plan), so the
auto-review workflow fires on every push to an open PR touching this
folder. If you're cost-conscious while iterating, rely on the on-demand
workflow instead.

## One-time setup

1. Store your NaN API key as a repository secret named `NAN_API_KEY`
   under Settings → Secrets and variables → Actions → New repository
   secret. Never commit the key to the repo.
2. Optional — to use a different NaN model, change the `model:` input in
   both workflow files. Options include `nan/glm5.3-flash`,
   `nan/qwen3.8-flash` and `nan/mimo-v2.5`; add the model id to
   `opencode.ci.json` first if it isn't listed there.

## Running the demo live

1. Push a branch that changes `sample-app/src/index.ts` (or open a PR as-is
   against `main` — the sample app already has 3 planted issues).
2. Open a PR that touches `ci-subagents-opencode/`.
   `ci-subagents-opencode-auto-review.yml` fires automatically and posts
   a review comment within a minute or two.
3. On the same PR, comment `/opencode take another look at the security
   issue`. `ci-subagents-opencode-on-demand.yml` fires and responds
   directly to your comment.

## What's planted in the sample app

`sample-app/src/index.ts` intentionally contains the same 3 issues as
`ci-subagents-claude/sample-app` (a hardcoded API key, an off-by-one bug,
an unhandled promise rejection) — so you can compare how differently the
two tools review identical code.
