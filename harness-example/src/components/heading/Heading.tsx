import type { ReactNode } from 'react'

type HeadingLevel = 1 | 2 | 3
type HeadingSize = 'display' | 'section' | 'body'

interface HeadingProps {
  level: HeadingLevel
  size?: HeadingSize
  children: ReactNode
  className?: string
}

const sizeStyles: Record<HeadingSize, string> = {
  display: 'heading--display',
  section: 'heading--section',
  body: 'heading--body',
}

export function Heading({ level, size, children, className }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
  const defaultSize: HeadingSize = level === 1 ? 'display' : level === 2 ? 'section' : 'body'
  const resolvedSize = size ?? defaultSize
  const classes = ['heading', sizeStyles[resolvedSize], className].filter(Boolean).join(' ')

  return (
    <Tag className={classes}>
      {children}
    </Tag>
  )
}
