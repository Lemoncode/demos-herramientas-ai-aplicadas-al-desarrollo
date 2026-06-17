import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Contact } from './Contact'

describe('Contact', () => {
  // Newsletter signup
  it('renders the newsletter email input with an associated label', () => {
    render(<Contact />)
    expect(screen.getByLabelText(/correo electrónico/i, { selector: '#newsletter-email' })).toBeInTheDocument()
  })

  it('renders a newsletter submit button with visible text', () => {
    render(<Contact />)
    expect(
      screen.getByRole('button', { name: /suscribirme/i }),
    ).toBeInTheDocument()
  })

  // Contact form fields
  it('renders the name input with an associated label', () => {
    render(<Contact />)
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
  })

  it('renders the organization input with an associated label', () => {
    render(<Contact />)
    expect(screen.getByLabelText(/organización/i)).toBeInTheDocument()
  })

  it('renders the message textarea with an associated label', () => {
    render(<Contact />)
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument()
  })

  it('renders the legal-consent checkbox with an associated label', () => {
    render(<Contact />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders a contact form submit button with visible text', () => {
    render(<Contact />)
    expect(
      screen.getByRole('button', { name: /enviar mensaje/i }),
    ).toBeInTheDocument()
  })

  // Footer landmark
  it('renders a footer landmark element', () => {
    render(<Contact />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders a phone number in the footer', () => {
    render(<Contact />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent(/\+?\d/)
  })

  it('renders a contact email link in the footer', () => {
    render(<Contact />)
    const footer = screen.getByRole('contentinfo')
    const emailLink = footer.querySelector('a[href^="mailto:"]')
    expect(emailLink).not.toBeNull()
  })

  it('renders social media links in the footer', () => {
    render(<Contact />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent(/instagram|linkedin/i)
  })

  it('renders a copyright notice in the footer', () => {
    render(<Contact />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent(/©|copyright/i)
  })

  // Accessibility: every input must have htmlFor
  it('every form input has an associated label via htmlFor', () => {
    render(<Contact />)
    const inputs = document.querySelectorAll('input, textarea')
    inputs.forEach((input) => {
      const id = input.getAttribute('id')
      expect(id).toBeTruthy()
      expect(document.querySelector(`label[for="${id}"]`)).not.toBeNull()
    })
  })

  // Controlled form state
  it('contact form name input is controlled', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    const nameInput = screen.getByLabelText(/nombre/i)
    await user.type(nameInput, 'María García')
    expect(nameInput).toHaveValue('María García')
  })
})
