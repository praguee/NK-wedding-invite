'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import { TextReveal } from './ScrollReveal'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'
import MobileGallery from './MobileGallery'

const PHOTOS = [
  {
    id: 1,
    src: '/images/gallery-wish.jpg',
    alt: 'A wish written in Birmingham',
    index: '01',
    title: 'A Wish',
    caption: "She wrote it down in Birmingham. You're reading it.",
    meta: 'Birmingham · 2025',
    objectPosition: 'center 60%',
  },
  {
    id: 3,
    src: '/images/gallery-diwali-sparklers.jpg',
    alt: 'Diwali together',
    index: '02',
    title: 'Diwali',
    caption: 'The way they look at each other — always.',
    meta: 'Diwali · Mumbai',
    objectPosition: 'center 25%',
  },
  {
    id: 4,
    src: '/images/gallery-diwali-lights.jpg',
    alt: 'Diwali fairy lights',
    index: '03',
    title: 'Fairy Lights',
    caption: 'The kind of photo you frame.',
    meta: 'Diwali · Mumbai',
    objectPosition: 'center 25%',
  },
  {
    id: 5,
    src: '/images/gallery-diwali2.jpg',
    alt: 'Diwali celebrations — dressed up',
    index: '04',
    title: 'All Dressed Up',
    caption: 'He wore maroon. She wore purple. They matched the night.',
    meta: 'Diwali · Mumbai',
    objectPosition: 'center 20%',
  },
  {
    id: 6,
    src: '/images/gallery-airport.jpg',
    alt: 'At the airport — long distance begins',
    index: '05',
    title: 'See You Soon',
    caption: "The last flight before long distance. They didn't cry. Much.",
    meta: 'Mumbai Airport · Sept 2025',
    objectPosition: 'center 30%',
  },
  {
    id: 7,
    src: '/images/gallery-mirror.jpg',
    alt: 'Mirror selfie in a hotel corridor',
    index: '06',
    title: 'Mirror, Mirror',
    caption: 'Hotel corridor. The architecture posed too.',
    meta: 'Mumbai',
    objectPosition: 'center 15%',
  },
  {
    id: 8,
    src: '/images/gallery-park.jpg',
    alt: 'Under the lights at a park at night',
    index: '07',
    title: 'Under the Lights',
    caption: 'Pretending to look at the tree.',
    meta: 'Mumbai',
    objectPosition: 'center 30%',
  },
  {
    id: 9,
    src: '/images/gallery-christmas.jpg',
    alt: 'First Christmas together',
    index: '08',
    title: 'First Christmas',
    caption: "She wore the crown. He didn't argue.",
    meta: 'Christmas · Mumbai',
    objectPosition: 'center 25%',
  },
]

// colSpan, rowSpan, revealDelay
// Grid: 12 columns, auto-rows 240px
// Row 1-2: wish(5,2) | diwali(4,1) | lights(3,1)
// Row 2:   (wish)    | diwali2(4,1) | airport(3,1)
// Row 3:   mirror(3,1) | park(4,1) | christmas(5,1)
const GRID_CONFIG = [
  { colSpan: 5, rowSpan: 2, delay: 0.00, rotate: -1.4 },
  { colSpan: 4, rowSpan: 1, delay: 0.10, rotate:  0.9 },
  { colSpan: 3, rowSpan: 1, delay: 0.20, rotate: -0.6 },
  { colSpan: 4, rowSpan: 1, delay: 0.14, rotate:  1.2 },
  { colSpan: 3, rowSpan: 1, delay: 0.06, rotate: -1.0 },
  { colSpan: 3, rowSpan: 1, delay: 0.00, rotate:  0.7 },
  { colSpan: 4, rowSpan: 1, delay: 0.10, rotate: -0.8 },
  { colSpan: 5, rowSpan: 1, delay: 0.20, rotate:  1.1 },
]

