import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Page from './page'

describe('Page', () => {
  it('renders the team directory', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { name: /team directory/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/search teammates/i)).toBeInTheDocument()
  })
})
