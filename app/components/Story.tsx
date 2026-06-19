'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import LotusDecoration from './LotusDecoration'
import Image from 'next/image'
import { SlideIn, StaggerContainer, StaggerItem } from './ScrollReveal'

const RELATIONSHIP_START = new Date('2023-07-08T00:00:00+05:30')
const EASE = [0.16, 1, 0.3, 1] as const

function getRelationshipTime() {
  const diff      = Date.now() - RELATIONSHIP_START.getTime()
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  const years     = Math.floor(totalDays / 365)
  const months    = Math.floor((totalDays - years * 365) / 30)
  const days      = totalDays - years * 365 - months * 30
  return { years, months, days }
}

export default function Story() {
  const [t, setT] = useState({ years: 0, months: 0, days: 0 })

  useEffect(() => {
    setT(getRelationshipTime())
    const id = setInterval(() => setT(getRelationshipTime()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="story" className="relative overflow-hidden bg-white" aria-labelledby="story-heading">
      <LotusDecoration position="top-right" size={120} opacity={0.07} />

      {/* ── Cinematic image header — full-width landscape ── */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(55vh, 72vh, 85vh)', overflow: 'hidden' }}>
        <Image
          src="/images/story-wayofwater.jpg"
          alt="Abhishek Farms floating mandap — where it all begins"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
        />

        {/* Cinematic vignette — lighter at top, deep at bottom for text */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(3,1,10,0.10) 0%, rgba(3,1,10,0.04) 30%, rgba(3,1,10,0.52) 68%, rgba(3,1,10,0.88) 100%)',
          }}
        />

        {/* Thin gold rule that wipes across */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
          style={{
            position: 'absolute',
            bottom: '28%',
            left: 0, right: 0,
            height: 1,
            background: 'rgba(196,154,40,0.22)',
            transformOrigin: 'left center',
          }}
        />

        {/* Ornament — top left inside image */}
        <div style={{ position: 'absolute', top: 28, left: 28, zIndex: 2 }}>
          <SectionOrnament />
        </div>

        {/* Title + caption — bottom of image */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(24px, 4vw, 56px)',
          zIndex: 2,
        }}>
          {/* Heading — slides up from behind the overflow clip */}
          <div style={{ overflow: 'hidden', marginBottom: 'clamp(10px, 1.6vh, 18px)' }}>
            <motion.h2
              id="story-heading"
              initial={{ y: '105%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.78, ease: EASE }}
              style={{
                fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
                fontSize: 'clamp(3.2rem, 8.5vw, 9rem)',
                fontWeight: 900,
                fontStyle: 'italic',
                lineHeight: 0.88,
                color: 'rgba(255, 255, 255, 0.96)',
                letterSpacing: '-0.025em',
                margin: 0,
              }}
            >
              The Way of Water
            </motion.h2>
          </div>

          {/* Caption strip */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(10px, 1.8vw, 18px)',
              flexWrap: 'wrap',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(9px, 1.1vw, 12px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(246, 237, 218, 0.45)',
            }}>
              not directed by James Cameron
            </span>
            <span aria-hidden="true" style={{ width: 1, height: 10, flexShrink: 0, background: 'rgba(196,154,40,0.35)', display: 'inline-block' }} />
            <span style={{
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(9px, 1.1vw, 12px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(196, 154, 40, 0.65)',
              fontStyle: 'italic',
            }}>
              Water brought us together. Water will witness our forever.
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── Story content — below the image ── */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Story text */}
          <SlideIn from="left" className="space-y-5">
            <StaggerContainer className="space-y-5">
              {[
                <>Nidhi has always had a deep, unshakeable love for water. Whether it&apos;s a three-hour bath, a glass of water every five minutes, or drinking water until she physically cannot drink more water — Nidhi and hydration have an exclusive, committed relationship.</>,
                <>Parag noticed this early on, and when the moment came to ask if she&apos;d be his girlfriend, he didn&apos;t go for a candlelit dinner or a rooftop view.</>,
                <>He asked her in the shower. Yes, really. <strong style={{ color: '#C49A28' }}>8th July 2023.</strong> She said yes — and honestly, we think she had no choice. It was too original to refuse.</>,
                <>So when it came to the wedding, there was really only one way to do it properly. They&apos;re exchanging vows on a <strong style={{ color: '#C49A28' }}>floating mandap, right in the middle of a pool</strong> — surrounded by flowers, family, and the element that started it all.</>,
              ].map((para, i) => (
                <StaggerItem key={i}>
                  <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>{para}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </SlideIn>

          {/* Relationship counter + wedding detail */}
          <SlideIn from="right" delay={0.12} className="space-y-6">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#9C7A5A' }}>
                In a relationship for
              </p>
              <div className="flex gap-3" role="group" aria-label="Relationship duration">
                {[
                  { value: t.years,  label: 'years'  },
                  { value: t.months, label: 'months' },
                  { value: t.days,   label: 'days'   },
                ].map(({ value, label }) => (
                  <motion.div
                    key={label}
                    className="glass-gold rounded-xl p-4 text-center flex-1"
                    whileHover={{ scale: 1.04, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <p className="text-2xl font-extralight" style={{ color: '#C49A28' }}>{value}</p>
                    <p className="text-xs mt-1" style={{ color: '#9C7A5A' }}>{label}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: '#C4B09A' }}>
                Since 8 July 2023 — officially, officially official
              </p>
            </div>

            <div className="glass-gold rounded-2xl px-5 py-4 text-center">
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C49A28' }}>The Wedding</p>
              <p className="text-sm font-light" style={{ color: '#5C3A2E' }}>
                A floating mandap · in the middle of a pool
              </p>
            </div>
          </SlideIn>

        </div>
      </div>
    </section>
  )
}
