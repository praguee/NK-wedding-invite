# Mobile-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a premium mobile experience through targeted additive enhancements — mobile swipe gallery, floating RSVP button, lotus corner decorations, and active navigation highlights — without touching any Supabase, auth, or existing animation logic.

**Architecture:** Three new components (MobileGallery, FloatingRSVPButton, LotusDecoration) and one new hook (useMediaQuery). Existing components receive surgical edits only. Mobile/desktop branching uses Tailwind responsive classes and a SSR-safe `useMediaQuery` hook. Cross-component visibility coordination (lightbox ↔ floating button, nav drawer ↔ floating button) uses lightweight `window.dispatchEvent` custom events — no prop drilling, no context.

**Tech Stack:** Next.js 14 App Router, TypeScript, Framer Motion 12 (`framer-motion`), Tailwind CSS, inline SVG, CSS `@keyframes`

---

## Verified Section IDs (all confirmed in DOM before writing this plan)

| Spec ID | File | Line |
|---|---|---|
| `#story` | Story.tsx | 29 |
| `#jab-we-met` | JabWeMet.tsx | 30 |
| `#timeline` | Timeline.tsx | 39 |
| `#gallery` | Gallery.tsx | 191 |
| `#rsvp` | RSVPForm.tsx | 106 |
| `#messages` | GuestBook.tsx | 62 |
| `#travel` | Transportation.tsx | 12 |
| `#contact` | ContactFAQ.tsx | 15 |

---

## Files Created

| File | Purpose |
|---|---|
| `app/hooks/useMediaQuery.ts` | SSR-safe media query hook — starts `false` on server |
| `app/components/LotusDecoration.tsx` | Inline SVG 8-petal lotus for corner ornament |
| `app/components/MobileGallery.tsx` | Horizontal swipe carousel with scroll-snap and pagination dots |
| `app/components/FloatingRSVPButton.tsx` | Fixed bottom CTA visible on mobile when scrolled past hero |

## Files Modified

| File | Edit |
|---|---|
| `app/globals.css` | Add Hero, Gallery, Lotus CSS sections |
| `app/components/Hero.tsx` | svh height, hero-image CSS class, mobile overlay, lotus corners, sentinel div |
| `app/components/Gallery.tsx` | Mobile branch + tablet auto-rows + lightbox event dispatch |
| `app/components/Navigation.tsx` | Active section state via IntersectionObserver + menu event dispatch |
| `app/page.tsx` | Mount `<FloatingRSVPButton />` |
| `app/components/Story.tsx` | Add lotus decoration top-right |
| `app/components/JabWeMet.tsx` | Add lotus decoration top-left |
| `app/components/RSVPForm.tsx` | Add lotus decoration bottom-left + fix triple `'use client'` |

---

## Task 1: `useMediaQuery` Hook

**Files:**
- Create: `app/hooks/useMediaQuery.ts`

- [ ] **Step 1: Create the hook**

```ts
// app/hooks/useMediaQuery.ts
'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false) // false on server — safe for SSR

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/parag/NK-wedding-invite && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors (or pre-existing errors only — there should be none).

- [ ] **Step 3: Commit**

```bash
git add app/hooks/useMediaQuery.ts
git commit -m "feat: add SSR-safe useMediaQuery hook"
```

---

## Task 2: `globals.css` Additions

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Read the end of globals.css to find where to append**

```bash
tail -30 /home/parag/NK-wedding-invite/app/globals.css
```

- [ ] **Step 2: Append CSS sections after the last existing rule**

Add the following at the very end of `app/globals.css`:

```css

/* ==========================================================================
   Hero
   ========================================================================== */

/* Responsive image position for hero-cover.jpg (sunset silhouette — couple upper-center) */
.hero-image { object-position: center 22%; }
@media (min-width: 768px) { .hero-image { object-position: center 20%; } }

/* ==========================================================================
   Gallery
   ========================================================================== */

