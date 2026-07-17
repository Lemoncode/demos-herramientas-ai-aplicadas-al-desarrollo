import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { Card } from '@/components/card/Card'

interface MetricTile {
  value: string
  label: string
}

const METRICS: MetricTile[] = [
  { value: '12.400', label: 'CO₂ evitado (toneladas)' },
  { value: '2.800.000', label: 'Sesiones de carga' },
  { value: '18', label: 'Países asociados' },
]

const CIRCULAR_ECONOMY_COPY =
  'Diseñamos cada cargador para su desmontaje, recuperamos materiales a través de socios de ' +
  'recogida certificados y compensamos las emisiones residuales con créditos de carbono verificados, ' +
  'cerrando el ciclo en cada unidad que fabricamos.'

export function Sustainability() {
  return (
    <Section id="sustainability">
      <Heading level={2} size="section">
        Sostenibilidad
      </Heading>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '2rem 0',
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {METRICS.map(({ value, label }) => (
          <li key={label} style={{ flex: '1 1 200px' }}>
            <Card>
              <span
                style={{
                  display: 'block',
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {value}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                }}
              >
                {label}
              </span>
            </Card>
          </li>
        ))}
      </ul>

      <p
        data-testid="circular-economy-paragraph"
        style={{ maxWidth: '720px' }}
      >
        {CIRCULAR_ECONOMY_COPY}
      </p>
    </Section>
  )
}
