'use client'

'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Heart } from 'lucide-react'
import SectionOrnament from './SectionOrnament'

interface FormState { name: string; plusOnes: string; message: string }
const INITIAL: FormState = { name: '', plusOnes: '0', message: '' }
const INITIAL_SUBMITTED = false

function GamesPrompt() {
  return (
    <div className="mt-4 rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1A0830 0%, #0D0520 100%)', border: '1px solid rgba(196,154,40,0.25)' }}>
      <div className="p-5">
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(196,154,40,0.8)' }}>
          While you&apos;re here 🐱
        </p>
        <p className="text-sm font-light text-white mb-1">
          Think you know us?
        </p>
        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Take the quiz — score 60%+ and win a live caricature at the reception.
        </p>
        <Link href="/games"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full transition-all"
          style={{
            background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
            color: '#2A1200',
            boxShadow: '0 4px 16px rgba(196,154,40,0.35)',
          }}>
          Play Now →
        </Link>
      </div>
    </div>
  )
}

const countWords = (text: string) =>
  text.trim() === '' ? 0 : text.trim().split(/\s+/).length

const inputClass =
  'w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition'
const inputStyle = {
  borderColor: 'rgba(196,154,40,0.2)',
  background: 'rgba(255,253,246,0.7)',
  '--tw-ring-color': 'rgba(196,154,40,0.4)',
} as React.CSSProperties

export default function RSVPForm() {
  const [form, setForm]       = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(INITIAL_SUBMITTED)

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const words = countWords(form.message)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Tell us your name! 😊'); return }
    if (words > 100) { toast.error('Keep your message to 100 words 💕'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          plus_ones: parseInt(form.plusOnes, 10),
          message: form.message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.message || 'Something went wrong, try again!'); return }
      toast.success("You're on the list! See you December 4th 🎉")
      setForm(INITIAL)
      setSubmitted(true)
    } catch {
      toast.error('Network issue, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="rsvp" className="py-24 bg-slate-50">
      <div className="max-w-xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Will you be there?
        </h2>
        <p className="text-center mb-10" style={{ color: '#9C7A5A', fontSize: 15 }}>
          We&apos;d love to celebrate with you — let us know you&apos;re coming 🎊
        </p>

        <form onSubmit={handleSubmit} className="glass-gold rounded-2xl p-8 space-y-6">

          {/* Name */}
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase" style={{ color: '#9C7A5A' }}>
              What do we call you?
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              className={inputClass}
              style={inputStyle}
              placeholder="Your name"
              required
            />
          </div>

          {/* Plus ones */}
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase" style={{ color: '#9C7A5A' }}>
              Who&apos;s coming with you?
            </label>
            <select value={form.plusOnes} onChange={set('plusOnes')} className={inputClass} style={inputStyle}>
              <option value="0">Single, tho looking for someone</option>
              <option value="1">Me + my person</option>
              <option value="2">Me + 2, we travel in a pack</option>
              <option value="3">Me + 3, the whole gang</option>
              <option value="4">Me + 4, honestly a wedding within a wedding</option>
              <option value="5">Me + 5, we need our own table</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase" style={{ color: '#9C7A5A' }}>
              A little note for the couple 💌
            </label>
            <textarea
              value={form.message}
              onChange={set('message')}
              className={`${inputClass} resize-none`}
              style={inputStyle}
              placeholder="Share a wish, a memory, or just say hi — they'd love to hear from you…"
              rows={4}
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-xs" style={{ color: words > 100 ? '#e11d48' : 'transparent' }}>
                Keep it to 100 words 💕
              </span>
              <span className="text-xs" style={{ color: words > 90 ? '#C49A28' : '#C4B09A' }}>
                {words} / 100 words
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || words > 100}
            className="w-full disabled:opacity-50 py-3.5 rounded-xl font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition-all"
            style={{
              background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
              color: '#2A1200',
              boxShadow: loading ? 'none' : '0 4px 18px rgba(196,154,40,0.38)',
            }}
          >
            <Heart size={15} fill="currentColor" />
            {loading ? 'Sending…' : 'Count me in!'}
          </button>
        </form>
        {submitted && <GamesPrompt />}
      </div>
    </section>
  )
}
