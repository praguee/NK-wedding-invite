'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import SectionOrnament from './SectionOrnament'
import { StaggerContainer, StaggerItem } from './ScrollReveal'

const EASE = [0.16, 1, 0.3, 1] as const

const EVENTS = [
  {
    time: '5:00 PM',
    title: 'Guests Arrive',
    desc: 'Welcome and seating begins — find your spot and settle in',
    accent: '#C4B09A',
    dot: '#C4B09A',
  },
  {
    time: '5:30 PM',
    title: 'Wedding Ceremony',
    desc: 'The sacred ceremony — on a floating mandap, in the middle of a pool',
    accent: '#C49A28',
    dot: '#C49A28',
  },
  {
    time: '7:30 PM',
    title: 'Evening Refreshments',
    desc: 'Light snacks, beverages, and good company while we transition',
    accent: '#9C7A5A',
    dot: '#9C7A5A',
  },
  {
    time: '8:00 PM',
    title: 'Reception',
    desc: 'Dinner, music, dancing, and celebrations till the night gives up',
    accent: '#8B2252',
    dot: '#8B2252',
  },
]

export default function VenuePreview() {
  return (
    <section
      id="timeline"
      aria-labelledby="invite-heading"
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}
    >

      {/* ── Full-section background: two photos side by side ── */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, display: 'flex' }}
      >
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <Image
            src="/images/invited1.jpg"
            alt=""
            fill
            priority
            sizes="50vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        </div>
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <Image
            src="/images/invited2.jpg"
            alt=""
            fill
            sizes="50vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        </div>
      </div>

      {/* ── Cinematic vignette — heavier top + bottom for text legibility ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(3,1,10,0.82) 0%, rgba(3,1,10,0.55) 22%, rgba(3,1,10,0.50) 60%, rgba(3,1,10,0.90) 100%)',
      }} />
      {/* Center horizontal darkening so timeline text pops */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(3,1,10,0.30) 0%, transparent 100%)',
      }} />

      {/* ── Content overlaid on photos ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 560,
        marginLeft: 'auto', marginRight: 'auto',
        padding: 'clamp(60px, 9vw, 104px) clamp(20px, 5vw, 40px) clamp(72px, 10vw, 112px)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 52px)' }}>
          <SectionOrnament />

          {/* Marathi — लग्नाला नक्की या */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            lang="mr"
            style={{
              fontFamily: '"Noto Serif Devanagari", "Mangal", serif',
              fontSize: 'clamp(14px, 1.8vw, 20px)',
              fontWeight: 400,
              color: 'rgba(196, 154, 40, 0.68)',
              letterSpacing: '0.06em',
              margin: '0 0 clamp(8px, 1.2vh, 14px)',
              textShadow: '0 1px 20px rgba(3,1,10,0.9)',
            }}
          >
            लग्नाला नक्की या
          </motion.p>

          <motion.h2
            id="invite-heading"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, delay: 0.10, ease: EASE }}
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255, 255, 255, 0.96)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              margin: 0,
              marginBottom: 'clamp(6px, 1vh, 10px)',
              textShadow: '0 2px 40px rgba(3,1,10,0.85)',
            }}
          >
            You&apos;re Invited
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(10px, 1.2vw, 13px)',
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'rgba(196, 154, 40, 0.85)',
              margin: 0,
              textShadow: '0 1px 20px rgba(3,1,10,0.9)',
            }}
          >
            Friday, December 4, 2026
          </motion.p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical connecting line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-48px' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{
              position: 'absolute',
              left: 19, top: 20, bottom: 20, width: 1,
              background: 'linear-gradient(to bottom, #C4B09A, #C49A28, #9C7A5A, #8B2252)',
              opacity: 0.35,
              transformOrigin: 'top center',
            }}
          />

          <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {EVENTS.map((event, i) => (
              <StaggerItem key={i}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '16px 0' }}>
                  {/* Dot */}
                  <div style={{ flexShrink: 0, paddingTop: 3 }}>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.3 + i * 0.14 }}
                      style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: `${event.dot}22`,
                        border: `1.5px solid ${event.dot}65`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 16px ${event.dot}35`,
                      }}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: event.dot, opacity: 0.9 }} />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: event.accent,
                      background: `${event.accent}22`,
                      border: `1px solid ${event.accent}45`,
                      borderRadius: 100,
                      padding: '3px 10px',
                      marginBottom: 6,
                    }}>
                      {event.time}
                    </span>
                    <h3 style={{
                      fontSize: 16, fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.94)',
                      marginBottom: 4, lineHeight: 1.3,
                      textShadow: '0 1px 16px rgba(3,1,10,0.95)',
                    }}>
                      {event.title}
                    </h3>
                    <p style={{
                      fontSize: 13,
                      color: 'rgba(255, 255, 255, 0.55)',
                      lineHeight: 1.6,
                      textShadow: '0 1px 10px rgba(3,1,10,0.90)',
                    }}>
                      {event.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

      </div>
    </section>
  )
}
