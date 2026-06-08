// app/components/FloatingRSVPButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingRSVPButton() {
  const [heroLeft,     setHeroLeft]     = useState(false)
  const [rsvpVisible,  setRsvpVisible]  = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)

  // Watch hero sentinel — button shows when hero scrolls out of view
  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([entry]) => setHeroLeft(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  // Watch RSVP section — button hides when RSVP is in view
  useEffect(() => {
    const rsvp = document.getElementById('rsvp')
    if (!rsvp) return
    const obs = new IntersectionObserver(
      ([entry]) => setRsvpVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    obs.observe(rsvp)
    return () => obs.disconnect()
  }, [])

  // Listen for lightbox and menu state from Gallery + Navigation
  useEffect(() => {
    const onLightbox = (e: Event) =>
      setLightboxOpen((e as CustomEvent<{ open: boolean }>).detail.open)
    const onMenu = (e: Event) =>
      setMenuOpen((e as CustomEvent<{ open: boolean }>).detail.open)
    window.addEventListener('nk:lightbox', onLightbox)
    window.addEventListener('nk:menu',     onMenu)
    return () => {
      window.removeEventListener('nk:lightbox', onLightbox)
      window.removeEventListener('nk:menu',     onMenu)
    }
  }, [])

  const visible = heroLeft && !rsvpVisible && !lightboxOpen && !menuOpen

  return (
    // md:hidden — only renders visually on mobile; layout exists on all sizes
    <div className="md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, pointerEvents: 'none' }}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="floating-rsvp"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{
              maxWidth: 384,
              margin: '0 auto',
              padding: '0 16px',
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
              pointerEvents: 'auto',
            }}
          >
            {/* Frosted backdrop bar */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: 80,
              background: 'linear-gradient(to top, rgba(255,253,246,0.72), transparent)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              pointerEvents: 'none',
            }} />

            {/* Button */}
            <motion.a
              href="#rsvp"
              whileTap={{ scale: 0.96 }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                height: 52,
                borderRadius: 100,
                background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
                color: '#2A1200',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.12em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                boxShadow: '0 6px 24px rgba(196,154,40,0.45), 0 1px 0 rgba(255,255,255,0.25) inset',
              }}
            >
              {/* Small lotus icon */}
              <svg width="14" height="14" viewBox="0 0 160 160" aria-hidden="true">
                <g transform="translate(80,80)">
                  {Array.from({ length: 8 }, (_, i) => (
                    <path key={i} d="M0,0 Q4,-18 0,-38 Q-4,-18 0,0" fill="#2A1200" transform={`rotate(${i * 45})`} />
                  ))}
                  <circle r="8" fill="none" stroke="#2A1200" strokeWidth="1.5" />
                  <circle r="3" fill="#2A1200" />
                </g>
              </svg>
              RSVP Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
