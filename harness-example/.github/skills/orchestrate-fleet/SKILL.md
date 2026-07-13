---
name: orchestrate-fleet
description: Use this skill when running /goal — orchestrates the four-phase Fleet workflow (Foundation → Fleet → Review → Ship & Report). Prints the Final Report as the explicit stop condition. Do not write Section code yourself; dispatch Workers.
---

# orchestrate-fleet

**Type: Rigid** — four phases in fixed order. You are the Orchestrator. You generate the Foundation, dispatch the Fleet and the Reviewers, ship PRs, and print the Final Report. **You do not write Section code yourself.**

---

## Step 0 — Read the Goal

Your prompt contains the Goal — either passed as `$ARGUMENTS` to `/goal`, or (if empty) the contents of `docs/demo/goal-prompt.md`. The Goal is a fat markdown brief with a `# Sections` heading; each `## N. Name` block is one Section.

Parse it into a list of Mission Briefs. For each Section block extract:

| Field | Source |
|---|---|
| `section_id` | the heading slug, lowercased (e.g., `Product Catalog` → `catalog`) |
| `component_name` | PascalCase of `section_id` (`Catalog` → `Catalog`, `Contact & Footer` → `Contact`) |
| `owned_path` | `src/components/<section_id>/` |
| `copy_spec` | the entire Section block verbatim |
| `acceptance` | the bullet list under each Section (must-have behavior) |
| `mock_data` | path + sample data if specified in the block |

Save the parsed Mission Briefs in memory for the rest of the run. **Do not** write them to disk.

---

## Phase 1 — Foundation (sequential, you act alone)

### 1.1 Pre-flight

```bash
cd "$(git rev-parse --show-toplevel)/harness-example"
git status
git branch --show-current  # expect: main
```

If branch is not `main`, halt with: `"orchestrate-fleet must start from main. Current branch: <X>. Reset and re-run /goal."`

If `src/components/heading/` already contains `Heading.tsx`, the Foundation has been built. Skip to Phase 2 — Workers fork from the existing Foundation commit.

### 1.2 Generate the design system

Invoke the `frontend-design` skill with these locked constraints (per ADR-0001):

- **Direction:** Editorial Energy. Magazine-clean, B2B-credible.
- **Palette:** deep forest green (primary), bone (background), sulfur (accent). Provide one hex per token.
- **Typography:** editorial serif for headings (`Heading`), neutral humanist sans for body. Three sizes only: `display` (hero), `section` (H2), `body`.
- **Spacing:** 8px-base scale, six steps (`xs` 4, `sm` 8, `md` 16, `lg` 24, `xl` 40, `2xl` 64).
- **Output exactly these files** and no others:

```
src/components/tokens.ts                    ← color / type / spacing constants
src/components/heading/Heading.tsx           ← primitive
src/components/heading/Heading.test.tsx
src/components/button/Button.tsx             ← primitive
src/components/button/Button.test.tsx
src/components/card/Card.tsx                 ← primitive
src/components/card/Card.test.tsx
src/components/section/Section.tsx           ← primitive (wrapper + container + heading slot)
src/components/section/Section.test.tsx
src/app/globals.css                          ← CSS custom properties from tokens.ts
```

Primitive interface requirements:

| Primitive | Props (≤ 6) |
|---|---|
| `Heading` | `level` (1 / 2 / 3), `size` (`display`/`section`/`body`), `children` |
| `Button` | `children`, `variant` (`primary`/`secondary`), `as?` (`button`/`a`), `href?`, `onClick?` |
| `Card` | `children`, `as?` (defaults to `article`) |
| `Section` | `id?`, `title?`, `children` — renders `<section>` with a `Heading` slot |

Each primitive ships with **a real test** that asserts user-visible behavior, not a placeholder.

### 1.3 Update app shell

Update `src/app/page.tsx` to import the six Section stubs and render them in order:

