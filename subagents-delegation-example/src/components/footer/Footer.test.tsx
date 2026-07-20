import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders the brand logo with accessible label', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /jivaenergy — inicio/i })).toBeInTheDocument()
  })

  it('renders the products navigation section', () => {
    render(<Footer />)
    expect(screen.getByRole('navigation', { name: /productos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cargadores ac/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cargadores dc/i })).toBeInTheDocument()
  })

  it('renders the company navigation section', () => {
    render(<Footer />)
    expect(screen.getByRole('navigation', { name: /empresa/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sostenibilidad/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /preguntas frecuentes/i })).toBeInTheDocument()
  })

  it('renders contact email and phone links', () => {
    render(<Footer />)
    const email = screen.getByRole('link', { name: /info@jivaenergy\.eu/i })
    expect(email).toBeInTheDocument()
    expect(email).toHaveAttribute('href', 'mailto:info@jivaenergy.eu')

    const phone = screen.getByRole('link', { name: /\+34 900 123 456/i })
    expect(phone).toBeInTheDocument()
    expect(phone).toHaveAttribute('href', 'tel:+34900123456')
  })

  it('renders copyright notice with company name', () => {
    render(<Footer />)
    expect(screen.getByText(/jivaenergy s\.l\./i)).toBeInTheDocument()
  })

  it('renders the landmark footer element', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
