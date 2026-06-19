import { render, screen } from '@testing-library/react'
import { Heading } from './Heading'

describe('Heading', () => {
  it('renders the correct heading level and text', () => {
    render(<Heading level={1} size="display">Energía sostenible para cada kilómetro</Heading>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Energía sostenible para cada kilómetro',
    )
  })

  it('applies the display size class', () => {
    render(<Heading level={1} size="display">Display</Heading>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('heading--display')
  })

  it('renders h2 with section size class', () => {
    render(<Heading level={2} size="section">Catálogo</Heading>)
    const el = screen.getByRole('heading', { level: 2 })
    expect(el).toHaveTextContent('Catálogo')
    expect(el).toHaveClass('heading--section')
  })

  it('renders h3 with body size class', () => {
    render(<Heading level={3} size="body">JC-DUO Premium</Heading>)
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass('heading--body')
  })
})
