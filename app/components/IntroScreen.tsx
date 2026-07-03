'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import styles from './IntroScreen.module.css'

interface IntroScreenProps {
  onUnlock: () => void
}

const BIRMINGHAM = { lat: 52.4862, lng: -1.8904 }
const MUMBAI     = { lat: 19.0760, lng: 72.8777 }

// Snap radius in screen pixels — drop within this of Mumbai to unlock
const SNAP_PX = 90

const GEO_ZONES: [number, number, number, number, string][] = [
  [49, 85,  -10,   3,   "That's where you started. You've gone in a circle."],
  [36, 72,  -10,  22,   "A lovely tour of Europe. Wrong wedding though."],
  [60, 85, -100, -10,   "Points for ambition. Minus several hundred for navigation."],
  [45, 85,   22, 180,   "Russia is not on the guest list."],
  [10, 42,   35,  62,   "Warmer. The Middle East says hi. Keep going."],
  [20, 36,   60,  73,   "You can almost smell the vada pav from here."],
  [26, 34,   74,  82,   "So close it hurts. Drop straight south about 1,400 km."],
  [ 5, 20,   73,  82,   "India does not extend into the Indian Ocean. Come back up."],
  [18, 55,   82, 145,   "You've left the subcontinent entirely. Bold move."],
  [-20, 28,  90, 145,   "Southeast Asia is charming but it's not the venue."],
  [-60, 18, -20,  55,   "Wrong wedding. Different continent. Different hemisphere."],
  [-60, 60, -180, -50,  "You've crossed an entire ocean in the wrong direction. Impressive."],
]

function pxDist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// Clean white airplane — top-down ✈ style (Material Design "flight" icon)
function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        fill="white"
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
      />
    </svg>
  )
}

