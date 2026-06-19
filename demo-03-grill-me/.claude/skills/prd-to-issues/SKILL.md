---
name: prd-to-issues
description: Break a plan, spec, or PRD into independently-grabbable issue files in issues/ using tracer-bullet vertical slices.
disable-model-invocation: true
---

# PRD to Issues

Break a plan into independently-grabbable issues using vertical slices (tracer bullets), saved as local markdown files in `issues/`.

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes a file path as an argument, read it.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the plan into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

<vertical-slice-rules>

- Each slice delivers a narrow but COMPLETE path through every layer (schema, service, UI, tests)
- A completed slice is demoable or verifiable on its own
- Any prefactoring should be done first

</vertical-slice-rules>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: `AFK` (agent can implement) or `HUMAN` (requires human decision/input)
- **Blocked by**: which other slices (if any) must complete first

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?

Iterate until the user approves the breakdown.

### 5. Write the issue files

For each approved slice, create a new file at `issues/[number]-[short-name].md`. Write them in dependency order (blockers first).

<issue-template>
# Issue [N]: [Title]

**Type:** [AFK | HUMAN]
**Blocked by:** [Issue N (reason) | nothing]

## Goal

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Modules touched

- NEW: ModuleName — description
- MODIFY: ModuleName — description
</issue-template>

## Issue types

| Tag | Meaning |
|---|---|
| `AFK` | Agent picks this up in the Ralph loop — no human needed |
| `HUMAN` | Requires a decision, design input, or external dependency |

The Ralph loop (`scripts/ralph-once.sh`) only picks up `AFK` issues.
