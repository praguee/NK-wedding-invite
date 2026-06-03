'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
import SectionOrnament from './SectionOrnament'

interface FormState {
  name: string
  plusOnes: string
  message: string
}

const INITIAL: FormState = { name: '', plusOnes: '0', message: '' }

export default function RSVPForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) { toast.error('Please enter your name'); return }

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

      if (!res.ok) {
        toast.error(data.message || 'Something went wrong. Please try again.')
        return
      }

      toast.success("You're on the list! See you December 4th 🎉")
      setForm(INITIAL)
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-white'

  return (
    <section id="rsvp" className="py-24 bg-slate-50">
      <div className="max-w-xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          RSVP
        </h2>
        <p className="text-center text-slate-500 mb-12">
          Let us know you&apos;re coming — we can&apos;t wait to celebrate with you
        </p>

        <form onSubmit={handleSubmit} className="glass-gold rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              className={inputClass}
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Guests Attending (including you)
            </label>
            <select value={form.plusOnes} onChange={set('plusOnes')} className={inputClass}>
              <option value="0">Just me</option>
              <option value="1">Me + 1</option>
              <option value="2">Me + 2</option>
              <option value="3">Me + 3</option>
              <option value="4">Me + 4</option>
              <option value="5">Me + 5</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Message (optional)
            </label>
            <textarea
              value={form.message}
              onChange={set('message')}
              className={`${inputClass} resize-none`}
              placeholder="Share a wish or note for the couple..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{form.message.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full disabled:opacity-50 py-3.5 rounded-xl font-semibold text-sm tracking-widest transition-all flex items-center justify-center gap-2"
            style={{
              background: loading ? '#d4aa38' : 'linear-gradient(135deg, #C49A28, #E8C547, #C49A28)',
              backgroundSize: '200% auto',
              color: '#3B1F00',
              boxShadow: '0 4px 18px rgba(196,154,40,0.35)',
            }}
          >
            <Send size={15} />
            {loading ? 'Sending…' : 'Send RSVP'}
          </button>
        </form>
      </div>
    </section>
  )
}
