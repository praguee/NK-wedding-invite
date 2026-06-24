'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { COUPLE, EVENT } from '@/lib/constants'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }
function getTimeLeft(): TimeLeft {
  const diff = EVENT.weddingDate.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const
const WIPE_EASE = [0.76, 0, 0.24, 1] as const

const PARTICLES = [
  { left: '6%',  delay: '0s',    dur: '8s',  size: 3 },
  { left: '14%', delay: '1.6s',  dur: '10s', size: 2 },
  { left: '22%', delay: '0.4s',  dur: '7.5s',size: 4 },
  { left: '32%', delay: '2.3s',  dur: '9s',  size: 2 },
  { left: '43%', delay: '0.9s',  dur: '11s', size: 3 },
  { left: '53%', delay: '3.2s',  dur: '8.5s',size: 2 },
  { left: '63%', delay: '1.1s',  dur: '9.5s',size: 3 },
  { left: '73%', delay: '0.3s',  dur: '7s',  size: 2 },
  { left: '82%', delay: '2.7s',  dur: '8s',  size: 4 },
  { left: '89%', delay: '1.9s',  dur: '9s',  size: 2 },
  { left: '95%', delay: '0.7s',  dur: '7.5s',size: 3 },
  { left: '48%', delay: '4.1s',  dur: '10s', size: 2 },
]

const MARQUEE_TEXT = `N × K  ·  December 4, 2026  ·  Thane, India  ·  Floating Mandap  ·  Abhishek Farms  ·  You Are Invited  ·  `

export default function Hero() {
  const [batmanPhase, setBatmanPhase] = useState(true)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 700], ['0%', '20%'])
  const isMobile = useMediaQuery('(max-width: 767px)')

  useEffect(() => {
    const id = setInterval(() => setBatmanPhase(b => !b), 4800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      className="min-h-[100svh] md:min-h-screen relative overflow-hidden animate-fade-in"
      aria-label="Hero"
    >

      {/* ── Parallax hero image ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: 1.05 }}
      >
        <Image
          src="/images/hero-cover.jpg"
          alt={`${COUPLE.brideName} and ${COUPLE.groomName}`}
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 0%',
            filter: 'contrast(1.10) saturate(1.20) brightness(0.82) sepia(0.06)',
          }}
        />
      </motion.div>

      {/* ── Cinematic gradient layers ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(10,4,25,0.18) 0%, rgba(10,4,25,0.02) 35%, transparent 55%)',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(5,2,15,0.92) 0%, rgba(10,4,25,0.72) 18%, rgba(15,6,35,0.30) 42%, transparent 68%)',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 40% at 50% 65%, rgba(196,120,40,0.18) 0%, transparent 70%)',
      }} />

      {/* ── Slide counter (01 / 02) — top-right ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 28, right: 28, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 10,
        pointerEvents: 'none',
      }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={batmanPhase ? '01' : '02'}
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 6 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            exit={{ clipPath: 'inset(100% 0 0 0)', y: -6 }}
            transition={{ duration: 0.45, ease: WIPE_EASE }}
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 'clamp(10px, 1.4vw, 12px)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'rgba(196,154,40,0.60)',
            }}
          >
            {batmanPhase ? '01' : '02'}
          </motion.span>
        </AnimatePresence>
        <span style={{ width: 22, height: 1, background: 'rgba(196,154,40,0.28)', display: 'inline-block' }} />
        <span style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 'clamp(10px, 1.4vw, 12px)',
          letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.18)',
        }}>02</span>
      </div>

      {/* ── Batman wipe panel ── */}
      {/* Mobile: vertical top↓bottom wipe   Desktop: horizontal left→right wipe */}
      <AnimatePresence>
        {batmanPhase && (
          <motion.div
            key={`batman-${isMobile ? 'm' : 'd'}`}
            initial={{ clipPath: isMobile ? 'inset(0 0 100% 0)' : 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: isMobile ? 'inset(100% 0 0 0)' : 'inset(0 0 0 100%)' }}
            transition={{ duration: 0.88, ease: WIPE_EASE }}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
          >
            {/* Ken Burns */}
            <motion.div
              initial={{ scale: 1.0, x: 0 }}
              animate={{ scale: 1.06, x: -8 }}
              transition={{ duration: 5.8, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src="/images/batman-inspiration.jpg"
                alt=""
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: isMobile ? '50% 28%' : 'center 28%',
                  filter: 'contrast(1.12) saturate(0.70) brightness(0.76)',
                }}
              />
            </motion.div>

            {/* Vignette */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(3,1,10,0.28) 0%, transparent 38%, rgba(3,1,10,0.70) 78%, rgba(3,1,10,0.94) 100%)',
            }} />

            {/* Gotham label — clips up after wipe lands */}
            <motion.div
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ delay: 0.72, duration: 0.48, ease: WIPE_EASE }}
              style={{
                position: 'absolute',
                bottom: 52,
                left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              }}
            >
              <span style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 'clamp(8px, 1.6vw, 10px)',
                letterSpacing: '0.38em',
                color: 'rgba(196,154,40,0.55)',
                textTransform: 'uppercase',
              }}>
                Gotham City
              </span>
              <span aria-hidden="true" style={{ width: 1, height: 16, background: 'rgba(196,154,40,0.22)', display: 'block' }} />
              <span style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 'clamp(7px, 1.2vw, 9px)',
                letterSpacing: '0.26em',
                color: 'rgba(255,255,255,0.22)',
                textTransform: 'uppercase',
              }}>
                same energy · less cape
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating gold particles ── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none', overflow: 'hidden' }}>
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', bottom: 0, left: p.left,
              width: p.size, height: p.size,
              background: '#C49A28', transform: 'rotate(45deg)', opacity: 0,
              animation: `floatParticle ${p.dur} ${p.delay} infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* ── Bottom editorial label + RSVP — always above marquee ── */}
      <div style={{
        position: 'absolute', bottom: 44, left: 0, right: 0,
        zIndex: 14, pointerEvents: 'none',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '0 clamp(20px, 5vw, 48px)',
      }}>
        {/* Left: couple name + event line */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
        >
          <span style={{
            fontFamily: 'var(--font-great-vibes), Georgia, serif',
            fontSize: 'clamp(28px, 6vw, 52px)',
            color: '#C49A28',
            lineHeight: 1,
            textShadow: '0 0 40px rgba(196,154,40,0.30)',
            display: 'block',
          }}>
            {COUPLE.brideName} &amp; {COUPLE.groomName}
          </span>
          <span style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 'clamp(8px, 1.4vw, 10px)',
            letterSpacing: '0.20em',
            color: 'rgba(255,255,255,0.30)',
            textTransform: 'uppercase',
            display: 'block',
          }}>
            04.12.2026
          </span>
          {/* Compact countdown replacing "Thane" */}
          <span style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 'clamp(8px, 1.4vw, 10px)',
            letterSpacing: '0.16em',
            color: 'rgba(196,154,40,0.65)',
            display: 'flex',
            gap: 'clamp(6px, 1.2vw, 10px)',
            alignItems: 'baseline',
          }}>
            {[
              { v: timeLeft.days,    l: 'd' },
              { v: timeLeft.hours,   l: 'h' },
              { v: timeLeft.minutes, l: 'm' },
              { v: timeLeft.seconds, l: 's' },
            ].map(({ v, l }) => (
              <span key={l} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1 }}>
                <span style={{ color: 'rgba(255,255,255,0.70)', fontWeight: 600 }}>
                  {String(v).padStart(2, '0')}
                </span>
                <span style={{ color: 'rgba(196,154,40,0.50)', fontSize: '0.75em' }}>{l}</span>
              </span>
            ))}
          </span>
        </motion.div>

        {/* Right: RSVP button */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          style={{ pointerEvents: 'auto', flexShrink: 0 }}
        >
          <motion.a
            href="#rsvp"
            whileHover={{ scale: 1.05, filter: 'brightness(1.08)' }}
            whileFocus={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(196,154,40,0.8)]"
            style={{
              display: 'inline-block',
              /* Apple Liquid Glass — dark-on-hero variant */
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(44px) saturate(200%) brightness(1.10)',
              WebkitBackdropFilter: 'blur(44px) saturate(200%) brightness(1.10)',
              border: '1px solid rgba(255, 255, 255, 0.30)',
              borderBottomColor: 'rgba(255, 255, 255, 0.10)',
              boxShadow: [
                'inset 0 1px 0 rgba(255,255,255,0.65)',
                'inset 0 0 0 0.5px rgba(255,255,255,0.18)',
                'inset 0 -1px 0 rgba(0,0,0,0.07)',
                '0 4px 20px rgba(0,0,0,0.14)',
                '0 0 0 0.5px rgba(196,154,40,0.14)',
              ].join(', '),
              color: 'rgba(255,255,255,0.92)',
              padding: '11px 28px',
              borderRadius: 100,
              fontWeight: 600,
              fontSize: 'clamp(9px, 1.6vw, 11px)',
              letterSpacing: '0.14em',
              textDecoration: 'none',
              textTransform: 'uppercase' as const,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            RSVP Now
          </motion.a>
        </motion.div>
      </div>

      {/* ── Marquee strip — ALWAYS visible on both images ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 15, pointerEvents: 'none',
          height: 26,
          background: 'rgba(10,5,20,0.55)',
          borderTop: '1px solid rgba(196,154,40,0.22)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center',
        }}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
          style={{ display: 'flex', whiteSpace: 'nowrap', gap: 0 }}
        >
          {[0, 1].map(i => (
            <span key={i} style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 9,
              letterSpacing: '0.30em',
              color: 'rgba(196,154,40,0.72)',
              textTransform: 'uppercase',
              paddingRight: 80,
            }}>
              {MARQUEE_TEXT}
            </span>
          ))}
        </motion.div>
      </div>


      <div id="hero-sentinel" aria-hidden="true" />
    </section>
  )
}
