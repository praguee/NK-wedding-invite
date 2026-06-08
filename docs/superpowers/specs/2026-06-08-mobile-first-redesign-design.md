# Mobile-First Redesign — Design Spec
**Date:** 2026-06-08  
**Project:** NK Wedding Invite  
**Approach:** Approach B — Targeted Surgical Enhancements

---

## Goals

Deliver a premium mobile experience that feels intentionally designed for phones, not a scaled-down desktop. Preserve 100% of existing business logic, Supabase integrations, animations, and data flows. All changes are additive layers.

---

## Constraints

- No new heavy dependencies
- All decorative animations use `transform` and `opacity` only (GPU-accelerated)
- Decorative SVGs rendered as inline React components, never as image assets
- No `window.innerWidth` checks — use `useMediaQuery` hook or Tailwind responsive classes
- Lighthouse mobile performance must not regress
- `prefers-reduced-motion` respected on all animations
- No hydration mismatches (SSR-safe)

---

## New Files

| File | Purpose |
|---|---|
| `app/components/MobileGallery.tsx` | Swipe carousel, mobile only |
| `app/components/FloatingRSVPButton.tsx` | Sticky bottom CTA, mobile only |
| `app/components/LotusDecoration.tsx` | Reusable corner ornament SVG |
| `app/hooks/useMediaQuery.ts` | SSR-safe media query hook, shared by Gallery + FloatingRSVPButton |

---

## Existing Files Modified (targeted edits only)

| File | Edit |
|---|---|
| `app/components/Gallery.tsx` | Add responsive branch: MobileGallery on mobile, 2-col grid on tablet |
| `app/components/Hero.tsx` | Add `hero-image` CSS class, `min-h-[100svh]`, stronger mobile overlay, lotus corners |
| `app/components/Navigation.tsx` | Add active section highlighting via IntersectionObserver |
| `app/components/RSVPForm.tsx` | Add sentinel div for FloatingRSVPButton visibility detection |
| `app/page.tsx` | Mount `<FloatingRSVPButton />` once at root |
| `app/globals.css` | Add hero-image, lotusRotate keyframe, gallery-scroll utilities |

---

## 1. `useMediaQuery` Hook

**File:** `app/hooks/useMediaQuery.ts`

- Returns `boolean`, starts `false` on server (SSR-safe, no hydration mismatch)
- Adds/removes `window.matchMedia` listener on mount/unmount
- Used by: `Gallery.tsx` (mobile branch), `FloatingRSVPButton.tsx` (visibility)

```ts
// Usage
const isMobile = useMediaQuery('(max-width: 767px)')
```

---

## 2. MobileGallery Component

**File:** `app/components/MobileGallery.tsx`  
**Renders on:** mobile only (< 768px), invoked from Gallery.tsx

### Layout
- Horizontal scroll container: `overflow-x: scroll`, `scroll-snap-type: x mandatory`, `-webkit-overflow-scrolling: touch`, `scrollbar-width: none`
- Left padding `5vw` on container — reveals 5% of next slide, encouraging swipe
- Each slide: `width: 90vw`, `flex-shrink: 0`, `scroll-snap-align: start`, `aspect-ratio: 3/4`
- Gap between slides: `8px`

### Active Slide Tracking
- Use `onScroll` handler + `scrollLeft / slideWidth` arithmetic (not IntersectionObserver — overkill for 4 slides)
- `activeIndex = Math.round(scrollLeft / slideWidth)`
- Drives: pagination dots + Framer Motion scale on each slide

### Per-Slide Animations
- Active slide: `scale: 1.0`, `opacity: 1.0`
- Inactive slides: `scale: 0.95`, `opacity: 0.88`
- `transition: { duration: 0.3, ease: [0.25,0.46,0.45,0.94] }`
- `prefers-reduced-motion`: disable scale/opacity change, keep scroll

### Pagination Dots
- 4 dots rendered below carousel
- Active dot: pill shape `width: 20px`, gold `#C49A28`
- Inactive: circle `width: 6px`, `rgba(196,154,40,0.3)`
- CSS `transition: width 0.3s ease` — pure CSS, no JS
- Positioned `mt-4`, centered