export default function IntroScreen({ onUnlock }: IntroScreenProps) {
  const mapDivRef         = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef        = useRef<any>(null)
  const grainDivRef       = useRef<HTMLDivElement>(null)
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null)

  // Pixel positions on screen (derived from Leaflet lat/lng → pixel)
  const [planePx, setPlanePx]   = useState({ x: -400, y: -400 })
  const [mumbaiPx, setMumbaiPx] = useState({ x: 0, y: 0 })
  const [mapReady, setMapReady] = useState(false)

  // Stable refs so event handlers always have current values
  const planePxRef      = useRef({ x: -400, y: -400 })
  const planeLatLngRef  = useRef(BIRMINGHAM)
  const isDraggingRef   = useRef(false)
  const lastPtrRef      = useRef({ x: 0, y: 0 })

  const [planeAngle, setPlaneAngle]   = useState(135)  // pointing SE toward Mumbai
  const [isDragging, setIsDragging]   = useState(false)
  const [isSnapping, setIsSnapping]   = useState(false)

  const [message, setMessage]         = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showHint, setShowHint]       = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [burstPos, setBurstPos]       = useState<{ x: number; y: number } | null>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const msgTimerRef  = useRef<ReturnType<typeof setTimeout>>()
  const hintTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Film grain — SVG feTurbulence baked once into a data URI, shifted by CSS animation
  useEffect(() => {
    if (!grainDivRef.current) return
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="300" height="300" filter="url(#f)" opacity="0.5"/></svg>'
    grainDivRef.current.style.backgroundImage = `url(data:image/svg+xml;base64,${btoa(svg)})`
  }, [])

  // Floating gold particles — canvas drawn after map is ready
  useEffect(() => {
    if (!mapReady) return
    const canvas = particlesCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.35,
      vy: -(Math.random() * 0.28 + 0.07),
      vx: (Math.random() - 0.5) * 0.09,
      t: Math.random() * Math.PI * 2,
      ts: Math.random() * 0.018 + 0.007,
      life: Math.random(),
      ls: Math.random() * 0.002 + 0.0008,
    }))
    let raf: number
    function tick() {
      raf = requestAnimationFrame(tick)
      ctx!.clearRect(0, 0, W, H)
      for (const p of pts) {
        p.y += p.vy; p.x += p.vx
        p.t += p.ts; p.life += p.ls
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; p.life = 0 }
        const a = Math.sin(p.life * Math.PI) * (0.55 + 0.45 * Math.sin(p.t)) * 0.42
        if (a <= 0.01) continue
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(196,154,40,${a})`
        ctx!.fill()
      }
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [mapReady])

  // Sync all screen-pixel positions from current Leaflet map state
  const syncPixels = useCallback(() => {
    const map = leafletRef.current
    if (!map) return
    const mPx = map.latLngToContainerPoint([MUMBAI.lat, MUMBAI.lng])
    setMumbaiPx({ x: mPx.x, y: mPx.y })
    if (!isDraggingRef.current) {
      const ll = planeLatLngRef.current
      const pPx = map.latLngToContainerPoint([ll.lat, ll.lng])
      planePxRef.current = { x: pPx.x, y: pPx.y }
      setPlanePx({ x: pPx.x, y: pPx.y })
    }
  }, [])

  useEffect(() => {
    if (!mapDivRef.current) return
    let cancelled = false

    import('leaflet').then(({ default: L }) => {
      if (cancelled || leafletRef.current) return

      // Give Leaflet explicit pixel dimensions so it measures correctly on every device
      const el = mapDivRef.current!
      el.style.width  = `${window.innerWidth}px`
      el.style.height = `${window.innerHeight}px`

      // Map is a locked backdrop — all interaction disabled except plane dragging
      const map = L.map(el, {
        zoomControl:        false,
        scrollWheelZoom:    false,
        dragging:           false,
        touchZoom:          false,
        doubleClickZoom:    false,
        boxZoom:            false,
        keyboard:           false,
        attributionControl: false,
      })

      // ESRI World Imagery — photorealistic satellite, no API key required
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(map)

      // CartoDB dark_only_labels — white text on transparent bg, perfect over satellite
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map)

      // Frame both cities — fitBounds ensures correct initial view on every screen size
      map.fitBounds(
        [[BIRMINGHAM.lat, BIRMINGHAM.lng], [MUMBAI.lat, MUMBAI.lng]],
        { padding: [60, 80], animate: false }
      )

      leafletRef.current = map
      map.on('move zoom zoomend moveend', syncPixels)

      // Force Leaflet to re-measure after React paint, then mark ready
      requestAnimationFrame(() => {
        if (cancelled) return
        map.invalidateSize()
        syncPixels()
        setMapReady(true)
        // Show hint for 8s so guests have time to notice it
        setShowHint(true)
        hintTimerRef.current = setTimeout(() => setShowHint(false), 8000)
      })

      // Handle viewport resize (orientation change on mobile)
      const onResize = () => {
        if (cancelled) return
        el.style.width  = `${window.innerWidth}px`
        el.style.height = `${window.innerHeight}px`
        map.invalidateSize()
        syncPixels()
      }
      window.addEventListener('resize', onResize)
      // Store cleanup on the ref so return() can reach it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(leafletRef as { current: any }).current._resizeCleanup = () =>
        window.removeEventListener('resize', onResize)
    })

    return () => {
      cancelled = true
      clearTimeout(hintTimerRef.current)
      clearTimeout(msgTimerRef.current)
      if (leafletRef.current) {
        leafletRef.current._resizeCleanup?.()
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [syncPixels])

  const showMsg = useCallback((msg: string) => {
    setMessage(msg)
    setShowMessage(true)
    clearTimeout(msgTimerRef.current)
    msgTimerRef.current = setTimeout(() => setShowMessage(false), 4200)
  }, [])

  const snapToBirmingham = useCallback((msg?: string) => {
    planeLatLngRef.current = BIRMINGHAM
    setIsSnapping(true)
    setTimeout(() => {
      syncPixels()
      setIsSnapping(false)
      // Re-show hint after snap so guest knows to try again
      clearTimeout(hintTimerRef.current)
      setShowHint(true)
      hintTimerRef.current = setTimeout(() => setShowHint(false), 5000)
    }, 360)
    if (msg) showMsg(msg)
  }, [syncPixels, showMsg])

  const triggerUnlock = useCallback(() => {
    const map = leafletRef.current
    const mPx = map
      ? map.latLngToContainerPoint([MUMBAI.lat, MUMBAI.lng])
      : mumbaiPx
    setBurstPos({ x: mPx.x, y: mPx.y })
    planeLatLngRef.current = MUMBAI
    setIsSnapping(true)
    syncPixels()
    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => {
        setIsUnlocking(true)
        setTimeout(() => {
          sessionStorage.setItem('invite_unlocked', 'true')
          onUnlock()
        }, 800)
      }, 1900)
    }, 350)
  }, [mumbaiPx, syncPixels, onUnlock])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isUnlocking || showSuccess) return
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    isDraggingRef.current = true
    setIsDragging(true)
    setShowHint(false)
    clearTimeout(msgTimerRef.current)
    setShowMessage(false)
    lastPtrRef.current = { x: e.clientX, y: e.clientY }
  }, [isUnlocking, showSuccess])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    e.preventDefault()
    const dx = e.clientX - lastPtrRef.current.x
    const dy = e.clientY - lastPtrRef.current.y
    lastPtrRef.current = { x: e.clientX, y: e.clientY }
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      setPlaneAngle(Math.atan2(dy, dx) * (180 / Math.PI) + 90)
    }
    const next = { x: planePxRef.current.x + dx, y: planePxRef.current.y + dy }
    planePxRef.current = next
    setPlanePx(next)
  }, [])

  const onPointerUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)

    const map = leafletRef.current
    const current = planePxRef.current

    // Check proximity to Mumbai in screen pixels
    const mPx = map
      ? map.latLngToContainerPoint([MUMBAI.lat, MUMBAI.lng])
      : mumbaiPx
    if (pxDist(current, { x: mPx.x, y: mPx.y }) < SNAP_PX) {
      triggerUnlock()
      return
    }

    // Convert screen position to lat/lng for zone check
    if (map) {
      const ll = map.containerPointToLatLng([current.x, current.y])
      const lat = ll.lat as number
      const lng = ll.lng as number
      for (const [minLat, maxLat, minLng, maxLng, msg] of GEO_ZONES) {
        if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
          snapToBirmingham(msg)
          return
        }
      }
    }
    snapToBirmingham("Creative attempt. The destination is in India, not wherever that was.")
  }, [mumbaiPx, snapToBirmingham, triggerUnlock])

  return (
    <div className={`${styles.overlay} ${isUnlocking ? styles.overlayFadingOut : ''}`}>

      {/* Leaflet map — ESRI satellite + CartoDB labels */}
      <div ref={mapDivRef} className={styles.leafletMap} />

      {/* Deep warm cinematic vignette */}
      <div className={styles.mapVignette} aria-hidden="true" />

      {/* Film grain — luxury texture overlay */}
      <div ref={grainDivRef} className={styles.grainOverlay} aria-hidden="true" />

      {/* Floating gold particles */}
      <canvas ref={particlesCanvasRef} className={styles.particlesCanvas} aria-hidden="true" />

      {/* Origin dot — UK */}
      {mapReady && <BirminghamDot map={leafletRef.current} />}

      {/* Destination pulse — India */}
      {mapReady && <MumbaiDot mumbaiPx={mumbaiPx} />}

      {/* Draggable white airplane — transform-only positioning for GPU smoothness */}
      {mapReady && (
        <div
          className={`${styles.plane} ${isDragging ? styles.planeDragging : ''} ${isSnapping ? styles.planeSnapping : ''}`}
          style={{
            left: 0,
            top:  0,
            transform: `translate(${planePx.x}px, ${planePx.y}px) translate(-50%, -50%) rotate(${planeAngle}deg) ${isDragging ? 'scale(1.18)' : 'scale(1)'}`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <PlaneIcon />
        </div>
      )}

      {/* Unlock burst */}
      {burstPos && (
        <div
          className={styles.unlockBurst}
          style={{ left: burstPos.x, top: burstPos.y }}
          aria-hidden="true"
        />
      )}

      {/* Sarcastic message */}
      <div className={`${styles.messageCard} ${showMessage ? styles.messageCardVisible : ''}`}>
        <div className={styles.messageCardBar} />
        <div className={styles.messageCardBody}>
          <p className={styles.messageText}>{message}</p>
        </div>
      </div>

      {/* Success card */}
      <div className={`${styles.successCard} ${showSuccess ? styles.successCardVisible : ''}`}>
        {/* Airport photo — full-bleed top half */}
        <div style={{
          position: 'relative', width: '100%', height: 180,
          borderRadius: '16px 16px 0 0', overflow: 'hidden',
          marginBottom: 0,
        }}>
          <Image
            src="/images/gallery-airport.jpg"
            alt="Nidhi and Parag at Mumbai Airport"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 12%' }}
          />
          {/* subtle vignette bottom edge to blend into card body */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
            background: 'linear-gradient(to bottom, transparent, rgba(6,8,18,0.90))',
          }} />
          {/* Gold top rule */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
            background: 'linear-gradient(90deg, transparent, rgba(196,154,40,0.7), transparent)',
          }} />
        </div>
        <div style={{ padding: '18px 28px 20px' }}>
          <div className={styles.successTitle}>You found us.</div>
          <div className={styles.successSub}>Nidhi &amp; Parag &nbsp;·&nbsp; December 4, 2026</div>
        </div>
      </div>

      {/* "make it fly" hint pill */}
      <div
        className={styles.flyHint}
        style={{ opacity: showHint ? 1 : 0 }}
        aria-hidden="true"
      >
        make it fly
      </div>

      {/* Skip */}
      <button
        onClick={triggerUnlock}
        className={styles.skipButton}
        aria-label="Skip intro"
      >
        Skip
      </button>
    </div>
  )
}

// ── Sub-components for dots (client-side only, no SSR needed) ──

const CITY_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-cormorant), Georgia, serif',
  fontSize: 11, fontWeight: 300,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  textShadow: '0 1px 8px rgba(0,0,0,0.95)',
  lineHeight: 1.2,
}
const CITY_SUB_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
  fontSize: 8, fontWeight: 400,
  letterSpacing: '0.14em', textTransform: 'uppercase',
  marginTop: 2,
  textShadow: '0 1px 6px rgba(0,0,0,0.95)',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BirminghamDot({ map }: { map: any }) {
  const [px, setPx] = useState({ x: -100, y: -100 })
  useEffect(() => {
    if (!map) return
    const update = () => {
      const p = map.latLngToContainerPoint([BIRMINGHAM.lat, BIRMINGHAM.lng])
      setPx({ x: p.x, y: p.y })
    }
    update()
    map.on('move zoom zoomend moveend', update)
    return () => map.off('move zoom zoomend moveend', update)
  }, [map])

  return (
    <div style={{ position: 'absolute', left: px.x, top: px.y,
      transform: 'translate(-50%,-50%)', zIndex: 6, pointerEvents: 'none' }}>
      {/* Label above dot */}
      <div style={{ position: 'absolute', bottom: 14, left: '50%',
        transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
        <div style={{ ...CITY_LABEL_STYLE, color: 'rgba(255,253,246,0.70)' }}>Birmingham</div>
        <div style={{ ...CITY_SUB_STYLE, color: 'rgba(139,34,82,0.80)' }}>UK</div>
      </div>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: '#8B2252',
        boxShadow: '0 0 12px #8B225299, 0 0 3px rgba(0,0,0,0.8)',
        position: 'relative', zIndex: 2,
      }} />
    </div>
  )
}

function MumbaiDot({ mumbaiPx }: { mumbaiPx: { x: number; y: number } }) {
  return (
    <div style={{ position: 'absolute', left: mumbaiPx.x, top: mumbaiPx.y,
      transform: 'translate(-50%,-50%)', zIndex: 6, pointerEvents: 'none' }}>
      <div className={styles.pulseRing} style={{ color: '#C49A28' }} />
      <div className={styles.pulseRing} style={{ color: '#C49A28', animationDelay: '1.3s' }} />
      <div style={{
        width: 9, height: 9, borderRadius: '50%',
        background: '#C49A28',
        boxShadow: '0 0 16px #C49A28CC, 0 0 32px #C49A2844',
        position: 'relative', zIndex: 2,
      }} />
      {/* Label below dot */}
      <div style={{ position: 'absolute', top: 14, left: '50%',
        transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
        <div style={{ ...CITY_LABEL_STYLE, color: 'rgba(255,253,246,0.70)' }}>Mumbai</div>
        <div style={{ ...CITY_SUB_STYLE, color: 'rgba(196,154,40,0.80)' }}>India</div>
      </div>
    </div>
  )
}
