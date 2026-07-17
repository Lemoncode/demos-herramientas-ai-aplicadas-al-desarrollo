import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { Card } from '@/components/card/Card'
import { Button } from '@/components/button/Button'
import { chargers } from './chargers'
import type { Charger } from './chargers'
import { colors, spacing } from '@/components/tokens'

const BADGE_LABEL: Record<Charger['segment'], string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
}

const BADGE_COLOR: Record<Charger['segment'], string> = {
  residential: colors.accent,
  commercial: colors.primary,
}

const BADGE_TEXT_COLOR: Record<Charger['segment'], string> = {
  residential: colors.text,
  commercial: '#FFFFFF',
}

interface ChargerCardProps {
  charger: Charger
}

function ChargerCard({ charger }: ChargerCardProps) {
  return (
    <Card as="article">
      <span
        style={{
          display: 'inline-block',
          backgroundColor: BADGE_COLOR[charger.segment],
          color: BADGE_TEXT_COLOR[charger.segment],
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: '2px',
          marginBottom: spacing.sm,
        }}
      >
        {BADGE_LABEL[charger.segment]}
      </span>
      <Heading level={3}>{charger.model}</Heading>
      <p
        style={{
          margin: `${spacing.sm} 0`,
          color: colors.text,
          fontWeight: 600,
        }}
      >
        {charger.powerKw} kW
      </p>
      <p
        style={{
          margin: `0 0 ${spacing.md}`,
          color: colors.textMuted,
          fontSize: '0.875rem',
        }}
      >
        {charger.connectorType}
      </p>
      <Button as="a" href={charger.productPath} variant="secondary">
        Ver producto
      </Button>
    </Card>
  )
}

export function Catalog() {
  return (
    <Section id="catalog" title="Catálogo de cargadores">
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: spacing.lg,
          listStyle: 'none',
          padding: 0,
          margin: `${spacing.xl} 0 0`,
        }}
      >
        {chargers.map((charger) => (
          <li key={charger.id}>
            <ChargerCard charger={charger} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