/* Mobile swipe carousel */
.gallery-scroll {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.gallery-scroll::-webkit-scrollbar { display: none; }
.gallery-slide { scroll-snap-align: start; flex-shrink: 0; }

/* ==========================================================================
   Lotus Decorations
   ========================================================================== */

@keyframes lotusRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.lotus-animate {
  animation: lotusRotate 90s linear infinite;
  transform-origin: center center;
}

@media (prefers-reduced-motion: reduce) {
  .lotus-animate { animation: none !important; }
}
```

- [ ] **Step 3: Verify build**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add hero, gallery, lotus CSS utilities"
```

---

## Task 3: `LotusDecoration` Component

**Files:**
- Create: `app/components/LotusDecoration.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/LotusDecoration.tsx
import type { CSSProperties } from 'react'

interface LotusDecorationProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number    // px, default 160
  opacity?: number // 0–1, default 0.07
  animate?: boolean // enables lotusRotate, default true
}

export default function LotusDecoration({
  position,
  size = 160,
  opacity = 0.07,
  animate = true,
}: LotusDecorationProps) {
  const offset = -(size / 3)

  const posStyle: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    zIndex: 2,
    ...(position === 'top-left'     && { top: offset, left: offset }),
    ...(position === 'top-right'    && { top: offset, right: offset }),
    ...(position === 'bottom-left'  && { bottom: offset, left: offset }),
    ...(position === 'bottom-right' && { bottom: offset, right: offset }),
  }

  return (
    <div style={posStyle} aria-hidden="true">
      <svg
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        className={animate ? 'lotus-animate' : undefined}
        style={{ opacity, display: 'block', width: '100%', height: '100%' }}
      >
        <g transform="translate(80,80)">
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={i}
              d="M0,0 Q5,-28 0,-58 Q-5,-28 0,0"
              fill="#C49A28"
              transform={`rotate(${i * 45})`}
            />
          ))}
          <circle r="12" fill="none" stroke="#C49A28" strokeWidth="1.2" />
          <circle r="4" fill="#C49A28" />
        </g>
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/parag/NK-wedding-invite && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/LotusDecoration.tsx
git commit -m "feat: add LotusDecoration SVG corner ornament component"
```

---

## Task 4: `Hero.tsx` — Height, Image Class, Mobile Overlay, Lotus, Sentinel

**Files:**
- Modify: `app/components/Hero.tsx`

- [ ] **Step 1: Import LotusDecoration at top of file**

In `app/components/Hero.tsx`, find the import block (currently ends at line 7 with `import SectionOrnament from './SectionOrnament'`). Add after it:

```tsx
import LotusDecoration from './LotusDecoration'
```

- [ ] **Step 2: Change section height to use svh on mobile**

Find line 136:
```tsx
<section className="min-h-screen relative flex flex-col items-center justify-end pb-16 pt-24 overflow-hidden animate-fade-in">
```

Replace with:
```tsx
<section className="min-h-[100svh] md:min-h-screen relative flex flex-col items-center justify-end pb-16 pt-24 overflow-hidden animate-fade-in">
```

- [ ] **Step 3: Replace inline objectPosition with CSS class**

Find (lines 148–153):
```tsx
          style={{
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: 'contrast(1.08) saturate(1.15) brightness(0.92)',
          }}
```

Replace with:
```tsx
          className="hero-image"
          style={{
            objectFit: 'cover',
            filter: 'contrast(1.08) saturate(1.15) brightness(0.92)',
          }}
```

- [ ] **Step 4: Add mobile overlay div after the existing gradient divs**

Find the third existing gradient div (the radial one, around line 168):
```tsx
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 40% at 50% 65%, rgba(196,120,40,0.12) 0%, transparent 70%)',
      }} />
```

Add this new div immediately after it:
```tsx
      {/* Mobile: stronger bottom overlay so text stays readable on small screens */}
      <div className="block md:hidden" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(5,2,15,.78), rgba(5,2,15,.35), transparent)',
      }} />
```

- [ ] **Step 5: Add lotus decorations and sentinel div inside the section**

Find the closing `</section>` tag (currently the last line of the component, after `</motion.div>`). Add both lotus components and the sentinel just before `</section>`:

```tsx
      <LotusDecoration position="top-left"  size={130} opacity={0.08} />
      <LotusDecoration position="top-right" size={130} opacity={0.08} />
      <div id="hero-sentinel" aria-hidden="true" />
    </section>
```

The full end of the component should now look like:
```tsx
      </motion.div>
      <LotusDecoration position="top-left"  size={130} opacity={0.08} />
      <LotusDecoration position="top-right" size={130} opacity={0.08} />
      <div id="hero-sentinel" aria-hidden="true" />
    </section>
```

- [ ] **Step 6: Verify build**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -20
```

Expected: build succeeds with no type errors.

- [ ] **Step 7: Commit**

```bash
git add app/components/Hero.tsx
git commit -m "feat: hero svh height, hero-image class, mobile overlay, lotus corners, sentinel"
```

---

## Task 5: `MobileGallery` Component

**Files:**
- Create: `app/components/MobileGallery.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/MobileGallery.tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/parag/NK-wedding-invite && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/MobileGallery.tsx
git commit -m "feat: add MobileGallery swipe carousel with rAF scroll tracking and pagination dots"
```

---

## Task 6: `Gallery.tsx` — Responsive Branch + Lightbox Event

**Files:**
- Modify: `app/components/Gallery.tsx`

- [ ] **Step 1: Add imports at top of file**

Find the existing imports at the top of `app/components/Gallery.tsx`:
```tsx
import { useEffect } from 'react'
```
(This import is at line 169 — inside the file below PhotoCard. Note the file structure has imports split across the file.)

For the new imports, find the top of the file (lines 1–7):
```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import { StaggerContainer, StaggerItem } from './ScrollReveal'
```

Replace the top 7 lines with:
```tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import { StaggerContainer, StaggerItem } from './ScrollReveal'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import MobileGallery from './MobileGallery'
```

Then remove the now-duplicate `import { useEffect } from 'react'` at line 169 (it was added as a standalone import before the Gallery component — after Step 1 it is replaced by the import at the top).

- [ ] **Step 2: Add `isMobile` constant and lightbox event dispatch inside `Gallery` component**

Find the inside of the `Gallery` component function, right after `const [lightbox, setLightbox] = useState<number | null>(null)`:

```tsx
export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
```

Replace with:
```tsx
export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')

  // Notify FloatingRSVPButton when lightbox opens/closes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('nk:lightbox', { detail: { open: lightbox !== null } }))
  }, [lightbox])
