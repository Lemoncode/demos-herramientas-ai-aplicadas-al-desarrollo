// ===========================================================================
// EDUCATIONAL SAMPLE APP - THIS FOLDER HAS DELIBERATE, PLANTED GAPS.
//
// src/components/directory/ ships four real, independent issues — one per
// file — used as the backlog for the fix-backlog demo. See docs/backlog.md
// for the ticket describing each one. Do not fix them by hand: they exist so
// a Fix Subagent can pick them up.
// ===========================================================================
//
// Ticket B2 (correctness): tenureLabel below computes elapsed years from the
// join date and today's date. Marked below.

import type { Person } from './people'

export function tenureLabel(joinedDate: string, now: Date = new Date()): string {
  const joined = new Date(joinedDate)

  // Issue (Correctness): subtracting calendar years ignores whether the
  // join-date anniversary has actually occurred yet this year. Someone who
  // joined 2023-12-01, evaluated on 2026-09-22, has completed 2 full years —
  // this reports 3, because 2026 - 2023 = 3 regardless of month/day.
  const years = now.getFullYear() - joined.getFullYear()

  if (years < 1) {
    return 'Joined this year'
  }
  return `Joined ${years} year${years === 1 ? '' : 's'} ago`
}

interface PersonRowProps {
  person: Person
}

export function PersonRow({ person }: PersonRowProps) {
  return (
    <div className="person-row">
      <span className="person-name">{person.name}</span>
      <span className="person-role">{person.role}</span>
      <span className="person-tenure">{tenureLabel(person.joinedDate)}</span>
    </div>
  )
}
