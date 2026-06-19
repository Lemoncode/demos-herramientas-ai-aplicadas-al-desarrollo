import { render, screen } from '@testing-library/react'
import { Certifications } from './Certifications'

describe('Certifications', () => {
  it('renders the coming soon placeholder', () => {
    render(<Certifications />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
