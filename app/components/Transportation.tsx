'use client'

import Image from 'next/image'
import { VENUE } from '@/lib/constants'
import SectionOrnament from './SectionOrnament'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const INFO = [
  {
    label: 'Parking & Valet',
    text: 'Ample parking at Abhishek Farms. Valet attendants will guide you from the entrance — just roll up and hand over the keys.',
    accent: 'rgba(196,154,40,0.70)',
    dot: '#C49A28',
  },
  {
    label: 'Getting Here',
    text: 'Uber, Ola, and autos work fine heading up to Yeoor Hills. Tell your driver: "Abhishek Farms, Narlepada, Yeoor Hills, Thane West" — about 20 mins from Thane station.',
    accent: 'rgba(196,154,40,0.70)',
    dot: '#C49A28',
  },
  {
    label: 'Getting Back Down the Hill',
    text: 'Getting a ride from Yeoor Hills at night can be a mission — they don\'t venture up here much. So we\'ve sorted it. Cars with drivers will be stationed at the venue all evening to drop guests back to Thane city. Find us before you\'re ready to leave.',
    note: 'we\'ve arranged this',
    accent: 'rgba(196,100,120,0.70)',
    dot: '#C4607A',
  },
]

export default function Transportation() {
  return (
    <section
      id="travel"
      aria-labelledby="travel-heading"
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100svh' }}
    >
      {/* ── Full-section background: two photos side by side ── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <Image
            src="/images/travel-bg-1.jpg"
            alt=""
            fill
            priority
            sizes="50vw"
            style={{ objectFit: 'cover', objectPosition: 'center 50%' }}
          />
        </div>
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <Image
            src="/images/travel-bg-2.jpg"
            alt=""
            fill
            sizes="50vw"
            style={{ objectFit: 'cover', objectPosition: 'center 50%' }}
          />
        </div>
      </div>

      {/* ── Cinematic vignette ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(3,1,10,0.82) 0%, rgba(3,1,10,0.55) 28%, rgba(3,1,10,0.55) 65%, rgba(3,1,10,0.90) 100%)',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 60% at 50% 50%, rgba(3,1,10,0.28) 0%, transparent 100%)',
      }} />

      {/* ── Content overlaid on photos ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 560,
        marginLeft: 'auto', marginRight: 'auto',
        padding: 'clamp(52px, 8vw, 96px) clamp(20px, 5vw, 40px) clamp(60px, 9vw, 104px)',
      }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 52px)' }}>
          <SectionOrnament />
          <motion.h2
            id="travel-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, ease: EASE }}
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.2rem, 5.2vw, 5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.96)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: 'clamp(6px, 1vh, 10px)',
              textShadow: '0 2px 40px rgba(3,1,10,0.85)',
            }}
          >
            Venue &amp; Getting There
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(10px, 1.15vw, 12px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(196,154,40,0.75)',
              margin: 0,
              textShadow: '0 1px 20px rgba(3,1,10,0.9)',
            }}
          >
            Up in the hills. Worth every turn.
          </motion.p>
        </div>

        {/* ── Venue block ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.68, delay: 0.18, ease: EASE }}
          style={{
            marginBottom: 'clamp(28px, 4.5vw, 48px)',
            paddingBottom: 'clamp(24px, 4vw, 40px)',
            borderBottom: '1px solid rgba(196,154,40,0.18)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            fontSize: 'clamp(9px, 1vw, 11px)',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(196,154,40,0.72)',
            marginBottom: 'clamp(6px, 1vh, 10px)',
          }}>
            December 4, 2026 · Thane West, Maharashtra
          </p>
          <h3 style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 clamp(6px, 1vh, 10px)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            {VENUE.name}
          </h3>
          <p style={{
            fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            fontSize: 'clamp(11px, 1.2vw, 13px)',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.6,
            margin: '0 0 clamp(12px, 2vh, 18px)',
          }}>
            {VENUE.fullAddress}
          </p>
          <motion.a
            href={VENUE.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(10px, 1.1vw, 12px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(196,154,40,0.85)',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            aria-label="Open Abhishek Farms in Google Maps"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Open in Maps
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.6 }}>
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </motion.a>
        </motion.div>

        {/* ── Info items — free-flowing, no boxes ── */}
        <div style={{ position: 'relative' }}>
          {/* Vertical connecting line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              position: 'absolute',
              left: 19, top: 20, bottom: 20, width: 1,
              background: 'linear-gradient(to bottom, #C49A28, #C4607A)',
              opacity: 0.28,
              transformOrigin: 'top center',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {INFO.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.58, delay: 0.25 + i * 0.14, ease: EASE }}
                style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: 'clamp(14px, 2.2vh, 22px) 0' }}
              >
                {/* Dot */}
                <div style={{ flexShrink: 0, paddingTop: 3 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `${item.dot}18`,
                    border: `1.5px solid ${item.dot}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 14px ${item.dot}30`,
                  }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: item.dot, opacity: 0.88 }} />
                  </div>
                </div>

                {/* Text */}
                <div style={{ flex: 1, paddingTop: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                      fontSize: 'clamp(13px, 1.4vw, 15px)',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.90)',
                      margin: 0,
                      textShadow: '0 1px 14px rgba(3,1,10,0.95)',
                    }}>
                      {item.label}
                    </h3>
                    {item.note && (
                      <span style={{
                        fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
                        fontSize: 'clamp(9px, 0.95vw, 11px)',
                        fontStyle: 'italic',
                        color: 'rgba(196,100,120,0.72)',
                        letterSpacing: '0.04em',
                      }}>
                        — {item.note}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                    fontSize: 'clamp(12px, 1.2vw, 13.5px)',
                    color: 'rgba(255,255,255,0.50)',
                    lineHeight: 1.65,
                    margin: 0,
                    textShadow: '0 1px 10px rgba(3,1,10,0.90)',
                  }}>
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
