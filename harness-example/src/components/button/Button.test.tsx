import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders a primary button with accessible text', () => {
    render(<Button variant="primary">Ver cargadores</Button>)
    expect(screen.getByRole('button', { name: 'Ver cargadores' })).toBeInTheDocument()
  })

  it('renders as a link when as="a"', () => {
    render(
      <Button variant="secondary" as="a" href="/contacto">
        Hablar con un distribuidor
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Hablar con un distribuidor' })
    expect(link).toHaveAttribute('href', '/contacto')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button variant="primary" onClick={handleClick}>Enviar</Button>)
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('applies the correct variant class', () => {
    render(<Button variant="secondary">Secundario</Button>)
    expect(screen.getByRole('button', { name: 'Secundario' })).toHaveClass('btn--secondary')
  })
})
