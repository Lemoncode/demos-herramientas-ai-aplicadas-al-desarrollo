# Step 5 — Ralph Loop (AFK Implementation)

**Script:** `scripts/ralph-once.sh`

Clear context. Run the script. Walk away.

The Ralph loop is the AFK phase. The human is out of the picture. The agent reads the issue backlog, picks the next unblocked AFK task, implements it with TDD, runs feedback loops, and marks it done. Then `ralph-once.sh` is called again.

---

## How the script works

```bash
# scripts/ralph-once.sh
ISSUES=$(cat issues/*.md)
COMMITS=$(git log --oneline -5)
PROMPT=$(cat scripts/ralph-prompt.md)

claude --permission-mode acceptEdits -p "$PROMPT

## Current issues
$ISSUES

## Recent commits
$COMMITS
"
```

Three things go into the context:
1. **All issue files** — the full backlog the agent can reason about
2. **Last 5 commits** — so it knows what was recently completed without reading the whole git log
3. **The Ralph prompt** — the instructions for how to pick and execute a task

---

## The Ralph prompt (scripts/ralph-prompt.md)

```md
You are an AFK implementer. Local issue files are provided above.

Work on AFK issues only. If all AFK tasks are complete, output exactly:
NO MORE TASKS

Pick the next task using this priority:
1. Critical bug fixes
2. Development infrastructure (migrations, schema)
3. Traceable bullets — the first vertical slice that produces visible output
4. Subsequent vertical slices in dependency order
5. Polish, quick wins, refactors

For each task:
1. Explore the relevant parts of the repo (use a sub-agent)
2. Use TDD — write a failing test first, confirm it fails, then implement
3. Run feedback loops: npm test && npm run typecheck
4. Fix any errors before moving on
5. Mark the issue file [DONE] and commit

Do not ask for permission. Do not pause for approval. Work through it.
```

---

## Running it manually first

Run `ralph-once.sh` once and watch what happens before looping it:

```bash
bash scripts/ralph-once.sh
```

This lets you:
- See which task the agent picks and whether the prioritisation makes sense
- Check that TDD is actually being followed (failing test before implementation)
- Catch prompt problems before committing to a long unattended run

Once you trust the output, loop it:

```bash
while true; do
  bash scripts/ralph-once.sh
  if grep -q "NO MORE TASKS" /tmp/ralph-output.txt; then break; fi
done
```

---

## What TDD looks like inside the Ralph loop

```
▶ Picking task: Issue 01 — GamificationService foundation

  Exploring repo... (sub-agent, isolated context)

  Writing failing test:
    gamification.test.ts — "awards 10 points on lesson completion"
  Running: npm test
  ✅ FAILS — GamificationService does not exist yet

  Writing implementation:
    services/gamification.ts — GamificationService class

  Running: npm test
  ✅ PASSES

  Running: npm run typecheck
  ✅ 0 errors

  Committing: feat(gamification): add GamificationService with lesson points
  Marking issue 01 [DONE]
```

---

## Feedback loops are the quality ceiling

> "If your codebase doesn't have feedback loops, you're never going to get decent output out of AI. The quality of your feedback loops is the ceiling."

The two essential loops are:
- `npm test` — catches logic errors and regressions
- `npm run typecheck` — catches type errors the agent introduced

If the agent is producing bad code, the first question is: what do the feedback loops look like? Improving tests improves agent output more reliably than improving prompts.

---

## Reviewing in the smart zone

Do not ask the agent to review its own code at the end of the implementation session — it will be reviewing from the dumb zone (high token count). Instead:

1. Let the Ralph loop finish
2. Clear context
3. Run a fresh review session with coding standards **pushed** to the reviewer (not just available to pull)

```
Review the commits on this branch against our coding standards:
[paste standards here]

Focus on: tests first (are they testing real behaviour?), then implementation.
```

Fresh context = smart zone reviewer smarter than the dumb zone implementer.
