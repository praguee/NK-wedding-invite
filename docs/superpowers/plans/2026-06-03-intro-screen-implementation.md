# Intro Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen interactive map unlock experience — guests drag an airplane from Birmingham to Mumbai to reveal the blurred wedding invite beneath.

**Architecture:** A single `IntroScreen.tsx` client component renders over the blurred main page. It uses Leaflet.js (loaded dynamically, no SSR) for the real map, pointer events for drag mechanics, and CSS animations for the liquid glass UI. State is stored in `sessionStorage` so the intro only shows once per visit. `app/page.tsx` is updated to wrap the main content with the intro overlay.

**Tech Stack:** Next.js 14, React, Leaflet.js, CSS Modules, TypeScript, Tailwind CSS

---

## File Structure

```
app/
  components/
    IntroScreen.tsx          — Full intro screen (map + drag + messages + unlock)
    IntroScreen.module.css   — Keyframe animations and liquid glass styles
  page.tsx                   — Modified to wrap content with IntroScreen
```

---

## Tasks

### Task 1: Install dependencies and add Leaflet CSS

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install Leaflet**

```bash
cd /home/parag/NK-wedding-invite && npm install leaflet @types/leaflet
```

Expected output: `added N packages` with no errors.

- [ ] **Step 2: Add Leaflet CSS to layout**

Read `app/layout.tsx`, then add the Leaflet CSS import. The full file should look like:

```typescript
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nidhi & Parag Wedding | December 4, 2026',
  description: 'Join us for our Hindu Maharashtrian wedding at Abhishek Farms, Yeoor Hills, Thane on December 4, 2026.',
  openGraph: {
    title: 'Nidhi & Parag Wedding',
    description: 'Join us for our wedding celebration on December 4, 2026',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        {children}
        <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify build still passes**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -10
```

Expected: Clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json app/layout.tsx && git commit -m "feat: install Leaflet for interactive map intro screen"
```

---

### Task 2: Create CSS Module with animations and liquid glass styles

**Files:**
- Create: `app/components/IntroScreen.module.css`

- [ ] **Step 1: Create the CSS module**

Create `app/components/IntroScreen.module.css`:

```css
/* ─── Overlay ─── */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
}

.overlayFadingOut {
  animation: overlayFadeOut 0.8s ease-out forwards;
}

@keyframes overlayFadeOut {
  from { opacity: 1; }
  to   { opacity: 0; pointer-events: none; }
}

/* ─── Map ─── */
.mapContainer {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* Hide Leaflet attribution */
.mapContainer :global(.leaflet-control-attribution) {
  display: none !important;
}
.mapContainer :global(.leaflet-control-zoom) {
  display: none !important;
}

/* ─── Dark overlay on top of map ─── */
.mapOverlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  z-index: 1;
  pointer-events: none;
}

/* ─── Blurred background page ─── */
.blurredPage {
  position: fixed;
  inset: 0;
  z-index: -1;
  filter: blur(24px) brightness(0.35);
  pointer-events: none;
  overflow: hidden;
  transition: filter 1.2s ease-out;
}

.blurredPageUnlocking {
  filter: none;
}

/* ─── City markers ─── */
.cityMarker {
  position: absolute;
  z-index: 10;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.pulseRing {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid currentColor;
  animation: pulse 2s ease-out infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes pulse {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0;   }
}

.cityDot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.cityLabel {
  margin-bottom: 16px;
  margin-top: -52px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(48px) saturate(160%) brightness(1.1);
  -webkit-backdrop-filter: blur(48px) saturate(160%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 100px;
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.06) inset,
    0 8px 24px rgba(0, 0, 0, 0.5);
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}

/* ─── Flight path SVG ─── */
.flightPath {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* ─── Airplane ─── */
.airplane {
  position: absolute;
  z-index: 20;
  width: 36px;
  height: 36px;
  cursor: grab;
  touch-action: none;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: filter 0.15s ease, transform 0.15s ease;
  user-select: none;
}

.airplaneDragging {
  cursor: grabbing;
  filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.7));
  transform: translate(-50%, -50%) rotate(var(--plane-angle, 45deg)) scale(1.15);
}

