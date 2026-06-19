export const colors = {
  primary: '#1B3A28',
  primaryLight: '#2D5C40',
  background: '#F3EDE2',
  backgroundAlt: '#EAE2D4',
  accent: '#D9C840',
  accentDark: '#B5A730',
  textPrimary: '#12201A',
  textSecondary: '#4B5E54',
  textOnPrimary: '#F3EDE2',
  border: '#C9BFA8',
  borderStrong: '#8A7F68',
} as const

export const typography = {
  fontSerif: '"Cormorant Garamond", "Georgia", serif',
  fontSans: '"Outfit", "Helvetica Neue", Arial, sans-serif',
  sizeDisplay: '4.5rem',
  sizeSection: '2.5rem',
  sizeBody: '1.125rem',
  lineHeightDisplay: '1.1',
  lineHeightSection: '1.2',
  lineHeightBody: '1.65',
  trackingDisplay: '-0.03em',
  trackingSection: '-0.02em',
  weightSerif: '600',
  weightSerifBold: '700',
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  '2xl': '64px',
} as const

export const cssVars = {
  colorPrimary: 'var(--color-primary)',
  colorBackground: 'var(--color-background)',
  colorAccent: 'var(--color-accent)',
  colorText: 'var(--color-text)',
  colorTextSecondary: 'var(--color-text-secondary)',
  colorBorder: 'var(--color-border)',
  fontSerif: 'var(--font-serif)',
  fontSans: 'var(--font-sans)',
} as const
