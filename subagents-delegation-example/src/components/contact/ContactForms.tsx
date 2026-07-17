'use client'

import { useState } from 'react'
import { Button } from '@/components/button/Button'
import { Heading } from '@/components/heading/Heading'

const NEWSLETTER_EMAIL_ID = 'newsletter-email'
const CONTACT_NAME_ID = 'contact-name'
const CONTACT_EMAIL_ID = 'contact-email'
const CONTACT_ORG_ID = 'contact-organization'
const CONTACT_MESSAGE_ID = 'contact-message'
const CONTACT_CONSENT_ID = 'contact-consent'

interface NewsletterState {
  email: string
}

interface ContactFormState {
  name: string
  email: string
  organization: string
  message: string
  consent: boolean
}

export function ContactForms() {
  const [newsletter, setNewsletter] = useState<NewsletterState>({ email: '' })
  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: '',
    email: '',
    organization: '',
    message: '',
    consent: false,
  })

  function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <Heading level={3} size="body">
          Suscríbete a nuestra newsletter
        </Heading>
        <form onSubmit={handleNewsletterSubmit} style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor={NEWSLETTER_EMAIL_ID} style={{ display: 'block', marginBottom: '0.5rem' }}>
              Correo electrónico
            </label>
            <input
              id={NEWSLETTER_EMAIL_ID}
              type="email"
              value={newsletter.email}
              onChange={(e) => setNewsletter({ email: e.target.value })}
              placeholder="tu@empresa.com"
              style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
            />
          </div>
          <Button variant="primary">Suscribirse</Button>
        </form>
      </div>

      <div>
        <Heading level={3} size="body">
          Contacta con nosotros
        </Heading>
        <form onSubmit={handleContactSubmit} style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor={CONTACT_NAME_ID} style={{ display: 'block', marginBottom: '0.5rem' }}>
              Nombre
            </label>
            <input
              id={CONTACT_NAME_ID}
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Tu nombre"
              style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor={CONTACT_EMAIL_ID} style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              id={CONTACT_EMAIL_ID}
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="tu@empresa.com"
              style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor={CONTACT_ORG_ID} style={{ display: 'block', marginBottom: '0.5rem' }}>
              Organización
            </label>
            <input
              id={CONTACT_ORG_ID}
              type="text"
              value={contactForm.organization}
              onChange={(e) => setContactForm((prev) => ({ ...prev, organization: e.target.value }))}
              placeholder="Tu empresa"
              style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor={CONTACT_MESSAGE_ID} style={{ display: 'block', marginBottom: '0.5rem' }}>
              Mensaje
            </label>
            <textarea
              id={CONTACT_MESSAGE_ID}
              value={contactForm.message}
              onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="¿En qué podemos ayudarte?"
              rows={5}
              style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
            />
          </div>

          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <input
              id={CONTACT_CONSENT_ID}
              type="checkbox"
              checked={contactForm.consent}
              onChange={(e) => setContactForm((prev) => ({ ...prev, consent: e.target.checked }))}
            />
            <label htmlFor={CONTACT_CONSENT_ID}>
              Acepto el tratamiento de mis datos personales conforme a la política de privacidad de JivaEnergy
            </label>
          </div>

          <Button variant="primary">Enviar consulta</Button>
        </form>
      </div>
    </div>
  )
}
