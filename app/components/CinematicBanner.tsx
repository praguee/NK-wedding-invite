'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

export default function CinematicBanner() {
  return (
    <section
      aria-label="Nidhi and Parag — December 4, 2026 at Abhishek Farms"
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(60vh, 80vh, 92vh)',
        overflow: 'hidden',
      }}
    >
      {/* Photo — fills horizontally, landscape orientation */}
      <Image
        src="/images/story-wayofwater.jpg"
        alt="Abhishek Farms floating mandap, Yeoor Hills, Thane"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        priority={false}
      />

      {/* Cinematic vignette — light at top, dark at bottom for text */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(3,1,10,0.18) 0%, rgba(3,1,10,0.05) 28%, rgba(3,1,10,0.48) 65%, rgba(3,1,10,0.88) 100%)',
      }} />

      {/* Thin gold rule — wipes in from the left */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        style={{
          position: 'absolute',
          bottom: '26%',
          left: 0,
          right: 0,
          height: 1,
          background: 'rgba(196,154,40,0.24)',
          transformOrigin: 'left center',
        }}
      />

      {/* Content — bottom-aligned, editorial layout */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(28px, 5vw, 64px)',
      }}>

        {/* Large display text — herocollective cinematic treatment */}
        <div style={{ overflow: 'hidden', marginBottom: 'clamp(14px, 2.4vh, 28px)' }}>
          <motion.div
            initial={{ y: '104%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.82, ease: EASE }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
                fontSize: 'clamp(5.5rem, 19vw, 20rem)',
                fontWeight: 900,
                fontStyle: 'italic',
                lineHeight: 0.84,
                color: 'rgba(255, 255, 255, 0.96)',
                letterSpacing: '-0.025em',
                margin: 0,
              }}
            >
              N{' '}
              <span
                aria-hidden="true"
                style={{
                  color: '#C49A28',
                  fontSize: '0.48em',
                  verticalAlign: 'middle',
                  display: 'inline-block',
                  transform: 'translateY(-0.12em)',
                }}
              >
                ✦
              </span>
              {' '}P
            </h2>
          </motion.div>
        </div>

        {/* Caption strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.60, delay: 0.38, ease: EASE }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 1.8vw, 20px)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            fontSize: 'clamp(9px, 1.1vw, 12px)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(246, 237, 218, 0.50)',
          }}>
            December 4, 2026
          </span>

          <span aria-hidden="true" style={{
            width: 1, height: 12, flexShrink: 0,
            background: 'rgba(196, 154, 40, 0.38)',
            display: 'inline-block',
          }} />

          <span style={{
            fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            fontSize: 'clamp(9px, 1.1vw, 12px)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(246, 237, 218, 0.50)',
          }}>
            Abhishek Farms, Yeoor Hills
          </span>

          <span aria-hidden="true" style={{
            width: 1, height: 12, flexShrink: 0,
            background: 'rgba(196, 154, 40, 0.38)',
            display: 'inline-block',
          }} />

          <span style={{
            fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            fontSize: 'clamp(9px, 1.1vw, 12px)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(196, 154, 40, 0.65)',
          }}>
            A Wedding on Water
          </span>
        </motion.div>
      </div>
    </section>
  )
}
