import type { CSSProperties } from 'react'
import { Section } from '@/components/section/Section'

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

const GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1.5rem',
  listStyle: 'none',
  padding: 0,
  margin: '1.5rem 0 0',
}

const ITEM_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

interface CertificationLogoProps {
  label: string
}

function CertificationLogo({ label }: CertificationLogoProps) {
  return (
    <li style={ITEM_STYLE}>
      <svg
        role="img"
        aria-label={`${label} certification logo`}
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        width={80}
        height={80}
      >
        <rect width="80" height="80" rx="8" fill="#e8f4f8" />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#1a3a4a"
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
      <p>{SUBHEAD}</p>
      <ul style={GRID_STYLE}>
        {CERTIFICATIONS.map((cert) => (
          <CertificationLogo key={cert.id} label={cert.label} />
        ))}
      </ul>
    </Section>
  )
}
