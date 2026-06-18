'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import { StaggerContainer, StaggerItem, TextReveal } from './ScrollReveal'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'
import MobileGallery from './MobileGallery'

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

const EASE = [0.25, 0.46, 0.45, 0.94] as const

function PhotoCard({
  photo,
  onOpen,
}: {
  photo: typeof PHOTOS[0]
  onOpen: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      style={{ borderRadius: 20, width: '100%', height: '100%' }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.4, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* Index ghost number */}
      <motion.span
        style={{
          position: 'absolute', top: 14, left: 18, zIndex: 10,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
        }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {photo.index}
      </motion.span>

      {/* Photo — zoom on hover */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
      </motion.div>

      {/* Gradient overlay — CSS for gradient (framer-motion can't interpolate gradients) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(3,1,10,0.94) 0%, rgba(3,1,10,0.4) 50%, rgba(3,1,10,0.1) 100%)'
          : 'linear-gradient(to top, rgba(3,1,10,0.75) 0%, rgba(3,1,10,0.05) 55%, transparent 100%)',
        transition: 'background 0.4s ease',
      }} />

      {/* Bottom content */}
      <motion.div
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 22px' }}
        animate={{ y: hovered ? 0 : 5 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'inline-block', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#C49A28', marginBottom: 6,
            }}>{photo.meta}</span>
            <motion.p
              style={{ fontWeight: 300, color: 'white', lineHeight: 1.1 }}
              animate={{ fontSize: hovered ? 20 : 17 }}
              transition={{ duration: 0.3 }}
            >
              {photo.title}
            </motion.p>
            <motion.p
              style={{
                fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5,
                overflow: 'hidden',
              }}
              animate={{
                maxHeight: hovered ? 80 : 0,
                opacity: hovered ? 1 : 0,
                marginTop: hovered ? 6 : 0,
              }}
              transition={{ duration: 0.35 }}
            >
              {photo.caption}
            </motion.p>
          </div>

          {/* Expand button */}
          <motion.div
            style={{
              width: 38, height: 38, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 16, flexShrink: 0,
            }}
            animate={{
              opacity: hovered ? 1 : 0,
              scale: hovered ? 1 : 0.65,
              rotate: hovered ? 0 : -45,
            }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const lightboxMounted = useRef(false)

  // Notify FloatingRSVPButton when lightbox opens/closes — skip initial mount
  useEffect(() => {
    if (!lightboxMounted.current) { lightboxMounted.current = true; return }
    window.dispatchEvent(new CustomEvent('nk:lightbox', { detail: { open: lightbox !== null } }))
  }, [lightbox])
  const idx     = PHOTOS.findIndex(p => p.id === lightbox)
  const current = PHOTOS[idx]
  const prev    = () => setLightbox(PHOTOS[(idx - 1 + PHOTOS.length) % PHOTOS.length].id)
  const next    = () => setLightbox(PHOTOS[(idx + 1) % PHOTOS.length].id)

  // Keyboard navigation for lightbox
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
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <SectionOrnament />
          <div className="flex items-end justify-between">
            <div>
              <TextReveal delay={0.05}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight">Gallery</h2>
              </TextReveal>
              <p className="text-sm mt-1" style={{ color: '#9C7A5A' }}>
                {PHOTOS.length} moments · more coming
              </p>
            </div>
            {!isMobile && (
            <p className="text-xs tracking-widest uppercase" style={{ color: '#C4B09A', marginBottom: 4 }}>
              Hover to read
            </p>
            )}
          </div>
        </div>

        {/* Mobile: swipe carousel */}
        {isMobile && (
          <MobileGallery photos={PHOTOS} onOpen={(id) => setLightbox(id)} />
        )}

        {/* Tablet + Desktop: editorial asymmetric grid */}
        {!isMobile && (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[340px] lg:auto-rows-auto gap-3">

          <StaggerItem className="md:col-span-5" style={{ minHeight: 320 }}>
            <div style={{ height: '100%', minHeight: 320, position: 'relative' }}>
              <PhotoCard photo={PHOTOS[0]} onOpen={() => setLightbox(PHOTOS[0].id)} />
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-4 flex flex-col gap-3">
            <div style={{ flex: 1, minHeight: 200, position: 'relative' }}>
              <PhotoCard photo={PHOTOS[1]} onOpen={() => setLightbox(PHOTOS[1].id)} />
            </div>
            <div style={{ flex: 1, minHeight: 200, position: 'relative' }}>
              <PhotoCard photo={PHOTOS[2]} onOpen={() => setLightbox(PHOTOS[2].id)} />
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-3" style={{ minHeight: 320 }}>
            <div style={{ height: '100%', minHeight: 320, position: 'relative' }}>
              <PhotoCard photo={PHOTOS[3]} onOpen={() => setLightbox(PHOTOS[3].id)} />
            </div>
          </StaggerItem>

        </StaggerContainer>
        )}
      </div>

      {/* ── Lightbox with AnimatePresence ── */}
      <AnimatePresence>
        {lightbox !== null && current && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(3,1,10,0.96)' }}
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
              transition={{ delay: 0.1 }}
              className="absolute top-5 right-5 p-2"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onClick={() => setLightbox(null)}
              whileHover={{ color: 'rgba(255,255,255,1)', scale: 1.1 }}
              aria-label="Close gallery"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.button>

            {/* Prev */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onClick={e => { e.stopPropagation(); prev() }}
              whileHover={{ color: 'white', x: -2 }}
              aria-label="Previous photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            {/* Photo frame — scales in on open */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative rounded-2xl overflow-hidden"
              style={{ maxWidth: 'min(440px, 90vw)', maxHeight: '88vh', aspectRatio: '3/4', width: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Photo — fades when navigating between photos */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image src={current.src} alt={current.alt} fill
                    style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
                </motion.div>
              </AnimatePresence>

              {/* Caption overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(3,1,10,0.95) 0%, transparent 100%)',
                padding: '32px 22px 24px',
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C49A28', display: 'block', marginBottom: 8 }}>
                  {current.meta}
                </span>
                <p style={{ color: 'white', fontSize: 20, fontWeight: 300, marginBottom: 6 }}>{current.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.5 }}>{current.caption}</p>
              </div>
            </motion.div>

            {/* Next */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onClick={e => { e.stopPropagation(); next() }}
              whileHover={{ color: 'white', x: 2 }}
              aria-label="Next photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <p className="absolute bottom-5 text-white/25 text-xs tracking-widest">
              {idx + 1} — {PHOTOS.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
