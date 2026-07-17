import { render, screen } from '@testing-library/react'
import { Certifications } from './Certifications'

describe('Certifications', () => {
  it('renders coming soon text', () => {
    render(<Certifications />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
