import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { ContactNewsletterForm } from './ContactNewsletterForm'
import { ContactForm } from './ContactForm'
import { ContactFooter } from './ContactFooter'

const NEWSLETTER_HEADING = 'Mantente informado'
const NEWSLETTER_DESCRIPTION =
  'Recibe novedades sobre nuestros cargadores, normativas y eventos del sector EV.'

const CONTACT_FORM_HEADING = 'Escríbenos'
const CONTACT_FORM_DESCRIPTION =
  'Cuéntanos tu proyecto. Nuestro equipo técnico te responderá en menos de 24 horas.'

export function Contact() {
  return (
    <>
      <Section id="contact" className="contact">
        <div className="contact__newsletter">
          <Heading level={2} size="section">
            {NEWSLETTER_HEADING}
          </Heading>
          <p className="contact__description">{NEWSLETTER_DESCRIPTION}</p>
          <ContactNewsletterForm />
        </div>

        <div className="contact__form-wrapper">
          <Heading level={2} size="section">
            {CONTACT_FORM_HEADING}
          </Heading>
          <p className="contact__description">{CONTACT_FORM_DESCRIPTION}</p>
          <ContactForm />
        </div>
      </Section>

      <ContactFooter />
    </>
  )
}
