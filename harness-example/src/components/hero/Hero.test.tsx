import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders a level-1 heading with the copy spec headline', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /energía sostenible para cada kilómetro/i }),
    ).toBeInTheDocument()
  })

  it('renders the primary CTA as an accessible link to /vehiculo/cargadores', () => {
    render(<Hero />)
    const link = screen.getByRole('link', { name: /ver cargadores/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/vehiculo/cargadores')
  })

  it('renders the secondary CTA as an accessible link to /contacto', () => {
    render(<Hero />)
    const link = screen.getByRole('link', { name: /hablar con un distribuidor/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/contacto')
  })

  it('every image has an alt attribute', () => {
    render(<Hero />)
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt')
    })
  })
})
