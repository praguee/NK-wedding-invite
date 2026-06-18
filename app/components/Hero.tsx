'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { COUPLE, EVENT } from '@/lib/constants'
import SectionOrnament from './SectionOrnament'

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number
}

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

function AnimatedDigit({ value }: { value: number }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '1.1em' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '-110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ display: 'block', textAlign: 'center' }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

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

function Mandala() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 'min(680px, 120vw)',
        height: 'min(680px, 120vw)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.045,
        pointerEvents: 'none',
      }}
    >
      <g transform="translate(200,200)">
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={`op${i}`} d="M0,-180 Q18,-155 0,-130 Q-18,-155 0,-180Z" fill="#C49A28" transform={`rotate(${i * 22.5})`} />
        ))}
        <circle r="155" fill="none" stroke="#C49A28" strokeWidth="0.8" opacity="0.6" />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={`mp${i}`} d="M0,-120 Q14,-100 0,-80 Q-14,-100 0,-120Z" fill="#C49A28" transform={`rotate(${i * 30})`} />
        ))}
        <circle r="100" fill="none" stroke="#C49A28" strokeWidth="0.7" opacity="0.5" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`id${i}`} d="M0,-68 L8,-54 L0,-40 L-8,-54 Z" fill="#C49A28" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="62" fill="none" stroke="#C49A28" strokeWidth="0.6" opacity="0.45" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`il${i}`} d="M0,-38 Q10,-25 0,-15 Q-10,-25 0,-38Z" fill="#C49A28" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="28" fill="none" stroke="#C49A28" strokeWidth="0.8" opacity="0.6" />
        <circle r="14" fill="#C49A28" opacity="0.4" />
        <circle r="7" fill="#C49A28" opacity="0.6" />
        <circle r="3" fill="#C49A28" opacity="0.9" />
      </g>
    </svg>
  )
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const isWeddingDay = Object.values(timeLeft).every((v) => v === 0)

  return (
    <section
      className="min-h-[100svh] md:min-h-screen relative flex items-center justify-center py-12 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 85% 65% at 50% 42%, #1C0B00 0%, #0D0600 55%, #060200 100%)',
      }}
    >
      {/* Jali texture layer — white stroke version for dark bg */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cpath d='M36 5 L67 36 L36 67 L5 36 Z' fill='none' stroke='white' stroke-width='0.5' opacity='0.06'/%3E%3Ccircle cx='36' cy='5' r='1' fill='white' opacity='0.06'/%3E%3Ccircle cx='67' cy='36' r='1' fill='white' opacity='0.06'/%3E%3Ccircle cx='36' cy='67' r='1' fill='white' opacity='0.06'/%3E%3Ccircle cx='5' cy='36' r='1' fill='white' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundSize: '72px 72px',
        }}
      />

      {/* Warm ambient glow behind card */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,154,40,0.09) 0%, transparent 65%)',
        }}
      />

      {/* Mandala behind card */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        <Mandala />
      </div>

      {/* Floating gold particles */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: p.left,
              width: p.size,
              height: p.size,
              background: '#C49A28',
              transform: 'rotate(45deg)',
              opacity: 0,
              animation: `floatParticle ${p.dur} ${p.delay} infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* ── The invitation card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: 'relative', zIndex: 3, width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <motion.div
          animate={reducedMotion ? {} : { y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ width: '100%', maxWidth: 420 }}
          className="mx-4 sm:mx-auto"
        >
          <div
            style={{
              background: 'rgba(16, 7, 1, 0.78)',
              backdropFilter: 'blur(36px) saturate(160%)',
              WebkitBackdropFilter: 'blur(36px) saturate(160%)',
              border: '1px solid rgba(196,154,40,0.3)',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: [
                '0 0 0 0.5px rgba(196,154,40,0.18)',
                '0 0 90px rgba(196,154,40,0.14)',
                '0 40px 80px rgba(0,0,0,0.65)',
                '0 1px 0 rgba(255,210,100,0.35) inset',
                '0 -1px 0 rgba(0,0,0,0.3) inset',
              ].join(', '),
            }}
          >
            {/* Top gold gradient bar — invitation crown */}
            <div style={{
              height: 3,
              background: 'linear-gradient(90deg, transparent 0%, rgba(196,154,40,0.15) 10%, #C49A28 38%, #F0D060 50%, #C49A28 62%, rgba(196,154,40,0.15) 90%, transparent 100%)',
            }} />

            {/* Corner ornaments */}
            <div style={{ position: 'relative' }}>
              {/* Top-left corner */}
              <svg style={{ position: 'absolute', top: 0, left: 0, zIndex: 4, pointerEvents: 'none' }} width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M2 2 L14 2" stroke="#C49A28" strokeWidth="0.8" opacity="0.45" />
                <path d="M2 2 L2 14" stroke="#C49A28" strokeWidth="0.8" opacity="0.45" />
                <circle cx="2" cy="2" r="2" fill="#C49A28" opacity="0.4" />
              </svg>
              {/* Top-right corner */}
              <svg style={{ position: 'absolute', top: 0, right: 0, zIndex: 4, pointerEvents: 'none' }} width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M30 2 L18 2" stroke="#C49A28" strokeWidth="0.8" opacity="0.45" />
                <path d="M30 2 L30 14" stroke="#C49A28" strokeWidth="0.8" opacity="0.45" />
                <circle cx="30" cy="2" r="2" fill="#C49A28" opacity="0.4" />
              </svg>

              {/* Photo — Next.js Image for cross-browser consistency */}
              <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                <Image
                  src="/images/hero-cover.jpg"
                  alt="Nidhi and Parag"
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, 420px"
                  style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                />
                {/* Bottom fade into card */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
                  background: 'linear-gradient(to top, rgba(16,7,1,0.92) 0%, rgba(16,7,1,0.4) 55%, transparent 100%)',
                }} />
                {/* Top vignette */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 56,
                  background: 'linear-gradient(to bottom, rgba(16,7,1,0.45) 0%, transparent 100%)',
                }} />
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '20px 28px 32px', textAlign: 'center' }}>
              <SectionOrnament light />

              <p style={{
                fontSize: 9,
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: 'rgba(196,154,40,0.5)',
                marginBottom: 16,
                fontWeight: 400,
              }}>
                Together with their families
              </p>

              {/* Names */}
              <div style={{ lineHeight: 1.1, marginBottom: 6 }}>
                <h1
                  aria-label={`${COUPLE.brideName} & ${COUPLE.groomName}`}
                  style={{
                    fontSize: 'clamp(42px, 10vw, 68px)',
                    fontWeight: 100,
                    letterSpacing: '-0.02em',
                    color: '#C49A28',
                    display: 'block',
                    textShadow: '0 0 44px rgba(196,154,40,0.4), 0 0 90px rgba(196,154,40,0.18)',
                  }}
                >
                  {COUPLE.brideName}
                </h1>
                <p style={{
                  fontSize: 16,
                  color: 'rgba(196,154,40,0.45)',
                  fontWeight: 200,
                  letterSpacing: '0.22em',
                  margin: '4px 0 2px',
                }}>
                  ✦ &amp; ✦
                </p>
                <div
                  aria-hidden="true"
                  style={{
                    fontSize: 'clamp(42px, 10vw, 68px)',
                    fontWeight: 100,
                    letterSpacing: '-0.02em',
                    color: '#C49A28',
                    display: 'block',
                    textShadow: '0 0 44px rgba(196,154,40,0.4), 0 0 90px rgba(196,154,40,0.18)',
                  }}
                >
                  {COUPLE.groomName}
                </div>
              </div>

              <p style={{
                fontSize: 12,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.48)',
                letterSpacing: '0.06em',
                marginBottom: 22,
              }}>
                Friday, December 4, 2026 · Thane, Maharashtra
              </p>

              {/* Countdown */}
              {isWeddingDay ? (
                <p style={{ fontSize: 18, fontWeight: 300, color: '#C49A28', marginBottom: 28 }}>
                  Today is the day! ✨
                </p>
              ) : (
                <div style={{ marginBottom: 28 }}>
                  <p style={{
                    fontSize: 8,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: 'rgba(196,154,40,0.38)',
                    marginBottom: 10,
                  }}>
                    Counting down
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 0 }}>
                    {[
                      { value: timeLeft.days,    label: 'Days' },
                      { value: timeLeft.hours,   label: 'Hrs' },
                      { value: timeLeft.minutes, label: 'Min' },
                      { value: timeLeft.seconds, label: 'Sec' },
                    ].map(({ value, label }, i) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ textAlign: 'center', minWidth: 52 }}>
                          <div style={{
                            fontSize: 'clamp(24px, 6vw, 34px)',
                            fontWeight: 100,
                            color: 'rgba(255,255,255,0.92)',
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                          }}>
                            <AnimatedDigit value={value} />
                          </div>
                          <div style={{
                            fontSize: 8,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(196,154,40,0.5)',
                            marginTop: 5,
                          }}>
                            {label}
                          </div>
                        </div>
                        {i < 3 && (
                          <span style={{
                            fontSize: 22,
                            color: 'rgba(196,154,40,0.22)',
                            fontWeight: 200,
                            lineHeight: 1,
                            paddingBottom: 18,
                          }}>
                            :
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RSVP */}
              <motion.a
                href="#rsvp"
                whileHover={{ scale: 1.06 }}
                whileFocus={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(196,154,40,0.8)]"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
                  color: '#2A1200',
                  padding: '13px 44px',
                  borderRadius: 100,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(196,154,40,0.45), 0 1px 0 rgba(255,255,255,0.25) inset',
                  textTransform: 'uppercase',
                }}
              >
                RSVP Now
              </motion.a>
            </div>

            {/* Bottom gold bar */}
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, rgba(196,154,40,0.12) 25%, rgba(196,154,40,0.28) 50%, rgba(196,154,40,0.12) 75%, transparent 100%)',
            }} />
          </div>
        </motion.div>
      </motion.div>

      <div id="hero-sentinel" aria-hidden="true" />
    </section>
  )
}
