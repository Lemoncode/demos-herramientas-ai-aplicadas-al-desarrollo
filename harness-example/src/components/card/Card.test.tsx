import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders an article element by default', () => {
    render(<Card>Contenido de tarjeta</Card>)
    const el = screen.getByRole('article')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('card')
  })

  it('renders children inside the card', () => {
    render(<Card><span>JC-DUO Premium</span></Card>)
    expect(screen.getByText('JC-DUO Premium')).toBeInTheDocument()
  })

  it('accepts a custom element type via the as prop', () => {
    const { container } = render(<Card as="li">Elemento</Card>)
    expect(container.querySelector('li')).toBeInTheDocument()
  })
})
