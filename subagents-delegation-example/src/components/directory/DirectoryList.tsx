// ===========================================================================
// EDUCATIONAL SAMPLE APP - THIS FOLDER HAS DELIBERATE, PLANTED GAPS.
//
// src/components/directory/ ships five real, independent issues used as the
// backlog for the fix-backlog demo. See docs/backlog.md for the ticket
// describing each one. Do not fix them by hand: they exist so a Fix Subagent
// can pick them up.
//
// This file carries two of them — B1 and B5 — on purpose. Most tickets own a
// file no other ticket touches; these two deliberately don't, to demonstrate
// why the Fix phase dispatches each ticket into its own git worktree: two
// Fix Subagents editing this file at the same time never see each other's
// in-progress changes, because each has an independent checkout. Their two
// PRs will still both touch this file, though — that's a normal merge
// concern for whoever merges second, not something worktree isolation
// removes.
// ===========================================================================
//
// Ticket B1 (accessibility): marked below.
// Ticket B5 (accessibility): marked below.

import { PersonRow } from './PersonRow'
import { StatusBadge } from './StatusBadge'
import type { Person } from './people'

interface DirectoryListProps {
  people: Person[]
  onMessage: (personId: string) => void
}

export function DirectoryList({ people, onMessage }: DirectoryListProps) {
  // Issue (Accessibility, ticket B5): when the search above narrows or
  // widens this list, sighted users see it change instantly, but nothing
  // here is announced to screen reader users — there's no aria-live region,
  // so someone using assistive tech gets no signal that the result count
  // changed unless they re-explore the DOM. Both branches below need it.
  if (people.length === 0) {
    return <p>No teammates match your search.</p>
  }

  return (
    <ul className="directory-list">
      {people.map((person) => (
        <li key={person.id}>
          <PersonRow person={person} />
          <StatusBadge status={person.status} />
          {/* Issue (Accessibility, ticket B1): icon-only button. The visible
              content is a symbol, not a real accessible name — screen
              reader users hear an ambiguous glyph instead of "Message
              Marta Alonso". */}
          <button onClick={() => onMessage(person.id)}>✉</button>
        </li>
      ))}
    </ul>
  )
}