```

- [ ] **Step 3: Wrap the editorial grid in a non-mobile condition and add tablet auto-rows**

Find the section JSX that starts around line 209:
```tsx
        {/* Editorial asymmetric grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-3" style={{ gridAutoRows: 'auto' }}>
```

Replace with:
```tsx
        {/* Mobile: swipe carousel */}
        {isMobile && (
          <MobileGallery photos={PHOTOS} onOpen={(id) => setLightbox(id)} />
        )}

        {/* Tablet + Desktop: editorial asymmetric grid */}
        {!isMobile && (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[340px] lg:auto-rows-auto gap-3">
```

Then find the closing `</StaggerContainer>` at the end of the grid block (around line 232):
```tsx
        </StaggerContainer>
      </div>
```

Replace with:
```tsx
        </StaggerContainer>
        )}
      </div>
```

- [ ] **Step 4: Verify build**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -20
```

Expected: build succeeds. Check for any TypeScript errors on the new CustomEvent dispatch.

- [ ] **Step 5: Commit**

```bash
git add app/components/Gallery.tsx
git commit -m "feat: gallery mobile swipe branch, tablet auto-rows, lightbox event dispatch"
```

---

## Task 7: `FloatingRSVPButton` Component

**Files:**
- Create: `app/components/FloatingRSVPButton.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/FloatingRSVPButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingRSVPButton() {
  const [heroLeft,    setHeroLeft]    = useState(false)
  const [rsvpVisible, setRsvpVisible] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)

  // Watch hero sentinel — button shows when hero scrolls out of view
  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([entry]) => setHeroLeft(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  // Watch RSVP section — button hides when RSVP is in view
  useEffect(() => {
    const rsvp = document.getElementById('rsvp')
    if (!rsvp) return
    const obs = new IntersectionObserver(
      ([entry]) => setRsvpVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    obs.observe(rsvp)
    return () => obs.disconnect()
  }, [])

  // Listen for lightbox and menu state from Gallery + Navigation
  useEffect(() => {
    const onLightbox = (e: Event) =>
      setLightboxOpen((e as CustomEvent<{ open: boolean }>).detail.open)
    const onMenu = (e: Event) =>
      setMenuOpen((e as CustomEvent<{ open: boolean }>).detail.open)
    window.addEventListener('nk:lightbox', onLightbox)
    window.addEventListener('nk:menu',     onMenu)
    return () => {
      window.removeEventListener('nk:lightbox', onLightbox)
      window.removeEventListener('nk:menu',     onMenu)
    }
  }, [])

  const visible = heroLeft && !rsvpVisible && !lightboxOpen && !menuOpen

  return (
    // md:hidden — only renders visually on mobile; layout exists on all sizes
    <div className="md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, pointerEvents: 'none' }}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="floating-rsvp"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{
              maxWidth: 384,
              margin: '0 auto',
              padding: '0 16px',
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
              pointerEvents: 'auto',
            }}
          >
            {/* Frosted backdrop bar */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: 80,
              background: 'linear-gradient(to top, rgba(255,253,246,0.72), transparent)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              pointerEvents: 'none',
            }} />

            {/* Button */}
            <motion.a
              href="#rsvp"
              whileTap={{ scale: 0.96 }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                height: 52,
                borderRadius: 100,
                background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
                color: '#2A1200',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.12em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                boxShadow: '0 6px 24px rgba(196,154,40,0.45), 0 1px 0 rgba(255,255,255,0.25) inset',
              }}
            >
              {/* Small lotus icon */}
              <svg width="14" height="14" viewBox="0 0 160 160" aria-hidden="true">
                <g transform="translate(80,80)">
                  {Array.from({ length: 8 }, (_, i) => (
                    <path key={i} d="M0,0 Q4,-18 0,-38 Q-4,-18 0,0" fill="#2A1200" transform={`rotate(${i * 45})`} />
                  ))}
                  <circle r="8" fill="none" stroke="#2A1200" strokeWidth="1.5" />
                  <circle r="3" fill="#2A1200" />
                </g>
              </svg>
              RSVP Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/parag/NK-wedding-invite && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/FloatingRSVPButton.tsx
git commit -m "feat: add FloatingRSVPButton with hero/rsvp observers and overlay state coordination"
```

