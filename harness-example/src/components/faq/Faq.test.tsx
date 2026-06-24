import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Faq } from './Faq'

describe('Faq', () => {
  it('renders all three FAQ questions as buttons', () => {
    render(<Faq />)
    expect(
      screen.getByRole('button', { name: /¿Qué tipos de cargadores ofrecen\?/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /¿Son compatibles con todos los vehículos eléctricos\?/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /¿Cómo gestionan la garantía y el soporte\?/i }),
    ).toBeInTheDocument()
  })

  it('renders a section heading for the FAQ block', () => {
    render(<Faq />)
    expect(screen.getByRole('heading', { name: /preguntas frecuentes/i })).toBeInTheDocument()
  })

  it('collapses all answer panels on initial render', () => {
    render(<Faq />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('expands an answer panel when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const firstButton = screen.getByRole('button', {
      name: /¿Qué tipos de cargadores ofrecen\?/i,
    })
    await user.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('collapses an expanded panel when clicked again', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const firstButton = screen.getByRole('button', {
      name: /¿Qué tipos de cargadores ofrecen\?/i,
    })
    await user.click(firstButton)
    await user.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('reveals the answer panel content after clicking the question', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const firstButton = screen.getByRole('button', {
      name: /¿Qué tipos de cargadores ofrecen\?/i,
    })
    await user.click(firstButton)
    const panel = screen.getByRole('region', { name: /¿Qué tipos de cargadores ofrecen\?/i })
    expect(panel).toBeVisible()
  })

  it('toggles aria-expanded with the keyboard Enter key', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const secondButton = screen.getByRole('button', {
      name: /¿Son compatibles con todos los vehículos eléctricos\?/i,
    })
    secondButton.focus()
    await user.keyboard('{Enter}')
    expect(secondButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('toggles aria-expanded with the keyboard Space key', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const thirdButton = screen.getByRole('button', {
      name: /¿Cómo gestionan la garantía y el soporte\?/i,
    })
    thirdButton.focus()
    await user.keyboard(' ')
    expect(thirdButton).toHaveAttribute('aria-expanded', 'true')
  })
})
