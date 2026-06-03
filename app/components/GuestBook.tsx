'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { RSVP } from '@/lib/types'

// Deterministic gradient per guest name so each avatar looks distinct
const GRADIENTS = [
  ['#c084fc', '#818cf8'], // violet→indigo
  ['#f472b6', '#fb7185'], // pink→rose
  ['#34d399', '#059669'], // emerald→green
  ['#60a5fa', '#3b82f6'], // sky→blue
  ['#fbbf24', '#f97316'], // amber→orange
  ['#a78bfa', '#7c3aed'], // purple→violet
]

function nameGradient(name: string): [string, string] {
  let h = 0
  for (let i = 0; i < name.length; i++) h = ((h * 31) + name.charCodeAt(i)) & 0xffff
  const g = GRADIENTS[Math.abs(h) % GRADIENTS.length]
  return [g[0], g[1]]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function GuestBook() {
  const [messages, setMessages] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase
      .from('rsvps')
      .select('*')
      .not('message', 'is', null)
      .neq('message', '')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setMessages(data)
        setLoading(false)
      })

    const channel = supabase
      .channel('guest-book')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvps' }, (payload) => {
        const rsvp = payload.new as RSVP
        if (rsvp.message) setMessages((prev) => [rsvp, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <section id="messages" className="py-20 bg-slate-50">
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-slate-900">
              Guest Book
            </h2>
            <p className="text-slate-400 text-sm mt-1">Wishes from our family and friends</p>
          </div>
          {messages.length > 0 && (
            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-100 shadow-sm px-3 py-1.5 rounded-full mb-1">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm gap-3 border border-slate-100">
            <span className="text-4xl">💌</span>
            <p className="text-slate-400 text-sm">Be the first to leave a message!</p>
          </div>
        ) : (
          /* Scroll container with fade edges */
          <div className="relative">
            {/* Top fade */}
            <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-slate-50 to-transparent z-10 pointer-events-none rounded-t-3xl" />
            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none rounded-b-3xl" />

            <div
              ref={scrollRef}
              className="space-y-3 overflow-y-auto py-4 pr-1"
              style={{
                maxHeight: 480,
                scrollbarWidth: 'thin',
                scrollbarColor: '#e2e8f0 transparent',
              }}
            >
              {messages.map((m) => {
                const [from, to] = nameGradient(m.name)
                const initial = m.name.trim().charAt(0).toUpperCase()
                return (
                  <div
                    key={m.id}
                    className="group relative bg-white rounded-2xl px-5 py-4 border border-slate-100 transition-all duration-300"
                    style={{
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)')}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-semibold shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                      >
                        {initial}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-medium text-slate-900 text-sm truncate">{m.name}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {m.plus_ones > 0 && (
                              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                +{m.plus_ones}
                              </span>
                            )}
                            <span className="text-xs text-slate-300">{formatDate(m.created_at)}</span>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{m.message}</p>
                      </div>
                    </div>

                    {/* Subtle coloured left edge on hover */}
                    <div
                      className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
