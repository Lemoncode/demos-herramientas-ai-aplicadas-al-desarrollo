# Backlog — Team Directory

Five open tickets against the Team Directory page (`src/components/directory/`). Use `fix-backlog` to dispatch one Fix Subagent per ticket, then review, then ship.

Most tickets are scoped to a file no other ticket touches, so they're trivially safe to fix in parallel. **B1 and B5 are the exception, on purpose** — both own `DirectoryList.tsx`. They're still dispatched into separate git worktrees, same as every other ticket, so the two Fix Subagents never see each other's in-progress edits while working. That's what worktree isolation actually buys you: it doesn't need every ticket to be file-exclusive to be safe, it just needs every ticket to get its own checkout. The one thing it doesn't remove is a normal merge conflict between the two resulting PRs — whichever merges second will show one on GitHub, same as if two engineers had touched the same file. That's expected, not a failure of the demo.

---

## B1 — Message button has no meaningful accessible name

**File:** `src/components/directory/DirectoryList.tsx`

**Current behavior:** Each row renders a "message this person" button whose only content is the symbol `✉`. It passes lint (it has visible text content, so no static a11y rule fires), but a screen reader announces an ambiguous glyph instead of who the button messages.

**Acceptance criteria:**
- The button has an accessible name that includes the person's name, e.g. `aria-label={\`Message ${person.name}\`}`.
- `DirectoryList.test.tsx` gains a test that queries the button via `getByRole('button', { name: /message marta alonso/i })` and asserts it exists.
- No change to `PersonRow.tsx` or `StatusBadge.tsx`. **Note:** ticket B5 also owns `DirectoryList.tsx` — that's intentional (see the note at the top of this file). Don't touch B5's part of the file (the empty-state / live-region area); stay focused on the message button.

---

## B2 — Tenure label is wrong for people who haven't hit their join-date anniversary yet

**File:** `src/components/directory/PersonRow.tsx`

**Current behavior:** `tenureLabel` computes `now.getFullYear() - joined.getFullYear()`, ignoring month/day. For someone who joined `2023-12-01`, evaluated on `2026-09-22`, this reports "Joined 3 years ago" — but their third anniversary isn't until December 2026, so the correct label is "Joined 2 years ago". The existing test in `PersonRow.test.tsx` currently asserts the wrong (buggy) value — it was written to match the bug, not to match reality.

**Acceptance criteria:**
- `tenureLabel('2023-12-01', new Date('2026-09-22'))` returns `'Joined 2 years ago'`.
- The anniversary-not-yet-reached case is handled generally (compare month, and day when the month is equal), not just for this one example.
- Update the existing test in `PersonRow.test.tsx` to assert the corrected value — don't leave the old wrong assertion in place.
- No change to `DirectoryList.tsx` or `DirectorySearch.tsx`.

---

## B3 — Search re-filters the full roster on every render

**File:** `src/components/directory/DirectorySearch.tsx`

**Current behavior:** The filtered list is recomputed on every render (a new lowercase string per person, a new array) with no memoization, even on renders where `query` hasn't changed. Functionally the search still works — this is a performance ticket, not a correctness one — but it does unnecessary work and causes `DirectoryList` to re-render in full on every keystroke.

**Acceptance criteria:**
- Wrap the filtering in `useMemo`, keyed on `query` (and `people`, since it's referenced), per the `vercel-react-best-practices` skill's guidance on avoiding uncached recomputation.
- The existing behavioral test in `DirectorySearch.test.tsx` (typing "marta" narrows the list) still passes.
- No change to `DirectoryList.tsx` or `PersonRow.tsx`.

---

## B4 — StatusBadge has no test coverage

**File:** `src/components/directory/StatusBadge.tsx`

**Current behavior:** The component itself is correct — it renders a color dot plus a visible text label for both `active` and `on-leave` — but it shipped without a colocated test file, which violates this repo's own component rule (`.claude/rules/components.md`: "Every component file must have a colocated test file").

**Acceptance criteria:**
- Add `StatusBadge.test.tsx` asserting the visible text for both `active` ("Active") and `on-leave` ("On leave").
- Do not change `StatusBadge.tsx`'s behavior — this ticket is coverage-only.
- No change to any other file in `src/components/directory/`.

---

## B5 — Filtered result count isn't announced to screen reader users

**File:** `src/components/directory/DirectoryList.tsx`

**Current behavior:** When the search box above narrows or widens the roster, sighted users see the list change instantly. Nothing is announced to screen reader users — there's no `aria-live` region, so someone using assistive tech gets no signal that the result count changed unless they re-explore the list manually. This applies to both the populated list and the "No teammates match your search." empty state.

**Note:** this ticket shares `DirectoryList.tsx` with ticket B1 — deliberately, see the note at the top of this file. Stay focused on the live-region behavior; don't touch B1's message-button code.

**Acceptance criteria:**
- Add a region with `aria-live="polite"` (e.g. a `<p role="status">`) that announces the result count whenever the `people` prop changes — something like "8 teammates found", "1 teammate found", or "No teammates match your search."
- `DirectoryList.test.tsx` gains a test asserting the announcement text updates as the `people` prop changes.
- No change to `PersonRow.tsx` or `StatusBadge.tsx`.

---

## Constraints (every Fix Subagent must respect)

- Touch only the one file named in your ticket, plus its colocated test file.
- Do not edit `people.ts` — it's shared data, not owned by any single ticket.
- Do not edit another ticket's file, even if you notice something wrong there — file a note in your return contract instead. This includes B1/B5: even though you share a file, only touch the part of it your own ticket describes.
- `npm run typecheck && npm run lint && npm test` must all exit 0 before you commit.
