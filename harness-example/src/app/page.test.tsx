import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Page from './page'

describe('Page', () => {
  it('renders the foundation-not-built placeholder', () => {
    render(<Page />)
    expect(
      screen.getByText(/foundation has not been built/i),
    ).toBeInTheDocument()
  })
})