.airplaneSnapping {
  transition: left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              top  0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.3s ease;
}

/* ─── Instruction bar ─── */
.instructionBar {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(48px) saturate(160%);
  -webkit-backdrop-filter: blur(48px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  padding: 10px 22px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
}

.instructionBarHidden {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

/* ─── Sarcastic message card ─── */
.messageCard {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  z-index: 40;
  max-width: 380px;
  width: calc(100% - 48px);
  background: rgba(10, 10, 20, 0.55);
  backdrop-filter: blur(60px) saturate(180%);
  -webkit-backdrop-filter: blur(60px) saturate(180%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.messageCardVisible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.messageCardPrismaticBorder {
  height: 2px;
  background: linear-gradient(90deg, #fb7185, #818cf8, #fbbf24, #818cf8, #fb7185);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0%   { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

.messageCardInner {
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none;
  border-radius: 0 0 20px 20px;
}

.messageText {
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.5;
  letter-spacing: 0.01em;
}

/* ─── Success card ─── */
.successCard {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  z-index: 50;
  text-align: center;
  background: rgba(10, 10, 20, 0.5);
  backdrop-filter: blur(60px) saturate(180%);
  -webkit-backdrop-filter: blur(60px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.06) inset,
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(251, 191, 36, 0.08);
  padding: 28px 40px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
  min-width: 280px;
}

.successCardVisible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.successEmoji {
  font-size: 36px;
  margin-bottom: 10px;
  display: block;
}

.successTitle {
  font-size: 26px;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.02em;
  margin-bottom: 8px;
}

.successSub {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.06em;
}

/* ─── Mumbai unlock burst ─── */
.unlockBurst {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
  z-index: 15;
  animation: burst 0.7s ease-out forwards;
}

@keyframes burst {
  0%   { width: 0px;    height: 0px;   opacity: 1; }
  100% { width: 800px;  height: 800px; opacity: 0; }
}
```

- [ ] **Step 2: Verify CSS module has no syntax errors by checking build**

```bash
cd /home/parag/NK-wedding-invite && npx tsc --noEmit 2>&1 | head -5
```

Expected: No errors (CSS modules don't get type-checked, so this just verifies the project is still healthy).

- [ ] **Step 3: Commit**

```bash
git add app/components/IntroScreen.module.css && git commit -m "feat: add CSS module with liquid glass and animation styles for intro screen"
```

---

### Task 3: Build the IntroScreen component

**Files:**
- Create: `app/components/IntroScreen.tsx`

- [ ] **Step 1: Create IntroScreen.tsx**

Create `app/components/IntroScreen.tsx`:

```typescript
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './IntroScreen.module.css'

interface IntroScreenProps {
  onUnlock: () => void
}

interface City {
  name: string
  lat: number
  lng: number
  color: string
  label: string
  radius: number
  message?: string
}

const BIRMINGHAM: City = {
  name: 'Birmingham',
  lat: 52.4862,
  lng: -1.8904,
  color: '#fb7185',
  label: 'Birmingham · Nidhi 💙',
  radius: 50,
  message: 'Nidhi is waiting here! Drag the plane east toward Mumbai! →',
}

const MUMBAI: City = {
  name: 'Mumbai',
  lat: 19.076,
  lng: 72.877,
  color: '#fbbf24',
  label: 'Mumbai · Parag ✨',
  radius: 60,
}

const SARCASTIC_ZONES: City[] = [
  { name: 'London',   lat: 51.5074, lng: -0.1278,  color: '#fff', label: '', radius: 55, message: "That's London! Nidhi actually moved to Birmingham 😄 Try a bit north-west!" },
  { name: 'Paris',    lat: 48.8566, lng:  2.3522,  color: '#fff', label: '', radius: 55, message: "Paris?! Très romantique — save that for the honeymoon 💕 The wedding is in Mumbai!" },
  { name: 'Dubai',    lat: 25.2048, lng: 55.2708,  color: '#fff', label: '', radius: 60, message: "Ooh, Dubai! Tempting… but the mandap is in Mumbai. Just a little further east! ✈️" },
  { name: 'Delhi',    lat: 28.6139, lng: 77.2090,  color: '#fff', label: '', radius: 60, message: "So close!! That's Delhi. Mumbai is just 1,400 km south. Almost there! 🎯" },
  { name: 'Karachi',  lat: 24.8607, lng: 67.0011,  color: '#fff', label: '', radius: 55, message: "Hmm, that's Karachi 👀 Mumbai is just across the border to the right →" },
  { name: 'New York', lat: 40.7128, lng: -74.0060, color: '#fff', label: '', radius: 70, message: "WRONG DIRECTION 😂 You've flown the wrong way across the planet. Turn around!" },
  { name: 'Sydney',   lat: -33.8688, lng: 151.2093, color: '#fff', label: '', radius: 70, message: "You've overshot Mumbai by about 9,000 km 🦘 Come back!" },
  { name: 'Tokyo',    lat: 35.6762, lng: 139.6503, color: '#fff', label: '', radius: 65, message: "Tokyo! Great sushi, wrong wedding venue 🍣 Mumbai is way west!" },
]

export default function IntroScreen({ onUnlock }: IntroScreenProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)

  // Airplane screen position
  const [planePos, setPlanePos] = useState({ x: 0, y: 0 })
  const [planePosReady, setPlanePosReady] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [planeAngle, setPlaneAngle] = useState(45)
  const [isSnapping, setIsSnapping] = useState(false)

  // City screen positions (updated on map move/resize)
  const [birminghamPos, setBirminghamPos] = useState({ x: 0, y: 0 })
  const [mumbaiPos, setMumbaiPos] = useState({ x: 0, y: 0 })
  const [otherCityPositions, setOtherCityPositions] = useState<{ x: number; y: number }[]>([])

  // UI state
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showBurst, setBurstPos] = useState<{ x: number; y: number } | null>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastPosRef = useRef({ x: 0, y: 0 })

  // Update city screen positions from map
  const updateCityPositions = useCallback(() => {
    if (!mapRef.current || !leafletRef.current) return
    const L = leafletRef.current
    const map = mapRef.current

    const bPoint = map.latLngToContainerPoint(L.latLng(BIRMINGHAM.lat, BIRMINGHAM.lng))
    const mPoint = map.latLngToContainerPoint(L.latLng(MUMBAI.lat, MUMBAI.lng))

    setBirminghamPos({ x: bPoint.x, y: bPoint.y })
    setMumbaiPos({ x: mPoint.x, y: mPoint.y })

    const others = SARCASTIC_ZONES.map(z => {
      const p = map.latLngToContainerPoint(L.latLng(z.lat, z.lng))
      return { x: p.x, y: p.y }
    })
    setOtherCityPositions(others)
  }, [])

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    import('leaflet').then(L => {
      leafletRef.current = L.default ?? L

      const map = (L.default ?? L).map(mapContainerRef.current!, {
        center: [35, 35],
        zoom: window.innerWidth < 640 ? 2 : 3,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
        attributionControl: false,
      })

      ;(L.default ?? L).tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      ).addTo(map)

      mapRef.current = map

      map.whenReady(() => {
        updateCityPositions()
        // Set initial plane position to Birmingham
        const L2 = leafletRef.current
        const bPoint = map.latLngToContainerPoint(L2.latLng(BIRMINGHAM.lat, BIRMINGHAM.lng))
        setPlanePos({ x: bPoint.x, y: bPoint.y })
        setPlanePosReady(true)
      })

      map.on('resize', updateCityPositions)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [updateCityPositions])

  // Handle window resize
  useEffect(() => {
    const onResize = () => updateCityPositions()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [updateCityPositions])

  const showSarcasticMessage = useCallback((msg: string) => {
    setMessage(msg)
    setShowMessage(true)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    messageTimerRef.current = setTimeout(() => setShowMessage(false), 3500)
  }, [])

  const snapToCity = useCallback((pos: { x: number; y: number }) => {
    setIsSnapping(true)
    setPlanePos(pos)
    setTimeout(() => setIsSnapping(false), 350)
  }, [])

  const triggerUnlock = useCallback(() => {
    setIsSnapping(true)
    setPlanePos(mumbaiPos)
    setBurstPos({ x: mumbaiPos.x, y: mumbaiPos.y })

    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => {
        setIsUnlocking(true)
        setTimeout(() => {
          sessionStorage.setItem('invite_unlocked', 'true')
          onUnlock()
        }, 800)
      }, 1500)
    }, 400)
  }, [mumbaiPos, onUnlock])

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isUnlocking || showSuccess) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setIsDragging(true)
    setShowMessage(false)
    setShowInstruction(false)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    lastPosRef.current = { x: e.clientX, y: e.clientY }
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
  }, [isUnlocking, showSuccess])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    e.preventDefault()

    const dx = e.clientX - lastPosRef.current.x
    const dy = e.clientY - lastPosRef.current.y

    // Compute angle from movement direction
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45
      setPlaneAngle(angle)
    }

    lastPosRef.current = { x: e.clientX, y: e.clientY }
    setPlanePos(prev => ({ x: prev.x + dx, y: prev.y + dy }))
  }, [isDragging])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)

    const currentPos = planePos

    // Check Mumbai (unlock)
    if (dist(currentPos, mumbaiPos) < MUMBAI.radius) {
      triggerUnlock()
      return
    }

    // Check Birmingham (snap back with hint)
    if (dist(currentPos, birminghamPos) < BIRMINGHAM.radius) {
      snapToCity(birminghamPos)
      showSarcasticMessage(BIRMINGHAM.message!)
      setShowInstruction(true)
      return
    }

    // Check "Parag going to Birmingham" — westward near Mumbai latitude
    const isMumbaiLatRange = Math.abs(e.clientY - mumbaiPos.y) < 80
    const isDraggingWest = e.clientX < mumbaiPos.x - 60
    if (isMumbaiLatRange && isDraggingWest) {
      snapToCity(birminghamPos)
      showSarcasticMessage("Parag going to Birmingham?! He doesn't have a flight ticket yet 😂 The wedding is in Mumbai, not Birmingham!")
      setShowInstruction(true)
      return
    }

    // Check sarcastic zones
    for (let i = 0; i < SARCASTIC_ZONES.length; i++) {
      const zone = SARCASTIC_ZONES[i]
      const zonePos = otherCityPositions[i]
      if (zonePos && dist(currentPos, zonePos) < zone.radius) {
        snapToCity(birminghamPos)
        showSarcasticMessage(zone.message!)
        setShowInstruction(true)
        return
      }
    }

    // No zone hit — snap back to Birmingham
    snapToCity(birminghamPos)
    setShowInstruction(true)
  }, [isDragging, planePos, mumbaiPos, birminghamPos, otherCityPositions, triggerUnlock, snapToCity, showSarcasticMessage])

  // Flight path arc as SVG between Birmingham and Mumbai
  const flightArc = () => {
    if (!planePosReady) return null
    const bx = birminghamPos.x
    const by = birminghamPos.y
    const mx = mumbaiPos.x
    const my = mumbaiPos.y
    const cpx = (bx + mx) / 2
    const cpy = Math.min(by, my) - Math.abs(mx - bx) * 0.25
    return (
      <svg className={styles.flightPath} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        <path
          d={`M ${bx} ${by} Q ${cpx} ${cpy} ${mx} ${my}`}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="4 6"
          fill="none"
        />
      </svg>
    )
  }

  return (
    <>
      {/* Intro overlay */}
      <div className={`${styles.overlay} ${isUnlocking ? styles.overlayFadingOut : ''}`}>
        {/* Real Leaflet map */}
        <div ref={mapContainerRef} className={styles.mapContainer} />

        {/* Dark tint over map */}
        <div className={styles.mapOverlay} />

        {/* Flight path arc */}
        {flightArc()}

        {/* Birmingham marker */}
        {planePosReady && (
          <div
            className={styles.cityMarker}
            style={{ left: birminghamPos.x, top: birminghamPos.y }}
          >
            <div className={styles.cityLabel}>{BIRMINGHAM.label}</div>
            <div className={styles.pulseRing} style={{ color: BIRMINGHAM.color }} />
            <div className={styles.cityDot} style={{ background: BIRMINGHAM.color, boxShadow: `0 0 12px ${BIRMINGHAM.color}` }} />
          </div>
        )}

        {/* Mumbai marker */}
        {planePosReady && (
          <div
            className={styles.cityMarker}
            style={{ left: mumbaiPos.x, top: mumbaiPos.y }}
          >
            <div className={styles.cityLabel}>{MUMBAI.label}</div>
            <div className={styles.pulseRing} style={{ color: MUMBAI.color }} />
            <div className={styles.cityDot} style={{ background: MUMBAI.color, boxShadow: `0 0 12px ${MUMBAI.color}` }} />
          </div>
        )}

        {/* Draggable airplane */}
        {planePosReady && (
          <svg
            className={`${styles.airplane} ${isDragging ? styles.airplaneDragging : ''} ${isSnapping ? styles.airplaneSnapping : ''}`}
            style={{
              left: planePos.x,
              top: planePos.y,
              '--plane-angle': `${planeAngle}deg`,
            } as React.CSSProperties}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        )}

        {/* Unlock burst effect */}
        {showBurst && (
          <div
            className={styles.unlockBurst}
            style={{ left: showBurst.x, top: showBurst.y }}
          />
        )}

        {/* Sarcastic message card */}
        <div className={`${styles.messageCard} ${showMessage ? styles.messageCardVisible : ''}`}>
          <div className={styles.messageCardPrismaticBorder} />
          <div className={styles.messageCardInner}>
            <p className={styles.messageText}>{message}</p>
          </div>
        </div>

        {/* Success card */}
        <div className={`${styles.successCard} ${showSuccess ? styles.successCardVisible : ''}`}>
          <span className={styles.successEmoji}>✨</span>
          <div className={styles.successTitle}>You found us!</div>
          <div className={styles.successSub}>Nidhi & Parag · December 4, 2026</div>
        </div>

        {/* Instruction bar */}
        <div className={`${styles.instructionBar} ${!showInstruction ? styles.instructionBarHidden : ''}`}>
          ✈️&nbsp;&nbsp;Drag the plane from Birmingham to Mumbai
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd /home/parag/NK-wedding-invite && npx tsc --noEmit 2>&1 | head -20
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/IntroScreen.tsx && git commit -m "feat: create IntroScreen component with map, drag, and liquid glass UI"
```

---

### Task 4: Integrate IntroScreen into the main page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update page.tsx to show intro screen**

Replace `app/page.tsx` with:

```typescript
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Story from './components/Story'
import InviteDetails from './components/InviteDetails'
import Addresses from './components/Addresses'
import Gallery from './components/Gallery'
import Accommodations from './components/Accommodations'
import Transportation from './components/Transportation'
import Timeline from './components/Timeline'
import RSVPForm from './components/RSVPForm'
import GuestBook from './components/GuestBook'
import ContactFAQ from './components/ContactFAQ'

const IntroScreen = dynamic(() => import('./components/IntroScreen'), { ssr: false })

export default function Home() {
  const [unlocked, setUnlocked] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem('invite_unlocked') === 'true') {
      setUnlocked(true)
    }
  }, [])

  const handleUnlock = () => setUnlocked(true)

  const mainContent = (
    <>
      <Navigation />
      <main>
        <Hero />
        <Story />
        <InviteDetails />
        <Addresses />
        <Gallery />
        <Accommodations />
        <Transportation />
        <Timeline />
        <RSVPForm />
        <GuestBook />
        <ContactFAQ />
      </main>
      <footer className="bg-slate-900 text-white py-12 text-center">
        <p className="text-slate-400 text-sm">© 2026 Nidhi & Parag · Made with love</p>
      </footer>
    </>
  )

  if (!mounted) return null

  if (unlocked) return mainContent

  return (
    <>
      {/* Blurred background — the actual page content */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          filter: 'blur(24px) brightness(0.35)',
          pointerEvents: 'none',
          overflow: 'hidden',
          transform: 'scale(1.05)', // slight scale to hide blur edges
        }}
      >
        {mainContent}
      </div>

      {/* Intro screen on top */}
      <IntroScreen onUnlock={handleUnlock} />
    </>
  )
}
```

- [ ] **Step 2: Run full build**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -15
```

