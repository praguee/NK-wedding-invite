'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ── POLL ────────────────────────────────────────────────────────
type Side = 'bride' | 'groom'
interface PollCounts { bride: number; groom: number; total: number }
const POLL_KEY = 'nk_poll_vote_v3'   // bump key so old votes don't block

function Poll({ onDone }: { onDone: () => void }) {
  const [voted, setVoted]     = useState<Side | null>(null)
  const [counts, setCounts]   = useState<PollCounts>({ bride: 0, groom: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)

  const fetchCounts = useCallback(async () => {
    try {
      const r = await fetch('/api/poll')
      if (r.ok) setCounts(await r.json())
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    setVoted(localStorage.getItem(POLL_KEY) as Side | null)
    fetchCounts()
    const channel = supabase.channel('poll-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes' }, fetchCounts)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchCounts])

  const vote = async (side: Side) => {
    if (voted || loading) return
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/poll', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side }),
      })
      if (r.ok) {
        localStorage.setItem(POLL_KEY, side)
        setVoted(side)
        await fetchCounts()
        // Auto-advance to quiz after 3s countdown
        let c = 3
        setCountdown(c)
        const t = setInterval(() => {
          c -= 1
          setCountdown(c)
          if (c <= 0) { clearInterval(t); onDone() }
        }, 1000)
      } else {
        const d = await r.json()
        setError(d.message || 'Vote failed')
      }
    } catch {
      setError('Network error — try again')
    } finally { setLoading(false) }
  }

  const bp = counts.total ? Math.round((counts.bride / counts.total) * 100) : 50
  const gp = counts.total ? Math.round((counts.groom / counts.total) * 100) : 50

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-extralight text-center mb-2 text-white tracking-tight">Pick a Side</h2>
      <p className="text-center text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
        No judgement. (Okay, maybe a little.)
      </p>

      {!voted ? (
        <><div className="grid grid-cols-2 gap-4">
          {([
            { side: 'bride' as Side, label: 'Team Nidhi', sub: 'Obviously the better choice', img: '/images/nidhi-stand.png', accent: '#fb7185' },
            { side: 'groom' as Side, label: 'Team Parag',  sub: 'Bold, brave, delusional',      img: '/images/parag-avatar.png', accent: '#C49A28' },
          ]).map(opt => (
            <button key={opt.side} onClick={() => vote(opt.side)} disabled={loading}
              className="relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 disabled:opacity-60 group"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(40px)',
                border: `1.5px solid rgba(255,255,255,0.12)`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.border = `1.5px solid ${opt.accent}55`)}
              onMouseLeave={e => (e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.12)')}
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3"
                style={{ border: `2px solid ${opt.accent}60` }}>
                <Image src={opt.img} alt={opt.label} fill
                  style={{ objectFit: 'cover', objectPosition: opt.side === 'groom' ? '50% 8%' : '50% 15%' }} />
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: opt.accent }}>{opt.label}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{opt.sub}</p>
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-center mt-3" style={{ color: '#fb7185' }}>{error}</p>}
        </>) : (
        <div className="rounded-2xl overflow-hidden" style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div className="p-6">
            <p className="text-center text-sm mb-6 text-white">
              {voted === 'bride' ? "Smart. Nidhi approves. Parag does not." : "Brave. Truly. Nidhi's already made a list."}
            </p>

            {/* Bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1.5px solid #fb718560' }}>
                <Image src="/images/nidhi-stand.png" alt="Nidhi" fill style={{ objectFit: 'cover', objectPosition: '50% 15%' }} />
              </div>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', width: `${bp}%`, background: 'linear-gradient(to right,#f472b6,#fb7185)', borderRadius: 100, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
              </div>
              <span className="text-sm font-light w-10 text-right" style={{ color: '#fb7185' }}>{bp}%</span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1.5px solid #C49A2860' }}>
                <Image src="/images/parag-avatar.png" alt="Parag" fill style={{ objectFit: 'cover', objectPosition: '50% 8%' }} />
              </div>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', width: `${gp}%`, background: 'linear-gradient(to right,#C49A28,#E8C547)', borderRadius: 100, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
              </div>
              <span className="text-sm font-light w-10 text-right" style={{ color: '#C49A28' }}>{gp}%</span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {bp > gp ? "Nidhi winning. Parag is fine. He's fine." : bp === gp ? "It's a tie. Diplomatic." : "Parag winning. Nidhi is planning revenge."}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{counts.total} votes · live</span>
              </div>
            </div>
            {countdown !== null && countdown > 0 && (
              <div className="text-center py-2 rounded-xl" style={{ background: 'rgba(196,154,40,0.1)' }}>
                <p className="text-xs" style={{ color: '#C49A28' }}>
                  Quiz starting in {countdown}…
                </p>
              </div>
            )}
            {countdown === null && (
              <button
                onClick={() => { localStorage.removeItem(POLL_KEY); setVoted(null) }}
                className="text-xs w-full text-center mt-2 py-1"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              >
                Change vote
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── QUIZ ────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "Parag has saved Nidhi's name in his phone as?",
    options: ['Nidhi Kesarkar', 'Girlfriend', 'Ex Girlfriend', 'Fiancé'],
    answer: 3,
  },
  {
    q: "Nidhi has saved Parag's number as?",
    options: ['Batman', 'Parag Khalde', 'Boyfriend', 'Pari'],
    answer: 3,
  },
  {
    q: "What food cuisine do both of them love?",
    options: ['Indian', 'Mexican', 'Chinese', 'Thai'],
    answer: 2,
  },
  {
    q: "Where did Parag and Nidhi first meet?",
    options: ['Agent Jack\'s Bar', 'Runwal Greens, Mulund', 'A cafe in Birmingham', 'Video call'],
    answer: 1,
  },
  {
    q: "What did Parag 'accidentally' leave at Nidhi's after their first meeting?",
    options: ['His phone', 'His keys', 'His heart', 'His wallet'],
    answer: 3,
  },
]

const PASSING_SCORE = Math.ceil(QUESTIONS.length * 0.6)

type QuizState = 'idle' | 'playing' | 'result'

function Quiz() {
  const [state, setState]       = useState<QuizState>('idle')
  const [qIdx, setQIdx]         = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))
  const [revealed, setRevealed] = useState(false)
  const [score, setScore]       = useState(0)
  const choosingRef             = useRef(false)  // prevents double-tap

  const current = QUESTIONS[qIdx]

  const choose = (i: number) => {
    // QA guard: prevent double-click / tap race condition
    if (revealed || choosingRef.current) return
    choosingRef.current = true

    setSelected(i)
    const newAnswers = [...answers]
    newAnswers[qIdx] = i
    setAnswers(newAnswers)
    setRevealed(true)

    setTimeout(() => {
      if (qIdx === QUESTIONS.length - 1) {
        const s = newAnswers.filter((a, qi) => a === QUESTIONS[qi].answer).length
        setScore(s)
        setState('result')
      } else {
        setQIdx(q => q + 1)
        setSelected(null)
        setRevealed(false)
        choosingRef.current = false   // re-arm for next question
      }
    }, 900)
  }


  const reset = () => {
    setState('idle'); setQIdx(0); setSelected(null)
    setAnswers(Array(QUESTIONS.length).fill(null)); setRevealed(false); setScore(0)
  }

  const win = score >= PASSING_SCORE

  if (state === 'idle') {
    return (
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-3xl font-extralight mb-3 text-white tracking-tight">How Well Do You Know Us?</h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {QUESTIONS.length} questions · Hosted by Ginny 🐱
        </p>
        <div className="mb-8 relative w-48 h-48 mx-auto rounded-2xl overflow-hidden"
          style={{ border: '2px solid rgba(196,154,40,0.3)', boxShadow: '0 0 40px rgba(196,154,40,0.15)' }}>
          <Image src="/images/ginny-idle.jpg" alt="Ginny" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
        </div>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Think you know them? 5 questions.<br/>
          Ginny is judging your answers personally.
        </p>
        <button
          onClick={() => setState('playing')}
          className="px-10 py-3.5 rounded-full font-semibold text-sm tracking-widest"
          style={{
            background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
            color: '#2A1200',
            boxShadow: '0 4px 20px rgba(196,154,40,0.4)',
          }}
        >
          Start Quiz
        </button>
      </div>
    )
  }

  if (state === 'playing') {
    return (
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Question {qIdx + 1} of {QUESTIONS.length}
          </span>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === qIdx ? 20 : 8,
                  background: i < qIdx ? '#C49A28' : i === qIdx ? 'rgba(196,154,40,0.8)' : 'rgba(255,255,255,0.2)',
                }} />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl p-7 mb-5" style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <p className="text-xl font-light text-white leading-snug mb-6">{current.q}</p>

          <div className="space-y-3">
            {current.options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect  = i === current.answer
              let bg = 'rgba(255,255,255,0.05)'
              let border = 'rgba(255,255,255,0.12)'
              let textColor = 'rgba(255,255,255,0.75)'

              if (revealed) {
                if (isCorrect) { bg = 'rgba(52,211,153,0.15)'; border = '#34d399'; textColor = '#34d399' }
                else if (isSelected) { bg = 'rgba(251,113,133,0.15)'; border = '#fb7185'; textColor = '#fb7185' }
              } else if (isSelected) {
                bg = 'rgba(196,154,40,0.15)'; border = '#C49A28'; textColor = '#C49A28'
              }

              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className="w-full text-left rounded-xl px-4 py-3.5 transition-all duration-200 flex items-center gap-3"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <span className="w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ borderColor: border, color: textColor }}>
                    {revealed && isCorrect ? '✓' : revealed && isSelected && !isCorrect ? '✗' : ['A','B','C','D'][i]}
                  </span>
                  <span className="text-sm" style={{ color: textColor }}>{opt}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Auto-advancing — just show a subtle hint */}
        {revealed && (
          <p className="text-center text-xs animate-pulse" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {qIdx === QUESTIONS.length - 1 ? 'Calculating results…' : 'Next question coming…'}
          </p>
        )}
        {!revealed && selected === null && (
          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Tap an answer to continue
          </p>
        )}
      </div>
    )
  }

  // Result state
  return (
    <div className="max-w-md mx-auto text-center">
      {/* Ginny */}
      <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden mb-6"
        style={{
          border: win ? '3px solid #C49A28' : '3px solid rgba(255,255,255,0.2)',
          boxShadow: win ? '0 0 50px rgba(196,154,40,0.3)' : '0 0 30px rgba(0,0,0,0.5)',
        }}>
        <Image
          src={win ? '/images/ginny-win.jpg' : '/images/ginny-lose.jpg'}
          alt="Ginny"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
      </div>

      {/* Score */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: win ? '#C49A28' : 'rgba(255,255,255,0.4)' }}>
        {score} / {QUESTIONS.length} correct
      </p>

      <h3 className="text-3xl font-extralight text-white mb-3 tracking-tight">
        {win ? "Okay fine, you know us." : "Genuinely shocking."}
      </h3>

      <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {win
          ? "Okay fine, you actually know us. Screenshot this. Abhishek will be at the reception drawing live caricatures — show him this and he'll immortalise your face. You've earned it."
          : "Genuinely shocking. You were there at the same wedding invite page as everyone else. Abhishek will still draw your caricature at the reception — consider it a participation trophy."}
      </p>

      {/* Caricature CTA */}
      <div className="rounded-2xl p-5 mb-6 text-left" style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(196,154,40,0.2)',
      }}>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#C49A28' }}>Meet Abhishek — the artist</p>
        <p className="text-sm text-white mb-1">Live caricatures at the reception. He will be there.</p>
        <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Check out his work:</p>
        <a
          href="https://www.instagram.com/joyofcaricaturestudio?igsh=MXRlc2N4cjJncTEzZQ=="
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-2 transition-all"
          style={{
            background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
            color: 'white',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          @joyofcaricaturestudio
        </a>
      </div>

      <button onClick={reset} className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Try again?
      </button>
    </div>
  )
}

