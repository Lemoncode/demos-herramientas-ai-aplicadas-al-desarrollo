import { render, screen } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  it('renders children in the document', () => {
    render(
      <Section>
        <p>Contenido de la sección</p>
      </Section>,
    )
    expect(screen.getByText('Contenido de la sección')).toBeInTheDocument()
  })

  it('renders a named region with an h2 heading when title is provided', () => {
    render(
      <Section title="Catálogo de cargadores">
        <p>Grid</p>
      </Section>,
    )
    expect(
      screen.getByRole('region', { name: 'Catálogo de cargadores' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Catálogo de cargadores' }),
    ).toBeInTheDocument()
  })

  it('applies the section id to the HTML element', () => {
    const { container } = render(
      <Section id="hero">
        <p>Hero content</p>
      </Section>,
    )
    expect(container.querySelector('#hero')).not.toBeNull()
  })
})
