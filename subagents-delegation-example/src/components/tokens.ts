export const colors = {
  primary: '#1A3D2B',
  background: '#F2EDE4',
  accent: '#CEDA0A',
  text: '#0E1F16',
  textMuted: '#4A5C4F',
  surface: '#FFFFFF',
  border: '#C8C3B8',
} as const

export const fontFamily = {
  heading: "var(--font-heading, 'Playfair Display', Georgia, 'Times New Roman', serif)",
  body: "var(--font-body, Inter, 'Helvetica Neue', Arial, sans-serif)",
} as const

export const fontSize = {
  display: 'clamp(2.5rem, 5vw, 4rem)',
  section: '2rem',
  body: '1rem',
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  '2xl': '64px',
} as const

export type FontSizeKey = keyof typeof fontSize
export type SpacingKey = keyof typeof spacing
