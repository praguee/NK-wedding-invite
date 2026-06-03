'use client'

import { useEffect, useState } from 'react'
import SectionOrnament from './SectionOrnament'

const RELATIONSHIP_START = new Date('2023-07-08T00:00:00+05:30')

function getRelationshipTime() {
  const diff = Date.now() - RELATIONSHIP_START.getTime()
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
    <section id="story" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Our Story
        </h2>
        <p className="text-center mb-14 text-sm" style={{ color: '#9C7A5A' }}>
          The Way of Water <span style={{ opacity: 0.5 }}>— not directed by James Cameron</span>
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Story text */}
          <div className="space-y-5 order-2 md:order-1">
            <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
              Nidhi has always had a deep, unshakeable love for water. Whether it&apos;s a three-hour bath, a glass of water every five minutes, or drinking water until she physically cannot drink more water — Nidhi and hydration have an exclusive, committed relationship.
            </p>
            <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
              Parag noticed this early on, and when the moment came to ask if she&apos;d be his girlfriend, he didn&apos;t go for a candlelit dinner or a rooftop view.
            </p>
            <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
              He asked her in the shower. Yes, really. <strong style={{ color: '#C49A28' }}>8th July 2023.</strong> She said yes — and honestly, we think she had no choice. It was too original to refuse.
            </p>
            <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
              So when it came to the wedding, there was really only one way to do it properly. They&apos;re exchanging vows on a <strong style={{ color: '#C49A28' }}>floating mandap, right in the middle of a pool</strong> — surrounded by flowers, family, and the element that started it all.
            </p>
            <p className="text-sm italic mt-4" style={{ color: '#9C7A5A' }}>
              Water brought us together. Water will witness our forever.
            </p>

            {/* Together since counter */}
            <div className="pt-4">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#9C7A5A' }}>
                In a relationship for
              </p>
              <div className="flex gap-3">
                {[
                  { value: t.years,  label: 'years'  },
                  { value: t.months, label: 'months' },
                  { value: t.days,   label: 'days'   },
                ].map(({ value, label }) => (
                  <div key={label} className="glass-gold rounded-xl p-4 text-center flex-1">
                    <p className="text-2xl font-extralight" style={{ color: '#C49A28' }}>{value}</p>
                    <p className="text-xs mt-1" style={{ color: '#9C7A5A' }}>{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: '#C4B09A' }}>
                Since 8 July 2023 — officially, officially official
              </p>
            </div>
          </div>

          {/* Photo panel */}
          <div className="order-1 md:order-2 space-y-4">
            <div
              className="aspect-[4/5] rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #e8d5f0 0%, #bfcfee 50%, #c8e8f0 100%)',
                boxShadow: '0 8px 40px rgba(196,154,40,0.15)',
              }}
            >
              <div className="text-center p-8">
                <p className="text-5xl mb-4">💧</p>
                <p className="font-light text-slate-500 text-sm italic leading-relaxed">
                  Engagement &amp; pre-wedding<br />photos coming soon
                </p>
              </div>
              {[
                { style: { top:12,left:12 },    d:'M0 32 L0 0 L32 0',   cx:0,  cy:0  },
                { style: { top:12,right:12 },   d:'M32 32 L32 0 L0 0',  cx:32, cy:0  },
                { style: { bottom:12,left:12 }, d:'M0 0 L0 32 L32 32',  cx:0,  cy:32 },
                { style: { bottom:12,right:12 },d:'M32 0 L32 32 L0 32', cx:32, cy:32 },
              ].map((f, i) => (
                <svg key={i} style={{ position:'absolute', width:32, height:32, opacity:0.35, ...f.style }} viewBox="0 0 32 32">
                  <path d={f.d} fill="none" stroke="#C49A28" strokeWidth="1.5"/>
                  <circle cx={f.cx} cy={f.cy} r="3" fill="#C49A28"/>
                </svg>
              ))}
            </div>
            <div className="glass-gold rounded-2xl px-5 py-4 text-center">
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C49A28' }}>The Wedding</p>
              <p className="text-sm font-light" style={{ color: '#5C3A2E' }}>
                A floating mandap · in the middle of a pool ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
