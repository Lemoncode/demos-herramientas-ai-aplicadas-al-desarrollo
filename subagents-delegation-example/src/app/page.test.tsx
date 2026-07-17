import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Page', () => {
  it('renders at least one heading', () => {
    render(<Page />)
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })
})
