import Image from 'next/image'
import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { Button } from '@/components/button/Button'

const HEADLINE = 'Energía sostenible para cada kilómetro'
const SUBHEAD =
  'JivaEnergy diseña y fabrica hardware de recarga para vehículos eléctricos en Europa, con certificación CE y soporte técnico especializado para distribuidores e instaladores profesionales.'
const CTA_PRIMARY_LABEL = 'Ver cargadores'
const CTA_PRIMARY_HREF = '/vehiculo/cargadores'
const CTA_SECONDARY_LABEL = 'Hablar con un distribuidor'
const CTA_SECONDARY_HREF = '/contacto'
const PRODUCT_IMAGE_SRC = '/images/hero-charger.jpg'
const PRODUCT_IMAGE_ALT = 'Cargador de vehículo eléctrico JivaEnergy instalado en pared'
const PRODUCT_IMAGE_WIDTH = 960
const PRODUCT_IMAGE_HEIGHT = 720

export function Hero() {
  return (
    <Section id="hero" className="hero">
      <div className="hero__content">
        <Heading level={1} size="display">
          {HEADLINE}
        </Heading>
        <p className="hero__subhead">{SUBHEAD}</p>
        <div className="hero__ctas">
          <Button as="a" href={CTA_PRIMARY_HREF} variant="primary">
            {CTA_PRIMARY_LABEL}
          </Button>
          <Button as="a" href={CTA_SECONDARY_HREF} variant="secondary">
            {CTA_SECONDARY_LABEL}
          </Button>
        </div>
      </div>
      <div className="hero__visual">
        <Image
          src={PRODUCT_IMAGE_SRC}
          alt={PRODUCT_IMAGE_ALT}
          width={PRODUCT_IMAGE_WIDTH}
          height={PRODUCT_IMAGE_HEIGHT}
          priority
          className="hero__image"
        />
      </div>
    </Section>
  )
}
