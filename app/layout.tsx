import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Playfair_Display, Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import './globals.css'
import SmoothScroll from './components/SmoothScroll'

// Romantic script accent — used only for logo N ✦ P and special accents
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// Editorial serif — h2/h3 section headings + cinematic display text
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

// Clean neutral body — UI text, captions, labels (replaces DM Sans)
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans', // keep same CSS var — no cascading changes needed
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#010408',
}

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
      <body className={`bg-white text-slate-900 ${cormorant.variable} ${playfair.variable} ${inter.variable}`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}
