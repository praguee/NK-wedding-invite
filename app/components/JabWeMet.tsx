'use client'

import { useEffect, useState } from 'react'
import SectionOrnament from './SectionOrnament'

const FIRST_MET = new Date('2022-12-23T00:00:00+05:30')

function getTimeTogether() {
  const now = new Date()
  const diff = now.getTime() - FIRST_MET.getTime()

  const totalDays    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const years        = Math.floor(totalDays / 365)
  const remainDays   = totalDays - years * 365
  const months       = Math.floor(remainDays / 30)
  const days         = remainDays - months * 30

  return { years, months, days }
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="glass-gold rounded-xl p-4 text-center flex-1">
      <p className="text-2xl font-extralight tracking-tight" style={{ color: '#C49A28' }}>
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: '#9C7A5A' }}>{label}</p>
    </div>
  )
}

export default function JabWeMet() {
  const [t, setT] = useState({ years: 0, months: 0, days: 0 })

  useEffect(() => {
    setT(getTimeTogether())
    const interval = setInterval(() => setT(getTimeTogether()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="jab-we-met" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Jab We Met
        </h2>
        <p className="text-center mb-14 text-sm" style={{ color: '#9C7A5A' }}>
          How it all started{' '}
          <span style={{ opacity: 0.5 }}>— not directed by Imtiaz Ali</span>
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Story placeholder */}
          <div className="space-y-5">
            <div className="space-y-5">
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                It was at <strong style={{ color: '#C49A28' }}>Runwal Greens, Mulund</strong>. Nidhi showed up straight from office — laptop bag on shoulder, mask on face, because pandemic habits don&apos;t die, they just relocate to social situations.
              </p>
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                Parag thought: alright, seems nice.
              </p>
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                Then she took off the mask.
              </p>
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                That was the moment. He didn&apos;t say it out loud. He just quietly knew.
              </p>
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                They had a few drinks, danced — the kind of dancing that happens when you&apos;re both pretending you&apos;re not trying to impress each other. Parag dropped her home like a complete gentleman.
              </p>
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                He drove back. Went to bed. Woke up the next morning.
              </p>
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                And only <em>two days later</em>, mid-reach for his wallet — gone. Left at her place.
              </p>
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                Here&apos;s the thing: he didn&apos;t call to ask for it back. Not because he forgot. Because it gave him an excuse to meet her again.
              </p>
              <p className="text-sm italic mt-2" style={{ color: '#9C7A5A' }}>
                She says she didn&apos;t steal it. We&apos;re letting you decide. 🕵️
              </p>
            </div>

            {/* Live counter */}
            <div>
              <p className="text-xs text-center mb-3 tracking-widest uppercase" style={{ color: '#9C7A5A' }}>
                Known each other for
              </p>
              <div className="flex gap-3">
                <StatCard value={t.years}  label="years"  />
                <StatCard value={t.months} label="months" />
                <StatCard value={t.days}   label="days"   />
              </div>
              <p className="text-xs text-center mt-3" style={{ color: '#C4B09A' }}>
                Counting every day since the universe decided to be helpful
              </p>
            </div>
          </div>

          {/* Photo placeholder */}
          <div
            className="aspect-[4/5] rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #f0e8d8, #e8d5c4)',
              boxShadow: '0 8px 40px rgba(196,154,40,0.12)',
            }}
          >
            {[
              { top: 12, left: 12,  d: 'M0 32 L0 0 L32 0',   cx: 0,  cy: 0  },
              { top: 12, right: 12, d: 'M32 32 L32 0 L0 0',  cx: 32, cy: 0  },
              { bottom: 12, left: 12,  d: 'M0 0 L0 32 L32 32', cx: 0, cy: 32 },
              { bottom: 12, right: 12, d: 'M32 0 L32 32 L0 32',cx: 32,cy: 32 },
            ].map((f, i) => (
              <svg key={i} style={{ position: 'absolute', width: 32, height: 32, opacity: 0.35, ...f }} viewBox="0 0 32 32">
                <path d={f.d} fill="none" stroke="#C49A28" strokeWidth="1.5"/>
                <circle cx={f.cx} cy={f.cy} r="3" fill="#C49A28"/>
              </svg>
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
              <span style={{ fontSize: 40 }}>📸</span>
              <p className="text-center text-sm italic" style={{ color: '#9C7A5A' }}>
                Photos from when they met<br/>— coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
