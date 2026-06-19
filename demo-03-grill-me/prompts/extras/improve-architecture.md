# Extra — Codebase Design (Deep Modules)

**Skill:** `/codebase-design`

Use when designing a new module, deciding where a seam goes, or when the agent is struggling to make clean changes in an existing codebase.

---

## The problem: shallow modules

Left unguided, agents produce **shallow modules** — many small files where the interface is nearly as complex as the implementation. Testing requires mocking everything. The agent has to traverse the whole dependency graph to understand any single change.

**Deep modules** are the opposite: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface.

---

## Prompt

```
/codebase-design
```

Then describe what you want to design or improve:

```
/codebase-design

I need to add a GamificationService. It should own all points, streaks, and
level logic. Help me design the interface before we implement it.
```

Or to find deepening opportunities in an existing codebase:

```
/codebase-design

The quiz-related code feels tangled. There are four small files that all
call each other. Help me find a better seam and consolidate them.
```

---

## Key vocabulary the skill uses

| Term | Meaning |
|---|---|
| **Module** | Anything with an interface and an implementation (function, class, package, tier-spanning slice) |
| **Interface** | Everything a caller must know: type signature, invariants, error modes, ordering constraints |
| **Depth** | Amount of behaviour a caller can exercise per unit of interface they have to learn |
| **Seam** | Where you can alter behaviour without editing in that place — where the interface lives |
| **Shallow module** | Large interface, thin implementation. Avoid. |
| **Deep module** | Small interface, rich implementation. Aim for this. |

---

## How to spot shallow modules

- Four files that are only ever called together → candidate for consolidation
- A module that just passes through to another module → the seam is in the wrong place
- Zero tests on a module with meaningful logic → no test boundary was designed
- Agent keeps making changes in five places for one feature → modules are too granular

---

## Designing for testability

The interface is the test surface. Callers and tests cross the same seam. When you design a deep module:

1. **Accept dependencies, don't create them** — pass `db` as an argument rather than instantiating it inside
2. **Return results, don't produce side effects** — `calculatePoints(event)` instead of `applyPoints(event)` that mutates in place
3. **Small surface area** — fewer methods means fewer tests needed

---

## The mental model for staying oriented as the codebase grows

> "Design the interface for the module, delegate the implementation."

You need to know the shape of your modules — what they do, how they behave under certain conditions — but you can delegate the internals to the agent. This is how you keep your mental model of the codebase intact while moving fast: you own the interfaces, the agent owns the implementations.

---

## When to create an issue for this

If `/codebase-design` surfaces a consolidation opportunity, create an `AFK` issue for it and let the Ralph loop do the refactor:

```md
# Issue N: Consolidate quiz scoring into QuizScoringService

**Type:** AFK
**Blocked by:** nothing

## Goal
Merge quiz-scorer.ts, question-evaluator.ts, answer-normalizer.ts into a single
QuizScoringService with a score(answers, questions) interface. Zero existing tests
— add a test suite at the new seam.

## Acceptance criteria
- [ ] Single QuizScoringService module with score() as the public interface
- [ ] Old files deleted
- [ ] Integration tests pass through score() without mocking internals
- [ ] npm test passes

## Modules touched
- NEW: QuizScoringService
- DELETE: quiz-scorer.ts, question-evaluator.ts, answer-normalizer.ts
```
