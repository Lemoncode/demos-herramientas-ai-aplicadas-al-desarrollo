import Image from 'next/image'
import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { Button } from '@/components/button/Button'
import { colors, spacing } from '@/components/tokens'

const HEADLINE = 'Energía sostenible para cada kilómetro'
const SUBHEAD =
  'JivaEnergy fabrica cargadores AC y DC para vehículos eléctricos e híbridos enchufables. Soluciones certificadas para residencias, flotas comerciales y organizaciones del sector público en toda Europa.'
const PRIMARY_CTA_LABEL = 'Ver cargadores'
const PRIMARY_CTA_HREF = '/vehiculo/cargadores'
const SECONDARY_CTA_LABEL = 'Hablar con un distribuidor'
const SECONDARY_CTA_HREF = '/contacto'
const PRODUCT_IMAGE_SRC = '/images/hero-charger.jpg'
const PRODUCT_IMAGE_ALT = 'Cargador JivaEnergy instalado en aparcamiento'
const PRODUCT_IMAGE_WIDTH = 640
const PRODUCT_IMAGE_HEIGHT = 480

export function Hero() {
  return (
    <Section id="hero">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.xl,
          alignItems: 'center',
        }}
      >
        <div>
          <Heading level={1}>{HEADLINE}</Heading>
          <p
            style={{
              color: colors.textMuted,
              fontSize: '1.125rem',
              lineHeight: 1.6,
              marginTop: spacing.md,
              marginBottom: spacing.xl,
            }}
          >
            {SUBHEAD}
          </p>
          <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Button as="a" href={PRIMARY_CTA_HREF} variant="primary">
              {PRIMARY_CTA_LABEL}
            </Button>
            <Button as="a" href={SECONDARY_CTA_HREF} variant="secondary">
              {SECONDARY_CTA_LABEL}
            </Button>
          </div>
        </div>
        <div style={{ position: 'relative', aspectRatio: '4/3' }}>
          <Image
            src={PRODUCT_IMAGE_SRC}
            alt={PRODUCT_IMAGE_ALT}
            width={PRODUCT_IMAGE_WIDTH}
            height={PRODUCT_IMAGE_HEIGHT}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            priority
          />
        </div>
      </div>
    </Section>
  )
}
