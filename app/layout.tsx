import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nidhi & Parag Wedding | December 4, 2026',
  description: 'Join us for our Hindu Maharashtrian wedding at Abhishek Farms, Yeoor Hills, Thane on December 4, 2026.',
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
      <body className="bg-white text-slate-900">
        {children}
        <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}
