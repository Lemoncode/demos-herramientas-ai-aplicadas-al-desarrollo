# CI Subagent Reviewer Demos — Design Spec

**Date:** 2026-08-24
**Status:** Approved for implementation planning
**Author:** Aridane Martín (with Claude)

## 1. Purpose

Add two new self-contained teaching demos to this course repo, following the
existing `demo-0X` folder convention, that show how to wire an AI code-review
agent into a GitHub Actions pipeline:

- `ci-subagents-claude/` — using Anthropic's official `claude-code-action`.
- `ci-subagents-opencode/` — using opencode's official GitHub Action
  (`anomalyco/opencode/github`).

Both are **teaching demos**, not production-hardened templates: minimal,
easy to explain live, self-contained, and cheap/free to run.

"Subagents" in the folder name is naming/branding only — each demo runs a
**single** reviewer agent per workflow. It does not imply a multi-agent
fan-out (no parallel specialized reviewers in this iteration).

## 2. Non-goals

- No multi-agent / parallel specialized reviewers (security-agent,
  test-agent, etc.) — YAGNI for this teaching example.
- No merge-gating / required-status-check behavior — the agent posts a
  review comment; it does not block merges.
- No support for arbitrary opencode providers beyond documenting how to
  swap the example's default provider/key for whatever the presenter
  already has configured locally.

## 3. Folder structure

```
ci-subagents-claude/
  README.md
  sample-app/
    <tiny app with planted issues>
  .github/workflows/
    claude-auto-review.yml
    claude-on-demand.yml

ci-subagents-opencode/
  README.md
  sample-app/
    <same planted issues as the claude demo>
  .github/workflows/
    opencode-auto-review.yml
    opencode-on-demand.yml
```

Each folder is independently runnable/explainable, matching how the other
`demo-0X` folders work — no shared code between the two demo folders (the
`sample-app` content is duplicated, not imported), so each is copy-pasteable
on its own.

## 4. Sample app

A minimal Node/TypeScript snippet (not a full app — a couple of files) with
2–3 **deliberately planted issues**, chosen to be obvious enough that any
reasonable reviewer agent catches at least one of them on the first pass:

1. A hardcoded secret/API key in source (security issue).
2. An unhandled promise rejection / missing error handling on an async call.
3. An off-by-one or similar logic bug in a small function.

The exact same issues are planted in both `ci-subagents-claude/sample-app`
and `ci-subagents-opencode/sample-app`, so a live demo can open equivalent
PRs against each and compare how the two tools review identical code.

## 5. Authentication (zero marginal cost)

### Claude (`ci-subagents-claude/`)

- Uses `anthropics/claude-code-action@v1`.
- Auth via `claude_code_oauth_token` input (NOT `anthropic_api_key`), backed
  by the repo secret `CLAUDE_CODE_OAUTH_TOKEN`.
- README documents the one-time setup: run `claude setup-token` locally
  (authenticates against your existing Claude Pro/Max subscription), copy
  the resulting token into the GitHub repo secret. No pay-per-token spend —
  it rides on the subscription already paid for.

### opencode (`ci-subagents-opencode/`)

- Uses `anomalyco/opencode/github@latest`.
- Auth via whatever provider key opencode is already configured with
  locally, passed as an env var to the action and sourced from a GitHub
  repo secret — never committed to the repo.
- The example workflow defaults to `ANTHROPIC_API_KEY` (opencode's own
  documented default) with a `model: anthropic/claude-sonnet-4-...` input.
  README explicitly calls out: **rename the secret/env var and swap the
  `model` input to match whatever provider you actually have configured in
  your local opencode setup** (OpenRouter, a different Anthropic key, etc.)
  — the presenter's exact provider is a placeholder here, not prescribed.

### Shared cost note (both READMEs)

A short explicit paragraph: GitHub Actions minutes are free for public
repos (and included free minutes on private repos); the AI calls ride on
subscriptions/API keys already paid for outside this demo. No new recurring
cost is introduced by adding these workflows.

## 6. Workflows

Four workflow files total, two per demo folder, following the same shape:

### Auto-trigger (`claude-auto-review.yml`, `opencode-auto-review.yml`)

- Trigger: `on: pull_request: types: [opened, synchronize]`.
- Runs unconditionally on every PR open/update against the demo folder's
  sample app.
- Fixed prompt (same wording in both tools' workflows, adapted to each
  action's input format): *"Review the PR changes. Focus on code quality,
  potential bugs, and security issues. Suggest improvements where
  appropriate."*
- Posts the result as a PR comment automatically (native to both actions
  in this mode).

### On-demand trigger (`claude-on-demand.yml`, `opencode-on-demand.yml`)

- Trigger: `on: issue_comment: types: [created]` +
  `pull_request_review_comment: types: [created]`.
- Gated so the job only runs when the comment contains the tool's trigger
  phrase:
  - Claude: default `@claude` mention (interactive mode — no `prompt`
    input, per `claude-code-action` docs).
  - opencode: `if: contains(comment.body, '/oc') ||
    contains(comment.body, '/opencode')`.
- Demonstrates human-in-the-loop review-on-request, contrasted with the
  always-on auto workflow.

## 7. README content (per folder)

Each `README.md` covers, in this order:

1. What this demo shows and why (one paragraph).
2. Cost note (see §5).
3. One-time auth setup steps (secret name, how to generate/obtain it).
4. How to run the demo live: push a branch, open a PR against the sample
   app, observe the automatic review comment; then post the trigger phrase
   as a PR comment and observe the on-demand review comment.
5. Pointers to the two workflow files with a one-line description of what
   each does.

## 8. Validation plan

No live GitHub repo interaction is required to validate the artifacts
themselves before a real demo run:

- Lint all four workflow YAML files with `actionlint`.
- Manually re-read each workflow against the official action docs
  (`anthropics/claude-code-action`, `opencode.ai/docs/github`) fetched via
  Context7 to confirm input names/shapes are current as of this spec's
  date.
- Full end-to-end validation (opening a real PR and watching comments
  land) happens live during the actual course demo, using the presenter's
  own GitHub repo/secrets — this is out of scope for something that can be
  verified in this repo alone, since it requires GitHub Actions secrets
  and a real pull request lifecycle.

## 9. Open assumptions

- opencode's exact provider/subscription in the presenter's local setup is
  unknown; the example workflow uses `ANTHROPIC_API_KEY` as a documented
  default and calls out explicitly that it must be adapted to match
  whatever the presenter has configured locally.
- Course repo has no existing `.github/workflows/` — these are the first
  workflow files added to the repo, scoped entirely inside the two new
  demo folders.
