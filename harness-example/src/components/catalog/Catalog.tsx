import Link from 'next/link'
import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { Card } from '@/components/card/Card'
import { chargers } from './chargers'
import type { Charger } from './chargers'

const SEGMENT_LABELS: Record<Charger['segment'], string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
}

export function Catalog() {
  return (
    <Section id="catalog" title="Catálogo de productos">
      <ul className="catalog__grid">
        {chargers.map((charger) => (
          <li key={charger.id} className="catalog__item">
            <Card>
              <span className={`catalog__badge catalog__badge--${charger.segment}`}>
                {SEGMENT_LABELS[charger.segment]}
              </span>
              <Heading level={3} size="body">
                {charger.model}
              </Heading>
              <dl className="catalog__specs">
                <dt className="catalog__spec-label">Potencia</dt>
                <dd className="catalog__spec-value">{charger.powerKw} kW</dd>
                <dt className="catalog__spec-label">Conector</dt>
                <dd className="catalog__spec-value">{charger.connector}</dd>
              </dl>
              <Link href={charger.href} className="catalog__link">
                Ver producto
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  )
}
