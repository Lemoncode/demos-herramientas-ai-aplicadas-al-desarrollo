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

      <ul className="sustainability__metrics">
        {METRICS.map(({ value, label }) => (
          <li key={label} className="sustainability__metric-item">
            <Card>
              <span className="sustainability__metric-value">{value}</span>
              <span className="sustainability__metric-label">{label}</span>
            </Card>
          </li>
        ))}
      </ul>

      <p
        className="sustainability__description"
        data-testid="circular-economy-paragraph"
      >
        {CIRCULAR_ECONOMY_COPY}
      </p>
    </Section>
  )
}
