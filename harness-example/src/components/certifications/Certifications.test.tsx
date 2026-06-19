import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Certifications } from './Certifications'

const CERT_LABELS = ['CB', 'CE', 'IEC', 'UN38.3', 'RoHS', 'FCC', 'TÜV', 'UKCA']

describe('Certifications', () => {
  it('renders exactly 8 certification logos', () => {
    render(<Certifications />)
    const logos = screen.getAllByRole('img')
    expect(logos).toHaveLength(8)
  })

  it('renders the section subheading in Spanish', () => {
    render(<Certifications />)
    expect(
      screen.getByText(/homologado para venta en europa/i),
    ).toBeInTheDocument()
  })

  it('gives every logo a descriptive aria-label', () => {
    render(<Certifications />)
    for (const label of CERT_LABELS) {
      expect(screen.getByRole('img', { name: label })).toBeInTheDocument()
    }
  })

  it('renders the certifications grid as a list', () => {
    render(<Certifications />)
    const grid = screen.getByRole('list')
    expect(grid).toBeInTheDocument()
  })
})
