import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'

interface CertificationItem {
  id: string
  label: string
  svgPath: string
}

const CERTIFICATIONS: CertificationItem[] = [
  { id: 'cb', label: 'CB', svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: 'ce', label: 'CE', svgPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138' },
  { id: 'iec', label: 'IEC', svgPath: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'un383', label: 'UN38.3', svgPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { id: 'rohs', label: 'RoHS', svgPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622' },
  { id: 'fcc', label: 'FCC', svgPath: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
  { id: 'tuv', label: 'TÜV', svgPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438' },
  { id: 'ukca', label: 'UKCA', svgPath: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
]

const SUBHEAD = 'Homologado para venta en Europa, Reino Unido y Norteamérica.'

interface CertLogoProps {
  certification: CertificationItem
}

function CertLogo({ certification }: CertLogoProps) {
  return (
    <li className="certifications__item">
      <figure className="certifications__figure">
        <svg
          role="img"
          aria-label={certification.label}
          className="certifications__svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>{certification.label}</title>
          <path strokeLinecap="round" strokeLinejoin="round" d={certification.svgPath} />
        </svg>
        <figcaption className="certifications__caption">{certification.label}</figcaption>
      </figure>
    </li>
  )
}

export function Certifications() {
  return (
    <Section id="certifications">
      <Heading level={2} size="section">Certificaciones</Heading>
      <p className="certifications__subhead">{SUBHEAD}</p>
      <ul className="certifications__grid" aria-label="Certificaciones de producto">
        {CERTIFICATIONS.map((cert) => (
          <CertLogo key={cert.id} certification={cert} />
        ))}
      </ul>
    </Section>
  )
}
