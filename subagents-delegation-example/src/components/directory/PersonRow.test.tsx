import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PersonRow, tenureLabel } from './PersonRow'
import type { Person } from './people'

const person: Person = {
  id: 'p1',
  name: 'Marta Alonso',
  role: 'Backend Engineer',
  status: 'active',
  joinedDate: '2023-12-01',
}

describe('PersonRow', () => {
  it('renders the name and role', () => {
    render(<PersonRow person={person} />)
    expect(screen.getByText('Marta Alonso')).toBeInTheDocument()
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
  })

  // This assertion currently passes, but it locks in the ticket B2 bug: as
  // of 2026-09-22, Marta joined on 2023-12-01, so she has completed 2 full
  // years, not 3 — her anniversary hasn't happened yet this year. See
  // docs/backlog.md ticket B2 for the correct expected value.
  it('shows a tenure label relative to a fixed date', () => {
    expect(tenureLabel('2023-12-01', new Date('2026-09-22'))).toBe('Joined 3 years ago')
  })
})