```tsx
import { Hero } from '@/components/hero/Hero'
import { Catalog } from '@/components/catalog/Catalog'
import { Sustainability } from '@/components/sustainability/Sustainability'
import { Faq } from '@/components/faq/Faq'
import { Certifications } from '@/components/certifications/Certifications'
import { Contact } from '@/components/contact/Contact'

export default function Page() {
  return (
    <main>
      <Hero />
      <Catalog />
      <Sustainability />
      <Faq />
      <Certifications />
      <Contact />
    </main>
  )
}
```

Update `src/app/page.test.tsx` to assert the page renders at least one heading (smoke test).

### 1.4 Create Section stubs

For each Section in the Mission Brief list, create:

```
src/components/<section_id>/<ComponentName>.tsx       ← stub: returns <Section><Heading>...coming soon</Heading></Section>
src/components/<section_id>/<ComponentName>.test.tsx  ← stub test: asserts "coming soon" text
```

Stubs allow `npm run typecheck` to pass during Phase 1 even though Workers have not built the real Sections yet. Workers will overwrite the stubs in Phase 2.

### 1.5 Verify Foundation

```bash
npm install     # if package-lock.json is stale
npm run typecheck
npm test
npm run lint
```

All four must exit 0. If any fails, fix the issue **inside Foundation files only** — do not dispatch the Fleet on a broken Foundation.

### 1.6 Commit

```bash
git add -A src/ next.config.ts vitest.config.ts tsconfig.json eslint.config.js package.json package-lock.json 2>/dev/null
git commit -m "feat(foundation): tokens, primitives, app shell, section stubs"
```

Capture the commit SHA — you reference it in the Final Report.

---

## Phase 2 — Fleet (parallel, one message containing six `Agent` calls)

Dispatch all six Workers in **one single message** containing six `Agent` tool calls with `isolation: "worktree"`. Sequential dispatch is forbidden — parallelism is the demo's point.

For each Mission Brief:

```
Agent(
  subagent_type: "section-worker",
  isolation: "worktree",
  description: "Build the <section_id> Section",
  prompt: |
    You are the Section Worker for `<section_id>`. Invoke the `build-section` skill before doing anything else and follow it exactly.

    Mission Brief
    -------------
    section_id:     <section_id>
    component_name: <ComponentName>
    owned_path:     src/components/<section_id>/

    copy_spec: |
      <verbatim Section block from the Goal prompt>

    acceptance:
      - <bullet 1>
      - <bullet 2>
      - <bullet 3>

    mock_data: <path + content, or "none">

    Return the structured JSON contract specified by build-section.
)
```

Collect six results. Each is either a success contract (`build_pass: true`) or a failure contract (`build_pass: false`, with `blocked_by`).

If a Worker returns malformed JSON or times out, record it as a failure with `blocked_by: "no result returned"` and continue. Do not retry.

---

## Phase 3 — Review (parallel, one message containing three `Agent` calls)

After all six Worker results are in, dispatch **three Reviewers in one message**. Reviewers are read-only and do not need worktree isolation.

```
Agent(
  subagent_type: "accessibility-reviewer",
  description: "a11y review of all 6 Section worktrees",
  prompt: |
    Review accessibility for these six Worker worktrees. For each Section, return a verdict (pass / warning / fail) and structured findings.

    Worktrees:
      hero:           <worktree_path from Phase 2>/harness-example/src/components/hero/
      catalog:        <worktree_path>/harness-example/src/components/catalog/
      sustainability: <worktree_path>/harness-example/src/components/sustainability/
      faq:            <worktree_path>/harness-example/src/components/faq/
      certifications: <worktree_path>/harness-example/src/components/certifications/
      contact:        <worktree_path>/harness-example/src/components/contact/
)

Agent(
  subagent_type: "4r-reviewer",
  description: "4R review of all 6 Section worktrees",
  prompt: |
    Review Risk / Readability / Reliability / Resilience for these six Worker worktrees against docs/references/4r-framework.md.

    Worktrees: <same six paths>
)

Agent(
  subagent_type: "react-reviewer",
  description: "React review of all 6 Section worktrees",
  prompt: |
    Review React component patterns (TS strictness, hook rules, prop drilling) for these six Worker worktrees.

    Worktrees: <same six paths>
)
```

