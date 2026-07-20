import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('renders the brand logo with accessible label', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /jivaenergy — inicio/i })).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navbar />)
    const nav = screen.getByRole('navigation', { name: /navegación principal/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cargadores/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sostenibilidad/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /certificaciones/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /faq/i })).toBeInTheDocument()
  })

  it('renders the CTA link to contact section', () => {
    render(<Navbar />)
    const cta = screen.getByRole('link', { name: /contactar/i })
    expect(cta).toBeInTheDocument()
    expect(cta).toHaveAttribute('href', '/#contacto')
  })

  it('shows burger button with accessible label', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /abrir menú/i })).toBeInTheDocument()
  })

  it('toggles mobile menu label when burger is clicked', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const burger = screen.getByRole('button', { name: /abrir menú/i })
    await user.click(burger)
    expect(screen.getByRole('button', { name: /cerrar menú/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cerrar menú/i }))
    expect(screen.getByRole('button', { name: /abrir menú/i })).toBeInTheDocument()
  })

  it('sets aria-expanded on the burger button', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const burger = screen.getByRole('button', { name: /abrir menú/i })
    expect(burger).toHaveAttribute('aria-expanded', 'false')

    await user.click(burger)
    expect(screen.getByRole('button', { name: /cerrar menú/i })).toHaveAttribute('aria-expanded', 'true')
  })
})
