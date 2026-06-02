'use client'

import { useEffect, useState } from 'react'
import { COUPLE, EVENT } from '@/lib/constants'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = EVENT.weddingDate.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const isWeddingDay = Object.values(timeLeft).every((v) => v === 0)

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white flex flex-col items-center justify-center pt-16 animate-fade-in">
      <div className="text-center px-6 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] opacity-80 mb-6">
          Together with their families
        </p>
        <h1 className="text-6xl md:text-8xl font-extralight tracking-tight mb-4">
          {COUPLE.brideName}
        </h1>
        <p className="text-2xl md:text-3xl font-light opacity-80 mb-4">&</p>
        <h1 className="text-6xl md:text-8xl font-extralight tracking-tight mb-8">
          {COUPLE.groomName}
        </h1>
        <p className="text-lg md:text-xl font-light opacity-90 mb-12">
          Friday, December 4, 2026 · Thane, Maharashtra
        </p>

        {isWeddingDay ? (
          <p className="text-2xl font-light animate-pulse">Today&apos;s the day! 🎉</p>
        ) : (
          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-12">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins' },
              { value: timeLeft.seconds, label: 'Secs' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                <div className="text-3xl font-light tabular-nums">{String(value).padStart(2, '0')}</div>
                <div className="text-xs opacity-70 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        <a
          href="#rsvp"
          className="inline-block bg-white text-purple-700 px-10 py-3 rounded-full font-medium hover:bg-slate-100 transition-colors text-sm tracking-wide"
        >
          RSVP Now
        </a>
      </div>
    </section>
  )
}
