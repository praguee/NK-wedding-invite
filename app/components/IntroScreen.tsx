'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './IntroScreen.module.css'

interface IntroScreenProps {
  onUnlock: () => void
}

const BIRMINGHAM = { lat: 52.4862, lng: -1.8904, color: '#fb7185', label: 'Birmingham · Nidhi 👧', radius: 90 }
const MUMBAI     = { lat: 19.076,  lng: 72.877,  color: '#fbbf24', label: 'Mumbai · Parag 👦',    radius: 110 }

// Geographic zones: [minLat, maxLat, minLng, maxLng, message]
// Checked in order — first match wins. Put specific cities before large regions.
const GEO_ZONES: [number, number, number, number, string][] = [
  // ── UK & Ireland (not Birmingham itself — that's handled separately) ──
  [49, 60,  -10, 3,    "That's the UK! But Birmingham is where Nidhi starts — not where she's headed 😄 Drag east to Mumbai!"],
  // ── Western Europe ──
  [36, 72,  -10, 25,   "That's Europe! The wedding is in Mumbai, India 🇮🇳 Head east — way east!"],
  // ── Iceland & Greenland ──
  [60, 85, -80, -10,   "Iceland or Greenland?! Beautiful ice but nowhere near Mumbai 🧊 Turn the plane around!"],
  // ── Russia & Central Asia ──
  [45, 82,  25, 180,   "That's Russia or Central Asia! Mumbai is way south of here ↓ Keep searching!"],
  // ── Middle East (before South Asia so Dubai/Karachi get caught first) ──
  [12, 42,  35, 65,    "That's the Middle East! Getting warmer… Mumbai is further east and south ✈️"],
  // ── Pakistan / Karachi area ──
  [20, 36,  60, 74,    "That's Pakistan! Mumbai is just across the border to the east → almost there!"],
  // ── Delhi / North India ──
  [26, 34,  74, 82,    "So close!! That's North India — Delhi area. Mumbai is just 1,400 km south ↓ Almost!"],
  // ── South India / Sri Lanka (not Mumbai) ──
  [ 5, 20,  73, 82,    "You're in India but too far south! Mumbai is north of here ↑"],
  // ── China & East Asia ──
  [18, 55,  73, 145,   "That's East Asia! Great Wall, sushi — wrong continent for the wedding 🐉 Mumbai is west of here!"],
  // ── South East Asia ──
  [-10, 28, 90, 145,   "That's South East Asia! Lovely beaches but Mumbai is west of here ← Keep looking!"],
  // ── Japan ──
  [30, 46, 128, 148,   "Tokyo! Great sushi, wrong wedding venue 🍣 Mumbai is way west of Japan!"],
  // ── Australia & NZ ──
  [-50, -10, 110, 180, "Australia!! You've overshot Mumbai by about 9,000 km 🦘 Come back — way back!"],
  // ── North Africa & Egypt ──
  [18, 38,  -5, 40,    "That's North Africa or Egypt! The pyramids are magnificent but the wedding is in Mumbai 🐪"],
  // ── Sub-Saharan Africa ──
  [-35, 18, -20, 55,   "That's Africa! Mumbai is across the Indian Ocean to the north-east 🌍"],
  // ── North America (covers USA + Canada + Mexico) ──
  [10, 85, -170, -50,  "WRONG CONTINENT 😂 That's North America! The wedding is in India, not America. Turn around!"],
  // ── South America ──
  [-60, 15, -85, -30,  "South America! 🌴 Completely wrong side of the planet. Mumbai is way east across the Atlantic!"],
  // ── Pacific Ocean ──
  [-60, 60, -180, -100,"You're in the middle of the Pacific Ocean 🌊 There's nothing here! Head west to India!"],
  // ── Indian Ocean fallback ──
  [-40, 25, 40, 100,   "You're over the Indian Ocean! You're close — Mumbai is to the north-east ↗️"],
  // ── Atlantic Ocean fallback ──
  [-60, 70, -60, -5,   "You're over the Atlantic Ocean 🌊 Mumbai is to the east — keep flying!"],
]

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export default function IntroScreen({ onUnlock }: IntroScreenProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef = useRef<any>(null)

  const [planePos, setPlanePos]         = useState({ x: 0, y: 0 })
  const [planePosReady, setPlanePosReady] = useState(false)
  const [isDragging, setIsDragging]     = useState(false)
  const [planeAngle, setPlaneAngle]     = useState(45)
  const [isSnapping, setIsSnapping]     = useState(false)

  const [birminghamPos, setBirminghamPos] = useState({ x: 0, y: 0 })
  const [mumbaiPos, setMumbaiPos]         = useState({ x: 0, y: 0 })

  const [message, setMessage]       = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [burstPos, setBurstPos]       = useState<{ x: number; y: number } | null>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const messageTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPosRef         = useRef({ x: 0, y: 0 })
  const birminghamPosRef   = useRef({ x: 0, y: 0 })
  const mumbaiPosRef       = useRef({ x: 0, y: 0 })

  const updateCityPositions = useCallback(() => {
    if (!mapRef.current || !leafletRef.current) return
    const L   = leafletRef.current
    const map = mapRef.current
    const bPt = map.latLngToContainerPoint(L.latLng(BIRMINGHAM.lat, BIRMINGHAM.lng))
    const mPt = map.latLngToContainerPoint(L.latLng(MUMBAI.lat, MUMBAI.lng))
    birminghamPosRef.current = { x: bPt.x, y: bPt.y }
    mumbaiPosRef.current     = { x: mPt.x, y: mPt.y }
    setBirminghamPos({ x: bPt.x, y: bPt.y })
    setMumbaiPos    ({ x: mPt.x, y: mPt.y })
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // iOS Safari fix: explicitly size the container using window dimensions
    const setSize = () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.style.width  = `${window.innerWidth}px`
        mapContainerRef.current.style.height = `${window.innerHeight}px`
      }
    }
    setSize()
    window.addEventListener('resize', setSize)

    import('leaflet').then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (mod.default ?? mod) as any
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' })
      leafletRef.current = L

      const map = L.map(mapContainerRef.current!, {
        center: [32, 38],
        zoom: 2,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map

      // Tight bounds: Birmingham top-left, Mumbai bottom-right
      const bounds = L.latLngBounds(
        [MUMBAI.lat - 5,    BIRMINGHAM.lng - 18],
        [BIRMINGHAM.lat + 2, MUMBAI.lng  + 14]
      )

      const getPadding = () => {
        const portrait = window.innerHeight > window.innerWidth
        // Portrait: almost no vertical padding so polar tiles don't show
        // Landscape/desktop: comfortable padding all around
        return portrait ? [8, 30] as [number, number] : [55, 60] as [number, number]
      }

      map.whenReady(() => {
        map.invalidateSize()
        map.fitBounds(bounds, { padding: getPadding(), animate: false, maxZoom: 4 })
        setTimeout(() => {
          map.invalidateSize()
          updateCityPositions()
          const bPt = map.latLngToContainerPoint(L.latLng(BIRMINGHAM.lat, BIRMINGHAM.lng))
          setPlanePos({ x: bPt.x, y: bPt.y })
          setPlanePosReady(true)
        }, 250)
      })

      map.on('resize', () => {
        map.fitBounds(bounds, { padding: getPadding(), animate: false, maxZoom: 4 })
        setTimeout(updateCityPositions, 50)
      })
    })

    return () => {
      window.removeEventListener('resize', setSize)
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [updateCityPositions])

  useEffect(() => {
    window.addEventListener('resize', updateCityPositions)
    return () => window.removeEventListener('resize', updateCityPositions)
  }, [updateCityPositions])

  const showSarcasticMessage = useCallback((msg: string) => {
    setMessage(msg)
    setShowMessage(true)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    messageTimerRef.current = setTimeout(() => setShowMessage(false), 4000)
  }, [])

  const snapToBirmingham = useCallback((msg?: string) => {
    const bp = birminghamPosRef.current
    setIsSnapping(true)
    setPlanePos(bp)
    setTimeout(() => setIsSnapping(false), 350)
    if (msg) showSarcasticMessage(msg)
    setShowInstruction(true)
  }, [showSarcasticMessage])

  const triggerUnlock = useCallback(() => {
    const mp = mumbaiPosRef.current
    setIsSnapping(true)
    setPlanePos(mp)
    setBurstPos({ x: mp.x, y: mp.y })
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
  }, [onUnlock])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isUnlocking || showSuccess) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setIsDragging(true)
    setShowMessage(false)
    setShowInstruction(false)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }, [isUnlocking, showSuccess])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const dx = e.clientX - lastPosRef.current.x
    const dy = e.clientY - lastPosRef.current.y
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      setPlaneAngle(Math.atan2(dy, dx) * (180 / Math.PI) + 45)
    }
    lastPosRef.current = { x: e.clientX, y: e.clientY }
    setPlanePos(prev => ({ x: prev.x + dx, y: prev.y + dy }))
  }, [isDragging])

  const onPointerUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    setPlanePos(current => {
      const mp = mumbaiPosRef.current
      const bp = birminghamPosRef.current

      // Mumbai — unlock!
      if (dist(current, mp) < MUMBAI.radius) {
        setTimeout(() => triggerUnlock(), 0)
        return current
      }

      // Birmingham — snap back with hint
      if (dist(current, bp) < BIRMINGHAM.radius) {
        setTimeout(() => snapToBirmingham("That's where Nidhi is! Drag the plane east toward Mumbai! →"), 0)
        return current
      }

      // Convert plane screen position to lat/lng for geographic zone detection
      if (mapRef.current && leafletRef.current) {
        const L = leafletRef.current
        const map = mapRef.current
        try {
          const ll = map.containerPointToLatLng(L.point(current.x, current.y))
          const lat = ll.lat
          const lng = ll.lng
          for (const [minLat, maxLat, minLng, maxLng, msg] of GEO_ZONES) {
            if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
              setTimeout(() => snapToBirmingham(msg), 0)
              return current
            }
          }
        } catch {
          // fall through to default snap
        }
      }

      // Default — snap back silently
      setTimeout(() => snapToBirmingham(), 0)
      return current
    })
  }, [isDragging, snapToBirmingham, triggerUnlock])

  const renderFlightArc = () => {
    if (!planePosReady) return null
    const { x: bx, y: by } = birminghamPos
    const { x: mx, y: my } = mumbaiPos
    const cpx = (bx + mx) / 2
    const cpy = Math.min(by, my) - Math.abs(mx - bx) * 0.22
    return (
      <svg className={styles.flightPath}>
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
    <div className={`${styles.overlay} ${isUnlocking ? styles.overlayFadingOut : ''}`}>
      {/* Leaflet map */}
      <div ref={mapContainerRef} className={styles.mapContainer} />

      {/* Dark tint */}
      <div className={styles.mapOverlay} />

      {/* Flight arc */}
      {renderFlightArc()}

      {/* Birmingham marker */}
      {planePosReady && (
        <div className={styles.cityMarker} style={{ left: birminghamPos.x, top: birminghamPos.y }}>
          <div className={styles.cityLabel}>{BIRMINGHAM.label}</div>
          <div className={styles.pulseRing} style={{ color: BIRMINGHAM.color }} />
          <div className={styles.cityDot} style={{ background: BIRMINGHAM.color, boxShadow: `0 0 12px ${BIRMINGHAM.color}` }} />
        </div>
      )}

      {/* Mumbai marker */}
      {planePosReady && (
        <div className={styles.cityMarker} style={{ left: mumbaiPos.x, top: mumbaiPos.y }}>
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
            transform: `translate(-50%, -50%) rotate(${planeAngle}deg) ${isDragging ? 'scale(1.2)' : ''}`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      )}

      {/* Unlock burst */}
      {burstPos && (
        <div className={styles.unlockBurst} style={{ left: burstPos.x, top: burstPos.y }} />
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
        <span className={styles.successEmoji}>👫</span>
        <div className={styles.successTitle}>You found us!</div>
        <div className={styles.successSub}>Nidhi & Parag · December 4, 2026</div>
      </div>

      {/* Instruction bar */}
      <div className={`${styles.instructionBar} ${!showInstruction ? styles.instructionBarHidden : ''}`}>
        ✈️&nbsp;&nbsp;Drag the plane from Birmingham to Mumbai
      </div>
    </div>
  )
}
