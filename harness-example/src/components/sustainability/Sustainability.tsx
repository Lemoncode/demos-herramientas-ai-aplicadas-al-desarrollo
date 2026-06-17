import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { Card } from '@/components/card/Card'

interface MetricTile {
  value: string
  label: string
}

const METRICS: MetricTile[] = [
  { value: '48,200', label: 'CO₂ avoided (tons)' },
  { value: '1.3M', label: 'Charge sessions' },
  { value: '34', label: 'Partner countries' },
]

const CIRCULAR_ECONOMY_COPY =
  'We design every charger for disassembly, recover materials through certified take-back partners, ' +
  'and offset residual emissions with verified carbon credits — closing the loop on every unit we ship.'

export function Sustainability() {
  return (
    <Section id="sustainability">
      <Heading level={2}>Sustainability</Heading>

      <ul className="sustainability__metrics">
        {METRICS.map(({ value, label }) => (
          <li key={label} className="sustainability__metric-item">
            <Card className="sustainability__metric-card">
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
