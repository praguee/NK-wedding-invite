'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

interface Photo {
  id: number
  src: string
  alt: string
  index: string
  title: string
  caption: string
  meta: string
}

interface MobileGalleryProps {
  photos: Photo[]
  onOpen: (id: number) => void
}

export default function MobileGallery({ photos, onOpen }: MobileGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const rafRef    = useRef<number | null>(null)

  const onScroll = useCallback(() => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el && el.scrollWidth > 0) {
        const slideWidth = el.scrollWidth / photos.length
        setActiveIndex(Math.round(el.scrollLeft / slideWidth))
      }
      rafRef.current = null
    })
  }, [photos.length])

  return (
    <div>
      {/* Swipe carousel */}
      <div
        ref={scrollRef}
        className="gallery-scroll flex"
        style={{ paddingLeft: '5vw', paddingRight: '5vw', gap: 8 }}
        onScroll={onScroll}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            className="gallery-slide relative cursor-pointer"
            style={{
              width: '90vw',
              aspectRatio: '3 / 4',
              borderRadius: 16,
              overflow: 'hidden',
            }}
            animate={{
              scale: i === activeIndex ? 1.0 : 0.95,
              opacity: i === activeIndex ? 1.0 : 0.88,
            }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={() => onOpen(photo.id)}
          >
            {/* Photo */}
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="90vw"
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            />

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to top, rgba(3,1,10,0.88) 0%, rgba(3,1,10,0.18) 55%, transparent 100%)',
            }} />

            {/* Index */}
            <span style={{
              position: 'absolute', top: 14, left: 18,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.4)', pointerEvents: 'none',
            }}>
              {photo.index}
            </span>

            {/* Bottom info */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 24px' }}>
              <span style={{
                display: 'block', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#C49A28', marginBottom: 6,
              }}>
                {photo.meta}
              </span>
              <p style={{ fontWeight: 300, color: 'white', fontSize: 18, lineHeight: 1.1 }}>
                {photo.title}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginTop: 6 }}>
                {photo.caption}
              </p>
            </div>

            {/* Tap hint */}
            <div style={{
              position: 'absolute', top: 14, right: 18,
              width: 32, height: 32, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)', fontSize: 14,
            }}>
              ↗
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
        {photos.map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              height: 6,
              borderRadius: 100,
              background: i === activeIndex ? '#C49A28' : 'rgba(196,154,40,0.3)',
              width: i === activeIndex ? 20 : 6,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
