'use client'

import { useState } from 'react'
import Image from 'next/image'
import SectionOrnament from './SectionOrnament'

const PHOTOS = [
  {
    id: 1,
    src: '/images/gallery-diwali.jpg',
    alt: 'Diwali celebrations',
    title: 'Diwali',
    caption: "The lights were beautiful. They didn't notice.",
    tag: '2024',
  },
  {
    id: 2,
    src: '/images/gallery-agentjacks.jpg',
    alt: "Agent Jack's bar",
    title: "Agent Jack's",
    caption: 'Negotiated drinks for 30 mins. Got two. Fully worth it.',
    tag: 'Birmingham',
  },
  {
    id: 3,
    src: '/images/gallery-wish.jpg',
    alt: 'Birmingham wish',
    title: 'A Wish',
    caption: "She wrote it down in Birmingham. You're reading it.",
    tag: 'Birmingham',
  },
  {
    id: 4,
    src: '/images/gallery-longdistance.jpg',
    alt: 'Long distance begins',
    title: 'Sept 23, 2025',
    caption: 'Two time zones. One very expensive phone bill. Still here.',
    tag: 'Long Distance',
  },
]

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? '#C49A28' : '#9C7A5A'}>
      <rect x="0"   y="0"   width="6.5" height="6.5" rx="1.5"/>
      <rect x="9.5" y="0"   width="6.5" height="6.5" rx="1.5"/>
      <rect x="0"   y="9.5" width="6.5" height="6.5" rx="1.5"/>
      <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="1.5"/>
    </svg>
  )
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? '#C49A28' : '#9C7A5A'}>
      <rect x="0" y="1"    width="16" height="2.5" rx="1.2"/>
      <rect x="0" y="6.75" width="16" height="2.5" rx="1.2"/>
      <rect x="0" y="12.5" width="16" height="2.5" rx="1.2"/>
    </svg>
  )
}

export default function Gallery() {
  const [view, setView]       = useState<'grid' | 'list'>('grid')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const current      = PHOTOS.find(p => p.id === lightbox)
  const currentIndex = PHOTOS.findIndex(p => p.id === lightbox)
  const prev = () => setLightbox(PHOTOS[(currentIndex - 1 + PHOTOS.length) % PHOTOS.length].id)
  const next = () => setLightbox(PHOTOS[(currentIndex + 1) % PHOTOS.length].id)

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionOrnament />
            <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">Gallery</h2>
            <p className="text-sm mt-1" style={{ color: '#9C7A5A' }}>
              {PHOTOS.length} moments · more coming
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-0.5 glass-gold rounded-xl p-1 mb-1">
            {(['grid', 'list'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="p-2.5 rounded-lg transition-all duration-200"
                style={{
                  background: view === v ? 'rgba(196,154,40,0.15)' : 'transparent',
                }}
                aria-label={`${v} view`}
              >
                {v === 'grid'
                  ? <GridIcon active={view === 'grid'} />
                  : <ListIcon active={view === 'list'} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── GRID VIEW ── */}
        {view === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHOTOS.map(photo => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-2xl cursor-pointer"
                style={{ aspectRatio: '3/4' }}
                onMouseEnter={() => setHovered(photo.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setLightbox(photo.id)}
              >
                <Image
                  src={photo.src} alt={photo.alt} fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{
                    objectFit: 'cover', objectPosition: 'center 15%',
                    transition: 'transform 0.5s ease',
                    transform: hovered === photo.id ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
                {/* Gradient */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(5,2,15,0.88) 0%, rgba(5,2,15,0.1) 50%, transparent 100%)',
                  opacity: hovered === photo.id ? 1 : 0.65,
                  transition: 'opacity 0.3s',
                }} />
                {/* Caption */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '12px 14px 14px',
                  transform: hovered === photo.id ? 'translateY(0)' : 'translateY(3px)',
                  transition: 'transform 0.3s',
                }}>
                  <span style={{
                    display: 'inline-block', fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#C49A28', background: 'rgba(196,154,40,0.18)',
                    border: '1px solid rgba(196,154,40,0.3)',
                    borderRadius: 100, padding: '2px 8px', marginBottom: 5,
                  }}>{photo.tag}</span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 2, lineHeight: 1.2 }}>
                    {photo.title}
                  </p>
                  <p style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4,
                    opacity: hovered === photo.id ? 1 : 0,
                    transition: 'opacity 0.25s',
                  }}>
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === 'list' && (
          <div style={{ borderTop: '1px solid rgba(196,154,40,0.12)' }}>
            {PHOTOS.map((photo, idx) => (
              <div
                key={photo.id}
                className="flex items-center gap-5 cursor-pointer transition-all duration-200"
                style={{
                  padding: '16px 12px',
                  borderBottom: '1px solid rgba(196,154,40,0.1)',
                  borderRadius: 16,
                  background: hovered === photo.id ? 'rgba(196,154,40,0.04)' : 'transparent',
                  margin: '0 -12px',
                }}
                onClick={() => setLightbox(photo.id)}
                onMouseEnter={() => setHovered(photo.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Index */}
                <span style={{ fontSize: 11, fontWeight: 600, color: '#C4B09A', minWidth: 24, textAlign: 'right', flexShrink: 0 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Thumb */}
                <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative', border: '1px solid rgba(196,154,40,0.2)' }}>
                  <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 15, fontWeight: 600, marginBottom: 3, lineHeight: 1.2,
                    color: hovered === photo.id ? '#C49A28' : '#1C0F0A',
                    transition: 'color 0.2s',
                  }}>{photo.title}</p>
                  <p style={{ fontSize: 13, color: '#7C5A3A', lineHeight: 1.5 }}>{photo.caption}</p>
                </div>

                {/* Tag + arrow */}
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: '#C49A28', background: 'rgba(196,154,40,0.1)', border: '1px solid rgba(196,154,40,0.2)',
                    borderRadius: 100, padding: '3px 10px', whiteSpace: 'nowrap',
                  }}>{photo.tag}</span>
                  <span style={{
                    fontSize: 16, color: '#C4B09A',
                    opacity: hovered === photo.id ? 1 : 0,
                    transform: hovered === photo.id ? 'translateX(0)' : 'translateX(-4px)',
                    transition: 'opacity 0.2s, transform 0.2s',
                  }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.93)' }}
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-5 right-5 text-white/60 hover:text-white transition"
            onClick={() => setLightbox(null)}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M4 4 L22 22 M22 4 L4 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <button className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3"
            onClick={e => { e.stopPropagation(); prev() }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M17 3 L7 13 L17 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="relative rounded-2xl overflow-hidden"
            style={{ maxWidth: 'min(420px, 88vw)', maxHeight: '85vh', aspectRatio: '3/4', width: '100%' }}
            onClick={e => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill
              style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(5,2,15,0.92) 0%, transparent 100%)',
              padding: '28px 20px 22px',
            }}>
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#C49A28',
                background: 'rgba(196,154,40,0.15)', border: '1px solid rgba(196,154,40,0.3)',
                borderRadius: 100, padding: '2px 10px', marginBottom: 8,
              }}>{current.tag}</span>
              <p style={{ color: 'white', fontWeight: 600, marginBottom: 5, fontSize: 16 }}>{current.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.5 }}>{current.caption}</p>
            </div>
          </div>

          <button className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3"
            onClick={e => { e.stopPropagation(); next() }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M9 3 L19 13 L9 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <p className="absolute bottom-4 text-white/30 text-xs">
            {currentIndex + 1} / {PHOTOS.length}
          </p>
        </div>
      )}
    </section>
  )
}
