import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import './globals.css'
import CursorEffect from './components/CursorEffect'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nidhi & Parag Wedding | December 4, 2026',
  description: 'Join us for our wedding at Abhishek Farms, Yeoor Hills, Thane on December 4, 2026.',
  openGraph: {
    title: 'Nidhi & Parag Wedding',
    description: 'Join us for our wedding celebration on December 4, 2026',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-white text-slate-900 ${cinzel.variable} ${cormorant.variable} ${greatVibes.variable}`}>
        <CursorEffect />
        {children}
        <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}
