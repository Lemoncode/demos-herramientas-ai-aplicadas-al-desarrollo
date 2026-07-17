import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Contact } from './Contact'

describe('Contact', () => {
  describe('Newsletter signup', () => {
    it('renders a newsletter email input with an accessible label', () => {
      render(<Contact />)
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    })

    it('renders a newsletter submit button with visible text', () => {
      render(<Contact />)
      expect(screen.getByRole('button', { name: /suscribirse/i })).toBeInTheDocument()
    })

    it('updates the newsletter email input value when the user types', async () => {
      const user = userEvent.setup()
      render(<Contact />)
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      await user.type(emailInput, 'test@example.com')
      expect(emailInput).toHaveValue('test@example.com')
    })
  })

  describe('Contact form', () => {
    it('renders a name input with an accessible label', () => {
      render(<Contact />)
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    })

    it('renders an email input with an accessible label', () => {
      render(<Contact />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('renders an organization input with an accessible label', () => {
      render(<Contact />)
      expect(screen.getByLabelText(/organización/i)).toBeInTheDocument()
    })

    it('renders a message textarea with an accessible label', () => {
      render(<Contact />)
      expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument()
    })

    it('renders a legal consent checkbox with an accessible label', () => {
      render(<Contact />)
      expect(screen.getByRole('checkbox', { name: /acepto/i })).toBeInTheDocument()
    })

    it('renders a contact form submit button with visible text', () => {
      render(<Contact />)
      expect(screen.getByRole('button', { name: /enviar consulta/i })).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders the footer landmark', () => {
      render(<Contact />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('renders the phone number', () => {
      render(<Contact />)
      expect(screen.getByText(/\+34 900 123 456/i)).toBeInTheDocument()
    })

    it('renders the contact email address', () => {
      render(<Contact />)
      expect(screen.getByText(/info@jivaenergy\.es/i)).toBeInTheDocument()
    })

    it('renders an Instagram link', () => {
      render(<Contact />)
      expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
    })

    it('renders a LinkedIn link', () => {
      render(<Contact />)
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    })

    it('renders a copyright notice', () => {
      render(<Contact />)
      expect(screen.getByText(/todos los derechos reservados/i)).toBeInTheDocument()
    })
  })
})
