import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders children inside an article by default', () => {
    render(
      <Card>
        <p>Contenido</p>
      </Card>,
    )
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('renders as a div when specified', () => {
    const { container } = render(<Card as="div">Contenido</Card>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })
})
