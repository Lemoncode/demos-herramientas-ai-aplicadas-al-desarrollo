import type { ReactNode } from 'react'
import { Heading } from '@/components/heading/Heading'

interface SectionProps {
  id?: string
  title?: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, children, className }: SectionProps) {
  const classes = ['section', className].filter(Boolean).join(' ')

  return (
    <section id={id} className={classes}>
      <div className="section__container">
        {title && (
          <Heading level={2} size="section">
            {title}
          </Heading>
        )}
        {children}
      </div>
    </section>
  )
}
