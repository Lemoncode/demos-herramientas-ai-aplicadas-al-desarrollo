import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Section } from './Section'

describe('Section', () => {
  it('renders a section landmark', () => {
    const { container } = render(<Section>Contenido</Section>)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('renders a title as an h2 when provided', () => {
    render(<Section title="Catálogo de cargadores">Contenido</Section>)
    expect(screen.getByRole('heading', { level: 2, name: /catálogo de cargadores/i })).toBeInTheDocument()
  })

  it('does not render a heading when title is omitted', () => {
    render(<Section>Sin título</Section>)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('passes the id to the section element', () => {
    const { container } = render(<Section id="catalog">Contenido</Section>)
    expect(container.querySelector('#catalog')).toBeInTheDocument()
  })

  it('renders children inside the section', () => {
    render(<Section>Texto visible</Section>)
    expect(screen.getByText('Texto visible')).toBeInTheDocument()
  })
})
