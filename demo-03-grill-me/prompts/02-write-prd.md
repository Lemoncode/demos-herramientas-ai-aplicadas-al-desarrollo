# Step 3 — Write PRD

**Skill:** `/write-prd`

Run this in the same session, immediately after the grill ends. The skill reads what you have already discussed — it does **not** re-interview you. It synthesizes.

---

## Prompt

```
/write-prd
```

No arguments. The grill conversation is already in context.

---

## What the skill does first: propose seams

Before writing anything, it sketches the **seams** — the integration points where tests will cross the feature. It prefers existing seams over new ones, and the highest possible seam (fewest seams across the codebase is ideal).

Example output at this step:

```
Proposed seams:

1. GamificationService public interface — all points/streaks/levels logic sits behind
   a single module. Tests call this interface directly without mocking internals.
   Prior art: ProgressService in services/progress.ts follows the same pattern.

Do these seams match your expectations?
```

You review and approve before the PRD is written. This is the only moment of back-and-forth in this skill.

---

## PRD template (what it produces)

Saved as `issues/prd-[feature-name].md`:

```md
## Problem Statement
The problem the user is facing, from the user's perspective.

## Solution
The solution to the problem, from the user's perspective.

## User Stories
A long, numbered list. Each in the format:
  As a <actor>, I want <feature>, so that <benefit>

This list should be extensive — cover all aspects of the feature.

## Implementation Decisions
- Modules that will be built or modified
- Interfaces of those modules
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include file paths or code snippets (they go stale fast).
Exception: if a prototype produced a snippet that encodes a decision more precisely
than prose, inline it and note it came from a prototype.

## Testing Decisions
- What makes a good test (test external behaviour, not implementation details)
- Which modules will be tested
- Prior art for tests (similar test patterns already in the codebase)

## Out of Scope
Everything this PRD explicitly does NOT address.
This is the definition of done.

## Further Notes
Anything else worth capturing.
```

---

## Should you read it carefully?

**No.** You already reached alignment during the grill. The PRD is the agent's reference for future sessions. LLMs are excellent at summarisation — trust that.

What to check: is the **Out of Scope** section accurate? That list is your definition of done. If it's wrong, fix it.

---

## After the PRD is saved

Clear context. The grill conversation has served its purpose. Open a new session and run `/prd-to-issues`.

**Delete the PRD after the feature ships.** Stale PRDs cause doc rot — the agent finds them in future sessions and treats old requirements as live. Mark the issue closed or delete the file.
