'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_SECTIONS = [
  { index: '01', label: 'Our Story',  href: '#story' },
  { index: '02', label: 'Gallery',    href: '#gallery' },
  { index: '03', label: 'Schedule',   href: '#timeline' },
  { index: '04', label: 'Travel',     href: '#travel' },
  { index: '05', label: 'RSVP',       href: '#rsvp' },
  { index: '06', label: 'Messages',   href: '#messages' },
]

const OVERLAY_EASE = [0.76, 0, 0.24, 1] as const
const ITEM_EASE    = [0.76, 0, 0.24, 1] as const

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const menuMounted = useRef(false)

  // Lenis stop/start + body scroll lock
  useEffect(() => {
    if (!menuMounted.current) { menuMounted.current = true; return }
    window.dispatchEvent(new CustomEvent('nk:menu', { detail: { open: isOpen } }))
    document.documentElement.style.overflow = isOpen ? 'hidden' : ''
  }, [isOpen])

  // Escape closes overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    setTimeout(() => {
      const el = document.querySelector(href)
      if (!el) return
      const lenis = (window as unknown as { __lenis?: { scrollTo: (el: Element, opts: { duration: number }) => void } }).__lenis
      if (lenis) lenis.scrollTo(el, { duration: 1.2 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }, 220)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* ── Nav bar ───────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[60]"
        aria-label="Main navigation"
      >
        <div style={{
          background: isOpen ? 'rgba(16, 8, 20, 0.96)' : 'rgba(255, 255, 255, 0.62)',
          backdropFilter: isOpen ? 'none' : 'blur(44px) saturate(170%) brightness(1.04)',
          WebkitBackdropFilter: isOpen ? 'none' : 'blur(44px) saturate(170%) brightness(1.04)',
          borderBottom: isOpen ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.22)',
          boxShadow: isOpen ? 'none' : 'inset 0 -1px 0 rgba(196,154,40,0.10), 0 4px 24px rgba(0,0,0,0.05)',
          transition: 'background 0.55s ease, box-shadow 0.45s ease, border-color 0.45s ease',
        }}>
          {/* Top gold accent bar — hides when overlay is open */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #C49A28 30%, #E8C547 50%, #C49A28 70%, transparent 100%)',
            opacity: isOpen ? 0 : 0.7,
            transition: 'opacity 0.35s ease',
          }} />

          <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 no-underline"
              style={{ zIndex: 1 }}
              onClick={e => { if (isOpen) { e.preventDefault(); setIsOpen(false) } }}
            >
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="#C49A28" strokeWidth="0.9" opacity="0.7"/>
                <path d="M16 7 Q19 11 16 16 Q13 11 16 7Z" fill="#C49A28" opacity="0.6"/>
                <path d="M16 25 Q19 21 16 16 Q13 21 16 25Z" fill="#C49A28" opacity="0.6"/>
                <path d="M7 16 Q11 13 16 16 Q11 19 7 16Z" fill="#C49A28" opacity="0.5"/>
                <path d="M25 16 Q21 13 16 16 Q21 19 25 16Z" fill="#C49A28" opacity="0.5"/>
                <circle cx="16" cy="16" r="2.5" fill="#C49A28" opacity="0.8"/>
              </svg>
              <span style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 21,
                color: isOpen ? '#F6EDDA' : '#5C3A1E',
                lineHeight: 1,
                letterSpacing: '0.05em',
                transition: 'color 0.45s ease',
              }}>
                N <span aria-hidden="true" style={{ color: '#C49A28', fontSize: 13 }}>✦</span> P
              </span>
            </a>

            {/* MENU / CLOSE button */}
            <button
              onClick={() => setIsOpen(v => !v)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="fullscreen-menu"
              className="flex items-center gap-3"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 0',
                zIndex: 1,
              }}
            >
              {/* Animated hamburger → X */}
              <div style={{ position: 'relative', width: 22, height: 14 }}>
                <motion.span
                  animate={{ y: isOpen ? 6 : 0, rotate: isOpen ? 45 : 0, scaleX: isOpen ? 1 : 1 }}
                  transition={{ duration: 0.38, ease: OVERLAY_EASE }}
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
                    background: isOpen ? '#F6EDDA' : '#7C5A3A',
                    borderRadius: 2,
                    display: 'block',
                    transformOrigin: 'center',
                    transition: 'background 0.4s ease',
                  }}
                />
                <motion.span
                  animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    position: 'absolute', top: 6, left: 0, right: 0, height: 1.5,
                    background: isOpen ? '#F6EDDA' : '#7C5A3A',
                    borderRadius: 2,
                    display: 'block',
                    transition: 'background 0.4s ease',
                  }}
                />
                <motion.span
                  animate={{ y: isOpen ? -6 : 0, rotate: isOpen ? -45 : 0 }}
                  transition={{ duration: 0.38, ease: OVERLAY_EASE }}
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5,
                    background: isOpen ? '#F6EDDA' : '#7C5A3A',
                    borderRadius: 2,
                    display: 'block',
                    transformOrigin: 'center',
                    transition: 'background 0.4s ease',
                  }}
                />
              </div>
              <motion.span
                animate={{ opacity: isOpen ? 0 : 1, x: isOpen ? 6 : 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#7C5A3A',
                  fontWeight: 500,
                  userSelect: 'none',
                }}
              >
                MENU
              </motion.span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Fullscreen overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="fullscreen-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.68, ease: OVERLAY_EASE }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
              background: '#100814',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 'clamp(80px, 12vh, 120px) clamp(24px, 6vw, 96px) clamp(32px, 6vh, 60px)',
            }}
          >
            {/* Ambient gold blob — top right */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: 0, right: 0,
              width: '45vw', height: '45vw',
              background: 'radial-gradient(ellipse at 80% 20%, rgba(196,154,40,0.10) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />

            {/* Ghost N ✦ P — deep background */}
            <div aria-hidden="true" style={{
              position: 'absolute',
              bottom: '-4%', right: '-2%',
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(12rem, 32vw, 28rem)',
              fontWeight: 300,
              color: 'rgba(196, 154, 40, 0.025)',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
              lineHeight: 1,
            }}>
              N ✦ P
            </div>

            {/* ── Nav items ── */}
            <nav aria-label="Site sections" style={{ position: 'relative', zIndex: 1 }}>
              {NAV_SECTIONS.map((section, i) => (
                <div key={section.href} style={{ overflow: 'hidden' }}>
                  <motion.div
                    initial={{ y: '105%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-105%' }}
                    transition={{
                      duration: 0.58,
                      delay: isOpen ? 0.10 + i * 0.06 : 0,
                      ease: ITEM_EASE,
                    }}
                  >
                    <a
                      href={section.href}
                      onClick={e => { e.preventDefault(); handleNavClick(section.href) }}
                      className="group flex items-center gap-4 md:gap-6"
                      style={{
                        textDecoration: 'none',
                        paddingTop: 'clamp(2px, 0.6vh, 6px)',
                        paddingBottom: 'clamp(2px, 0.6vh, 6px)',
                        display: 'flex',
                      }}
                    >
                      {/* Index number */}
                      <span style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
                        color: 'rgba(196,154,40,0.45)',
                        letterSpacing: '0.14em',
                        minWidth: 24,
                        lineHeight: 1,
                        paddingTop: '0.4em',
                        alignSelf: 'flex-start',
                        flexShrink: 0,
                      }}>
                        {section.index}
                      </span>

                      {/* Label — moves right on hover */}
                      <motion.span
                        whileHover={{ x: 14, color: '#C49A28' }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        style={{
                          fontFamily: 'var(--font-playfair), Georgia, serif',
                          fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)',
                          fontWeight: 400,
                          fontStyle: 'italic',
                          lineHeight: 1.0,
                          color: 'rgba(246, 237, 218, 0.82)',
                          letterSpacing: '-0.01em',
                          display: 'block',
                        }}
                      >
                        {section.label}
                      </motion.span>
                    </a>
                  </motion.div>
                </div>
              ))}
            </nav>

            {/* ── Footer strip ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.48, delay: 0.52 }}
              style={{
                position: 'relative', zIndex: 1,
                marginTop: 'clamp(20px, 3.5vh, 40px)',
              }}
            >
              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(196,154,40,0.16)', marginBottom: 16 }} />

              {/* Sub-links */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <Link
                  href="/menu"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 10,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(196,154,40,0.65)',
                    textDecoration: 'none',
                    padding: '5px 14px',
                    border: '1px solid rgba(196,154,40,0.18)',
                    borderRadius: 100,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#C49A28'
                    e.currentTarget.style.borderColor = 'rgba(196,154,40,0.45)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(196,154,40,0.65)'
                    e.currentTarget.style.borderColor = 'rgba(196,154,40,0.18)'
                  }}
                >
                  Wedding Menu
                </Link>
                <Link
                  href="/games"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 10,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(196,154,40,0.65)',
                    textDecoration: 'none',
                    padding: '5px 14px',
                    border: '1px solid rgba(196,154,40,0.18)',
                    borderRadius: 100,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#C49A28'
                    e.currentTarget.style.borderColor = 'rgba(196,154,40,0.45)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(196,154,40,0.65)'
                    e.currentTarget.style.borderColor = 'rgba(196,154,40,0.18)'
                  }}
                >
                  Couple Trivia
                </Link>
              </div>

              {/* Date + venue */}
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(246,237,218,0.22)',
              }}>
                December 4, 2026 &nbsp;·&nbsp; Abhishek Farms, Yeoor Hills, Thane
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
