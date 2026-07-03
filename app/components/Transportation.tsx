'use client'

import Image from 'next/image'
import { VENUE } from '@/lib/constants'
import { Car, Navigation } from 'lucide-react'
import SectionOrnament from './SectionOrnament'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

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
            src="/images/vng1.jpg"
            alt=""
            fill
            priority
            sizes="50vw"
            style={{ objectFit: 'cover', objectPosition: 'center 50%' }}
          />
        </div>
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <Image
            src="/images/vng2.jpg"
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
        background: 'linear-gradient(to bottom, rgba(3,1,10,0.80) 0%, rgba(3,1,10,0.52) 25%, rgba(3,1,10,0.52) 65%, rgba(3,1,10,0.88) 100%)',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(3,1,10,0.28) 0%, transparent 100%)',
      }} />

      {/* ── Content overlaid on photos ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 600,
        marginLeft: 'auto', marginRight: 'auto',
        padding: 'clamp(48px, 8vw, 96px) clamp(18px, 5vw, 40px) clamp(56px, 9vw, 100px)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vw, 40px)' }}>
          <SectionOrnament />
          <motion.h2
            id="travel-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, ease: EASE }}
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.96)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: 'clamp(4px, 0.8vh, 8px)',
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
              fontSize: 'clamp(10px, 1.2vw, 12px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(196,154,40,0.80)',
              margin: 0,
              textShadow: '0 1px 20px rgba(3,1,10,0.9)',
            }}
          >
            Everything you need to find us
          </motion.p>
        </div>

        {/* Venue name + address + directions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
          style={{
            background: 'rgba(8,4,18,0.52)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderBottomColor: 'rgba(0,0,0,0.25)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.38)',
            borderRadius: 'clamp(14px, 2vw, 20px)',
            padding: 'clamp(16px, 3vw, 24px)',
            marginBottom: 'clamp(10px, 2vw, 16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(12px, 2vw, 20px)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <p style={{
              fontSize: 'clamp(9px, 1.05vw, 11px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(196,154,40,0.85)',
              marginBottom: 4,
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            }}>
              Wedding Venue · December 4, 2026
            </p>
            <h3 style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.4rem)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.95)',
              margin: '0 0 4px',
              fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
            }}>
              {VENUE.name}
            </h3>
            <p style={{
              fontSize: 'clamp(11px, 1.15vw, 13px)',
              color: 'rgba(255,255,255,0.50)',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            }}>
              {VENUE.fullAddress}
            </p>
          </div>
          <motion.a
            href={VENUE.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{
              flexShrink: 0,
              fontSize: 'clamp(9px, 1vw, 11px)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '10px 18px',
              borderRadius: 100,
              background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
              color: '#2A1200',
              textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(196,154,40,0.40)',
              cursor: 'pointer',
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Directions →
          </motion.a>
        </motion.div>

        {/* Transport cards: 2-col on tablet+, stacked on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(8px, 1.5vw, 12px)',
          marginBottom: 'clamp(8px, 1.5vw, 12px)',
        }}>
          {/* Parking */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.30, ease: EASE }}
            style={{
              background: 'rgba(8,4,18,0.48)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.30)',
              borderRadius: 'clamp(12px, 1.6vw, 16px)',
              padding: 'clamp(14px, 2.2vw, 20px)',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: 36, height: 36, flexShrink: 0, borderRadius: 10,
              background: 'rgba(196,154,40,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Car size={18} style={{ color: '#C49A28' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: 'clamp(12px, 1.3vw, 14px)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.92)',
                marginBottom: 5,
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              }}>
                Parking &amp; Valet
              </h3>
              <p style={{
                fontSize: 'clamp(11px, 1.05vw, 12px)',
                color: 'rgba(255,255,255,0.48)',
                lineHeight: 1.55,
                margin: 0,
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              }}>
                Ample parking at Abhishek Farms. Valet attendants will guide you from the entrance.
              </p>
            </div>
          </motion.div>

          {/* Getting Here */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.38, ease: EASE }}
            style={{
              background: 'rgba(8,4,18,0.48)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.30)',
              borderRadius: 'clamp(12px, 1.6vw, 16px)',
              padding: 'clamp(14px, 2.2vw, 20px)',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: 36, height: 36, flexShrink: 0, borderRadius: 10,
              background: 'rgba(196,154,40,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Navigation size={18} style={{ color: '#C49A28' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: 'clamp(12px, 1.3vw, 14px)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.92)',
                marginBottom: 5,
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              }}>
                Getting Here
              </h3>
              <p style={{
                fontSize: 'clamp(11px, 1.05vw, 12px)',
                color: 'rgba(255,255,255,0.48)',
                lineHeight: 1.55,
                margin: 0,
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              }}>
                Uber, Ola, and autos work fine up to Yeoor Hills. Tell your driver:{' '}
                <strong style={{ color: 'rgba(255,255,255,0.70)' }}>&ldquo;Abhishek Farms, Narlepada, Yeoor Hills, Thane West&rdquo;</strong>
                {' '}— about 20 mins from Thane station.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Getting Back Down — full width, burgundy accent */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.46, ease: EASE }}
          style={{
            background: 'rgba(139,34,82,0.18)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(139,34,82,0.35)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 20px rgba(139,34,82,0.15)',
            borderRadius: 'clamp(12px, 1.6vw, 16px)',
            padding: 'clamp(14px, 2.2vw, 20px)',
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}
        >
          <div style={{
            width: 36, height: 36, flexShrink: 0, borderRadius: 10,
            background: 'rgba(139,34,82,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Car size={18} style={{ color: '#C4607A' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <h3 style={{
                fontSize: 'clamp(12px, 1.3vw, 14px)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.92)',
                margin: 0,
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              }}>
                Getting Back Down the Hill
              </h3>
              <span style={{
                fontSize: 'clamp(9px, 0.9vw, 10px)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: 100,
                background: 'linear-gradient(135deg, #B8850A, #E8C547)',
                color: '#2A1200',
              }}>
                ★ We&apos;ve arranged this
              </span>
            </div>
            <p style={{
              fontSize: 'clamp(11px, 1.05vw, 12px)',
              color: 'rgba(255,255,255,0.48)',
              lineHeight: 1.55,
              margin: 0,
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            }}>
              Getting an auto or Uber from Yeoor Hills at night is tricky — they don&apos;t venture up here much. So we&apos;ve sorted it.{' '}
              <strong style={{ color: 'rgba(255,255,255,0.70)' }}>Cars with drivers will be stationed at the venue all evening</strong>{' '}
              to drop guests back to Thane city. Just find us before you leave.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
