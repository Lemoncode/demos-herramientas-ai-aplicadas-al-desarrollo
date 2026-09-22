// ===========================================================================
// EDUCATIONAL SAMPLE APP - THIS FOLDER HAS DELIBERATE, PLANTED GAPS.
//
// src/components/directory/ ships four real, independent issues — one per
// file — used as the backlog for the fix-backlog demo. See docs/backlog.md
// for the ticket describing each one. Do not fix them by hand: they exist so
// a Fix Subagent can pick them up.
// ===========================================================================
//
// Ticket B4 (test gap): this component's behavior is correct, but it has no
// colocated StatusBadge.test.tsx — it shipped without coverage.

import type { PersonStatus } from './people'

const STATUS_LABEL: Record<PersonStatus, string> = {
  active: 'Active',
  'on-leave': 'On leave',
}

const STATUS_COLOR: Record<PersonStatus, string> = {
  active: '#1a7f37',
  'on-leave': '#9a6700',
}

interface StatusBadgeProps {
  status: PersonStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="status-badge">
      <span
        aria-hidden="true"
        className="status-dot"
        style={{ backgroundColor: STATUS_COLOR[status] }}
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
