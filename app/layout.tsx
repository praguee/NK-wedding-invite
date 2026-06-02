import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nidhi & Parag Wedding',
  description: 'Join us for our wedding on December 4, 2026',
  openGraph: {
    title: 'Nidhi & Parag Wedding',
    description: 'Join us for our wedding on December 4, 2026',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  )
}
