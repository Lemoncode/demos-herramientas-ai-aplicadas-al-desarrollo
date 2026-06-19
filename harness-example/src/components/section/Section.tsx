import type { ReactNode } from 'react'
import { Heading } from '@/components/heading/Heading'

interface SectionProps {
  id?: string
  title?: string
  children: ReactNode
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="section" aria-label={title}>
      <div className="section__container">
        {title !== undefined && (
          <div className="section__title">
            <Heading level={2} size="section">{title}</Heading>
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
