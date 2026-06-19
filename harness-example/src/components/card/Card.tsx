import type { ReactNode, ElementType } from 'react'

interface CardProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

export function Card({ children, as: Tag = 'article', className }: CardProps) {
  const classes = ['card', className].filter(Boolean).join(' ')

  return (
    <Tag className={classes}>
      {children}
    </Tag>
  )
}
