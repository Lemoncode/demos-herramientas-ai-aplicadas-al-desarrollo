import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders a level-1 heading with the JivaEnergy headline', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /energía sostenible para cada kilómetro/i }),
    ).toBeInTheDocument()
  })

  it('renders the primary CTA linking to /vehiculo/cargadores', () => {
    render(<Hero />)
    const link = screen.getByRole('link', { name: /ver cargadores/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/vehiculo/cargadores')
  })

  it('renders the secondary CTA linking to /contacto', () => {
    render(<Hero />)
    const link = screen.getByRole('link', { name: /hablar con un distribuidor/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/contacto')
  })

  it('renders a subheadline positioning JivaEnergy as a European manufacturer', () => {
    render(<Hero />)
    expect(screen.getByText(/jiva/i)).toBeInTheDocument()
  })

  it('does not render any img element without an alt attribute', () => {
    render(<Hero />)
    const images = document.querySelectorAll('img')
    for (const img of images) {
      expect(img).toHaveAttribute('alt')
    }
  })
})
