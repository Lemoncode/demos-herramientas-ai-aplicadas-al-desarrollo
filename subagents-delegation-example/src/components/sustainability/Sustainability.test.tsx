import { render, screen } from '@testing-library/react'
import { Sustainability } from './Sustainability'

describe('Sustainability', () => {
  it('renders coming soon text', () => {
    render(<Sustainability />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
