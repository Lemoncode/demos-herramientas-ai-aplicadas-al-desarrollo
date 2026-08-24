# CI Subagent Reviewer Demos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two self-contained course demos (`ci-subagents-claude/`, `ci-subagents-opencode/`) that show an AI agent reviewing GitHub PRs automatically and on-demand, at zero marginal cost.

**Architecture:** Two parallel, structurally-identical demo folders, each holding a tiny sample app with 3 planted bugs and two GitHub Actions workflows (auto-trigger on PR events, on-demand via a comment trigger phrase). No shared code between the folders — each is independently copy-pasteable, matching this repo's existing `demo-0X` convention.

**Tech Stack:** GitHub Actions, `anthropics/claude-code-action@v1`, `anomalyco/opencode/github@latest`, TypeScript (sample app only, no build step required), `actionlint` for workflow validation.

**Spec:** `docs/superpowers/specs/2026-08-24-ci-subagents-reviewer-design.md`

## Global Constraints

- No multi-agent fan-out — each workflow runs a single reviewer agent (per spec §1).
- No merge-gating — agents post PR comments only, never block merges (per spec §2).
- Claude auth uses `claude_code_oauth_token` (subscription-backed), never a metered `anthropic_api_key` (per spec §5).
- opencode auth uses a repo secret sourced from whatever the presenter already has configured locally; the example defaults to `ANTHROPIC_API_KEY` / `anthropic/claude-sonnet-4-5` and must be documented as swappable, not prescribed (per spec §5).
- The two sample apps must contain identical planted issues so the two tools can be compared on identical code (per spec §4).
- Work happens directly on the current branch (`slides/orca-herdr-card-styling`); merge directly to `main` when done — no separate PR for this work (per user instruction).

---

### Task 1: `ci-subagents-claude` sample app

**Files:**
- Create: `ci-subagents-claude/sample-app/package.json`
- Create: `ci-subagents-claude/sample-app/src/index.ts`

**Interfaces:**
- Produces: `applyBulkDiscount(order: Order, discountRate: number): number` and `notifySupplier(order: Order): void`, exported from `src/index.ts`. Later tasks (README) reference this file's issues by name but do not import it.

- [ ] **Step 1: Create the sample app files**

`ci-subagents-claude/sample-app/package.json`:
```json
{
  "name": "ci-subagents-claude-sample-app",
  "version": "1.0.0",
  "private": true,
  "description": "Tiny sample app with intentionally planted issues, used to demo an AI code reviewer in CI.",
  "main": "src/index.ts",
  "scripts": {
    "start": "ts-node src/index.ts"
  }
}
```

`ci-subagents-claude/sample-app/src/index.ts`:
```ts
// Sample order-processing module used to demo an AI code reviewer.
// NOTE: This file contains 3 intentionally planted issues for teaching
// purposes. Do not use as a reference implementation.

// Issue 1: hardcoded secret committed to source.
const STRIPE_API_KEY = "sk-live-51NcU8aBcDeFgHiJk1234567890abcdef";

interface Order {
  id: string;
  items: { name: string; price: number }[];
}

// Issue 2: off-by-one bug — the last item in the order is never discounted.
export function applyBulkDiscount(order: Order, discountRate: number): number {
  let total = 0;
  for (let i = 0; i < order.items.length - 1; i++) {
    total += order.items[i].price * (1 - discountRate);
  }
  return total;
}

// Issue 3: unhandled promise rejection — fetch() failures are never caught,
// and the caller never awaits this, so a network error crashes the process.
export function notifySupplier(order: Order): void {
  fetch("https://supplier.example.com/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${STRIPE_API_KEY}` },
    body: JSON.stringify(order),
  }).then((res) => {
    console.log("Supplier notified:", res.status);
  });
}
```

- [ ] **Step 2: Verify the file is valid TypeScript**

Run: `npx -y -p typescript@5 tsc --strict --target es2020 --module commonjs --noEmit ci-subagents-claude/sample-app/src/index.ts`
Expected: no output, exit code 0 (the planted issues are logic/security bugs, not syntax errors — this only confirms the file compiles).

- [ ] **Step 3: Commit**

```bash
git add ci-subagents-claude/sample-app
git commit -m "feat(ci-subagents-claude): add sample app with planted issues"
```

---

### Task 2: `ci-subagents-claude` auto-trigger workflow

**Files:**
- Create: `ci-subagents-claude/.github/workflows/claude-auto-review.yml`

**Interfaces:**
- Consumes: repo secret `CLAUDE_CODE_OAUTH_TOKEN` (documented in Task 4's README, not created by this task — the workflow references it but the actual secret is a manual GitHub UI step outside this repo).

- [ ] **Step 1: Create the workflow file**

`ci-subagents-claude/.github/workflows/claude-auto-review.yml`:
```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  code-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Run Claude Code Review
        uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          prompt: |
            Review the PR changes. Focus on code quality, potential bugs,
            and security issues. Suggest improvements where appropriate.
            Write your review as markdown text.
