# demo-03-grill-me

A hands-on walkthrough of the **Grill Me workflow** — a methodology for going from a vague client brief to AFK agent implementation while keeping the human in the loop where it matters and out of the loop where it doesn't.

Based on Matt Pocock's workshop: [youtube.com/watch?v=-QFHIoCo-Ko](https://www.youtube.com/watch?v=-QFHIoCo-Ko)

---

## Core idea

LLMs have a **smart zone** and a **dumb zone**. The smart zone is roughly the first ~100K tokens of a context window — where attention relationships are healthy and the model does its best work. Beyond that, it gets progressively dumber.

This workflow is designed around two constraints:

1. **The smart zone** — keep tasks small enough to fit in it. Clear context rather than compact: compacting adds sediment; clearing resets to a known-good state.
2. **The Memento problem** — LLMs forget everything on a clear. The workflow produces durable artifacts (PRD, issue files) so that clearing context loses nothing important.

---

## Two types of tasks

| Type | Who does it | Examples |
|---|---|---|
| **Human in the loop** | You must be present | Grilling, PRD review, QA, code review |
| **AFK** | Agent runs unattended | Implementation, migrations, tests |

The goal is to front-load all human decisions into a short, intense planning phase, then hand the queue to an agent and walk away.

---

## The workflow

```
Client Brief → Grill Me → Write PRD → PRD to Issues → Ralph Loop → QA & Review
                ↑ human in the loop ↑                  ↑    AFK    ↑    ↑ human ↑
```

---

## Step-by-step guide

### Step 1 — Start with a client brief

Before opening Claude Code, write or gather the raw input: a Slack message, a meeting note, a vague feature request. Don't refine it — the grilling session exists precisely to do that work.

**Example input:** [`client-brief.md`](client-brief.md)

---

### Step 2 — Grill Me

**Skill:** `/grill-me` (thin alias that triggers `/grilling`)

The AI explores the codebase via a sub-agent (isolated context window), then interviews you one question at a time — always providing its own recommended answer. Your job is to react, not originate.

The goal is not a plan. It is a **shared design concept**: you and the agent on the same wavelength before a single line of code is written.

This is always human-in-the-loop. It cannot be looped or automated. It can last 40–100 questions.

**Prompt example:** [`prompts/01-grill-me.md`](prompts/01-grill-me.md)

---

### Step 3 — Write PRD

**Skill:** `/write-prd`

After the grill session, synthesize the shared design concept into a **destination document**: a PRD. The skill reads what was already discussed — it does **not** re-interview you.

Before writing the PRD, it first proposes the **seams**: the integration points where tests will cross. You review and approve those before anything is written down.

You don't need to read the final PRD carefully. You already reached alignment during the grill. The PRD is for the agent's benefit in future sessions — don't let it rot in your repo.

**Prompt example:** [`prompts/02-write-prd.md`](prompts/02-write-prd.md)

**Output:** `issues/prd-[feature].md`

---

### Step 4 — PRD to Issues

**Skill:** `/prd-to-issues`

Break the PRD into independently-grabbable issues organized as a **Kanban board** with explicit blocking relationships. Each issue is a local markdown file.

The key rule: use **vertical slices** (traceable bullets), not horizontal layers. A horizontal slice implements the full database layer first, then the full API layer, then the UI — giving you zero feedback until phase three. A vertical slice cuts through all layers for one user story at a time, giving you something testable at the end of every issue.

Issues are tagged `AFK` (agent can work unattended) or `HUMAN` (needs a person). The agent only picks up `AFK` issues in the Ralph loop.

**Prompt example:** [`prompts/03-prd-to-issues.md`](prompts/03-prd-to-issues.md)

**Output:** `issues/[n]-[slug].md` files with blocking relationships

---

### Step 5 — Ralph Loop (AFK implementation)

**Script:** `scripts/ralph-once.sh` — or interactively: `/implement`

Clear context. Run the script. Walk away.

The script concatenates all issue files and the last few git commits, then passes them to Claude with a prompt that tells it to pick the next unblocked AFK task, implement it with `/tdd` (red → green → refactor), run feedback loops (`npm test && npm run typecheck`), mark the task done, and then run `/code-review` on its own work before committing.

Run `ralph-once.sh` manually first to observe how the agent behaves before looping it.

**Prompt example:** [`prompts/04-ralph-loop.md`](prompts/04-ralph-loop.md)

**Script:** [`scripts/ralph-once.sh`](scripts/ralph-once.sh)

---

### Step 6 — QA & Code Review

Back to human-in-the-loop.

QA is how you impose your taste on the codebase. It is also how new issues get added to the Kanban board — bugs found during QA become new tickets for the next Ralph loop.

Code review: check tests first, then implementation. The reviewer should have coding standards **pushed** to it (not available only on pull).

**Prompt example:** [`prompts/05-qa-review.md`](prompts/05-qa-review.md)

---

## Extra: Codebase design (deep modules)

**Skill:** `/codebase-design`

AI produces shallow modules by default — many small files with tangled dependencies that are hard to test. The `/codebase-design` skill provides shared vocabulary and principles for designing **deep modules**: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface.

Use it when designing a new module, deciding where a seam goes, or when the agent is struggling to navigate an existing codebase cleanly.

**Prompt example:** [`prompts/extras/improve-architecture.md`](prompts/extras/improve-architecture.md)

---

## Quick reference

| Step | Skill / Script | Task type | Prompt file |
|---|---|---|---|
| 1 — Brief | — | Human | [`client-brief.md`](client-brief.md) |
| 2 — Grill Me | `/grill-me` | Human in loop | [`01-grill-me.md`](prompts/01-grill-me.md) |
| 3 — Write PRD | `/write-prd` | Human in loop | [`02-write-prd.md`](prompts/02-write-prd.md) |
| 4 — Issues | `/prd-to-issues` | Human reviews | [`03-prd-to-issues.md`](prompts/03-prd-to-issues.md) |
| 5 — Ralph | `ralph-once.sh` | **AFK** | [`04-ralph-loop.md`](prompts/04-ralph-loop.md) |
| 6 — QA | — | Human | [`05-qa-review.md`](prompts/05-qa-review.md) |
| Extra | `/codebase-design` | Human reviews | [`improve-architecture.md`](prompts/extras/improve-architecture.md) |

---

## Key books referenced in the workshop

- *The Design of Design* — Frederick P. Brooks (design concept)
- *The Pragmatic Programmer* — Hunt & Thomas (traceable bullets / vertical slices)
- *A Philosophy of Software Design* — John Ousterhout (deep vs. shallow modules)
- *Refactoring* — Martin Fowler (keep tasks small)
