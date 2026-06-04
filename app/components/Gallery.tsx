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
    year: '2024',
  },
  {
    id: 2,
    src: '/images/gallery-agentjacks.jpg',
    alt: "Agent Jack's bar",
    title: "Agent Jack's",
    caption: 'Negotiated drinks for 30 mins. Got two. Fully worth it.',
    tag: 'Birmingham',
    year: '2024',
  },
  {
    id: 3,
    src: '/images/gallery-wish.jpg',
    alt: 'A wish in Birmingham',
    title: 'A Wish',
    caption: "She wrote it down in Birmingham. You're reading it.",
    tag: 'Birmingham',
    year: '2025',
  },
  {
    id: 4,
    src: '/images/gallery-longdistance.jpg',
    alt: 'Long distance begins',
    title: 'Sept 23, 2025',
    caption: 'Two time zones. One very expensive phone bill. Still here.',
    tag: 'Long Distance',
    year: '2025',
  },
]

export default function Gallery() {
  const [view, setView]         = useState<'grid' | 'list'>('grid')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [hovered, setHovered]   = useState<number | null>(null)

  const idx     = PHOTOS.findIndex(p => p.id === lightbox)
  const current = PHOTOS[idx]
  const prev    = () => setLightbox(PHOTOS[(idx - 1 + PHOTOS.length) % PHOTOS.length].id)
  const next    = () => setLightbox(PHOTOS[(idx + 1) % PHOTOS.length].id)

  return (
    <section id="gallery" className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <SectionOrnament />
            <h2 className="text-4xl md:text-5xl font-extralight tracking-tight leading-tight">
              Gallery
            </h2>
            <p className="mt-1 text-sm" style={{ color: '#9C7A5A' }}>
              {PHOTOS.length} moments · more coming
            </p>
          </div>

          {/* Toggle — editorial text style */}
          <div className="flex items-center mt-2">
            <button
              onClick={() => setView('grid')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs tracking-widest uppercase font-medium transition-all duration-200"
              style={{
                color: view === 'grid' ? '#C49A28' : '#C4B09A',
                borderBottom: view === 'grid' ? '1.5px solid #C49A28' : '1.5px solid transparent',
              }}
            >
              {/* Grid icon */}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                <rect x="0"   y="0"   width="5.5" height="5.5" rx="1"/>
                <rect x="7.5" y="0"   width="5.5" height="5.5" rx="1"/>
                <rect x="0"   y="7.5" width="5.5" height="5.5" rx="1"/>
                <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1"/>
              </svg>
              Grid
            </button>
            <span style={{ color: '#C4B09A', margin: '0 2px', fontSize: 12 }}>/</span>
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs tracking-widest uppercase font-medium transition-all duration-200"
              style={{
                color: view === 'list' ? '#C49A28' : '#C4B09A',
                borderBottom: view === 'list' ? '1.5px solid #C49A28' : '1.5px solid transparent',
              }}
            >
              {/* List icon */}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                <rect x="0" y="0"   width="13" height="2.5" rx="1"/>
                <rect x="0" y="5.2" width="13" height="2.5" rx="1"/>
                <rect x="0" y="10.5" width="13" height="2.5" rx="1"/>
              </svg>
              List
            </button>
          </div>
        </div>

        {/* ── GRID VIEW — 2 column, tall cards ── */}
        {view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PHOTOS.map((photo, i) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                style={{ aspectRatio: i % 3 === 0 ? '4/5' : '3/4' }}
                onMouseEnter={() => setHovered(photo.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setLightbox(photo.id)}
              >
                {/* Photo */}
                <Image
                  src={photo.src} alt={photo.alt} fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: 'cover', objectPosition: 'center 15%',
                    transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
                    transform: hovered === photo.id ? 'scale(1.04)' : 'scale(1)',
                  }}
                />

                {/* Persistent dark base at bottom */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(3,1,10,0.9) 0%, rgba(3,1,10,0.15) 45%, transparent 70%)',
                }}/>

                {/* Index number — top left */}
                <div style={{
                  position: 'absolute', top: 18, left: 20,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.45)',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Caption — bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 22px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <span style={{
                        display: 'inline-block', fontSize: 9, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: '#C49A28', marginBottom: 6,
                      }}>
                        {photo.tag}
                      </span>
                      <p style={{ fontSize: 18, fontWeight: 300, color: 'white', lineHeight: 1.1 }}>
                        {photo.title}
                      </p>
                    </div>
                    {/* Arrow on hover */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 14, flexShrink: 0,
                      opacity: hovered === photo.id ? 1 : 0,
                      transform: hovered === photo.id ? 'scale(1)' : 'scale(0.8)',
                      transition: 'opacity 0.25s, transform 0.25s',
                    }}>↗</div>
                  </div>

                  {/* Caption slides up on hover */}
                  <p style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6, lineHeight: 1.5,
                    maxHeight: hovered === photo.id ? '60px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                    opacity: hovered === photo.id ? 1 : 0,
                  }}>
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST VIEW — editorial rows ── */}
        {view === 'list' && (
          <div>
            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto 100px',
              gap: 16,
              padding: '0 0 12px',
              borderBottom: '1px solid rgba(196,154,40,0.2)',
              marginBottom: 4,
            }}>
              {['No.', 'Moment', 'Year', ''].map(h => (
                <span key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4B09A' }}>
                  {h}
                </span>
              ))}
            </div>

            {PHOTOS.map((photo, i) => (
              <div
                key={photo.id}
                onClick={() => setLightbox(photo.id)}
                onMouseEnter={() => setHovered(photo.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr auto 100px',
                  gap: 16,
                  alignItems: 'center',
                  padding: '18px 0',
                  borderBottom: '1px solid rgba(196,154,40,0.1)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  borderRadius: 12,
                  marginLeft: -12, marginRight: -12, paddingLeft: 12, paddingRight: 12,
                  background: hovered === photo.id ? 'rgba(196,154,40,0.04)' : 'transparent',
                }}
              >
                {/* Index */}
                <span style={{ fontSize: 12, fontWeight: 700, color: '#C4B09A', letterSpacing: '0.05em' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title + caption */}
                <div>
                  <p style={{
                    fontSize: 20, fontWeight: 300, lineHeight: 1.1, marginBottom: 5,
                    color: hovered === photo.id ? '#C49A28' : '#1C0F0A',
                    transition: 'color 0.2s',
                  }}>
                    {photo.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#7C5A3A', lineHeight: 1.5, maxWidth: 380 }}>
                    {photo.caption}
                  </p>
                </div>

                {/* Year tag */}
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#C49A28', background: 'rgba(196,154,40,0.1)',
                  border: '1px solid rgba(196,154,40,0.25)',
                  borderRadius: 100, padding: '4px 12px', whiteSpace: 'nowrap',
                }}>
                  {photo.tag}
                </span>

                {/* Thumbnail */}
                <div style={{
                  width: 100, height: 70, borderRadius: 10, overflow: 'hidden',
                  position: 'relative', flexShrink: 0,
                  border: '1px solid rgba(196,154,40,0.2)',
                  transition: 'transform 0.3s ease',
                  transform: hovered === photo.id ? 'scale(1.04)' : 'scale(1)',
                }}>
                  <Image src={photo.src} alt={photo.alt} fill
                    style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
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
          style={{ background: 'rgba(0,0,0,0.94)' }}
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-5 right-5 text-white/50 hover:text-white transition p-2"
            onClick={() => setLightbox(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3"
            onClick={e => { e.stopPropagation(); prev() }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="relative rounded-2xl overflow-hidden"
            style={{ maxWidth: 'min(420px, 90vw)', maxHeight: '88vh', aspectRatio: '3/4', width: '100%' }}
            onClick={e => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill
              style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(3,1,10,0.95) 0%, transparent 100%)',
              padding: '32px 22px 24px',
            }}>
              <span style={{
                display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#C49A28', marginBottom: 8,
              }}>{current.tag}</span>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 300, marginBottom: 6 }}>{current.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.5 }}>{current.caption}</p>
            </div>
          </div>

          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3"
            onClick={e => { e.stopPropagation(); next() }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <p className="absolute bottom-5 text-white/25 text-xs tracking-widest">
            {idx + 1} — {PHOTOS.length}
          </p>
        </div>
      )}
    </section>
  )
}
