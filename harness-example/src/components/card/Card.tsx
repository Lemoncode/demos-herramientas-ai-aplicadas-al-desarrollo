import type { ReactNode } from 'react'

type CardElement = 'article' | 'div' | 'li' | 'section'

interface CardProps {
  children: ReactNode
  as?: CardElement
}

export function Card({ children, as: Tag = 'article' }: CardProps) {
  return <Tag className="card">{children}</Tag>
}
