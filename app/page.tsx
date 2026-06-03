'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Story from './components/Story'
import InviteDetails from './components/InviteDetails'
import Addresses from './components/Addresses'
import Gallery from './components/Gallery'
import Accommodations from './components/Accommodations'
import Transportation from './components/Transportation'
import Timeline from './components/Timeline'
import RSVPForm from './components/RSVPForm'
import GuestBook from './components/GuestBook'
import ContactFAQ from './components/ContactFAQ'

const IntroScreen = dynamic(() => import('./components/IntroScreen'), { ssr: false })

export default function Home() {
  const [unlocked, setUnlocked] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem('invite_unlocked') === 'true') {
      setUnlocked(true)
    }
  }, [])

  const mainContent = (
    <>
      <Navigation />
      <main>
        <Hero />
        <Story />
        <InviteDetails />
        <Addresses />
        <Gallery />
        <Accommodations />
        <Transportation />
        <Timeline />
        <RSVPForm />
        <GuestBook />
        <ContactFAQ />
      </main>
      <footer className="bg-slate-900 text-white py-12 text-center">
        <p className="text-slate-400 text-sm">© 2026 Nidhi & Parag · Made with love</p>
      </footer>
    </>
  )

  if (!mounted) return null

  if (unlocked) return mainContent

  return (
    <>
      {/* Blurred wedding content visible underneath the intro */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          filter: 'blur(24px) brightness(0.35)',
          pointerEvents: 'none',
          overflow: 'hidden',
          transform: 'scale(1.05)',
        }}
      >
        {mainContent}
      </div>

      {/* Intro screen on top */}
      <IntroScreen onUnlock={() => setUnlocked(true)} />
    </>
  )
}
