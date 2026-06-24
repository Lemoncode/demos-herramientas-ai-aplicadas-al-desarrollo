'use client'

import { useState } from 'react'

const FIELD_NAME_ID = 'contact-name'
const FIELD_EMAIL_ID = 'contact-email'
const FIELD_ORG_ID = 'contact-organization'
const FIELD_MESSAGE_ID = 'contact-message'
const FIELD_CONSENT_ID = 'contact-consent'

const LABEL_NAME = 'Nombre'
const LABEL_EMAIL = 'Correo electrónico'
const LABEL_ORG = 'Organización'
const LABEL_MESSAGE = 'Mensaje'
const LABEL_CONSENT = 'He leído y acepto la política de privacidad'
const SUBMIT_LABEL = 'Enviar mensaje'
const SUCCESS_MESSAGE = 'Tu mensaje ha sido enviado. Gracias.'

interface ContactFormState {
  name: string
  email: string
  organization: string
  message: string
  consent: boolean
}

const INITIAL_STATE: ContactFormState = {
  name: '',
  email: '',
  organization: '',
  message: '',
  consent: false,
}

export function ContactForm() {
  const [fields, setFields] = useState<ContactFormState>(INITIAL_STATE)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = event.target
    const checked =
      type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : undefined
    setFields((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="contact__form-success">{SUCCESS_MESSAGE}</p>
  }

  return (
    <form className="contact__form" onSubmit={handleSubmit} noValidate>
      <div className="contact__field">
        <label htmlFor={FIELD_NAME_ID} className="contact__label">
          {LABEL_NAME}
        </label>
        <input
          id={FIELD_NAME_ID}
          name="name"
          type="text"
          value={fields.name}
          onChange={handleChange}
          required
          className="contact__input"
        />
      </div>

      <div className="contact__field">
        <label htmlFor={FIELD_EMAIL_ID} className="contact__label">
          {LABEL_EMAIL}
        </label>
        <input
          id={FIELD_EMAIL_ID}
          name="email"
          type="email"
          value={fields.email}
          onChange={handleChange}
          required
          className="contact__input"
        />
      </div>

      <div className="contact__field">
        <label htmlFor={FIELD_ORG_ID} className="contact__label">
          {LABEL_ORG}
        </label>
        <input
          id={FIELD_ORG_ID}
          name="organization"
          type="text"
          value={fields.organization}
          onChange={handleChange}
          className="contact__input"
        />
      </div>

      <div className="contact__field">
        <label htmlFor={FIELD_MESSAGE_ID} className="contact__label">
          {LABEL_MESSAGE}
        </label>
        <textarea
          id={FIELD_MESSAGE_ID}
          name="message"
          value={fields.message}
          onChange={handleChange}
          required
          className="contact__textarea"
          rows={5}
        />
      </div>

      <div className="contact__field contact__field--checkbox">
        <input
          id={FIELD_CONSENT_ID}
          name="consent"
          type="checkbox"
          checked={fields.consent}
          onChange={handleChange}
          required
          className="contact__checkbox"
        />
        <label
          htmlFor={FIELD_CONSENT_ID}
          className="contact__label contact__label--inline"
        >
          {LABEL_CONSENT}
        </label>
      </div>

      <button type="submit" className="btn btn--primary">
        {SUBMIT_LABEL}
      </button>
    </form>
  )
}
