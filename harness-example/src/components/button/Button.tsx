import type { ReactNode, MouseEventHandler } from 'react'

type ButtonVariant = 'primary' | 'secondary'
type ButtonAs = 'button' | 'a'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  as?: ButtonAs
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ children, variant = 'primary', as = 'button', href, onClick, type = 'button' }: ButtonProps) {
  const classes = `btn btn--${variant}`

  if (as === 'a') {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
    >
      {children}
    </button>
  )
}
