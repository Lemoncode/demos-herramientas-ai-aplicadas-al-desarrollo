import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Heading } from './Heading'

describe('Heading', () => {
  it('renders an h1 with display size by default', () => {
    render(<Heading level={1}>Energía sostenible</Heading>)
    const el = screen.getByRole('heading', { level: 1 })
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent('Energía sostenible')
    expect(el).toHaveClass('heading--display')
  })

  it('renders an h2 with section size by default', () => {
    render(<Heading level={2}>Catálogo</Heading>)
    const el = screen.getByRole('heading', { level: 2 })
    expect(el).toHaveClass('heading--section')
  })

  it('renders an h3 with body size by default', () => {
    render(<Heading level={3}>Subtítulo</Heading>)
    const el = screen.getByRole('heading', { level: 3 })
    expect(el).toHaveClass('heading--body')
  })

  it('applies an explicit size override', () => {
    render(<Heading level={2} size="display">Gran titular</Heading>)
    const el = screen.getByRole('heading', { level: 2 })
    expect(el).toHaveClass('heading--display')
  })
})
