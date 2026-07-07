'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'

const FIRST_MET = new Date('2022-12-23T00:00:00+05:30')
const EASE = [0.16, 1, 0.3, 1] as const

function getTimeTogether() {
  const diff      = Date.now() - FIRST_MET.getTime()
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  const years     = Math.floor(totalDays / 365)
  const remainDays = totalDays - years * 365
  const months    = Math.floor(remainDays / 30)
  const days      = remainDays - months * 30
  return { years, months, days }
}

export default function JabWeMet() {
  const [t, setT]   = useState({ years: 0, months: 0, days: 0 })
  const isMobile    = useMediaQuery('(max-width: 767px)')

  useEffect(() => {
    setT(getTimeTogether())
    const id = setInterval(() => setT(getTimeTogether()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="jab-we-met" aria-labelledby="jwm-heading" style={{ position: 'relative' }}>

      {/* ── Full-section cinematic image ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        // Mobile: cap height at the photo's aspect ratio (1206x1497 ≈ 124vw)
        // so the full frame is visible instead of a cropped sliver
        height: isMobile ? 'min(88vh, 124vw)' : 'clamp(72vh, 88vh, 96vh)',
        overflow: 'hidden',
      }}>
        <Image
          src="/images/jabwemet-bg.jpg"
          alt="Nidhi and Parag — Diwali, Mumbai"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 28%' }}
        />

        {/* Deep cinematic vignette — heavier at bottom for legibility */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(3,1,10,0.10) 0%, rgba(3,1,10,0.02) 28%, rgba(3,1,10,0.50) 62%, rgba(3,1,10,0.94) 100%)',
        }} />

        {/* ── Bottom bar: title (left) + counter (right) ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(20px, 4vw, 52px)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 'clamp(16px, 3vw, 32px)',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}>

          {/* Left: cinematic title */}
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <motion.h2
              id="jwm-heading"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.78, ease: EASE }}
              style={{
                fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
                fontSize: 'clamp(2.8rem, 7.5vw, 8.5rem)',
                fontWeight: 900,
                fontStyle: 'italic',
                lineHeight: 0.88,
                color: 'rgba(255, 255, 255, 0.96)',
                letterSpacing: '-0.025em',
                margin: 0,
                marginBottom: 'clamp(8px, 1.4vh, 14px)',
              }}
            >
              Jab We Met
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 16px)', flexWrap: 'wrap' }}
            >
              <span style={{
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                fontSize: 'clamp(9px, 1.1vw, 11px)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(246, 237, 218, 0.40)',
              }}>
                not directed by Imtiaz Ali
              </span>
              <span aria-hidden="true" style={{ width: 1, height: 10, flexShrink: 0, background: 'rgba(196,154,40,0.35)', display: 'inline-block' }} />
              <span style={{
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                fontSize: 'clamp(9px, 1.1vw, 11px)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(196, 154, 40, 0.60)',
                fontStyle: 'italic',
              }}>
                23 December 2022 · Runwal Greens, Mumbai
              </span>
            </motion.div>
          </div>

          {/* Right: known each other counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.48, ease: EASE }}
            style={{ flexShrink: 0, textAlign: 'center' }}
            aria-label="Time known each other"
          >
            <p style={{
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(8px, 0.9vw, 10px)',
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              color: 'rgba(196, 154, 40, 0.72)',
              marginBottom: 'clamp(8px, 1.2vh, 12px)',
            }}>
              Known each other for
            </p>

            {/* Three glass counter pills */}
            <div style={{ display: 'flex', gap: 'clamp(6px, 1.2vw, 12px)' }} role="group">
              {[
                { value: t.years,  label: 'years'  },
                { value: t.months, label: 'months' },
                { value: t.days,   label: 'days'   },
              ].map(({ value, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -3, scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  style={{
                    background: 'rgba(8, 4, 18, 0.58)',
                    backdropFilter: 'blur(28px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderBottomColor: 'rgba(0, 0, 0, 0.22)',
                    boxShadow: [
                      'inset 0 1px 0 rgba(255, 255, 255, 0.18)',
                      'inset 0 0 0 0.5px rgba(255, 255, 255, 0.07)',
                      '0 8px 32px rgba(0, 0, 0, 0.40)',
                      '0 0 0 0.5px rgba(196, 154, 40, 0.10)',
                    ].join(', '),
                    borderRadius: 'clamp(8px, 1vw, 14px)',
                    padding: 'clamp(10px, 1.4vh, 16px) clamp(12px, 1.8vw, 22px)',
                    textAlign: 'center',
                    minWidth: 'clamp(54px, 7vw, 84px)',
                  }}
                >
                  <p style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 'clamp(22px, 3.2vw, 42px)',
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.92)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}>
                    {String(value).padStart(2, '0')}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                    fontSize: 'clamp(7px, 0.85vw, 9px)',
                    letterSpacing: '0.20em',
                    textTransform: 'uppercase',
                    color: 'rgba(196, 154, 40, 0.62)',
                    marginTop: 'clamp(4px, 0.6vh, 7px)',
                  }}>
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(7px, 0.82vw, 9px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(246, 237, 218, 0.28)',
              marginTop: 'clamp(6px, 0.8vh, 10px)',
            }}>
              Counting every day since the universe decided to be helpful
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
