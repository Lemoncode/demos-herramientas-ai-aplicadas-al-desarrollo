import type { ReactNode } from 'react'
import { spacing } from '@/components/tokens'
import { Heading } from '@/components/heading/Heading'

interface SectionProps {
  id?: string
  title?: string
  children: ReactNode
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section
      id={id}
      style={{
        paddingTop: spacing['2xl'],
        paddingBottom: spacing['2xl'],
        paddingLeft: spacing.xl,
        paddingRight: spacing.xl,
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {title && (
        <Heading level={2} size="section">
          {title}
        </Heading>
      )}
      {children}
    </section>
  )
}
