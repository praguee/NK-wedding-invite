'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'
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
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <section
      id="timeline"
      aria-labelledby="invite-heading"
      style={{ background: '#07030A', padding: 'clamp(56px, 8vw, 96px) 0 clamp(64px, 9vw, 104px)' }}
    >

      {/* ── Header ── */}
      <div style={{
        maxWidth: 520,
        marginLeft: 'auto', marginRight: 'auto',
        marginBottom: 'clamp(32px, 5vw, 52px)',
        padding: '0 clamp(20px, 5vw, 40px)',
        textAlign: 'center',
      }}>
        <SectionOrnament />
        <motion.h2
          id="invite-heading"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.94)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            margin: 0,
            marginBottom: 'clamp(6px, 1vh, 10px)',
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
            color: 'rgba(196, 154, 40, 0.65)',
            margin: 0,
          }}
        >
          Friday, December 4, 2026
        </motion.p>
      </div>

      {/* ── Timeline ── */}
      <div style={{
        maxWidth: 520,
        marginLeft: 'auto', marginRight: 'auto',
        marginBottom: 'clamp(52px, 8vw, 88px)',
        padding: '0 clamp(20px, 5vw, 40px)',
      }}>
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
              opacity: 0.22,
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
                        background: `${event.dot}18`,
                        border: `1.5px solid ${event.dot}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 14px ${event.dot}25`,
                      }}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: event.dot, opacity: 0.85 }} />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: event.accent,
                      background: `${event.accent}18`,
                      border: `1px solid ${event.accent}35`,
                      borderRadius: 100,
                      padding: '3px 10px',
                      marginBottom: 6,
                    }}>
                      {event.time}
                    </span>
                    <h3 style={{
                      fontSize: 16, fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.88)',
                      marginBottom: 4, lineHeight: 1.3,
                    }}>
                      {event.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.40)', lineHeight: 1.6 }}>
                      {event.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* ── Gold rule divider ── */}
      <div aria-hidden="true" style={{
        width: 'clamp(48px, 7vw, 80px)', height: 1,
        background: 'linear-gradient(to right, transparent, rgba(196,154,40,0.30), transparent)',
        marginLeft: 'auto', marginRight: 'auto',
        marginBottom: 'clamp(40px, 6vw, 60px)',
      }} />

      {/* ── Venue photo diptych ── */}
      <div style={{
        maxWidth: 1100,
        marginLeft: 'auto', marginRight: 'auto',
        padding: '0 clamp(20px, 5vw, 56px)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 'clamp(10px, 1.8vw, 18px)',
          alignItems: 'start',
        }}>

          <motion.div
            initial={{ opacity: 0, y: 44, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: EASE }}
            style={{
              position: 'relative',
              borderRadius: 'clamp(8px, 1vw, 14px)',
              overflow: 'hidden',
              aspectRatio: '3 / 4',
            }}
          >
            <Image
              src="/images/invited1.jpg"
              alt="Abhishek Farms — stage and seating ready for the ceremony"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center 38%' }}
            />
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(7,3,10,0.06) 0%, rgba(7,3,10,0.04) 50%, rgba(7,3,10,0.45) 100%)',
            }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 64, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            style={{
              position: 'relative',
              borderRadius: 'clamp(8px, 1vw, 14px)',
              overflow: 'hidden',
              aspectRatio: '3 / 4',
              marginTop: isMobile ? 0 : 'clamp(36px, 5vw, 64px)',
            }}
          >
            <Image
              src="/images/invited2.jpg"
              alt="Abhishek Farms — floral archways and gold chiavari chairs"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center 42%' }}
            />
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(7,3,10,0.06) 0%, rgba(7,3,10,0.04) 50%, rgba(7,3,10,0.45) 100%)',
            }} />
          </motion.div>

        </div>
      </div>

    </section>
  )
}