### Tap Behaviour
- Each slide has `onClick={() => onOpen(photo.id)}`
- `onOpen` is the existing lightbox callback from Gallery — unchanged

### Props
```ts
interface MobileGalleryProps {
  photos: typeof PHOTOS
  onOpen: (id: number) => void
}
```

---

## 3. Gallery — Responsive Branch

**File:** `app/components/Gallery.tsx` (surgical additions only)

```
mobile  (<768px) → <MobileGallery photos={PHOTOS} onOpen={setLightbox} />
tablet  (768–1024px) → 2-col CSS grid, auto-rows: 340px
desktop (>1024px) → existing editorial 12-col grid (unchanged)
```

### Tablet Grid
- `md:grid-cols-2 md:auto-rows-[340px]` — 340px gives wedding photography the vertical space it needs
- The existing `StaggerContainer + StaggerItem` wrappers remain — they animate both tablet and desktop
- No change to photo order or PhotoCard component

### Implementation
```tsx
const isMobile = useMediaQuery('(max-width: 767px)')
// ...
return (
  <>
    {isMobile
      ? <MobileGallery photos={PHOTOS} onOpen={setLightbox} />
      : <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-[340px] lg:grid-cols-12 gap-3">
          {/* existing StaggerItems unchanged */}
        </StaggerContainer>
    }
    {/* existing lightbox AnimatePresence unchanged */}
  </>
)
```

---

## 4. Hero — Responsive Enhancements

**File:** `app/components/Hero.tsx` (3 targeted edits)

### Edit 1 — Image class
Remove inline `objectPosition`. Add `className="hero-image"`.

```css
/* globals.css */
.hero-image { object-position: center 22%; }          /* mobile */
@media (min-width: 768px) { .hero-image { object-position: center 20%; } }
```

Rationale: The image is a sunset silhouette with the couple in the upper-center. `center 22%` on mobile keeps both heads fully in frame.

### Edit 2 — Section height
`min-h-screen` → `min-h-[100svh] md:min-h-screen`

`100svh` = small viewport height on iOS — accounts for Safari's collapsing address bar. Prevents content jumping when chrome collapses.

### Edit 3 — Mobile overlay
Add a `block md:hidden` overlay `<div>` below the existing gradient divs:

```tsx
<div className="block md:hidden" style={{
  position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
  background: 'linear-gradient(to top, rgba(5,2,15,.78), rgba(5,2,15,.35), transparent)',
}} />
```

This preserves the warm orange sky at the top while ensuring the text block at the bottom is readable. `.78` is the revision-approved value (not `.92`).

### Edit 4 — Lotus corner decorations
```tsx
{/* Hero top corners */}
<LotusDecoration position="top-left"  size={130} opacity={0.08} />
<LotusDecoration position="top-right" size={130} opacity={0.08} />
```

Both clipped by `overflow: hidden` on the Hero section. `zIndex: 2`. These sit in the sky region, well clear of the couple silhouettes which occupy the center.

---

## 5. LotusDecoration Component

**File:** `app/components/LotusDecoration.tsx`  
**Rendered as:** pure inline SVG, never an image asset

### SVG Design
8 petals arranged radially. Each petal: tapered teardrop (`M0,0 Q5,-28 0,-58 Q-5,-28 0,0`). Centre: filled circle r=4, ring circle r=12 stroke-only. Colour: `#C49A28`. ViewBox `0 0 160 160`, origin at center `(80,80)`.

### Props
```ts
interface LotusDecorationProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number        // default 160
  opacity?: number     // default 0.07
  animate?: boolean    // default true
}
```

### Positioning
Absolutely positioned. Each corner: `position: absolute`, then `top: -size/3, left: -size/3` (top-left), etc. This pushes the mandala into the corner so only the outer petals are visible — feels like a border embellishment, not a floating graphic.

### Animation
```css
@keyframes lotusRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```
- Duration: 90s, `linear`, `infinite`
- Bottom corners: reverse direction (`animation-direction: reverse`)
- Class `.lotus-animate` applied when `animate={true}`
- `@media (prefers-reduced-motion: reduce) { .lotus-animate { animation: none !important; } }`

