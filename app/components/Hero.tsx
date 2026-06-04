'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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

/* ── Mandala watermark behind text ── */
function Mandala() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 'min(480px, 90vw)',
        height: 'min(480px, 90vw)',
        bottom: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0.07,
        pointerEvents: 'none',
      }}
    >
      <g transform="translate(200,200)">
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={`op${i}`} d="M0,-180 Q18,-155 0,-130 Q-18,-155 0,-180Z" fill="white" transform={`rotate(${i*22.5})`} />
        ))}
        <circle r="155" fill="none" stroke="white" strokeWidth="0.8" opacity="0.6"/>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={`mp${i}`} d="M0,-120 Q14,-100 0,-80 Q-14,-100 0,-120Z" fill="white" transform={`rotate(${i*30})`} />
        ))}
        <circle r="100" fill="none" stroke="white" strokeWidth="0.7" opacity="0.5"/>
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`id${i}`} d="M0,-68 L8,-54 L0,-40 L-8,-54 Z" fill="white" transform={`rotate(${i*45})`} />
        ))}
        <circle r="62" fill="none" stroke="white" strokeWidth="0.6" opacity="0.45"/>
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`il${i}`} d="M0,-38 Q10,-25 0,-15 Q-10,-25 0,-38Z" fill="white" transform={`rotate(${i*45})`} />
        ))}
        <circle r="28" fill="none" stroke="white" strokeWidth="0.8" opacity="0.6"/>
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
    <section className="min-h-screen relative flex flex-col items-center justify-end pb-16 pt-24 overflow-hidden animate-fade-in">

      {/* ── Cover photo ── */}
      <Image
        src="/images/hero-cover.jpg"
        alt="Nidhi and Parag"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center 20%',  /* show upper couple area on all screen sizes */
          filter: 'contrast(1.08) saturate(1.15) brightness(0.92)',
          zIndex: 0,
        }}
      />

      {/* ── Layered gradients for cinematic look ── */}
      {/* Top: very soft vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(10,4,25,0.55) 0%, rgba(10,4,25,0.05) 35%, transparent 55%)',
      }} />
      {/* Bottom: strong dark base for text */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(5,2,15,0.97) 0%, rgba(10,4,25,0.88) 25%, rgba(15,6,35,0.55) 50%, transparent 75%)',
      }} />
      {/* Gold warmth bleed from photo sunset */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 40% at 50% 65%, rgba(196,120,40,0.12) 0%, transparent 70%)',
      }} />

      {/* ── Mandala watermark ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        <Mandala />
      </div>

      {/* ── Text content ── */}
      <div className="relative text-white text-center px-6 max-w-2xl w-full" style={{ zIndex: 3 }}>
        <SectionOrnament light />

        <p className="text-xs uppercase tracking-[0.4em] mb-6 font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Together with their families
        </p>

        {/* Names — fixed line-height to prevent descender clipping */}
        <div style={{ lineHeight: 1.15, paddingBottom: '0.1em' }}>
          <h1
            className="font-extralight tracking-tight text-gold-shimmer block"
            style={{ fontSize: 'clamp(48px, 11vw, 92px)' }}
          >
            {COUPLE.brideName}
          </h1>
          <p className="text-lg font-light my-3 tracking-widest" style={{ color: 'rgba(196,154,40,0.6)' }}>✦ &amp; ✦</p>
          <h1
            className="font-extralight tracking-tight text-gold-shimmer block"
            style={{ fontSize: 'clamp(48px, 11vw, 92px)' }}
          >
            {COUPLE.groomName}
          </h1>
        </div>

        <p className="text-sm font-light mt-6 mb-10 tracking-wide" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Friday, December 4, 2026 · Thane, Maharashtra
        </p>

        {isWeddingDay ? (
          <p className="text-2xl font-light animate-pulse mb-10">Today&apos;s the day! 🎉</p>
        ) : (
          <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto mb-10">
            {[
              { value: timeLeft.days,    label: 'Days'  },
              { value: timeLeft.hours,   label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins'  },
              { value: timeLeft.seconds, label: 'Secs'  },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(196,154,40,0.28)',
                  borderRadius: 14,
                  padding: '10px 4px',
                }}
              >
                <div className="text-2xl font-light tabular-nums">{String(value).padStart(2, '0')}</div>
                <div className="text-xs tracking-wider uppercase mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        <a
          href="#rsvp"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
            color: '#2A1200',
            padding: '13px 44px',
            borderRadius: 100,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.12em',
            textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(196,154,40,0.45), 0 1px 0 rgba(255,255,255,0.25) inset',
            textTransform: 'uppercase',
          }}
        >
          RSVP Now
        </a>
      </div>
    </section>
  )
}
