import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'

interface Certification {
  id: string
  label: string
}

const CERTIFICATIONS: Certification[] = [
  { id: 'cb', label: 'CB' },
  { id: 'ce', label: 'CE' },
  { id: 'iec', label: 'IEC' },
  { id: 'un383', label: 'UN38.3' },
  { id: 'rohs', label: 'RoHS' },
  { id: 'fcc', label: 'FCC' },
  { id: 'tuv', label: 'TÜV' },
  { id: 'ukca', label: 'UKCA' },
]

const SUBHEAD = 'Homologado para venta en Europa, Reino Unido y Norteamérica.'

function CertificationLogo({ label }: { label: string }) {
  return (
    <li className="certifications__item">
      <svg
        role="img"
        aria-label={label}
        className="certifications__logo"
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="80" height="80" rx="8" fill="currentColor" opacity="0.12" />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="currentColor"
        >
          {label}
        </text>
      </svg>
    </li>
  )
}

export function Certifications() {
  return (
    <Section id="certifications" title="Certificaciones">
      <Heading level={3} size="body">{SUBHEAD}</Heading>
      <ul className="certifications__grid">
        {CERTIFICATIONS.map((cert) => (
          <CertificationLogo key={cert.id} label={cert.label} />
        ))}
      </ul>
    </Section>
  )
}
