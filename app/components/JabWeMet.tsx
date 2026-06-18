'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import LotusDecoration from './LotusDecoration'
import { SlideIn, StaggerContainer, StaggerItem, TextReveal } from './ScrollReveal'

const FIRST_MET = new Date('2022-12-23T00:00:00+05:30')

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
  const [t, setT] = useState({ years: 0, months: 0, days: 0 })

  useEffect(() => {
    setT(getTimeTogether())
    const interval = setInterval(() => setT(getTimeTogether()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="jab-we-met" className="py-24 bg-slate-50 relative overflow-hidden" aria-labelledby="jwm-heading">
      <LotusDecoration position="top-left" size={120} opacity={0.07} />
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <TextReveal delay={0.05}>
          <h2 id="jwm-heading" className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
            Jab We Met
          </h2>
        </TextReveal>
        <p className="text-center mb-14 text-sm" style={{ color: '#9C7A5A' }}>
          How it all started{' '}
          <span style={{ opacity: 0.5 }}>— not directed by Imtiaz Ali</span>
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Story — slides in from left */}
          <SlideIn from="left">
            <StaggerContainer className="space-y-5">
              {[
                <><span>It was at </span><strong style={{ color: '#C49A28' }}>Runwal Greens, Mulund</strong><span>. Nidhi showed up straight from office — laptop bag on shoulder, mask on face, because pandemic habits don&apos;t die, they just relocate to social situations.</span></>,
                <>Parag thought: alright, seems nice.</>,
                <>Then she took off the mask.</>,
                <>That was the moment. He didn&apos;t say it out loud. He just quietly knew.</>,
                <>They had a few drinks, danced — the kind of dancing that happens when you&apos;re both pretending you&apos;re not trying to impress each other. Parag dropped her home like a complete gentleman.</>,
                <>He drove back. Went to bed. Woke up the next morning. And only <em>two days later</em>, mid-reach for his wallet — gone. Left at her place.</>,
                <>Here&apos;s the thing: he didn&apos;t call to ask for it back. Not because he forgot. Because it gave him an excuse to meet her again.</>,
              ].map((para, i) => (
                <StaggerItem key={i}>
                  <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>{para}</p>
                </StaggerItem>
              ))}
              <StaggerItem>
                <p className="text-sm italic mt-2" style={{ color: '#9C7A5A' }}>
                  She says she didn&apos;t steal it. We&apos;re letting you decide. <span aria-hidden="true">🕵️</span>
                </p>
              </StaggerItem>
            </StaggerContainer>

            {/* Live counter */}
            <div className="mt-8">
              <p className="text-xs text-center mb-3 tracking-widest uppercase" style={{ color: '#9C7A5A' }}>
                Known each other for
              </p>
              <div className="flex gap-3" role="group" aria-label="Time since first meeting">
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
                    <p className="text-2xl font-extralight tracking-tight" style={{ color: '#C49A28' }}>{value}</p>
                    <p className="text-xs mt-1" style={{ color: '#9C7A5A' }}>{label}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-center mt-3" style={{ color: '#C4B09A' }}>
                Counting every day since the universe decided to be helpful
              </p>
            </div>
          </SlideIn>

          {/* Photo placeholder — slides in from right */}
          <SlideIn from="right" delay={0.12}>
            <motion.div
              className="aspect-[4/5] rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #f0e8d8, #e8d5c4)',
                boxShadow: '0 8px 40px rgba(196,154,40,0.12)',
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
            >
              {[
                { top: 12, left: 12,  d: 'M0 32 L0 0 L32 0',   cx: 0,  cy: 0  },
                { top: 12, right: 12, d: 'M32 32 L32 0 L0 0',  cx: 32, cy: 0  },
                { bottom: 12, left: 12,  d: 'M0 0 L0 32 L32 32', cx: 0, cy: 32 },
                { bottom: 12, right: 12, d: 'M32 0 L32 32 L0 32',cx: 32,cy: 32 },
              ].map((f, i) => (
                <svg key={i} aria-hidden="true" style={{ position: 'absolute', width: 32, height: 32, opacity: 0.35, ...f }} viewBox="0 0 32 32">
                  <path d={f.d} fill="none" stroke="#C49A28" strokeWidth="1.5"/>
                  <circle cx={f.cx} cy={f.cy} r="3" fill="#C49A28"/>
                </svg>
              ))}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
                <span role="presentation" aria-hidden="true" style={{ fontSize: 40 }}>📸</span>
                <p className="text-center text-sm italic" style={{ color: '#9C7A5A' }}>
                  Photos from when they met<br/>— coming soon
                </p>
              </div>
            </motion.div>
          </SlideIn>

        </div>
      </div>
    </section>
  )
}