### Usage across site
| Section | Position | Size | Opacity | Notes |
|---|---|---|---|---|
| Hero | top-left + top-right | 130 | 0.08 | In sky region, clear of couple |
| Story | top-right | 120 | 0.07 | |
| JabWeMet | top-left | 120 | 0.07 | |
| RSVP | bottom-left | 100 | 0.04 | Reinforces conversion area |

Sparse by design. No other sections.

---

## 6. FloatingRSVPButton Component

**File:** `app/components/FloatingRSVPButton.tsx`

### Visibility Logic
- `IntersectionObserver` on `#hero-sentinel` (a `<div>` added at end of Hero section): fires when hero bottom leaves viewport → button appears
- `IntersectionObserver` on `#rsvp`: fires when RSVP section enters viewport → button hides
- Both observers use `threshold: 0.1`

### Animation
```tsx
<AnimatePresence>
  {visible && (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      {/* button */}
    </motion.div>
  )}
</AnimatePresence>
```

### Visual
- `fixed bottom-0 left-0 right-0 z-40 px-4 pb-4` (+ `env(safe-area-inset-bottom)` via inline style)
- `max-w-sm mx-auto` — centred, max width 384px
- Background: `linear-gradient(135deg, #B8850A, #E8C547, #C49A28)` (matches existing RSVP button exactly)
- Height 52px, `border-radius: 100px`, full-width
- Small lotus SVG icon (16px) + "RSVP Now" text
- `font-weight: 700`, `font-size: 12px`, `letter-spacing: 0.12em`, `color: #2A1200`
- Backdrop behind button: thin frosted bar `rgba(255,253,246,0.6) blur(20px)`

### Mounting
Added once in `app/page.tsx` inside `mainContent` after `<Navigation />`:
```tsx
<FloatingRSVPButton />
```

---

## 7. Navigation — Active Section Highlighting

**File:** `app/components/Navigation.tsx` (targeted additions only)

### Implementation
- `useEffect` creates one `IntersectionObserver` for all section IDs
- `rootMargin: '-40% 0px -40% 0px'` — only the section currently centered in viewport triggers active state (prevents flicker on tall sections)
- `activeSection` state (`string | null`) drives link styling
- Active link: `color: #C49A28` + `border-bottom: 1.5px solid #C49A28` (inline style)
- No change to scroll behaviour, ARIA, mobile dropdown

### Sections observed
`['#story', '#jab-we-met', '#timeline', '#gallery', '#rsvp', '#messages', '#travel', '#contact']`

---

## 8. globals.css Additions

```css
/* Lotus rotation */
@keyframes lotusRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.lotus-animate { animation: lotusRotate 90s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .lotus-animate { animation: none !important; }
}

/* Hero responsive image position */
.hero-image { object-position: center 22%; }
@media (min-width: 768px) { .hero-image { object-position: center 20%; } }

/* Mobile gallery scroll snap */
.gallery-scroll {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.gallery-scroll::-webkit-scrollbar { display: none; }
.gallery-slide { scroll-snap-align: start; flex-shrink: 0; }
```

---

## Implementation Order

1. `useMediaQuery` hook — needed by Gallery + FloatingRSVPButton
2. `LotusDecoration` component — needed by Hero
3. `Hero.tsx` edits — image class, svh height, overlay, lotus corners
4. `MobileGallery.tsx` — new component
5. `Gallery.tsx` — add responsive branch
6. `FloatingRSVPButton.tsx` — new component
7. `Navigation.tsx` — active section highlighting
8. `globals.css` — add keyframes and utilities
9. `page.tsx` — mount FloatingRSVPButton, add hero sentinel div

---

## What Is Explicitly Not Changed

- All RSVP form logic and Supabase calls
- GuestBook realtime subscription
- Gallery lightbox (PhotoCard, AnimatePresence, keyboard nav)
- IntroScreen / map interaction
- Countdown timer
- All existing Framer Motion animations
- Games page
- Admin dashboard
- Any API routes
