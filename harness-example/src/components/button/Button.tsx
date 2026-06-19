import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant: 'primary' | 'secondary'
  as?: 'button' | 'a'
  href?: string
  onClick?: () => void
}

export function Button({ children, variant, as: Tag = 'button', href, onClick }: ButtonProps) {
  const className = `btn btn--${variant}`

  if (Tag === 'a') {
    return (
      <a className={className} href={href} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  )
}
