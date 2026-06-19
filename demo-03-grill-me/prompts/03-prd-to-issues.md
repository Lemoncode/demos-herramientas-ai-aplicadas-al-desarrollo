# Step 4 — PRD to Issues

**Skill:** `/prd-to-issues`

Break the PRD into independently-grabbable issues structured as a **Kanban board** with explicit blocking relationships. Each issue becomes a local markdown file in `issues/`. This is still human-reviewed — you approve the slice structure before anything is implemented.

---

## Prompt

```
/prd-to-issues issues/prd-gamification.md
```

---

## The critical rule: vertical slices, not horizontal layers

**Horizontal (wrong):**
- Phase 1: all database schema changes
- Phase 2: all service logic
- Phase 3: all UI changes

No feedback until phase 3. The agent codes blind for two entire phases.

**Vertical (right):**
- Issue 1: schema + GamificationService + points visible on dashboard (one complete slice through all layers)
- Issue 2: streak counter + streak visible on dashboard
- Issue 3: retroactive backfill migration

Each issue delivers something you can open in a browser and QA immediately. This is the **traceable bullet** principle from The Pragmatic Programmer — you fire a phosphorescent round so you can see where it lands.

---

## What good issues look like

Each issue file contains:

```md
# Issue 02: Streak tracking

**Type:** AFK
**Blocked by:** Issue 01 (GamificationService must exist)

## Goal
Students can see their current streak on the dashboard.
A streak increments when a student completes any lesson on a new calendar day.

## Acceptance criteria
- Completing a lesson today when the last completion was yesterday increments streak by 1
- Completing a lesson twice in one day does not increment streak
- Dashboard shows current streak count
- Streak is tested in GamificationService unit tests

## Modules touched
- MODIFY: GamificationService — add streak logic
- MODIFY: DashboardRoute — read streak from GamificationService
```

---

## Issue types

| Tag | Meaning |
|---|---|
| `AFK` | Agent picks this up in the Ralph loop — no human needed |
| `HUMAN` | Requires a decision, design input, or external dependency |

The Ralph loop only picks up `AFK` issues. `HUMAN` issues stay on the board until you action them yourself.

---

## Reviewing the Kanban board

Before handing off to the Ralph loop, eyeball the issue set and ask:

1. **Is the first issue a vertical slice?** It should touch schema, service, and UI. If it only touches one layer, it's horizontal — push back.
2. **Are blocking relationships correct?** Can issue 2 really start before issue 1 is done?
3. **Is anything missing from the PRD?** The out-of-scope list should map to nothing in the issues.

If you find a problem, say so directly: "The first slice is too horizontal — it only creates the service with no visible output." The agent will revise.

---

## Resulting file structure

```
issues/
├── prd-gamification.md           ← destination document (delete after ship)
├── 01-gamification-foundation.md ← AFK, blocked by: nothing
├── 02-streak-tracking.md         ← AFK, blocked by: 01
├── 03-retroactive-backfill.md    ← AFK, blocked by: 01
└── 04-level-ui-polish.md         ← AFK, blocked by: 01, 02, 03
```

The blocking graph is a directed acyclic graph (DAG). Issues with no shared blocking can run in parallel (advanced — see Sandcastle in the extras).
