import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Certifications } from './Certifications'

describe('Certifications', () => {
  it('renders coming soon placeholder', () => {
    render(<Certifications />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
