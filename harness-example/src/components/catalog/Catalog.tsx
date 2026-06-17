import Link from 'next/link'
import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { Card } from '@/components/card/Card'
import { chargers } from './chargers'

const SEGMENT_LABELS: Record<'residential' | 'commercial', string> = {
  residential: 'Residential',
  commercial: 'Commercial',
}

export function Catalog() {
  return (
    <Section id="catalog" title="Product Catalog">
      <ul className="catalog__grid">
        {chargers.map((charger) => (
          <li key={charger.id} className="catalog__item">
            <Card>
              <span className="catalog__badge">
                {SEGMENT_LABELS[charger.segment]}
              </span>
              <Heading level={3} size="body">
                {charger.model}
              </Heading>
              <dl className="catalog__specs">
                <dt className="catalog__spec-label">Power</dt>
                <dd className="catalog__spec-value">{charger.powerKw} kW</dd>
                <dt className="catalog__spec-label">Connector</dt>
                <dd className="catalog__spec-value">{charger.connectorType}</dd>
              </dl>
              <Link href={charger.href} className="catalog__link">
                View product
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  )
}
