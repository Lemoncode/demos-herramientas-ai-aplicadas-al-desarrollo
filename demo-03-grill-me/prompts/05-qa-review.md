# Step 6 — QA & Code Review

Back to human-in-the-loop. This is how you impose your taste on the codebase.

QA is not optional automation bait. It is the phase where you find things the agent got technically right but experientially wrong — confusing UX, off-brand visuals, flows that work but feel wrong. No amount of prompting replaces a human clicking through the feature.

---

## QA

Run the app and walk through every acceptance criterion in the issue files.

```bash
npm run dev
```

For each issue marked `[DONE]`:
- Open the browser
- Complete the user story manually
- Look for: wrong behaviour, missing edge cases, broken layout, off-brand wording

When you find a problem, **do not fix it directly**. Write a new issue file:

```md
# Issue 05: Fix streak display when streak is 0

**Type:** AFK
**Blocked by:** nothing

## Problem
When a student has no streak, the dashboard shows "0 days" which reads awkwardly.
Should show "Start your streak today!" instead.

## Acceptance criteria
- Dashboard shows "Start your streak today!" when streak count is 0
- Dashboard shows "X day streak" when streak > 0
```

Add it to `issues/`. It goes into the next Ralph loop. QA creates the backlog; implementation drains it.

---

## Code review

Review tests first, then implementation. In that order.

**Tests:**
- Does the test describe real user behaviour, or is it testing implementation details?
- Would this test catch a regression if someone rewrote the internals?
- Is the test boundary drawn at the module level (integration) or around tiny functions (unit soup)?

**Implementation:**
- Does the new code belong in an existing deep module, or did the agent create a new shallow one?
- Are there magic numbers or hardcoded strings that should be constants?
- Does the code read clearly, or did the agent over-engineer a simple problem?

---

## Push coding standards to the reviewer

The agent's implementer should be able to **pull** coding standards (a skill it reads when relevant). The reviewer should have standards **pushed** to it — included directly in the prompt.

```
Review the diff on branch feat/gamification against these standards:

[paste your coding standards here]

Check tests first. Report: test quality, any standard violations, anything that
looks fragile. Do not rewrite code — flag findings only.
```

Run this in a fresh context (clear first) so the reviewer operates in the smart zone, not the dumb zone left over from implementation.

---

## After QA

- Issues found → new `issues/` files → next Ralph loop
- All acceptance criteria pass → mark the PRD issue closed
- Delete `issues/prd-gamification.md` — it has served its purpose and will cause doc rot if left
- Share the branch with your team for a full review when you are happy with the output
