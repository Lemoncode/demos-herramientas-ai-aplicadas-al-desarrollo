import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders a button element by default', () => {
    render(<Button>Enviar</Button>)
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument()
  })

  it('renders an anchor when as="a"', () => {
    render(
      <Button as="a" href="/contacto">
        Contacto
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Contacto' })
    expect(link).toHaveAttribute('href', '/contacto')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button', { name: 'Click' }))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
