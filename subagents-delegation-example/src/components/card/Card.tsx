import type { ReactNode } from 'react'
import { colors, spacing } from '@/components/tokens'

type CardAs = 'article' | 'div' | 'li'

interface CardProps {
  children: ReactNode
  as?: CardAs
}

export function Card({ children, as: Tag = 'article' }: CardProps) {
  return (
    <Tag
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        padding: spacing.lg,
        borderRadius: '2px',
      }}
    >
      {children}
    </Tag>
  )
}
