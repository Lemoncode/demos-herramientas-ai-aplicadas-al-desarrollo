'use client'

import { useState } from 'react'
import { Button } from '@/components/button/Button'

const NEWSLETTER_EMAIL_ID = 'newsletter-email'
const NEWSLETTER_EMAIL_LABEL = 'Correo electrónico'
const NEWSLETTER_SUBMIT_LABEL = 'Suscribirme'

export function ContactNewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="contact__newsletter-success">Gracias por suscribirte.</p>
  }

  return (
    <form className="contact__newsletter-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor={NEWSLETTER_EMAIL_ID} className="contact__label">
        {NEWSLETTER_EMAIL_LABEL}
      </label>
      <input
        id={NEWSLETTER_EMAIL_ID}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="contact__input"
        placeholder="tu@correo.com"
      />
      <Button type="submit" variant="primary">
        {NEWSLETTER_SUBMIT_LABEL}
      </Button>
    </form>
  )
}
