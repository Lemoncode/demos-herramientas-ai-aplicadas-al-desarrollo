import { Section } from '@/components/section/Section'
import { ContactForms } from './ContactForms'
import { ContactFooter } from './ContactFooter'

export function Contact() {
  return (
    <>
      <Section id="contact" title="Contacto">
        <ContactForms />
      </Section>
      <ContactFooter />
    </>
  )
}
