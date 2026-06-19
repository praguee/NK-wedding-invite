import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import './globals.css'
import CursorEffect from './components/CursorEffect'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
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
      <body className={`bg-white text-slate-900 ${cormorant.variable} ${dmSans.variable}`}>
        <CursorEffect />
        {children}
        <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}
