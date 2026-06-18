# demo-02-spec-kit

A hands-on walkthrough of [Spec-Driven Development](https://github.com/github/spec-kit) using the **Spec Kit** toolkit from GitHub. Specifications are the primary artifact; code is their generated expression.

---

## What is Spec Kit?

Spec Kit inverts traditional software development: instead of writing code and attaching documentation after the fact, you write precise specifications first and let an AI coding agent (Claude, Copilot, Gemini…) generate implementations from them. The spec is always the source of truth.

---

## Installation

```bash
# One-shot (no persistent install)
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>

# Or install persistently
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init <PROJECT_NAME>
```

**Prerequisites:** Python 3.11+, Git, [uv](https://docs.astral.sh/uv/)

After `specify init`, the project gets a `.specify/` folder with memory, scripts, and templates, plus an empty `specs/` folder ready for features.

---

## The workflow

```
Constitution → Specify → Clarify → Checklist → Plan → Tasks → Analyze → Implement
```

For quick experiments, use the **lean path** (skip Clarify, Checklist, and Analyze):

```
Constitution → Specify → Plan → Tasks → Implement
```

---

## Step-by-step guide

### Step 1 — Constitution

Establish the project's immutable principles before writing a single spec. This runs once per project and produces `.specify/memory/constitution.md`.

**Command:** `/speckit.constitution`

**Prompt example:** [`prompts/01-constitution.md`](prompts/01-constitution.md)

**Output:** `.specify/memory/constitution.md`

---

### Step 2 — Specify

Describe what to build — focusing on *what* and *why*, not how. The agent creates a numbered feature spec with user stories and acceptance criteria.

**Command:** `/speckit.specify`

**Prompt example:** [`prompts/02-specify.md`](prompts/02-specify.md)

**Output:** `specs/[feature-id]/spec.md`

---

### Step 3 — Clarify *(full path only)*

Before planning, surface and resolve every ambiguity in the spec. The agent asks targeted questions and writes answers into a Clarifications section.

**Command:** `/speckit.clarify`

**Prompt example:** [`prompts/03-clarify.md`](prompts/03-clarify.md)

**Output:** Updated `specs/[feature-id]/spec.md` with a Clarifications section

---

### Step 4 — Checklist *(full path only)*

Validate that the spec meets quality standards before any technical work begins. Catches missing acceptance criteria, vague requirements, and untestable stories.

**Command:** `/speckit.checklist`

**Prompt example:** [`prompts/04-checklist.md`](prompts/04-checklist.md)

**Output:** Quality report; spec updated where gaps are found

---

### Step 5 — Plan

Translate the spec into a concrete technical plan: stack choices, architecture, data models, API contracts, and a quickstart guide. This is where technology decisions are first made.

**Command:** `/speckit.plan`

**Prompt example:** [`prompts/05-plan.md`](prompts/05-plan.md)

**Output:**
- `specs/[feature-id]/plan.md`
- `specs/[feature-id]/data-model.md`
- `specs/[feature-id]/api-spec.json`
- `specs/[feature-id]/research.md`
- `specs/[feature-id]/quickstart.md`

---

### Step 6 — Tasks

Break the plan into an ordered, executable task list. Parallel tasks are marked `[P]`. Tasks map directly to user stories and respect dependencies.

**Command:** `/speckit.tasks`

**Prompt example:** [`prompts/06-tasks.md`](prompts/06-tasks.md)

**Output:** `specs/[feature-id]/tasks.md`

---

### Step 7 — Analyze *(full path only)*

Cross-check spec, plan, and tasks for consistency before coding starts. Catches missing pieces, incomplete sequences, and over-engineered components.

**Command:** `/speckit.analyze`

**Prompt example:** [`prompts/07-analyze.md`](prompts/07-analyze.md)

**Output:** Consistency report; artifacts updated where gaps are found

---

### Step 8 — Implement

Execute the task list. The agent works through `tasks.md` in dependency order, writing tests first, then implementation, respecting the constitution throughout.

**Command:** `/speckit.implement`

**Prompt example:** [`prompts/08-implement.md`](prompts/08-implement.md)

**Output:** Working code, passing tests

---

## File structure after init

```
project-root/
├── .specify/
│   ├── memory/
│   │   └── constitution.md          ← project principles (Step 1)
│   ├── scripts/bash/
│   │   ├── check-prerequisites.sh
│   │   ├── create-new-feature.sh
│   │   ├── setup-plan.sh
│   │   └── setup-tasks.sh
│   └── templates/
│       ├── spec-template.md
│       ├── plan-template.md
│       └── tasks-template.md
└── specs/
    └── [feature-id]/
        ├── spec.md                  ← Step 2
        ├── plan.md                  ← Step 5
        ├── tasks.md                 ← Step 6
        ├── data-model.md            ← Step 5
        ├── api-spec.json            ← Step 5
        ├── research.md              ← Step 5
        └── quickstart.md            ← Step 5
```

---

## Quick reference

| Step | Command | Path | Prompt file |
|---|---|---|---|
| 1 — Constitution | `/speckit.constitution` | Full + Lean | [`01-constitution.md`](prompts/01-constitution.md) |
| 2 — Specify | `/speckit.specify` | Full + Lean | [`02-specify.md`](prompts/02-specify.md) |
| 3 — Clarify | `/speckit.clarify` | Full only | [`03-clarify.md`](prompts/03-clarify.md) |
| 4 — Checklist | `/speckit.checklist` | Full only | [`04-checklist.md`](prompts/04-checklist.md) |
| 5 — Plan | `/speckit.plan` | Full + Lean | [`05-plan.md`](prompts/05-plan.md) |
| 6 — Tasks | `/speckit.tasks` | Full + Lean | [`06-tasks.md`](prompts/06-tasks.md) |
| 7 — Analyze | `/speckit.analyze` | Full only | [`07-analyze.md`](prompts/07-analyze.md) |
| 8 — Implement | `/speckit.implement` | Full + Lean | [`08-implement.md`](prompts/08-implement.md) |
