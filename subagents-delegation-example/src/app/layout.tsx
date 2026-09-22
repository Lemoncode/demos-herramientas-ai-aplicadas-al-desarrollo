import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'JivaEnergy — Team Directory',
  description: 'Internal team directory for JivaEnergy staff.',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