```

- [ ] **Step 2: Commit**

```bash
git add ci-subagents-claude/.github/workflows/claude-auto-review.yml
git commit -m "feat(ci-subagents-claude): add auto-trigger review workflow"
```

(Lint validation for all workflow files happens together in Task 9, once `actionlint` is installed.)

---

### Task 3: `ci-subagents-claude` on-demand workflow

**Files:**
- Create: `ci-subagents-claude/.github/workflows/claude-on-demand.yml`

**Interfaces:**
- Consumes: repo secret `CLAUDE_CODE_OAUTH_TOKEN` (same secret as Task 2).

- [ ] **Step 1: Create the workflow file**

`ci-subagents-claude/.github/workflows/claude-on-demand.yml`:
```yaml
name: Claude Assistant (on-demand)

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  claude-response:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          trigger_phrase: "@claude"
```

- [ ] **Step 2: Commit**

```bash
git add ci-subagents-claude/.github/workflows/claude-on-demand.yml
git commit -m "feat(ci-subagents-claude): add on-demand review workflow"
```

---

### Task 4: `ci-subagents-claude` README

**Files:**
- Create: `ci-subagents-claude/README.md`

**Interfaces:**
- Consumes: file names/paths from Tasks 1–3 (`sample-app/src/index.ts`, `claude-auto-review.yml`, `claude-on-demand.yml`) — references them by path, does not import anything.

- [ ] **Step 1: Create the README**

`ci-subagents-claude/README.md`:
```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add ci-subagents-claude/README.md
git commit -m "docs(ci-subagents-claude): add demo README"
```

---

### Task 5: `ci-subagents-opencode` sample app

**Files:**
- Create: `ci-subagents-opencode/sample-app/package.json`
- Create: `ci-subagents-opencode/sample-app/src/index.ts`

**Interfaces:**
- Produces: same shape as Task 1 (`applyBulkDiscount`, `notifySupplier`) — content is identical to Task 1's files, duplicated per spec §4 (no shared code between the two demo folders).

- [ ] **Step 1: Create the sample app files**

`ci-subagents-opencode/sample-app/package.json`:
```json
{
  "name": "ci-subagents-opencode-sample-app",
  "version": "1.0.0",
  "private": true,
  "description": "Tiny sample app with intentionally planted issues, used to demo an AI code reviewer in CI.",
  "main": "src/index.ts",
  "scripts": {
    "start": "ts-node src/index.ts"
  }
}
```

`ci-subagents-opencode/sample-app/src/index.ts`:
```ts
// Sample order-processing module used to demo an AI code reviewer.
// NOTE: This file contains 3 intentionally planted issues for teaching
// purposes. Do not use as a reference implementation.

// Issue 1: hardcoded secret committed to source.
const STRIPE_API_KEY = "sk-live-51NcU8aBcDeFgHiJk1234567890abcdef";

interface Order {
  id: string;
  items: { name: string; price: number }[];
}

// Issue 2: off-by-one bug — the last item in the order is never discounted.
export function applyBulkDiscount(order: Order, discountRate: number): number {
  let total = 0;
  for (let i = 0; i < order.items.length - 1; i++) {
    total += order.items[i].price * (1 - discountRate);
  }
  return total;
}

// Issue 3: unhandled promise rejection — fetch() failures are never caught,
// and the caller never awaits this, so a network error crashes the process.
export function notifySupplier(order: Order): void {
  fetch("https://supplier.example.com/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${STRIPE_API_KEY}` },
    body: JSON.stringify(order),
  }).then((res) => {
    console.log("Supplier notified:", res.status);
  });
}
```

- [ ] **Step 2: Verify the file is valid TypeScript**

Run: `npx -y -p typescript@5 tsc --strict --target es2020 --module commonjs --noEmit ci-subagents-opencode/sample-app/src/index.ts`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add ci-subagents-opencode/sample-app
git commit -m "feat(ci-subagents-opencode): add sample app with planted issues"
```

---

### Task 6: `ci-subagents-opencode` auto-trigger workflow

**Files:**
- Create: `ci-subagents-opencode/.github/workflows/opencode-auto-review.yml`

**Interfaces:**
- Consumes: repo secret `ANTHROPIC_API_KEY` (documented in Task 8's README as renameable to match the presenter's actual provider).

- [ ] **Step 1: Create the workflow file**

