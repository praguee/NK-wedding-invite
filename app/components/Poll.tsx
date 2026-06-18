'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import SectionOrnament from './SectionOrnament'

type Side = 'bride' | 'groom'
interface Counts { bride: number; groom: number; total: number }
const STORAGE_KEY = 'nk_poll_vote_v2'

/* ── Bitmoji photo avatars ─────────────────────────────────── */
function NidhiAvatar({ size = 56 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(251,113,133,0.4)', position: 'relative', background: '#f0f8e8' }}>
      <Image src="/images/nidhi-stand.png" alt="Nidhi" fill style={{ objectFit: 'cover', objectPosition: '50% 8%' }} />
    </div>
  )
}

function ParagAvatar({ size = 56 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(196,154,40,0.4)', position: 'relative' }}>
      <Image src="/images/parag-avatar.png" alt="Parag" fill style={{ objectFit: 'cover', objectPosition: 'center 8%' }} />
    </div>
  )
}




export default function Poll() {
  const [voted, setVoted]     = useState<Side | null>(null)
  const [counts, setCounts]   = useState<Counts>({ bride: 0, groom: 0, total: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCounts = useCallback(async () => {
    const res = await fetch('/api/poll')
    if (res.ok) setCounts(await res.json())
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Side | null
    setVoted(stored)
    fetchCounts()

    // Supabase realtime for live updates
    const channel = supabase
      .channel('poll-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes' }, () => {
        fetchCounts()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchCounts])

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

  const bridePercent = counts.total ? Math.round((counts.bride / counts.total) * 100) : 0
  const groomPercent = counts.total ? Math.round((counts.groom / counts.total) * 100) : 0

  const ResultBar = ({ side, percent, label, sub }: { side: Side; percent: number; label: string; sub: string }) => {
    const isVoted    = voted === side
    const isWinning  = side === 'bride' ? counts.bride > counts.groom : counts.groom > counts.bride
    const barColor   = side === 'bride'
      ? 'linear-gradient(to right, #f472b6, #fb7185)'
      : 'linear-gradient(to right, #C49A28, #E8C547)'
    const accentColor = side === 'bride' ? '#fb7185' : '#C49A28'
    const count = side === 'bride' ? counts.bride : counts.groom

    return (
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer"
        style={{
          background: isVoted
            ? side === 'bride' ? 'rgba(251,113,133,0.08)' : 'rgba(196,154,40,0.08)'
            : 'rgba(255,253,246,0.7)',
          border: `1.5px solid ${isVoted ? accentColor + '50' : 'rgba(196,154,40,0.18)'}`,
          boxShadow: isVoted ? `0 4px 20px ${accentColor}22` : '0 2px 10px rgba(0,0,0,0.04)',
        }}
        onClick={() => !voted && vote(side)}
      >
        {/* Fill bar behind content */}
        {voted && (
          <div
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${percent}%`,
              background: side === 'bride' ? 'rgba(251,113,133,0.10)' : 'rgba(196,154,40,0.10)',
              transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
              borderRadius: 14,
            }}
          />
        )}

        <div className="relative flex items-center gap-4 p-4">
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            {side === 'bride' ? <NidhiAvatar /> : <ParagAvatar />}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm" style={{ color: isVoted ? accentColor : '#3B1F00' }}>
                {label}
                {isVoted && <span className="ml-2 text-xs">✓ your vote</span>}
                {!voted && isWinning && counts.total > 0 && (
                  <span className="ml-2 text-xs font-normal" style={{ color: accentColor }}>leading</span>
                )}
              </p>
              {voted && (
                <span className="text-sm font-medium" style={{ color: accentColor }}>
                  {percent}%
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: '#9C7A5A' }}>{sub}</p>

            {/* Progress bar */}
            {voted && (
              <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: barColor,
                    borderRadius: 100,
                    transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Vote count */}
          {voted && (
            <span className="text-xs flex-shrink-0" style={{ color: '#C4B09A' }}>
              {count}
            </span>
          )}
        </div>
      </div>
    )
  }

  const sarcasm = !counts.total ? '' :
    bridePercent > groomPercent ? "Nidhi is winning. Parag is fine. He's fine." :
    bridePercent === groomPercent ? "It's a tie. How very diplomatic of you all." :
    "Parag is winning. Nidhi is already planning revenge."

  return (
    <section className="py-20 bg-white">
      <div className="max-w-md mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Pick a side
        </h2>
        <p className="text-center mb-8 text-sm" style={{ color: '#9C7A5A' }}>
          We know you have a favourite. No judgement.<br className="hidden sm:block"/> (Okay, maybe a little.)
        </p>

        <div className="space-y-3">
          <ResultBar
            side="bride"
            percent={bridePercent}
            label="Team Nidhi"
            sub={!voted ? "Obviously the better choice" : "Wearing glasses and absolutely judging everyone"}
          />
          <ResultBar
            side="groom"
            percent={groomPercent}
            label="Team Parag"
            sub={!voted ? "Bold, brave, deeply delusional" : "Buying everyone biryani in hopes of winning"}
          />
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between px-1">
          {counts.total > 0 ? (
            <p className="text-xs" style={{ color: '#C4B09A' }}>{sarcasm}</p>
          ) : (
            <p className="text-xs" style={{ color: '#C4B09A' }}>Be the first to vote 👆</p>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: '#9C7A5A' }}>
              {counts.total} vote{counts.total !== 1 ? 's' : ''} · live
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
