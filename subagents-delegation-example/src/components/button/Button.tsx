import type { CSSProperties, ReactNode } from 'react'
import { colors, fontFamily, spacing } from '@/components/tokens'

type ButtonVariant = 'primary' | 'secondary'
type ButtonAs = 'button' | 'a'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  as?: ButtonAs
  href?: string
  onClick?: () => void
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: colors.primary,
    border: `2px solid ${colors.primary}`,
  },
}

const baseStyle: CSSProperties = {
  display: 'inline-block',
  fontFamily: fontFamily.body,
  fontWeight: 600,
  fontSize: '0.875rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  padding: `${spacing.md} ${spacing.xl}`,
  cursor: 'pointer',
  borderRadius: '2px',
}

export function Button({ children, variant = 'primary', as = 'button', href, onClick }: ButtonProps) {
  const style = { ...baseStyle, ...variantStyles[variant] }

  if (as === 'a') {
    return (
      <a href={href} style={style}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" style={style} onClick={onClick}>
      {children}
    </button>
  )
}