`ci-subagents-opencode/.github/workflows/opencode-auto-review.yml`:
```yaml
name: opencode Review

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: write
      issues: read
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - uses: anomalyco/opencode/github@latest
        env:
          # NOTE: rename this (and the secret behind it) to match whichever
          # provider your local opencode config actually uses, e.g.
          # OPENROUTER_API_KEY. See this folder's README.
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          # NOTE: swap this model to match your provider above.
          model: anthropic/claude-sonnet-4-5
          use_github_token: true
          prompt: |
            Review this pull request:
            - Check for code quality issues
            - Look for potential bugs
            - Look for security issues
            - Suggest improvements
```

- [ ] **Step 2: Commit**

```bash
git add ci-subagents-opencode/.github/workflows/opencode-auto-review.yml
git commit -m "feat(ci-subagents-opencode): add auto-trigger review workflow"
```

---

### Task 7: `ci-subagents-opencode` on-demand workflow

**Files:**
- Create: `ci-subagents-opencode/.github/workflows/opencode-on-demand.yml`

**Interfaces:**
- Consumes: repo secret `ANTHROPIC_API_KEY` (same secret as Task 6).

- [ ] **Step 1: Create the workflow file**

`ci-subagents-opencode/.github/workflows/opencode-on-demand.yml`:
```yaml
name: opencode (on-demand)

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  opencode:
    if: |
      contains(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          fetch-depth: 1
          persist-credentials: false

      - name: Run opencode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-5
```

- [ ] **Step 2: Commit**

```bash
git add ci-subagents-opencode/.github/workflows/opencode-on-demand.yml
git commit -m "feat(ci-subagents-opencode): add on-demand review workflow"
```

---

### Task 8: `ci-subagents-opencode` README

**Files:**
- Create: `ci-subagents-opencode/README.md`

**Interfaces:**
- Consumes: file names/paths from Tasks 5–7.

- [ ] **Step 1: Create the README**

`ci-subagents-opencode/README.md`:
```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add ci-subagents-opencode/README.md
git commit -m "docs(ci-subagents-opencode): add demo README"
```

---

### Task 9: Validate workflows, update root README, merge to main

**Files:**
- Modify: `README.md:7-40` (add two entries to the "Folders" list)
- No new files — this task validates Tasks 1–8's output and integrates.

**Interfaces:**
- Consumes: all files created in Tasks 1–8.

- [ ] **Step 1: Install actionlint**

Run: `brew install actionlint`
Expected: `actionlint` binary available on PATH. If Homebrew is unavailable, download a release binary from https://github.com/rhysd/actionlint/releases instead and use that binary in place of `actionlint` in the next step.

- [ ] **Step 2: Lint all four workflow files**

Run:
```bash
actionlint \
  ci-subagents-claude/.github/workflows/claude-auto-review.yml \
  ci-subagents-claude/.github/workflows/claude-on-demand.yml \
  ci-subagents-opencode/.github/workflows/opencode-auto-review.yml \
  ci-subagents-opencode/.github/workflows/opencode-on-demand.yml
```
Expected: no output, exit code 0. If `actionlint` reports issues, fix them in the relevant workflow file (from Tasks 2, 3, 6, or 7) before continuing — do not proceed with a failing lint.

- [ ] **Step 3: Add the two new demos to the root README's folder list**

In `README.md`, after the `### mcp-example` section (or wherever the demo-folder list currently ends before the RAG sections — check current content, since other demos may have been added since this plan was written), add:

```markdown
### `ci-subagents-claude`
Demo of an AI reviewer agent wired into a GitHub Actions pipeline using Anthropic's official `claude-code-action`. Shows both an automatic PR review trigger and an on-demand `@claude`-comment trigger, authenticated via a Claude Pro/Max subscription (no metered API spend).

### `ci-subagents-opencode`
Same demo as `ci-subagents-claude`, using opencode's official GitHub Action (`anomalyco/opencode/github`) instead. Shows the same automatic vs. on-demand trigger contrast, authenticated via whatever provider key you already have opencode configured with.
```

- [ ] **Step 4: Commit the README update**

```bash
git add README.md
git commit -m "docs: list ci-subagents-claude and ci-subagents-opencode in root README"
```

- [ ] **Step 5: Merge current branch into main**

```bash
git checkout main
git pull origin main
git merge slides/orca-herdr-card-styling
```
Expected: fast-forward or clean merge, no conflicts (this branch's commits are additive: slide styling changes plus the 9 commits from this plan, touching disjoint files). If conflicts appear, stop and resolve them manually before continuing — do not force-push over conflicts.

- [ ] **Step 6: Push main**

```bash
git push origin main
```
Expected: push succeeds, `main` now contains both the earlier slides work and the two new demo folders.