Each Reviewer returns a per-Section verdict map. Save the raw outputs to disk:

```bash
mkdir -p docs/reports
echo "<React report>" > docs/reports/$(date +%Y-%m-%d)-react.md
echo "<a11y report>"  > docs/reports/$(date +%Y-%m-%d)-a11y.md
echo "<4R report>"    > docs/reports/$(date +%Y-%m-%d)-4r.md
```

If a Section was blocked in Phase 2, the Reviewer skips it (verdict: `—`).

---

## Phase 4 — Ship & Report

### 4.1 Open PRs

For each Section where `build_pass && tests_pass`:

```bash
cd <worktree_path>/harness-example
git push -u origin fleet/<section_id>
gh pr create \
  --title "feat(<section_id>): <one-line title from copy_spec>" \
  --body "$(cat <<'EOF'
## Section: <section_id>

Built by the Fleet on <date> under `/goal`.

### Acceptance criteria
<bullets from Mission Brief>

### Reviews
- React verdict: <pass|warning|fail>
- a11y verdict: <pass|warning|fail>
- 4R verdict:   <pass|warning|fail>
<findings if any>

### TDD evidence
- Red:      ✓ (failing test captured)
- Green:    ✓ (passing test captured)
- Refactor: <yes|skipped>

🤖 Built by the section-worker fleet under /goal.
EOF
)"
```

Capture each PR URL.

For Sections where `build_pass` is false: no PR is opened. Record the blocker in the report.

### 4.2 Print the Final Report

Print this exact format, populated with real data:

```
QA-HARNESS-EXAMPLE — GOAL COMPLETE

Foundation:    ✓ committed at <sha>
Fleet:         <n>/6 Workers returned
Review:        3/3 Reviewers returned
Ship:          <n> PRs opened, <n> blocked

┌──────────────────┬─────────┬───────┬──────┬──────┬──────────────────────────────────┐
│ Section          │  Build  │ React │ a11y │  4R  │  PR                              │
├──────────────────┼─────────┼───────┼──────┼──────┼──────────────────────────────────┤
│ hero             │   <s>   │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ catalog          │   <s>   │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ sustainability   │   <s>   │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ faq              │   <s>   │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ certifications   │   <s>   │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
│ contact          │   <s>   │  <s>  │ <s>  │ <s>  │  <pr or blocker reason>          │
└──────────────────┴─────────┴───────┴──────┴──────┴──────────────────────────────────┘

Result:  <n> PRs opened · <n> blocked · <n> warnings
Reports: docs/reports/<date>-react.md, docs/reports/<date>-a11y.md, docs/reports/<date>-4r.md

✓ /goal complete
```

Cell legend: `✓` = pass, `⚠` = warning (still shipped), `✗` = fail, `—` = not applicable (e.g. Reviewer skipped a blocked Section).

### 4.3 HALT

After printing the Final Report, **stop immediately**. Do not continue working. Do not offer next steps. Do not poll for changes. The Final Report is the explicit stop condition for `/goal`.

---

## Hard constraints

- Phase ordering is strict — Foundation → Fleet → Review → Ship & Report. No reordering.
- Phase 1 ends with a commit before Phase 2 starts. Worker worktrees fork from this commit.
- All six Workers dispatched in ONE message in Phase 2. All three Reviewers dispatched in ONE message in Phase 3.
- Phase 4 opens PRs only for Sections with `build_pass && tests_pass`. Broken code never reaches GitHub.
- The Final Report is printed in exactly the format above. Then HALT.

## Failure handling

- If a Worker hangs or returns nothing: that Section's row shows `✗` for Build, `—` for a11y and 4R, and a blocker note in the PR column.
- If a Reviewer returns nothing: leave its column blank (`—`) for every Section and proceed to Ship.
- If `gh pr create` fails (auth, network): leave the PR cell as `push only` with the branch name, do not abort the Report.
- Never silently swallow failures. The Final Report is the truth, including the bad cells.
