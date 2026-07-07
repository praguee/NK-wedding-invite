'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface FormState { name: string; plusOnes: string; message: string }
const INITIAL: FormState = { name: '', plusOnes: '0', message: '' }
const EASE = [0.16, 1, 0.3, 1] as const

// Refined line-style field — transparent, hairline underline, gold on focus.
// Lets the photo breathe instead of stacking opaque boxes.
const FIELD: React.CSSProperties = {
  width: '100%',
  padding: '11px 2px',
  color: 'rgba(255,255,255,0.94)',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
  boxSizing: 'border-box' as const,
}

const LABEL: React.CSSProperties = {
  display: 'block',
  marginBottom: 2,
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  color: 'rgba(196,154,40,0.78)',
  fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
}

function GamesPrompt({ redirecting }: { redirecting: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        marginTop: 20,
        paddingTop: 20,
        borderTop: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(196,154,40,0.72)', marginBottom: 6, fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif' }}>
        One more thing
      </p>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 4, fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif' }}>
        Think you know us? Take the quiz.
      </p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 16, fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif' }}>
        Score 60%+ and get a live caricature drawn at the reception.
      </p>
      {redirecting ? (
        <p style={{ fontSize: 12, color: 'rgba(196,154,40,0.72)', fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif' }}>Taking you there now…</p>
      ) : (
        <Link href="/games" style={{
          display: 'inline-block',
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          padding: '10px 20px', borderRadius: 100,
          border: '1px solid rgba(255,255,255,0.22)',
          color: 'rgba(255,255,255,0.85)',
          textDecoration: 'none',
          fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
        }}>
          Go Now →
        </Link>
      )}
    </motion.div>
  )
}

const countWords = (text: string) =>
  text.trim() === '' ? 0 : text.trim().split(/\s+/).length

export default function RSVPForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const words = countWords(form.message)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Tell us your name'); return }
    if (words > 100) { toast.error('Keep your message to 100 words'); return }
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
      if (!res.ok) { toast.error(data.message || 'Something went wrong, try again'); return }
      toast.success("You're on the list — see you December 4th")
      setForm(INITIAL)
      setSubmitted(true)
      setRedirecting(true)
      setTimeout(() => router.push('/games'), 2500)
    } catch {
      toast.error('Network issue, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-heading"
      style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '100svh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}
    >
      {/* Background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/images/jabwemet.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, 50vw"
          style={{ objectFit: 'cover', objectPosition: 'center 28%' }}
        />
      </div>

      {/* Vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(3,1,10,0.78) 0%, rgba(3,1,10,0.60) 42%, rgba(3,1,10,0.86) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(48px, 7vw, 88px) clamp(20px, 5vw, 52px)',
        width: '100%', maxWidth: 468, margin: '0 auto',
      }}>
        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(22px, 3.5vw, 32px)' }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 'clamp(9px, 1vw, 11px)',
              letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'rgba(196,154,40,0.82)',
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              marginBottom: 'clamp(10px, 1.6vh, 16px)',
            }}
          >
            <span aria-hidden="true" style={{ width: 'clamp(20px, 5vw, 34px)', height: 1, background: 'linear-gradient(to right, transparent, rgba(196,154,40,0.6))' }} />
            RSVP
            <span aria-hidden="true" style={{ width: 'clamp(20px, 5vw, 34px)', height: 1, background: 'linear-gradient(to left, transparent, rgba(196,154,40,0.6))' }} />
          </motion.span>

          <motion.h2
            id="rsvp-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, ease: EASE }}
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.1rem, 4.6vw, 4.6rem)',
              fontWeight: 300, fontStyle: 'italic',
              color: 'rgba(255,255,255,0.97)',
              lineHeight: 1.02, letterSpacing: '-0.02em',
              margin: 0,
              textShadow: '0 2px 44px rgba(3,1,10,0.9)',
            }}
          >
            Will you be there?
          </motion.h2>
        </div>

        {/* ── Liquid-glass form panel ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          style={{
            display: 'flex', flexDirection: 'column',
            gap: 'clamp(18px, 2.6vw, 24px)',
            padding: 'clamp(26px, 5vw, 40px) clamp(22px, 4.5vw, 36px) clamp(28px, 5vw, 38px)',
            borderRadius: 24,
            background: 'rgba(10,6,20,0.46)',
            backdropFilter: 'blur(44px) saturate(200%)',
            WebkitBackdropFilter: 'blur(44px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.30), 0 30px 80px rgba(0,0,0,0.50)',
          }}
        >
          <div>
            <label htmlFor="rsvp-name" style={LABEL}>What do we call you?</label>
            <input
              id="rsvp-name"
              type="text"
              value={form.name}
              onChange={set('name')}
              className="rsvp-line-input"
              style={FIELD}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="rsvp-guests" style={LABEL}>Who&apos;s coming with you?</label>
            <select id="rsvp-guests" value={form.plusOnes} onChange={set('plusOnes')} className="rsvp-line-input" style={FIELD}>
              <option value="0">Just me</option>
              <option value="1">Me + my person</option>
              <option value="2">Me + 2, we travel in a pack</option>
              <option value="3">Me + 3, the whole gang</option>
              <option value="4">Me + 4, honestly a wedding within a wedding</option>
              <option value="5">Me + 5, we need our own table</option>
            </select>
          </div>

          <div>
            <label htmlFor="rsvp-note" style={LABEL}>A little note for the couple</label>
            <textarea
              id="rsvp-note"
              value={form.message}
              onChange={set('message')}
              className="rsvp-line-input"
              style={{ ...FIELD, resize: 'none', lineHeight: 1.55 }}
              placeholder="Share a wish, a memory, or just say hi…"
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
              <span style={{
                fontSize: 11,
                color: words > 90 ? 'rgba(196,154,40,0.85)' : 'rgba(255,255,255,0.28)',
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
                letterSpacing: '0.04em',
              }}>
                {words} / 100 words
              </span>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || words > 100}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            whileHover={{ scale: loading ? 1 : 1.015 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{
              width: '100%',
              marginTop: 4,
              padding: '15px 0',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.95)',
              color: 'rgba(3,1,10,0.90)',
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              border: 'none',
              cursor: loading || words > 100 ? 'not-allowed' : 'pointer',
              opacity: loading || words > 100 ? 0.5 : 1,
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              boxShadow: '0 6px 28px rgba(0,0,0,0.35)',
            }}
          >
            {loading ? 'Sending…' : 'Count me in'}
          </motion.button>

          {submitted && <GamesPrompt redirecting={redirecting} />}
        </motion.form>
      </div>
    </section>
  )
}
