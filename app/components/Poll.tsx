'use client'

import { useEffect, useState } from 'react'
import SectionOrnament from './SectionOrnament'

type Side = 'bride' | 'groom'
interface Counts { bride: number; groom: number; total: number }

const STORAGE_KEY = 'nk_poll_vote'

export default function Poll() {
  const [voted, setVoted]   = useState<Side | null>(null)
  const [counts, setCounts] = useState<Counts>({ bride: 0, groom: 0, total: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Side | null
    setVoted(stored)
    fetchCounts()
  }, [])

  const fetchCounts = async () => {
    const res = await fetch('/api/poll')
    if (res.ok) setCounts(await res.json())
  }

  const vote = async (side: Side) => {
    if (voted || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side }),
      })
      if (res.ok) {
        localStorage.setItem(STORAGE_KEY, side)
        setVoted(side)
        await fetchCounts()
      }
    } finally {
      setLoading(false)
    }
  }

  const bridePercent = counts.total ? Math.round((counts.bride / counts.total) * 100) : 50
  const groomPercent = counts.total ? Math.round((counts.groom / counts.total) * 100) : 50

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Pick a side
        </h2>
        <p className="text-center mb-10 text-sm" style={{ color: '#9C7A5A' }}>
          We know you have a favourite. No judgement. (Okay, maybe a little.)
        </p>

        {!voted ? (
          /* Voting state */
          <div className="grid grid-cols-2 gap-4">
            {/* Team Bride */}
            <button
              onClick={() => vote('bride')}
              disabled={loading}
              className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 disabled:opacity-60"
              style={{
                background: 'rgba(255,253,246,0.8)',
                border: '1.5px solid rgba(251,113,133,0.3)',
                boxShadow: '0 4px 20px rgba(251,113,133,0.1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(251,113,133,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(251,113,133,0.1)')}
            >
              <div className="text-4xl mb-3">👧</div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#be185d' }}>Team Nidhi</p>
              <p className="text-xs" style={{ color: '#9C7A5A' }}>
                Obviously the better choice
              </p>
            </button>

            {/* Team Groom */}
            <button
              onClick={() => vote('groom')}
              disabled={loading}
              className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 disabled:opacity-60"
              style={{
                background: 'rgba(255,253,246,0.8)',
                border: '1.5px solid rgba(196,154,40,0.3)',
                boxShadow: '0 4px 20px rgba(196,154,40,0.1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(196,154,40,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(196,154,40,0.1)')}
            >
              <div className="text-4xl mb-3">👦</div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#C49A28' }}>Team Parag</p>
              <p className="text-xs" style={{ color: '#9C7A5A' }}>
                Bold, brave, deeply delusional
              </p>
            </button>
          </div>
        ) : (
          /* Results state */
          <div className="glass-gold rounded-2xl p-8">
            <p className="text-center text-sm mb-6" style={{ color: '#9C7A5A' }}>
              {voted === 'bride'
                ? "Smart choice. Nidhi approves. Parag does not."
                : "Brave. Truly. Nidhi's already made a list."}
            </p>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2" style={{ color: '#7C5A3A' }}>
                <span>Team Nidhi 👧</span>
                <span>Team Parag 👦</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'rgba(196,154,40,0.12)' }}>
                <div
                  className="h-full rounded-l-full transition-all duration-700"
                  style={{
                    width: `${bridePercent}%`,
                    background: 'linear-gradient(to right, #f472b6, #fb7185)',
                  }}
                />
                <div
                  className="h-full rounded-r-full transition-all duration-700"
                  style={{
                    width: `${groomPercent}%`,
                    background: 'linear-gradient(to right, #C49A28, #E8C547)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-lg font-light" style={{ color: '#fb7185' }}>{bridePercent}%</span>
                <span className="text-xs self-center" style={{ color: '#9C7A5A' }}>{counts.total} votes</span>
                <span className="text-lg font-light" style={{ color: '#C49A28' }}>{groomPercent}%</span>
              </div>
            </div>

            <p className="text-center text-xs" style={{ color: '#C4B09A' }}>
              {bridePercent > groomPercent
                ? "Nidhi is winning. Parag is fine. He's fine."
                : bridePercent === groomPercent
                  ? "It's a tie. How very diplomatic of you all."
                  : "Parag is winning. Nidhi is already planning revenge."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
