import { render, screen } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  it('renders children', () => {
    render(
      <Section>
        <p>Contenido</p>
      </Section>,
    )
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('renders a heading when title is provided', () => {
    render(<Section title="Catálogo"><p>Cards</p></Section>)
    expect(screen.getByRole('heading', { name: 'Catálogo' })).toBeInTheDocument()
  })

  it('renders a section landmark element', () => {
    const { container } = render(<Section>Content</Section>)
    expect(container.querySelector('section')).toBeInTheDocument()
  })
})
