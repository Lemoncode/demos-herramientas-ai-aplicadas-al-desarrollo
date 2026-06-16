import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'JivaEnergy',
  description: 'Cargadores AC y DC para vehículos eléctricos.',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
