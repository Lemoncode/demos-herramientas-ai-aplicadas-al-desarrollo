import type { ReactNode } from 'react'

type HeadingLevel = 1 | 2 | 3
type HeadingSize = 'display' | 'section' | 'body'

interface HeadingProps {
  level: HeadingLevel
  size: HeadingSize
  children: ReactNode
}

const tagMap = { 1: 'h1', 2: 'h2', 3: 'h3' } as const

export function Heading({ level, size, children }: HeadingProps) {
  const Tag = tagMap[level]
  return <Tag className={`heading heading--${size}`}>{children}</Tag>
}