// ── GAMES PAGE ──────────────────────────────────────────────────
type PageStep = 'poll' | 'quiz'

export default function GamesPage() {
  const [step, setStep] = useState<PageStep>('poll')

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(160deg, #1A0830 0%, #0D0520 40%, #05010E 100%)',
        animation: 'slideUp 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top bar */}
      <div className="sticky top-0 z-40" style={{
        background: 'rgba(5,1,14,0.7)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Invitation
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {(['poll','quiz'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: step === s ? '#C49A28' : s < step || (step === 'quiz' && s === 'poll') ? 'rgba(196,154,40,0.4)' : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.3s',
                  }} />
                  <span className="text-xs" style={{ color: step === s ? '#C49A28' : 'rgba(255,255,255,0.25)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {s === 'poll' ? 'Poll' : 'Quiz'}
                  </span>
                </div>
                {i === 0 && <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.15)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(196,154,40,0.6)' }}>
            Nidhi &amp; Parag · December 4, 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight mb-3 text-white">
            {step === 'poll' ? 'Pick a Side' : 'Know the Couple?'}
          </h1>
          <div className="w-12 h-px mx-auto" style={{ background: 'rgba(196,154,40,0.4)' }} />
        </div>

        {step === 'poll'
          ? <Poll onDone={() => setStep('quiz')} />
          : <Quiz />
        }
      </div>
    </div>
  )
}