Expected: Clean build. `/` route will now show as dynamic `ƒ` (because page.tsx is a client component with `'use client'`).

- [ ] **Step 3: Test locally**

```bash
cd /home/parag/NK-wedding-invite && npm run dev
```

Open http://localhost:3000 and verify:
- Dark map loads over blurred invite
- Birmingham and Mumbai markers appear with pulsing rings and liquid glass labels
- Airplane appears on Birmingham
- Dragging airplane works (follows cursor)
- Dropping on wrong city: snap back + message card appears
- Dropping on Mumbai: unlock animation plays, invite revealed

- [ ] **Step 4: Commit and push**

```bash
git add app/page.tsx && git commit -m "feat: integrate intro screen into main page with blur unlock effect" && git push origin main
```

---

### Task 5: Polish — fix Leaflet marker icon issue and mobile

**Files:**
- Modify: `app/components/IntroScreen.tsx`

- [ ] **Step 1: Fix Leaflet default icon issue**

Leaflet's default marker icons break in Next.js due to webpack asset handling. Since we are NOT using Leaflet markers (we use custom CSS markers), we just need to make sure the Leaflet import doesn't try to load default icons. Add this right after the `import('leaflet')` call inside the `useEffect`:

In `IntroScreen.tsx`, find the line:
```typescript
import('leaflet').then(L => {
  leafletRef.current = L.default ?? L
```

