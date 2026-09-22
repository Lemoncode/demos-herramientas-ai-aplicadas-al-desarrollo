import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DirectoryList } from './DirectoryList'
import type { Person } from './people'

const people: Person[] = [
  { id: 'p1', name: 'Marta Alonso', role: 'Backend Engineer', status: 'active', joinedDate: '2021-06-01' },
  { id: 'p2', name: 'Diego Ruiz', role: 'Product Designer', status: 'on-leave', joinedDate: '2022-11-15' },
]

describe('DirectoryList', () => {
  it('renders one row per person', () => {
    render(<DirectoryList people={people} onMessage={vi.fn()} />)
    expect(screen.getByText('Marta Alonso')).toBeInTheDocument()
    expect(screen.getByText('Diego Ruiz')).toBeInTheDocument()
  })

  it('shows an empty state when no one matches', () => {
    render(<DirectoryList people={[]} onMessage={vi.fn()} />)
    expect(screen.getByText(/no teammates match/i)).toBeInTheDocument()
  })
})
