import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders children inside an article element by default', () => {
    render(
      <Card>
        <h3>JC-DUO Premium</h3>
        <p>22 kW · Type 2</p>
      </Card>,
    )
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByText('JC-DUO Premium')).toBeInTheDocument()
  })

  it('renders as a different element when as prop is provided', () => {
    render(
      <Card as="div">
        <span>Contenido</span>
      </Card>,
    )
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('applies the card class', () => {
    render(<Card><p>Content</p></Card>)
    expect(screen.getByRole('article')).toHaveClass('card')
  })
})
