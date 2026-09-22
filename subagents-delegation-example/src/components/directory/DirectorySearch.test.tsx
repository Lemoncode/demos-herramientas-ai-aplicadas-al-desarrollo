import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { DirectorySearch } from './DirectorySearch'

describe('DirectorySearch', () => {
  it('filters the roster as the user types', async () => {
    const user = userEvent.setup()
    render(<DirectorySearch />)

    expect(screen.getByText('Marta Alonso')).toBeInTheDocument()
    expect(screen.getByText('Diego Ruiz')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/search teammates/i), 'marta')

    expect(screen.getByText('Marta Alonso')).toBeInTheDocument()
    expect(screen.queryByText('Diego Ruiz')).not.toBeInTheDocument()
  })
})
