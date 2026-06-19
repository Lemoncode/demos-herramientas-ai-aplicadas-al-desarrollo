import { render, screen } from '@testing-library/react'
import { Faq } from './Faq'

describe('Faq', () => {
  it('renders the coming soon placeholder', () => {
    render(<Faq />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
