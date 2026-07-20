import './globals.css'
import type { ReactNode } from 'react'
import { Playfair_Display, Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: 'JivaEnergy',
  description: 'Cargadores AC y DC para vehículos eléctricos.',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
