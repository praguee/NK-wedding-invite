'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { COUPLE, EVENT } from '@/lib/constants'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'

const SCAN_STATUS = [
  'SIGNAL NOT FOUND',
  'SCANNING ENVIRONMENT...',
  'COORDINATES ENCRYPTED',
  'DECODING STREAM...',
  'CONNECTION REFUSED',
]

const CHAR_EASE = [0.16, 1, 0.3, 1] as const

// Each letter tumbles in from below with a 3D flip — theatrical, distinctive
function SplitText({
  text,
  delay = 0,
  style,
}: {
  text: string
  delay?: number
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  if (reduce) return <span style={style}>{text}</span>
  return (
    <span style={{ perspective: 900, display: 'inline-block' }}>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 52, rotateX: -70 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.68,
            ease: CHAR_EASE,
            delay: delay + i * 0.06,
          }}
          style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </span>
  )
}

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

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.25 } },
}
const heroUp   = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0,  transition: { duration: 0.85, ease: EASE } } }

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())
  const [phase, setPhase] = useState<'batman' | 'scan' | 'hero'>('batman')
  const [scanIdx, setScanIdx] = useState(0)
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 700], ['0%', '20%'])
  const isMobile = useMediaQuery('(max-width: 767px)')

  const CYCLE_PHASES: Array<'batman' | 'scan' | 'hero'> = ['batman', 'scan', 'hero']

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let idx = 0
    const id = setInterval(() => {
      idx = (idx + 1) % CYCLE_PHASES.length
      const next = CYCLE_PHASES[idx]
      setPhase(next)
      if (next === 'scan') setScanIdx(s => (s + 1) % SCAN_STATUS.length)
    }, 2400)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isWeddingDay = Object.values(timeLeft).every((v) => v === 0)

  return (
    <section className="min-h-[100svh] md:min-h-screen relative flex flex-col items-center justify-end pb-16 pt-24 overflow-hidden animate-fade-in">

      {/* ── Parallax hero image — Next.js Image for cross-browser consistency ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: 1.05 }}
      >
        <Image
          src="/images/hero-cover.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: isMobile ? '60% 38%' : 'center 38%',
            filter: 'contrast(1.10) saturate(1.20) brightness(0.82) sepia(0.06)',
          }}
        />
      </motion.div>

      {/* ── Cinematic gradient layers ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(10,4,25,0.18) 0%, rgba(10,4,25,0.02) 35%, transparent 55%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(5,2,15,0.97) 0%, rgba(10,4,25,0.88) 25%, rgba(15,6,35,0.55) 50%, transparent 75%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 40% at 50% 65%, rgba(196,120,40,0.22) 0%, transparent 70%)',
      }} />
      <div className="block md:hidden" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(5,2,15,.78), rgba(5,2,15,.35), transparent)',
      }} />

      {/* ── Batman inspiration phase ── */}
      <AnimatePresence>
        {phase === 'batman' && (
          <motion.div
            key="batman-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
          >
            <Image
              src="/images/batman-inspiration.jpg"
              alt=""
              fill
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: isMobile ? '52% 28%' : 'center 28%',
                filter: 'contrast(1.08) saturate(0.85) brightness(0.82)',
              }}
            />
            {/* Vignette matching hero style */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(3,1,10,0.22) 0%, transparent 40%, rgba(3,1,10,0.72) 80%, rgba(3,1,10,0.92) 100%)',
            }} />
            {/* Witty caption */}
            <div style={{
              position: 'absolute', bottom: 32, left: 0, right: 0,
              textAlign: 'center',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 'clamp(8px, 1.8vw, 10px)',
              letterSpacing: '0.32em',
              color: 'rgba(255,255,255,0.28)',
              textTransform: 'uppercase',
            }}>
              same energy · less cape
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cinematic 404 scan overlay ── */}
      <AnimatePresence>
        {phase === 'scan' && (
          <motion.div
            key="scan-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'rgba(3,1,12,0.88)',
              pointerEvents: 'none',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Scanlines */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
            }} />

            {/* Sweeping scan beam */}
            <motion.div
              aria-hidden="true"
              style={{
                position: 'absolute', left: 0, right: 0, height: 1,
                background: 'linear-gradient(90deg, transparent 0%, rgba(196,154,40,0.18) 20%, rgba(196,154,40,0.45) 50%, rgba(196,154,40,0.18) 80%, transparent 100%)',
              }}
              animate={{ top: ['8%', '92%'] }}
              transition={{ duration: 2.0, ease: 'linear', repeat: Infinity }}
            />

            {/* Error text */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 32px' }}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 'clamp(9px, 2.2vw, 11px)',
                  letterSpacing: '0.28em',
                  color: 'rgba(196,154,40,0.40)',
                  marginBottom: 16,
                }}
              >
                {'// NK_WEDDING.SYS'}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12, duration: 0.38 }}
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 'clamp(64px, 16vw, 100px)',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.90)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 80px rgba(196,154,40,0.15)',
                }}
              >
                404
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 'clamp(9px, 2.2vw, 11px)',
                  letterSpacing: '0.28em',
                  color: 'rgba(255,255,255,0.30)',
                  marginTop: 14,
                  textTransform: 'uppercase',
                }}
              >
                {SCAN_STATUS[scanIdx]}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating gold particles ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none', overflow: 'hidden' }}>
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute', bottom: 0, left: p.left,
              width: p.size, height: p.size,
              background: '#C49A28', transform: 'rotate(45deg)', opacity: 0,
              animation: `floatParticle ${p.dur} ${p.delay} infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* ── Hero text — staggered entrance ── */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="show"
        className="relative text-white text-center px-6 max-w-2xl w-full"
        style={{ zIndex: 4 }}
      >
        <motion.p
          variants={heroUp}
          className="text-xs uppercase tracking-[0.4em] mb-6 font-light"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          Together with their families
        </motion.p>

        <div style={{ lineHeight: 1.15, paddingBottom: '0.1em' }}>
          <h1
            aria-label={`${COUPLE.brideName} & ${COUPLE.groomName}`}
            className="block"
            style={{
              fontFamily: 'var(--font-great-vibes)',
              fontSize: 'clamp(56px, 13vw, 108px)',
              fontWeight: 400,
              color: '#C49A28',
              lineHeight: 1.1,
              textShadow: '0 0 48px rgba(196,154,40,0.28), 0 0 120px rgba(196,154,40,0.12)',
            }}
          >
            <SplitText text={COUPLE.brideName} delay={0.32} />
          </h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: CHAR_EASE, delay: 0.82 }}
            className="text-lg font-light my-3 tracking-widest"
            style={{ color: 'rgba(196,154,40,0.6)' }}
          >
            <span aria-hidden="true">✦</span> &amp; <span aria-hidden="true">✦</span>
          </motion.p>
          <div
            aria-hidden="true"
            className="block"
            style={{
              fontFamily: 'var(--font-great-vibes)',
              fontSize: 'clamp(56px, 13vw, 108px)',
              fontWeight: 400,
              color: '#C49A28',
              lineHeight: 1.1,
              textShadow: '0 0 48px rgba(196,154,40,0.28), 0 0 120px rgba(196,154,40,0.12)',
            }}
          >
            <SplitText text={COUPLE.groomName} delay={0.96} />
          </div>
        </div>

        <motion.p
          variants={heroUp}
          className="text-sm font-light mt-6 mb-8 tracking-wide"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          Friday, December 4, 2026 · Thane, Maharashtra
        </motion.p>

        {isWeddingDay ? (
          <motion.p variants={heroUp} className="text-2xl font-light motion-safe:animate-pulse mb-10">
            Today&apos;s the day! <span aria-hidden="true">🎉</span>
          </motion.p>
        ) : (
          <motion.div variants={heroUp} className="mb-10">
            <p className="text-xs tracking-[0.3em] uppercase mb-5" style={{ color: 'rgba(196,154,40,0.5)' }}>
              Counting down to the big day
            </p>
            <div className="flex items-center justify-center gap-1 md:gap-2">
              {[
                { value: timeLeft.days,    label: 'Days'  },
                { value: timeLeft.hours,   label: 'Hours' },
                { value: timeLeft.minutes, label: 'Mins'  },
                { value: timeLeft.seconds, label: 'Secs'  },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-1 md:gap-2">
                  <div style={{
                    minWidth: 'clamp(62px, 15vw, 86px)',
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(44px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(44px) saturate(160%)',
                    border: '1px solid rgba(196,154,40,0.28)',
                    borderRadius: 18,
                    paddingTop: 'clamp(10px, 2.5vw, 18px)',
                    paddingBottom: 'clamp(8px, 2vw, 14px)',
                    paddingLeft: 6, paddingRight: 6,
                    textAlign: 'center' as const,
                  }}>
                    <div className="font-extralight tabular-nums" style={{
                      fontSize: 'clamp(30px, 8vw, 48px)', color: 'white',
                      lineHeight: 1, letterSpacing: '-0.02em',
                    }}>
                      <AnimatedDigit value={value} />
                    </div>
                    <div style={{
                      fontSize: 'clamp(8px, 1.8vw, 10px)', color: 'rgba(196,154,40,0.65)',
                      letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 8,
                    }}>
                      {label}
                    </div>
                  </div>
                  {i < 3 && (
                    <span style={{
                      fontSize: 'clamp(20px, 5vw, 32px)', color: 'rgba(196,154,40,0.35)',
                      fontWeight: 200, lineHeight: 1, marginTop: -14, display: 'block',
                    }}>:</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div variants={heroUp}>
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
        </motion.div>
      </motion.div>

      {/* ── Gradient bridge: hero fades into the ivory Story section ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 200,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,253,246,0.7) 65%, #FFFDF6 100%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      <div id="hero-sentinel" aria-hidden="true" />
    </section>
  )
}
