'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { RSVP } from '@/lib/types'
import { Heart } from 'lucide-react'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function GuestBook() {
  const [messages, setMessages] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)

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
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rsvps' },
        (payload) => {
          const rsvp = payload.new as RSVP
          if (rsvp.message) setMessages((prev) => [rsvp, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <section id="messages" className="py-20 bg-slate-50">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">
            Guest Book
          </h2>
          {messages.length > 0 && (
            <span className="text-xs text-slate-400 font-medium bg-white border border-slate-100 px-3 py-1 rounded-full">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </span>
          )}
        </div>
        <p className="text-slate-500 mb-8 text-sm">
          Wishes from our family and friends
        </p>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-400 text-sm">Loading messages…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center bg-white rounded-2xl gap-3">
            <Heart className="text-slate-200" size={36} />
            <p className="text-slate-400 text-sm">Be the first to leave a message!</p>
          </div>
        ) : (
          <div
            className="space-y-3 overflow-y-auto pr-1"
            style={{
              maxHeight: '480px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#e2e8f0 transparent',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className="bg-white px-5 py-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">
                      {m.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{m.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(m.created_at)}</p>
                  </div>
                  {m.plus_ones > 0 && (
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      +{m.plus_ones}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pl-11">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
