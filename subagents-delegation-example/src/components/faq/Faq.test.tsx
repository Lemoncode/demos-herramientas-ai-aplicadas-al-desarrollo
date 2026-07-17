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

  it('answers are hidden on initial render', () => {
    render(<Faq />)
    const answers = screen.queryAllByRole('region')
    // Panels should not be visible initially (either hidden or absent)
    for (const answer of answers) {
      expect(answer).not.toBeVisible()
    }
  })

  it('expands a panel when clicking its button', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    const question = screen.getByRole('button', {
      name: /¿Qué tipos de cargadores ofrecen\?/i,
    })
    expect(question).toHaveAttribute('aria-expanded', 'false')

    await user.click(question)

    expect(question).toHaveAttribute('aria-expanded', 'true')
  })

  it('collapses a panel when clicking its button a second time', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    const question = screen.getByRole('button', {
      name: /¿Son compatibles con todos los vehículos eléctricos\?/i,
    })

    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')

    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'false')
  })

  it('each question button is reachable via Tab', () => {
    render(<Faq />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    for (const btn of buttons) {
      expect(btn).not.toHaveAttribute('tabindex', '-1')
    }
  })
})
