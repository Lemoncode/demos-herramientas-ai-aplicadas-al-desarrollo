import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders a button element by default', () => {
    render(<Button>Ver cargadores</Button>)
    expect(screen.getByRole('button', { name: /ver cargadores/i })).toBeInTheDocument()
  })

  it('applies primary variant class by default', () => {
    render(<Button>Primario</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn--primary')
  })

  it('applies secondary variant class when specified', () => {
    render(<Button variant="secondary">Secundario</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn--secondary')
  })

  it('renders an anchor element when as="a"', () => {
    render(<Button as="a" href="/contacto">Hablar con un distribuidor</Button>)
    const link = screen.getByRole('link', { name: /hablar con un distribuidor/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/contacto')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Acción</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
