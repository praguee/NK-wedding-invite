'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Active section highlighting via IntersectionObserver
  useEffect(() => {
    const SECTION_IDS = ['#story', '#jab-we-met', '#timeline', '#gallery', '#rsvp', '#messages', '#travel', '#contact']
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.querySelector(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const menuMounted = useRef(false)
  // Notify FloatingRSVPButton when mobile menu opens/closes — skip initial mount
  useEffect(() => {
    if (!menuMounted.current) { menuMounted.current = true; return }
    window.dispatchEvent(new CustomEvent('nk:menu', { detail: { open: isOpen } }))
  }, [isOpen])

  const sections = [
    { label: 'The Way of Water', href: '#story' },
    { label: 'Schedule',  href: '#timeline' },
    { label: 'Gallery',   href: '#gallery' },
    { label: 'Travel',    href: '#travel' },
    { label: 'RSVP',      href: '#rsvp' },
    { label: 'Messages',  href: '#messages' },
  ]

  return (
    <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      aria-label="Main navigation"
      style={{
        background: 'rgba(255,253,246,0.88)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        borderBottom: '1px solid rgba(196,154,40,0.15)',
        boxShadow: '0 1px 0 rgba(196,154,40,0.08), 0 4px 24px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top gold accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent 0%, #C49A28 30%, #E8C547 50%, #C49A28 70%, transparent 100%)',
        opacity: 0.7,
      }} />

      <div className="max-w-6xl mx-auto px-5 py-3.5 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 no-underline">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="#C49A28" strokeWidth="0.9" opacity="0.7"/>
            <path d="M16 7 Q19 11 16 16 Q13 11 16 7Z" fill="#C49A28" opacity="0.6"/>
            <path d="M16 25 Q19 21 16 16 Q13 21 16 25Z" fill="#C49A28" opacity="0.6"/>
            <path d="M7 16 Q11 13 16 16 Q11 19 7 16Z" fill="#C49A28" opacity="0.5"/>
            <path d="M25 16 Q21 13 16 16 Q21 19 25 16Z" fill="#C49A28" opacity="0.5"/>
            <circle cx="16" cy="16" r="2.5" fill="#C49A28" opacity="0.8"/>
          </svg>
          <span
            className="font-light tracking-[0.12em]"
            style={{ fontSize: 17, color: '#5C3A1E', letterSpacing: '0.12em' }}
          >
            N <span style={{ color: '#C49A28', fontSize: 11 }}>✦</span> P
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex gap-7 items-center">
          <Link href="/menu"
            className="text-xs tracking-widest uppercase px-3 py-1.5 rounded-full transition-all font-medium"
            style={{ color: '#C49A28', background: 'rgba(196,154,40,0.1)', border: '1px solid rgba(196,154,40,0.25)' }}>
            🍽 Menu
          </Link>
          <Link href="/games"
            className="text-xs tracking-widest uppercase px-3 py-1.5 rounded-full transition-all font-medium"
            style={{ color: '#C49A28', background: 'rgba(196,154,40,0.1)', border: '1px solid rgba(196,154,40,0.25)' }}>
            Trivia
          </Link>
          {sections.map((s) => {
            const isActive = activeSection === s.href
            return (
              <a
                key={s.label}
                href={s.href}
                className="text-xs tracking-widest uppercase transition-colors"
                style={{
                  color: isActive ? '#C49A28' : '#7C5A3A',
                  letterSpacing: '0.09em',
                  borderBottom: isActive ? '1.5px solid #C49A28' : '1.5px solid transparent',
                  paddingBottom: 2,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#C49A28' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#7C5A3A' }}
              >
                {s.label}
              </a>
            )
          })}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          style={{ color: '#7C5A3A' }}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div
          id="mobile-menu"
          role="menu"
          style={{
            borderTop: '1px solid rgba(196,154,40,0.12)',
            background: 'rgba(255,253,246,0.97)',
          }}
        >
          <Link
            href="/menu"
            className="flex items-center gap-2 px-6 py-3.5 text-xs tracking-widest uppercase"
            style={{ color: '#C49A28', background: 'rgba(196,154,40,0.05)', borderBottom: '1px solid rgba(196,154,40,0.1)', letterSpacing: '0.09em' }}
            onClick={() => setIsOpen(false)}
          >
            🍽 Menu
          </Link>
          <Link
            href="/games"
            className="flex items-center gap-2 px-6 py-3.5 text-xs tracking-widest uppercase"
            style={{ color: '#C49A28', background: 'rgba(196,154,40,0.05)', borderBottom: '1px solid rgba(196,154,40,0.1)', letterSpacing: '0.09em' }}
            onClick={() => setIsOpen(false)}
          >
            Trivia
          </Link>
          {sections.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="block px-6 py-3.5 text-xs tracking-widest uppercase transition-colors"
              style={{ color: '#7C5A3A', letterSpacing: '0.09em' }}
              onClick={() => setIsOpen(false)}
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </nav>
    </>
  )
}
