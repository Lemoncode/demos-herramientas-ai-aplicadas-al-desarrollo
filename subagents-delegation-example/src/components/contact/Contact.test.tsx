import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'

describe('Contact', () => {
  it('renders coming soon text', () => {
    render(<Contact />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
