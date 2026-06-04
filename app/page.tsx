'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Story from './components/Story'
import JabWeMet from './components/JabWeMet'
import InviteDetails from './components/InviteDetails'
import Gallery from './components/Gallery'
import Timeline from './components/Timeline'
import RSVPForm from './components/RSVPForm'
import GuestBook from './components/GuestBook'
import Transportation from './components/Transportation'
import Addresses from './components/Addresses'
import Accommodations from './components/Accommodations'
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
        <JabWeMet />
        <InviteDetails />
        <Gallery />
        <Timeline />
        <RSVPForm />
        <GuestBook />
        <Transportation />
        <Addresses />
        <Accommodations />
        <ContactFAQ />
      </main>
      <footer
        className="text-white py-16 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #3B1942 0%, #1A0A2E 60%, #0D0618 100%)' }}
      >
        {/* Subtle mandala watermark in footer */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='%23C49A28' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='70' fill='none' stroke='%23C49A28' stroke-width='0.8'/%3E%3Ccircle cx='100' cy='100' r='50' fill='none' stroke='%23C49A28' stroke-width='0.7'/%3E%3Ccircle cx='100' cy='100' r='30' fill='none' stroke='%23C49A28' stroke-width='0.6'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />
        <div className="relative z-10">
          <p className="text-gold-shimmer text-3xl font-extralight tracking-[0.2em] mb-2">N ✦ P</p>
          <p className="text-sm tracking-[0.15em] mb-1" style={{ color: 'rgba(196,154,40,0.7)' }}>
            Birmingham ✈ Mumbai · 04 · 12 · 2026
          </p>
          <p className="text-xs tracking-widest uppercase mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Started in a shower. Ends at a pool.
          </p>
        </div>
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
