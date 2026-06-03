'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import SectionOrnament from './SectionOrnament'

type Side = 'bride' | 'groom'
interface Counts { bride: number; groom: number; total: number }
const STORAGE_KEY = 'nk_poll_vote_v2'

/* ── Custom Indian-skin avatars ─────────────────────────────── */
function NidhiAvatar() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="26" cy="26" r="26" fill="#FDDBB4"/>
      {/* Hair */}
      <path d="M4 28 C4 10 14 3 26 3 C38 3 48 10 48 28" fill="#1C0A05"/>
      <path d="M5 26 C3 32 3 42 6 46 L5 50 C8 51 12 50 13 47 C10 44 9 38 9 32Z" fill="#1C0A05"/>
      <path d="M47 26 C49 32 49 42 46 46 L47 50 C44 51 40 50 39 47 C42 44 43 38 43 32Z" fill="#1C0A05"/>
      {/* Face/skin */}
      <ellipse cx="26" cy="32" rx="17" ry="19" fill="#C68642"/>
      {/* Ears */}
      <ellipse cx="9" cy="30" rx="3.5" ry="5" fill="#B8773A"/>
      <ellipse cx="43" cy="30" rx="3.5" ry="5" fill="#B8773A"/>
      {/* Eyebrows */}
      <path d="M16 23 Q20 21 23 22" stroke="#1C0A05" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M29 22 Q32 21 36 23" stroke="#1C0A05" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="20" cy="27" rx="3" ry="3.5" fill="#1C0A05"/>
      <ellipse cx="32" cy="27" rx="3" ry="3.5" fill="#1C0A05"/>
      <circle cx="21" cy="26" r="1" fill="white"/>
      <circle cx="33" cy="26" r="1" fill="white"/>
      {/* Glasses frames */}
      <rect x="13.5" y="23" width="11" height="9" rx="2.5" fill="none" stroke="#2C1A0E" strokeWidth="1.8"/>
      <rect x="27.5" y="23" width="11" height="9" rx="2.5" fill="none" stroke="#2C1A0E" strokeWidth="1.8"/>
      {/* Glasses bridge */}
      <line x1="24.5" y1="27.5" x2="27.5" y2="27.5" stroke="#2C1A0E" strokeWidth="1.8"/>
      {/* Nose */}
      <path d="M24 30 Q26 32 28 30" stroke="#9B6230" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      {/* Smile */}
      <path d="M20 37 Q26 42 32 37" stroke="#1C0A05" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function ParagAvatar() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="26" cy="26" r="26" fill="#F5C98A"/>
      {/* Hair */}
      <path d="M6 24 C6 8 14 3 26 3 C38 3 46 8 46 24" fill="#1C0A05"/>
      {/* Face/skin */}
      <ellipse cx="26" cy="32" rx="17" ry="19" fill="#A0622A"/>
      {/* Ears */}
      <ellipse cx="9" cy="30" rx="3.5" ry="5" fill="#955A25"/>
      <ellipse cx="43" cy="30" rx="3.5" ry="5" fill="#955A25"/>
      {/* Eyebrows */}
      <path d="M16 24 Q20 22 23 23" stroke="#1C0A05" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M29 23 Q32 22 36 24" stroke="#1C0A05" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="20" cy="28" rx="3" ry="3.5" fill="#1C0A05"/>
      <ellipse cx="32" cy="28" rx="3" ry="3.5" fill="#1C0A05"/>
      <circle cx="21" cy="27" r="1" fill="white"/>
      <circle cx="33" cy="27" r="1" fill="white"/>
      {/* Stubble hint */}
      <path d="M19 38 Q26 44 33 38" stroke="#7A4520" strokeWidth="1.2" fill="rgba(124,69,32,0.15)" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M24 31 Q26 33 28 31" stroke="#7A4520" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      {/* Smile */}
      <path d="M20 38 Q26 43 32 38" stroke="#1C0A05" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
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
              transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
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
                    transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
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
