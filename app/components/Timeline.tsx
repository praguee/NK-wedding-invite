'use client'

import { motion } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import { StaggerContainer, StaggerItem, TextReveal } from './ScrollReveal'

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
    desc: 'The sacred Hindu Maharashtrian ceremony — on a floating mandap, in the middle of a pool',
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

export default function Timeline() {
  return (
    <section id="timeline" className="py-20 bg-white">
      <div className="max-w-lg mx-auto px-6">
        <SectionOrnament />
        <TextReveal delay={0.05}>
          <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
            You&apos;re Invited
          </h2>
        </TextReveal>
        <p className="text-center mb-12 text-sm" style={{ color: '#9C7A5A' }}>
          Friday, December 4, 2026
        </p>

        <div className="relative">
          {/* Vertical connecting line — draws down on scroll entry */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-48px' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{
              position: 'absolute',
              left: 19,
              top: 20,
              bottom: 20,
              width: 1,
              background: 'linear-gradient(to bottom, #C4B09A, #C49A28, #9C7A5A, #8B2252)',
              opacity: 0.3,
              transformOrigin: 'top center',
            }}
          />

          <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {EVENTS.map((event, i) => (
              <StaggerItem key={i}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '16px 0' }}>
                  {/* Dot — springs in with a pop */}
                  <div style={{ flexShrink: 0, paddingTop: 3 }}>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.3 + i * 0.14 }}
                      style={{
                        width: 38, height: 38,
                        borderRadius: '50%',
                        background: `${event.dot}18`,
                        border: `1.5px solid ${event.dot}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 12px ${event.dot}20`,
                      }}
                    >
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: event.dot, opacity: 0.85,
                      }} />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: event.accent,
                      background: `${event.accent}14`,
                      border: `1px solid ${event.accent}30`,
                      borderRadius: 100,
                      padding: '3px 10px',
                      marginBottom: 6,
                    }}>
                      {event.time}
                    </span>
                    <h3 style={{
                      fontSize: 16, fontWeight: 600,
                      color: '#1C0F0A', marginBottom: 4,
                      lineHeight: 1.3,
                    }}>
                      {event.title}
                    </h3>
                    <p style={{ fontSize: 13, color: '#7C5A3A', lineHeight: 1.6 }}>
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