Replace with:
```typescript
import('leaflet').then(L => {
  const Leaflet = L.default ?? L
  // Prevent Leaflet from trying to load default marker icons (breaks in Next.js)
  delete (Leaflet.Icon.Default.prototype as any)._getIconUrl
  Leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: '',
    iconUrl: '',
    shadowUrl: '',
  })
  leafletRef.current = Leaflet
```

- [ ] **Step 2: Add mobile zoom level**

The map zoom is already handled (`window.innerWidth < 640 ? 2 : 3`). Verify on mobile by resizing the browser window to 375px width. City markers should still be visible and draggable.

- [ ] **Step 3: Run build and verify**

```bash
cd /home/parag/NK-wedding-invite && npm run build 2>&1 | tail -10
```

Expected: Clean build.

- [ ] **Step 4: Commit and push**

```bash
git add app/components/IntroScreen.tsx && git commit -m "fix: prevent Leaflet default icon errors in Next.js" && git push origin main
```

---

## Spec Coverage Checklist

- [x] Dark CartoDB map tiles
- [x] Birmingham (rose) and Mumbai (amber) markers with pulse rings
- [x] Liquid glass city label pills
- [x] Faint dashed flight arc
- [x] Draggable white SVG airplane with rotation
- [x] Dynamic angle update while dragging
- [x] Glow effect while dragging
- [x] Snap-back spring animation on release
- [x] Instruction bar (liquid glass, fades on drag)
- [x] 10 sarcastic zones with messages
- [x] "Parag → Birmingham" special message
- [x] Liquid glass message card with prismatic shimmer border
- [x] Unlock sequence (snap → burst → success card → blur dissolves → overlay fades)
- [x] sessionStorage so intro only shows once
- [x] Mobile: pointer events (touch support)
- [x] Mobile: zoom level 2 on small screens
- [x] SSR-safe (dynamic import, mounted check)
- [x] Leaflet loaded client-side only
