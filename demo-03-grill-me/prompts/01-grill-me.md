# Step 2 — Grill Me

**Skill:** `/grill-me`

The grilling session is the alignment phase. The AI explores the codebase via a sub-agent (burns tokens in an isolated context window, then reports a summary back), then interviews you one question at a time with a recommended answer included.

Your job: react, redirect, or accept. You don't need to originate ideas.

---

## What the skill does

```
"Interview me relentlessly about every aspect of this plan until we reach
a shared understanding. Walk down each branch of the decision tree,
resolving dependencies one by one. For each question, provide your
recommended answer. Ask questions one at a time."
```

The session ends when you have a shared design concept — not when a plan is produced. This is the difference: a plan is a document; a design concept is a state of alignment between you and the agent.

---

## Prompt

```
/grill-me client-brief.md
```

If you want to pass the brief inline:

```
/grill-me

Here is the brief:
[paste content of client-brief.md]
```

---

## What happens first

The skill dispatches a sub-agent to explore the codebase. The sub-agent runs in an isolated context window — it can burn 90K tokens exploring without touching your session's smart zone. It reports a summary back. Your token counter barely moves.

Only after the exploration does the first question arrive.

---

## Example questions and how to respond

> **Points economy.** What actions earn points and how much?
> *Recommendation: keep it simple — lesson completion and quiz passing to start. Skip video-watch events; they are noisy and gameable.*

→ Accept, redirect, or add constraints: "Agreed — skip video events. Sarah mentioned streaks too, include those."

---

> **Should points be retroactive?** There are existing lesson-progress records with completion timestamps.
> *Recommendation: yes — backfill on first login so early adopters don't feel penalized.*

→ This is exactly the kind of question Sarah didn't consider. Answer it now or it will become a production decision.

---

> **Levels.** What is the progression curve?
> *Recommendation: logarithmic — fast early levels to hook new users, slower later to reward long-term engagement.*

→ "Use the recommendation."

---

## Tips

- **Watch your token counter.** The grill session should stay well inside the smart zone. If you are approaching 80K tokens, wrap up and move to the PRD.
- **You can ask it questions too.** "What does the existing progress model look like?" — it has already explored the repo and can answer.
- **If it's asking too fast,** tell it to slow down or ask it to batch its remaining questions into a list so you can scan them.
- **If you want to end early,** say "Give me a long list of your remaining recommendations so I can approve them at once." It will batch everything and you can move on.

---

## What you end up with

~25K tokens of conversation that is the design concept. This conversation history is the asset. The PRD is just a summary of it.

You cannot Ralph-loop this phase. It is irreducibly human-in-the-loop.