const EASE = [0.16, 1, 0.3, 1] as const

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
      className="relative overflow-hidden cursor-pointer w-full h-full"
      style={{ borderRadius: 14 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
      aria-label={`Open photo: ${photo.title}`}
    >
      {/* Index — ghost number, fades when hovered */}
      <motion.span
        style={{
          position: 'absolute', top: 14, left: 16, zIndex: 10,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.32)', pointerEvents: 'none',
        }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      >
        {photo.index}
      </motion.span>

      {/* Image — zooms on hover */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 1.0, ease: EASE }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', objectPosition: photo.objectPosition }}
        />
      </motion.div>

      {/* Gold diagonal sheen — sweeps on hover */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(125deg, transparent 25%, rgba(196,154,40,0.15) 50%, transparent 75%)',
          backgroundSize: '250% 250%',
        }}
        animate={{
          opacity: hovered ? 1 : 0,
          backgroundPosition: hovered ? '100% 100%' : '0% 0%',
        }}
        transition={{ duration: 0.8, ease: EASE }}
      />

      {/* Dark vignette — deepens on hover */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: hovered
            ? 'linear-gradient(to top, rgba(3,1,10,0.92) 0%, rgba(3,1,10,0.3) 50%, rgba(3,1,10,0.06) 100%)'
            : 'linear-gradient(to top, rgba(3,1,10,0.70) 0%, rgba(3,1,10,0.04) 55%, transparent 100%)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Bottom content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Meta label */}
            <span style={{
              display: 'block', fontSize: 8, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#C49A28', marginBottom: 5, opacity: 0.9,
            }}>
              {photo.meta}
            </span>

            {/* Title */}
            <motion.p
              style={{ fontWeight: 300, color: 'white', lineHeight: 1.1 }}
              animate={{ fontSize: hovered ? 19 : 15 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {photo.title}
            </motion.p>

            {/* Caption — maxHeight slide-up */}
            <motion.p
              style={{
                fontSize: 12, color: 'rgba(255,255,255,0.58)', lineHeight: 1.5,
                overflow: 'hidden',
              }}
              animate={{
                maxHeight: hovered ? 70 : 0,
                opacity: hovered ? 1 : 0,
                marginTop: hovered ? 5 : 0,
              }}
              transition={{ duration: 0.38, ease: EASE }}
            >
              {photo.caption}
            </motion.p>
          </div>

          {/* Expand arrow */}
          <motion.div
            style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.55, rotate: hovered ? 0 : -45 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Wipe reveal — clip-path inset top-down, positioned absolute to fill grid cell
function WipeReveal({
  children,
  delay = 0,
  reducedMotion,
}: {
  children: React.ReactNode
  delay?: number
  reducedMotion: boolean
}) {
  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden' }}
      initial={reducedMotion
        ? { opacity: 0 }
        : { clipPath: 'inset(0 0 100% 0 round 14px)' }
      }
      whileInView={reducedMotion
        ? { opacity: 1 }
        : { clipPath: 'inset(0 0 0% 0 round 14px)' }
      }
      viewport={{ once: true, margin: '-32px' }}
      transition={{ duration: reducedMotion ? 0.4 : 1.15, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reducedMotion = useReducedMotion() ?? false
  const lightboxMounted = useRef(false)

  useEffect(() => {
    if (!lightboxMounted.current) { lightboxMounted.current = true; return }
    window.dispatchEvent(new CustomEvent('nk:lightbox', { detail: { open: lightbox !== null } }))
  }, [lightbox])

  const idx     = PHOTOS.findIndex(p => p.id === lightbox)
  const current = PHOTOS[idx]
  const prev    = () => setLightbox(PHOTOS[(idx - 1 + PHOTOS.length) % PHOTOS.length].id)
  const next    = () => setLightbox(PHOTOS[(idx + 1) % PHOTOS.length].id)

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      else if (e.key === 'ArrowLeft')  setLightbox(PHOTOS[(PHOTOS.findIndex(p => p.id === lightbox) - 1 + PHOTOS.length) % PHOTOS.length].id)
      else if (e.key === 'ArrowRight') setLightbox(PHOTOS[(PHOTOS.findIndex(p => p.id === lightbox) + 1) % PHOTOS.length].id)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  return (
    <section
      id="gallery"
      style={{
        padding: '80px 0 90px',
        background: 'linear-gradient(160deg, #0E0618 0%, #130920 55%, #0D0617 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blobs behind the dark section */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60vw 40vh at 80% 15%, rgba(196,154,40,0.07) 0%, transparent 65%), radial-gradient(ellipse 50vw 50vh at 10% 85%, rgba(139,34,82,0.06) 0%, transparent 60%)',
      }} />

      <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className={isMobile ? 'mb-8' : 'mb-12'}>
          <SectionOrnament />
          <div className="flex items-end justify-between">
            <div>
              <TextReveal delay={0.05}>
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight"
                  style={{ color: 'rgba(246,237,218,0.90)' }}
                >
                  Gallery
                </h2>
              </TextReveal>
              <motion.p
                className="text-sm mt-1"
                style={{ color: 'rgba(196,154,40,0.60)' }}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
              >
                {PHOTOS.length} moments · more coming
              </motion.p>
            </div>
            {!isMobile && (
              <motion.p
                className="text-xs tracking-widest uppercase"
                style={{ color: 'rgba(246,237,218,0.22)', marginBottom: 4 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Hover to read
              </motion.p>
            )}
          </div>
        </div>

        {/* Desktop: scattered/tilted photo cards */}
        {!isMobile && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoRows: '240px',
            gap: 14,
            overflow: 'visible',
          }}>
            {PHOTOS.map((photo, i) => {
              const cfg = GRID_CONFIG[i]
              return (
                <motion.div
                  key={photo.id}
                  style={{
                    gridColumn: `span ${cfg.colSpan}`,
                    gridRow: `span ${cfg.rowSpan}`,
                    position: 'relative',
                    rotate: reducedMotion ? 0 : cfg.rotate,
                    zIndex: 1,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 24px 64px rgba(0,0,0,0.35)',
                    borderRadius: 6,
                  }}
                  whileHover={{
                    rotate: 0,
                    scale: 1.025,
                    zIndex: 10,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.70), 0 40px 80px rgba(0,0,0,0.45)',
                  }}
                  transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <WipeReveal delay={cfg.delay} reducedMotion={reducedMotion}>
                    <PhotoCard photo={photo} onOpen={() => setLightbox(photo.id)} />
                  </WipeReveal>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Mobile: swipe carousel — outside padded container for full viewport width */}
      {isMobile && (
        <MobileGallery photos={PHOTOS} onOpen={(id) => setLightbox(id)} />
      )}

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && current && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(3,1,10,0.97)', backdropFilter: 'blur(10px)' }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
          >
            {/* Close */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.12 }}
              className="absolute top-5 right-5 p-2"
              style={{ color: 'rgba(255,255,255,0.45)' }}
              onClick={() => setLightbox(null)}
              whileHover={{ color: 'white', scale: 1.12 }}
              aria-label="Close gallery"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.button>

            {/* Prev */}
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onClick={e => { e.stopPropagation(); prev() }}
              whileHover={{ color: 'white', x: -3 }}
              aria-label="Previous photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            {/* Photo frame */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 28 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 28 }}
              transition={{ duration: 0.38, ease: EASE }}
              className="relative rounded-2xl overflow-hidden"
              style={{ maxWidth: 'min(440px, 90vw)', maxHeight: '88vh', aspectRatio: '3/4', width: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    style={{ objectFit: 'cover', objectPosition: current.objectPosition }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Caption */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(3,1,10,0.95) 0%, transparent 100%)',
                padding: '32px 22px 24px',
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C49A28', display: 'block', marginBottom: 8 }}>
                  {current.meta}
                </span>
                <p style={{ color: 'white', fontSize: 20, fontWeight: 300, marginBottom: 6 }}>{current.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 13, lineHeight: 1.5 }}>{current.caption}</p>
              </div>

              {/* Counter inside frame */}
              <span style={{
                position: 'absolute', top: 16, left: 18,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.35)',
              }}>
                {current.index}
              </span>
            </motion.div>

            {/* Next */}
            <motion.button
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onClick={e => { e.stopPropagation(); next() }}
              whileHover={{ color: 'white', x: 3 }}
              aria-label="Next photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <p className="absolute bottom-5 text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.22)' }}>
              {idx + 1} — {PHOTOS.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