---

## Task 8: `Navigation.tsx` — Active Section + Menu Event

**Files:**
- Modify: `app/components/Navigation.tsx`

- [ ] **Step 1: Add `useEffect` import and `activeSection` state**

Find line 1–3:
```tsx
'use client'

import { useState } from 'react'
```

Replace with:
```tsx
'use client'

import { useEffect, useState } from 'react'
```

- [ ] **Step 2: Add `activeSection` state inside the component**

Find inside `Navigation()`:
```tsx
  const [isOpen, setIsOpen] = useState(false)
```

Replace with:
```tsx
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
```

- [ ] **Step 3: Add the two `useEffect` hooks for observer and menu event**

Insert after the `activeSection` state declaration:

```tsx
  // Active section highlighting via IntersectionObserver
  useEffect(() => {
    const SECTION_IDS = ['#story', '#jab-we-met', '#timeline', '#gallery', '#rsvp', '#messages', '#travel', '#contact']
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.querySelector(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Notify FloatingRSVPButton when mobile menu opens/closes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('nk:menu', { detail: { open: isOpen } }))
  }, [isOpen])
```

- [ ] **Step 4: Apply active styling to desktop nav links**

Find the desktop links map (around line 66–78):
```tsx
          {sections.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-xs tracking-widest uppercase transition-colors"
              style={{ color: '#7C5A3A', letterSpacing: '0.09em' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C49A28')}
              onMouseLeave={e => (e.currentTarget.style.color = '#7C5A3A')}
            >
              {s.label}
            </a>
          ))}
```

Replace with:
```tsx
          {sections.map((s) => {
            const isActive = activeSection === s.href
            return (
              <a
                key={s.label}
                href={s.href}
                className="text-xs tracking-widest uppercase transition-colors"
                style={{
                  color: isActive ? '#C49A28' : '#7C5A3A',
                  letterSpacing: '0.09em',
                  borderBottom: isActive ? '1.5px solid #C49A28' : '1.5px solid transparent',
                  paddingBottom: 2,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#C49A28' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#7C5A3A' }}
              >
                {s.label}
              </a>
            )
          })}
```

- [ ] **Step 5: Verify build**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/components/Navigation.tsx
git commit -m "feat: active section nav highlighting and menu event dispatch"
```

---

## Task 9: `page.tsx` — Mount FloatingRSVPButton

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add FloatingRSVPButton import**

Find the imports block at the top of `app/page.tsx` (around lines 1–18). Add after `import { FadeUp } from './components/ScrollReveal'`:

```tsx
import FloatingRSVPButton from './components/FloatingRSVPButton'
```

- [ ] **Step 2: Mount FloatingRSVPButton in mainContent**

Find inside `mainContent`:
```tsx
    <>
      <Navigation />
      <main id="main-content">
```

Replace with:
```tsx
    <>
      <Navigation />
      <FloatingRSVPButton />
      <main id="main-content">
```

- [ ] **Step 3: Verify build**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mount FloatingRSVPButton in main page layout"
```

---

## Task 10: Lotus Decorations on Story, JabWeMet, RSVPForm

**Files:**
- Modify: `app/components/Story.tsx`
- Modify: `app/components/JabWeMet.tsx`
- Modify: `app/components/RSVPForm.tsx`

### Story.tsx

- [ ] **Step 1: Import LotusDecoration in Story.tsx**

