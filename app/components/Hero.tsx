'use client'

import { useEffect, useState } from 'react'
import { COUPLE, EVENT } from '@/lib/constants'
import SectionOrnament from './SectionOrnament'

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = EVENT.weddingDate.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

/* ── Mandala SVG watermark ── */
function Mandala() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        width: 'min(520px, 95vw)',
        height: 'min(520px, 95vw)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.11,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <g transform="translate(200,200)">
        {/* Outer petals (16) */}
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={`op-${i}`}
            d="M0,-180 Q18,-155 0,-130 Q-18,-155 0,-180Z"
            fill="white"
            transform={`rotate(${i * 22.5})`}
          />
        ))}
        {/* Outer ring circle */}
        <circle r="155" fill="none" stroke="white" strokeWidth="0.8" opacity="0.6"/>
        {/* Mid petals (12) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={`mp-${i}`}
            d="M0,-120 Q14,-100 0,-80 Q-14,-100 0,-120Z"
            fill="white"
            transform={`rotate(${i * 30})`}
          />
        ))}
        {/* Mid ring */}
        <circle r="100" fill="none" stroke="white" strokeWidth="0.7" opacity="0.5"/>
        {/* Inner ring diamonds (8) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`id-${i}`}
            d="M0,-68 L8,-54 L0,-40 L-8,-54 Z"
            fill="white"
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r="62" fill="none" stroke="white" strokeWidth="0.6" opacity="0.45"/>
        {/* Innermost lotus (8 petals) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`il-${i}`}
            d="M0,-38 Q10,-25 0,-15 Q-10,-25 0,-38Z"
            fill="white"
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r="28" fill="none" stroke="white" strokeWidth="0.8" opacity="0.6"/>
        {/* Center */}
        <circle r="14" fill="white" opacity="0.4"/>
        <circle r="7"  fill="white" opacity="0.6"/>
        <circle r="3"  fill="white" opacity="0.9"/>
      </g>
    </svg>
  )
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const isWeddingDay = Object.values(timeLeft).every((v) => v === 0)

  return (
    <section
      className="min-h-screen text-white flex flex-col items-center justify-center pt-16 animate-fade-in relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #4A1942 0%, #6B21A8 30%, #7C3AED 55%, #2563EB 100%)',
      }}
    >
      {/* Mandala watermark */}
      <Mandala />

      {/* Subtle gold shimmer overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(196,154,40,0.08) 0%, transparent 70%)',
      }} />

      <div className="text-center px-6 max-w-2xl relative z-10">
        {/* Gold ornament at top */}
        <SectionOrnament light />

        <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-8 font-light">
          Together with their families
        </p>

        {/* Couple names with gold shimmer */}
        <h1
          className="font-extralight tracking-tight mb-2 text-gold-shimmer"
          style={{ fontSize: 'clamp(52px, 12vw, 96px)', lineHeight: 1 }}
        >
          {COUPLE.brideName}
        </h1>
        <p className="text-xl font-light opacity-50 my-4 tracking-widest">✦ &amp; ✦</p>
        <h1
          className="font-extralight tracking-tight mb-8 text-gold-shimmer"
          style={{ fontSize: 'clamp(52px, 12vw, 96px)', lineHeight: 1 }}
        >
          {COUPLE.groomName}
        </h1>

        <p className="text-base font-light opacity-75 mb-12 tracking-wide">
          Friday, December 4, 2026 · Thane, Maharashtra
        </p>

        {isWeddingDay ? (
          <p className="text-2xl font-light animate-pulse">Today&apos;s the day! 🎉</p>
        ) : (
          <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-12">
            {[
              { value: timeLeft.days,    label: 'Days'  },
              { value: timeLeft.hours,   label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins'  },
              { value: timeLeft.seconds, label: 'Secs'  },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(196,154,40,0.3)',
                  boxShadow: '0 0 0 0.5px rgba(196,154,40,0.1) inset',
                  borderRadius: 14,
                  padding: '12px 4px',
                }}
              >
                <div className="text-3xl font-light tabular-nums">{String(value).padStart(2, '0')}</div>
                <div className="text-xs opacity-60 mt-1 tracking-wider uppercase">{label}</div>
              </div>
            ))}
          </div>
        )}

        <a
          href="#rsvp"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #C49A28, #E8C547, #C49A28)',
            backgroundSize: '200% auto',
            color: '#3B1F00',
            padding: '12px 40px',
            borderRadius: 100,
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(196,154,40,0.4), 0 1px 0 rgba(255,255,255,0.2) inset',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(196,154,40,0.5), 0 1px 0 rgba(255,255,255,0.2) inset'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLAnchorElement).style.transform = ''
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(196,154,40,0.4), 0 1px 0 rgba(255,255,255,0.2) inset'
          }}
        >
          RSVP Now
        </a>
      </div>
    </section>
  )
}
