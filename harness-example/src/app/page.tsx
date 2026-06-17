import { Hero } from '@/components/hero/Hero'
import { Catalog } from '@/components/catalog/Catalog'
import { Sustainability } from '@/components/sustainability/Sustainability'
import { Faq } from '@/components/faq/Faq'
import { Certifications } from '@/components/certifications/Certifications'
import { Contact } from '@/components/contact/Contact'

export default function Page() {
  return (
    <main>
      <Hero />
      <Catalog />
      <Sustainability />
      <Faq />
      <Certifications />
      <Contact />
    </main>
  )
}
