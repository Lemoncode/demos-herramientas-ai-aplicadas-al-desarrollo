import type { ReactNode } from 'react'
import { colors, fontFamily, fontSize } from '@/components/tokens'

type Level = 1 | 2 | 3
type Size = 'display' | 'section' | 'body'

interface HeadingProps {
  level: Level
  size?: Size
  children: ReactNode
}

const sizeDefaults: Record<Level, Size> = {
  1: 'display',
  2: 'section',
  3: 'body',
}

export function Heading({ level, size, children }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
  const resolvedSize = size ?? sizeDefaults[level]

  return (
    <Tag
      style={{
        fontFamily: fontFamily.heading,
        fontSize: fontSize[resolvedSize],
        color: colors.text,
        fontWeight: level === 1 ? 700 : 600,
        lineHeight: 1.15,
      }}
    >
      {children}
    </Tag>
  )
}
