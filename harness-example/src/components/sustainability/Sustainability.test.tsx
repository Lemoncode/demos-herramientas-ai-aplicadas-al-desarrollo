import { render, screen } from '@testing-library/react'
import { Sustainability } from './Sustainability'

describe('Sustainability', () => {
  it('renders the coming soon placeholder', () => {
    render(<Sustainability />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