Find in `app/components/Story.tsx`:
```tsx
import SectionOrnament from './SectionOrnament'
```

Add after it:
```tsx
import LotusDecoration from './LotusDecoration'
```

- [ ] **Step 2: Add `relative overflow-hidden` to section and insert lotus**

Find:
```tsx
    <section id="story" className="py-24 bg-white" aria-labelledby="story-heading">
```

Replace with:
```tsx
    <section id="story" className="py-24 bg-white relative overflow-hidden" aria-labelledby="story-heading">
```

Then find the opening of the section's content div:
```tsx
      <div className="max-w-4xl mx-auto px-6">
```

Add the lotus decoration BEFORE that div (inside the section, before the content):
```tsx
      <LotusDecoration position="top-right" size={120} opacity={0.07} />
      <div className="max-w-4xl mx-auto px-6">
```

### JabWeMet.tsx

- [ ] **Step 3: Import LotusDecoration in JabWeMet.tsx**

Find in `app/components/JabWeMet.tsx`:
```tsx
import SectionOrnament from './SectionOrnament'
```

Add after it:
```tsx
import LotusDecoration from './LotusDecoration'
```

- [ ] **Step 4: Add `relative overflow-hidden` to section and insert lotus**

Find:
```tsx
    <section id="jab-we-met" className="py-24 bg-slate-50" aria-labelledby="jwm-heading">
```

Replace with:
```tsx
    <section id="jab-we-met" className="py-24 bg-slate-50 relative overflow-hidden" aria-labelledby="jwm-heading">
```

Add lotus before the content div:
```tsx
      <LotusDecoration position="top-left" size={120} opacity={0.07} />
      <div className="max-w-4xl mx-auto px-6">
```

### RSVPForm.tsx

- [ ] **Step 5: Fix triple `'use client'` directive and import LotusDecoration**

Open `app/components/RSVPForm.tsx`. The file currently starts with three `'use client'` lines (lines 1, 3, 5). Replace the top of the file so it starts cleanly:

Find:
```tsx
'use client'

'use client'

'use client'

import { useState } from 'react'
```

Replace with:
```tsx
'use client'

import { useState } from 'react'
```

Then find the existing SectionOrnament import:
```tsx
import SectionOrnament from './SectionOrnament'
```

Add after it:
```tsx
import LotusDecoration from './LotusDecoration'
```

- [ ] **Step 6: Add `relative overflow-hidden` to section and insert lotus**

Find:
```tsx
    <section id="rsvp" className="py-24 bg-slate-50">
```

Replace with:
```tsx
    <section id="rsvp" className="py-24 bg-slate-50 relative overflow-hidden">
```

Add lotus before the content div (the `max-w-xl` div):
```tsx
      <LotusDecoration position="bottom-left" size={100} opacity={0.04} />
      <div className="max-w-xl mx-auto px-6">
```

- [ ] **Step 7: Verify build**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add app/components/Story.tsx app/components/JabWeMet.tsx app/components/RSVPForm.tsx
git commit -m "feat: lotus decorations on Story, JabWeMet, RSVP sections; fix RSVPForm triple use client"
```

---

## Post-Implementation Checklist

After all tasks are complete, verify these manually on the running dev server (`npm run dev`):

- [ ] On mobile width (375px): Gallery shows swipe carousel with pagination dots; editorial grid is hidden
- [ ] On tablet width (768–1023px): Gallery shows editorial 12-col grid with 340px rows; carousel is hidden
- [ ] On desktop (1024px+): Gallery shows original editorial layout unchanged
- [ ] Hero: lotus petals visible in top corners, slowly rotating; disappear at `prefers-reduced-motion`
- [ ] FloatingRSVP: button appears after scrolling past hero; hides when RSVP section reaches viewport; hides when lightbox is open; hides when mobile nav drawer is open
- [ ] Navigation: active section link turns gold + gets underline as user scrolls
- [ ] Story, JabWeMet, RSVP: faint lotus petal visible in corner at 7%, 7%, 4% opacity
- [ ] No layout shift (CLS) on page load from `useMediaQuery` starting false
- [ ] `npm run build` exits 0

---

## What Was NOT Changed

- RSVP form logic and Supabase POST — no changes
- GuestBook realtime subscription — no changes
- Gallery lightbox (PhotoCard, AnimatePresence, keyboard nav) — no changes
- IntroScreen / map interaction — no changes
- Countdown timer — no changes
- All existing Framer Motion animations — no changes
- Games page — no changes
- Admin dashboard — no changes
- Any API routes — no changes
