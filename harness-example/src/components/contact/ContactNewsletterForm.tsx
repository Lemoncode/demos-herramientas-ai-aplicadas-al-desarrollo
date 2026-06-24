'use client'

import { useState } from 'react'

const NEWSLETTER_EMAIL_ID = 'newsletter-email'
const NEWSLETTER_EMAIL_LABEL = 'Correo electrónico'
const NEWSLETTER_SUBMIT_LABEL = 'Suscribirme'
const NEWSLETTER_SUCCESS_MESSAGE = 'Gracias por suscribirte.'

export function ContactNewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="contact__newsletter-success">{NEWSLETTER_SUCCESS_MESSAGE}</p>
    )
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
      <button type="submit" className="btn btn--primary">
        {NEWSLETTER_SUBMIT_LABEL}
      </button>
    </form>
  )
}
