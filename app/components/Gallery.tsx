'use client'

import { useState } from 'react'
import Image from 'next/image'
import SectionOrnament from './SectionOrnament'

const PHOTOS = [
  {
    id: 1,
    src: '/images/gallery-diwali.jpg',
    alt: 'Diwali celebrations',
    index: '01',
    title: 'Diwali',
    caption: "The lights were beautiful. They didn't notice.",
    meta: '2024',
    tall: true,
  },
  {
    id: 2,
    src: '/images/gallery-agentjacks.jpg',
    alt: "Agent Jack's",
    index: '02',
    title: "Agent Jack's",
    caption: 'Negotiated drinks for 30 mins. Got two. Fully worth it.',
    meta: 'Birmingham',
    tall: false,
  },
  {
    id: 3,
    src: '/images/gallery-wish.jpg',
    alt: 'A wish in Birmingham',
    index: '03',
    title: 'A Wish',
    caption: "She wrote it down in Birmingham. You're reading it.",
    meta: 'Birmingham',
    tall: false,
  },
  {
    id: 4,
    src: '/images/gallery-longdistance.jpg',
    alt: 'Long distance begins',
    index: '04',
    title: 'Sept 23, 2025',
    caption: 'Two time zones. One very expensive phone bill. Still here.',
    meta: 'Long Distance',
    tall: true,
  },
]

function PhotoCard({
  photo,
  onOpen,
}: {
  photo: typeof PHOTOS[0]
  onOpen: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden cursor-pointer group"
      style={{ borderRadius: 20, width: '100%', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* Index — large ghost number, top-left */}
      <span
        style={{
          position: 'absolute', top: 14, left: 18, zIndex: 10,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
          transition: 'opacity 0.3s',
          opacity: hovered ? 0 : 1,
        }}
      >{photo.index}</span>

      {/* Photo */}
      <Image
        src={photo.src} alt={photo.alt} fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center 20%',
          transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      {/* Permanent gradient — always shows bottom info */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(3,1,10,0.94) 0%, rgba(3,1,10,0.4) 50%, rgba(3,1,10,0.1) 100%)'
          : 'linear-gradient(to top, rgba(3,1,10,0.75) 0%, rgba(3,1,10,0.05) 55%, transparent 100%)',
        transition: 'background 0.4s ease',
      }} />

      {/* Bottom content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 20px 22px',
        transform: hovered ? 'translateY(0)' : 'translateY(4px)',
        transition: 'transform 0.35s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'inline-block', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#C49A28', marginBottom: 6,
            }}>{photo.meta}</span>
            <p style={{
              fontSize: hovered ? 20 : 17, fontWeight: 300, color: 'white',
              lineHeight: 1.1,
              transition: 'font-size 0.3s ease',
            }}>{photo.title}</p>
            <p style={{
              fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6,
              lineHeight: 1.5,
              maxHeight: hovered ? '80px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.35s ease, opacity 0.35s ease',
              opacity: hovered ? 1 : 0,
            }}>{photo.caption}</p>
          </div>

          {/* Expand button */}
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 16, flexShrink: 0,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1) rotate(0deg)' : 'scale(0.7) rotate(-45deg)',
            transition: 'all 0.3s ease',
          }}>↗</div>
        </div>
      </div>
    </div>
  )
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const idx = PHOTOS.findIndex(p => p.id === lightbox)
  const current = PHOTOS[idx]
  const prev = () => setLightbox(PHOTOS[(idx - 1 + PHOTOS.length) % PHOTOS.length].id)
  const next = () => setLightbox(PHOTOS[(idx + 1) % PHOTOS.length].id)

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <SectionOrnament />
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">Gallery</h2>
              <p className="text-sm mt-1" style={{ color: '#9C7A5A' }}>
                {PHOTOS.length} moments · more coming
              </p>
            </div>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#C4B09A', marginBottom: 4 }}>
              Hover to read
            </p>
          </div>
        </div>

        {/* Editorial asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3" style={{ gridAutoRows: 'auto' }}>

          {/* Photo 1 — tall left column */}
          <div className="md:col-span-5" style={{ minHeight: 320 }}>
            <div style={{ height: '100%', minHeight: 320, position: 'relative' }}>
              <PhotoCard photo={PHOTOS[0]} onOpen={() => setLightbox(PHOTOS[0].id)} />
            </div>
          </div>

          {/* Center column — 2 stacked */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div style={{ flex: 1, minHeight: 200, position: 'relative' }}>
              <PhotoCard photo={PHOTOS[1]} onOpen={() => setLightbox(PHOTOS[1].id)} />
            </div>
            <div style={{ flex: 1, minHeight: 200, position: 'relative' }}>
              <PhotoCard photo={PHOTOS[2]} onOpen={() => setLightbox(PHOTOS[2].id)} />
            </div>
          </div>

          {/* Photo 4 — tall right column */}
          <div className="md:col-span-3" style={{ minHeight: 320 }}>
            <div style={{ height: '100%', minHeight: 320, position: 'relative' }}>
              <PhotoCard photo={PHOTOS[3]} onOpen={() => setLightbox(PHOTOS[3].id)} />
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(3,1,10,0.95)' }}
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-5 right-5 text-white/50 hover:text-white transition p-2"
            onClick={() => setLightbox(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-3"
            onClick={e => { e.stopPropagation(); prev() }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="relative rounded-2xl overflow-hidden"
            style={{ maxWidth: 'min(440px, 90vw)', maxHeight: '88vh', aspectRatio: '3/4', width: '100%' }}
            onClick={e => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(3,1,10,0.95) 0%, transparent 100%)',
              padding: '32px 22px 24px',
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C49A28', display: 'block', marginBottom: 8 }}>{current.meta}</span>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 300, marginBottom: 6 }}>{current.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.5 }}>{current.caption}</p>
            </div>
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-3"
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
