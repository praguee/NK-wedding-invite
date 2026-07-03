'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'
import SectionOrnament from './SectionOrnament'

const EASE = [0.16, 1, 0.3, 1] as const

export default function VenuePreview() {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <section
      aria-label="Venue preview"
      style={{ background: '#07030A', padding: 'clamp(56px, 8vw, 96px) 0 clamp(64px, 9vw, 104px)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 5vw, 56px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 52px)' }}>
          <SectionOrnament />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(9px, 1vw, 11px)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(196, 154, 40, 0.65)',
              marginBottom: 'clamp(10px, 1.5vh, 16px)',
            }}
          >
            Abhishek Farms · Yeoor Hills · Thane
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255, 255, 255, 0.94)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            You&apos;re Invited
          </motion.h2>
        </div>

        {/* Diptych */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 'clamp(10px, 1.8vw, 18px)',
          alignItems: 'start',
        }}>

          {/* Photo 1 — anchored at top */}
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

          {/* Photo 2 — offset down on desktop for diptych stagger */}
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
