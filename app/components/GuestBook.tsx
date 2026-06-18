'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { RSVP } from '@/lib/types'
import SectionOrnament from './SectionOrnament'

const GRADIENTS = [
  ['#c084fc', '#818cf8'],
  ['#f472b6', '#fb7185'],
  ['#34d399', '#059669'],
  ['#60a5fa', '#3b82f6'],
  ['#fbbf24', '#f97316'],
  ['#a78bfa', '#7c3aed'],
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

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export default function GuestBook() {
  const [messages, setMessages] = useState<RSVP[]>([])
  const [loading, setLoading]   = useState(true)
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
    <section id="messages" className="py-20 bg-slate-50" aria-labelledby="guestbook-heading">
      <div className="max-w-2xl mx-auto px-6">
        <SectionOrnament />

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 id="guestbook-heading" className="text-4xl md:text-5xl font-extralight tracking-tight" style={{ color: '#2A1200' }}>
              Guest Book
            </h2>
            <p className="text-sm mt-1" style={{ color: '#9C7A5A' }}>Wishes from our family and friends</p>
          </div>
          {messages.length > 0 && (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full mb-1"
              style={{ color: '#9C7A5A', background: 'rgba(196,154,40,0.08)', border: '1px solid rgba(196,154,40,0.15)' }}
              aria-live="polite">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center" aria-label="Loading messages">
            <div className="flex gap-1.5" role="status">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse"
                  style={{ background: 'rgba(196,154,40,0.4)', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="h-52 flex flex-col items-center justify-center glass-gold rounded-3xl gap-3"
          >
            <span className="text-4xl" aria-hidden="true">💌</span>
            <p className="text-sm" style={{ color: '#9C7A5A' }}>Be the first to leave a message!</p>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Top fade */}
            <div className="absolute top-0 inset-x-0 h-8 z-10 pointer-events-none rounded-t-3xl"
              style={{ background: 'linear-gradient(to bottom, #FAF3E0, transparent)' }} />
            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-16 z-10 pointer-events-none rounded-b-3xl"
              style={{ background: 'linear-gradient(to top, #FAF3E0, transparent)' }} />

            <div
              ref={scrollRef}
              className="space-y-3 overflow-y-auto py-4 pr-1"
              style={{ maxHeight: 480, scrollbarWidth: 'thin', scrollbarColor: 'rgba(196,154,40,0.25) transparent' }}
              role="feed"
              aria-label="Guest messages"
            >
              <AnimatePresence initial={false}>
                {messages.map((m) => {
                  const [from, to] = nameGradient(m.name)
                  const initial = m.name.trim().charAt(0).toUpperCase()
                  return (
                    <motion.article
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="group relative glass-gold rounded-2xl px-5 py-4"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}
                      whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)' }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-semibold shadow-sm"
                          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                          aria-hidden="true"
                        >
                          {initial}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-medium text-sm truncate" style={{ color: '#2A1200' }}>{m.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {m.plus_ones > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ color: '#9C7A5A', background: 'rgba(196,154,40,0.1)', border: '1px solid rgba(196,154,40,0.15)' }}>
                                  +{m.plus_ones}
                                </span>
                              )}
                              <time className="text-xs" style={{ color: '#C4B09A' }} dateTime={m.created_at}>
                                {formatDate(m.created_at)}
                              </time>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: '#7C5A3A' }}>{m.message}</p>
                        </div>
                      </div>

                      {/* Coloured left accent on hover */}
                      <div
                        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
                        aria-hidden="true"
                      />
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
