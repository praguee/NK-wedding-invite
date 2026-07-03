'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import SectionOrnament from './SectionOrnament'

interface FormState { name: string; plusOnes: string; message: string }
const INITIAL: FormState = { name: '', plusOnes: '0', message: '' }
const EASE = [0.16, 1, 0.3, 1] as const

const FIELD: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(8,4,18,0.48)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.13)',
  borderRadius: 12,
  color: 'rgba(255,255,255,0.90)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
  boxSizing: 'border-box' as const,
}

const LABEL: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  color: 'rgba(196,154,40,0.72)',
  fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
}

function GamesPrompt({ redirecting }: { redirecting: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        marginTop: 16,
        background: 'rgba(8,4,18,0.52)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '20px 24px',
      }}
    >
      <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(196,154,40,0.70)', marginBottom: 6, fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif' }}>
        One more thing
      </p>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 4, fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif' }}>
        Think you know us? Take the quiz.
      </p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', marginBottom: 16, fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif' }}>
        Score 60%+ and get a live caricature drawn at the reception.
      </p>
      {redirecting ? (
        <p style={{ fontSize: 12, color: 'rgba(196,154,40,0.70)', fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif' }}>Taking you there now…</p>
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
          src="/images/gallery-diwali.jpg"
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
        background: 'linear-gradient(to bottom, rgba(3,1,10,0.75) 0%, rgba(3,1,10,0.62) 40%, rgba(3,1,10,0.82) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(52px, 7vw, 88px) clamp(24px, 5vw, 52px)',
        width: '100%', maxWidth: 480, margin: '0 auto',
      }}>
        <SectionOrnament />

        <motion.h2
          id="rsvp-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(2rem, 4.5vw, 4.5rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.96)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '0 0 clamp(6px, 1vh, 10px)',
            textAlign: 'center',
            textShadow: '0 2px 40px rgba(3,1,10,0.85)',
          }}
        >
          Will you be there?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(10px, 1.1vw, 12px)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(196,154,40,0.72)',
            marginBottom: 'clamp(24px, 4vw, 36px)',
            fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
          }}
        >
          Let us know you&apos;re coming
        </motion.p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2vw, 18px)' }}>

          <div>
            <label style={LABEL}>What do we call you?</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              className="rsvp-dark-input"
              style={FIELD}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label style={LABEL}>Who&apos;s coming with you?</label>
            <select value={form.plusOnes} onChange={set('plusOnes')} className="rsvp-dark-input" style={FIELD}>
              <option value="0">Just me</option>
              <option value="1">Me + my person</option>
              <option value="2">Me + 2, we travel in a pack</option>
              <option value="3">Me + 3, the whole gang</option>
              <option value="4">Me + 4, honestly a wedding within a wedding</option>
              <option value="5">Me + 5, we need our own table</option>
            </select>
          </div>

          <div>
            <label style={LABEL}>A little note for the couple</label>
            <textarea
              value={form.message}
              onChange={set('message')}
              className="rsvp-dark-input"
              style={{ ...FIELD, resize: 'none' }}
              placeholder="Share a wish, a memory, or just say hi…"
              rows={4}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }}>
              <span style={{
                fontSize: 11,
                color: words > 90 ? 'rgba(196,154,40,0.80)' : 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              }}>
                {words} / 100 words
              </span>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || words > 100}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.94)',
              color: 'rgba(3,1,10,0.88)',
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              border: 'none',
              cursor: loading || words > 100 ? 'not-allowed' : 'pointer',
              opacity: loading || words > 100 ? 0.5 : 1,
              fontFamily: 'var(--font-dm-sans), Inter, system-ui, sans-serif',
              boxShadow: '0 4px 24px rgba(255,255,255,0.12)',
            }}
          >
            {loading ? 'Sending…' : 'Count me in'}
          </motion.button>

        </form>

        {submitted && <GamesPrompt redirecting={redirecting} />}
      </div>
    </section>
  )
}
