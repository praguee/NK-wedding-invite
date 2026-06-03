'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

const EVENTS = [
  { time: '5:00 PM', title: 'Guests Arrive',          desc: 'Welcome and seating begins',                  accent: '#a78bfa' },
  { time: '5:30 PM', title: 'Wedding Ceremony',        desc: 'The sacred Hindu Maharashtrian ceremony',     accent: '#c084fc' },
  { time: '7:30 PM', title: 'Evening Refreshments',    desc: 'Light snacks and beverages',                  accent: '#818cf8' },
  { time: '8:00 PM', title: 'Reception',               desc: 'Dinner, music, and celebrations',             accent: '#34d399' },
]

const ITEM_H = 96 // px per item

export default function Timeline() {
  const scrollRef  = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(1) // default to Wedding Ceremony

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollTop / ITEM_H)
    setActive(Math.max(0, Math.min(idx, EVENTS.length - 1)))
  }, [])

  // Scroll to default active item on mount
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = active * ITEM_H
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="timeline" className="py-20 bg-white">
      <div className="max-w-md mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Schedule
        </h2>
        <p className="text-center text-slate-500 mb-10 text-sm">
          Friday, December 4, 2026
        </p>

        {/* iOS-style scroll wheel */}
        <div
          style={{
            position: 'relative',
            height: ITEM_H * 3,
            borderRadius: 24,
            overflow: 'hidden',
            background: '#f8fafc',
            boxShadow: '0 2px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* Scrollable list */}
          <div
            ref={scrollRef}
            onScroll={onScroll}
            style={{
              height: ITEM_H * 3,
              overflowY: 'scroll',
              scrollSnapType: 'y mandatory',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Top padding so first item can center */}
            <div style={{ height: ITEM_H, flexShrink: 0 }} />

            {EVENTS.map((event, i) => {
              const distance = Math.abs(i - active)
              const opacity  = distance === 0 ? 1 : distance === 1 ? 0.38 : 0.15
              const scale    = distance === 0 ? 1 : distance === 1 ? 0.93 : 0.86
              const blur     = distance === 0 ? 0 : distance === 1 ? 1 : 2

              return (
                <div
                  key={i}
                  style={{
                    height: ITEM_H,
                    scrollSnapAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 28px',
                    gap: 18,
                    opacity,
                    transform: `scale(${scale}) perspective(400px) rotateX(${distance * 10}deg)`,
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                    transition: 'opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const el = scrollRef.current
                    if (el) el.scrollTo({ top: i * ITEM_H, behavior: 'smooth' })
                  }}
                >
                  {/* Time pill */}
                  <div
                    style={{
                      flexShrink: 0,
                      background: distance === 0 ? event.accent : 'transparent',
                      border: `1.5px solid ${distance === 0 ? event.accent : '#e2e8f0'}`,
                      borderRadius: 100,
                      padding: '5px 14px',
                      fontSize: 13,
                      fontWeight: distance === 0 ? 600 : 400,
                      color: distance === 0 ? '#fff' : '#94a3b8',
                      minWidth: 80,
                      textAlign: 'center',
                      letterSpacing: '0.02em',
                      transition: 'all 0.2s ease',
                      boxShadow: distance === 0 ? `0 4px 12px ${event.accent}55` : 'none',
                    }}
                  >
                    {event.time}
                  </div>

                  {/* Text */}
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: distance === 0 ? 15 : 14,
                        fontWeight: distance === 0 ? 600 : 400,
                        color: distance === 0 ? '#0f172a' : '#64748b',
                        marginBottom: 2,
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {event.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: distance === 0 ? '#64748b' : '#cbd5e1',
                        transition: 'color 0.2s ease',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {event.desc}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Bottom padding so last item can center */}
            <div style={{ height: ITEM_H, flexShrink: 0 }} />
          </div>

          {/* Selection highlight bar (like iOS) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: ITEM_H,
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              borderTop:    '1px solid rgba(148,163,184,0.25)',
              borderBottom: '1px solid rgba(148,163,184,0.25)',
            }}
          />

          {/* Top fade */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: ITEM_H * 1.2,
              background: 'linear-gradient(to bottom, #f8fafc 30%, transparent)',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom fade */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: ITEM_H * 1.2,
              background: 'linear-gradient(to top, #f8fafc 30%, transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Scroll to explore the day&apos;s events
        </p>
      </div>
    </section>
  )
}
