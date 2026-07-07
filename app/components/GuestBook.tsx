'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { RSVP } from '@/lib/types'
import SectionOrnament from './SectionOrnament'

const GRADIENTS = [
  ['#C49A28', '#B8850A'],
  ['#8B2252', '#A03268'],
  ['#9C7A5A', '#7C5A3A'],
  ['#C49A28', '#8B2252'],
  ['#D4AA38', '#9C7A5A'],
  ['#7A2040', '#5A1228'],
]

function nameGradient(name: string): [string, string] {
  let h = 0
  for (let i = 0; i < name.length; i++) h = ((h * 31) + name.charCodeAt(i)) & 0xffff
  const g = GRADIENTS[Math.abs(h) % GRADIENTS.length]
  return [g[0], g[1]]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export default function GuestBook() {
  const [messages, setMessages] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/guestbook')
      .then(r => r.json())
      .then((data: RSVP[]) => { setMessages(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section
      id="messages"
      aria-labelledby="guestbook-heading"
      style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '100svh',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Background — wishes notes photo. Container extends above the section
          so the "Prayers for Nidhi & Parag's wedding" note (vertical middle of
          the photo) lands in the bright top zone instead of the dark bottom. */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-75%', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <Image
          src="/images/guestbook-bg.jpg"
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          style={{ objectFit: 'cover', objectPosition: '48% center' }}
        />
      </div>

      {/*
        Two-zone vignette:
        - Top 0–15%: dark edges for a cinematic frame
        - 15–42%: near-transparent → photo + wishes notes clearly visible
        - 42–58%: bridge, darkens toward messages
        - 58–100%: dark, message cards live here
      */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: [
          'linear-gradient(to bottom,',
          '  rgba(3,1,10,0.60) 0%,',
          '  rgba(3,1,10,0.18) 14%,',
          '  rgba(3,1,10,0.14) 28%,',
          '  rgba(3,1,10,0.22) 42%,',
          '  rgba(3,1,10,0.78) 56%,',
          '  rgba(3,1,10,0.94) 68%,',
          '  rgba(3,1,10,0.97) 100%',
          ')',
        ].join(''),
      }} />
      {/* Side vignette so edges don't look flat */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 28%, transparent 40%, rgba(3,1,10,0.55) 100%)',
      }} />

      {/* ── Zone 1: photo visible area — heading sits here ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        flex: '0 0 auto',
        padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 52px) clamp(20px, 3vw, 28px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        minHeight: 'clamp(240px, 45svh, 400px)',
      }}>
        <SectionOrnament />

        <motion.h2
          id="guestbook-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(2rem, 4.5vw, 4.5rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.96)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: 0,
            textShadow: '0 2px 32px rgba(3,1,10,0.90)',
          }}
        >
          Guest Book
        </motion.h2>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <p style={{
            fontSize: 'clamp(10px, 1.1vw, 12px)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(196,154,40,0.80)',
            margin: 0,
            fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            textShadow: '0 1px 12px rgba(3,1,10,0.90)',
          }}>
            Wishes from family &amp; friends
          </p>
          {messages.length > 0 && (
            <span style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              flexShrink: 0,
              marginLeft: 8,
              textShadow: '0 1px 8px rgba(3,1,10,0.90)',
            }} aria-live="polite">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </span>
          )}
        </div>
      </div>

      {/* ── Zone 2: messages — dark glass area ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        flex: '1 1 auto',
        padding: '0 clamp(24px, 5vw, 52px) clamp(40px, 6vw, 64px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
      }}>
        {loading ? (
          <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }} role="status">
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'rgba(196,154,40,0.45)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              height: 160,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(8,4,18,0.50)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 20,
            }}
          >
            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.40)',
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
            }}>
              Be the first to leave a message
            </p>
          </motion.div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Bottom fade */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
              zIndex: 10, pointerEvents: 'none',
              background: 'linear-gradient(to top, rgba(3,1,10,0.72), transparent)',
              borderRadius: '0 0 16px 16px',
            }} />

            <div
              ref={scrollRef}
              style={{
                display: 'flex', flexDirection: 'column', gap: 10,
                overflowY: 'auto',
                maxHeight: 'clamp(320px, 48svh, 480px)',
                padding: '4px 0',
                paddingRight: 4,
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(196,154,40,0.18) transparent',
              }}
              role="feed"
              aria-label="Guest messages"
            >
              <AnimatePresence initial={false}>
                {messages.map((m) => {
                  const [from, to] = nameGradient(m.name)
                  const initial = m.name.trim().charAt(0).toUpperCase()
                  return (
                    <motion.article
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35 }}
                      style={{
                        background: 'rgba(8,4,18,0.52)',
                        backdropFilter: 'blur(24px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 20px rgba(0,0,0,0.28)',
                        borderRadius: 16,
                        padding: '14px 16px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: 34, height: 34, borderRadius: '50%',
                            flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `linear-gradient(135deg, ${from}, ${to})`,
                            color: '#fff',
                            fontSize: 13, fontWeight: 600,
                          }}
                          aria-hidden="true"
                        >
                          {initial}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                            <span style={{
                              fontSize: 13, fontWeight: 600,
                              color: 'rgba(255,255,255,0.88)',
                              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {m.name}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                              {m.plus_ones > 0 && (
                                <span style={{
                                  fontSize: 10, padding: '2px 8px', borderRadius: 100,
                                  color: 'rgba(196,154,40,0.80)',
                                  background: 'rgba(196,154,40,0.10)',
                                  border: '1px solid rgba(196,154,40,0.18)',
                                  fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                                }}>
                                  +{m.plus_ones}
                                </span>
                              )}
                              <time style={{
                                fontSize: 10,
                                color: 'rgba(255,255,255,0.28)',
                                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                              }} dateTime={m.created_at}>
                                {formatDate(m.created_at)}
                              </time>
                            </div>
                          </div>
                          {m.message && (
                            <p style={{
                              fontSize: 13, lineHeight: 1.6,
                              color: 'rgba(255,255,255,0.50)',
                              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                              margin: 0,
                            }}>
                              {m.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
