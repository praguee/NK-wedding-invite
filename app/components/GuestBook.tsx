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
          if (rsvp.message) {
            setMessages((prev) => [rsvp, ...prev])
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <section id="messages" className="py-24 bg-slate-50">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Guest Book
        </h2>
        <p className="text-center text-slate-500 mb-16">
          Messages from our family and friends
        </p>

        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Heart className="mx-auto text-slate-200 mb-4" size={40} />
            <p className="text-slate-400">Be the first to leave a message!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {m.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{m.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(m.created_at)}</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm">{m.message}</p>
                {m.plus_ones > 0 && (
                  <p className="text-xs text-slate-400 mt-3">
                    Attending with {m.plus_ones} {m.plus_ones === 1 ? 'guest' : 'guests'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
