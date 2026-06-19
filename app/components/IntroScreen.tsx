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
  [49, 85,  -10,   3,   "Back to the start. Destination is east."],
  [36, 72,  -10,  22,   "Still in Europe. Much further east."],
  [60, 85, -100, -10,   "That's the Arctic. Turn around."],
  [45, 85,   22, 180,   "Too far north. Head south-east."],
  [10, 42,   35,  62,   "Getting closer. Keep going east and south."],
  [20, 36,   60,  73,   "Very close. One more push east."],
  [26, 34,   74,  82,   "Almost. Drop about 1,400 km south."],
  [ 5, 20,   73,  82,   "Overshot south. Come back north."],
  [18, 55,   82, 145,   "Too far east. Come back west."],
  [-20, 28,  90, 145,   "Past it. Head west."],
  [-60, 18, -20,  55,   "Wrong continent. Try the other direction."],
  [-60, 60, -180, -50,  "Wrong side of the planet."],
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
  const mapDivRef   = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef  = useRef<any>(null)

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
        // Show hint immediately after map is ready — visible for 4s
        setShowHint(true)
        hintTimerRef.current = setTimeout(() => setShowHint(false), 4000)
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
    // Prevent map from panning or pinch-zooming while plane is grabbed
    leafletRef.current?.dragging.disable()
    leafletRef.current?.touchZoom.disable()
    leafletRef.current?.scrollWheelZoom.disable()
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
    leafletRef.current?.dragging.enable()
    leafletRef.current?.touchZoom.enable()
    leafletRef.current?.scrollWheelZoom.enable()

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
    snapToBirmingham()
  }, [mumbaiPx, snapToBirmingham, triggerUnlock])

  return (
    <div className={`${styles.overlay} ${isUnlocking ? styles.overlayFadingOut : ''}`}>

      {/* Leaflet map — ESRI satellite + CartoDB labels */}
      <div ref={mapDivRef} className={styles.leafletMap} />

      {/* Dark vignette over the map */}
      <div className={styles.mapVignette} aria-hidden="true" />

      {/* Origin dot — UK */}
      {mapReady && <BirminghamDot map={leafletRef.current} />}

      {/* Destination pulse — India */}
      {mapReady && <MumbaiDot mumbaiPx={mumbaiPx} />}

      {/* Draggable white airplane */}
      {mapReady && (
        <div
          className={`${styles.plane} ${isDragging ? styles.planeDragging : ''} ${isSnapping ? styles.planeSnapping : ''}`}
          style={{
            left: planePx.x,
            top:  planePx.y,
            transform: `translate(-50%, -50%) rotate(${planeAngle}deg) ${isDragging ? 'scale(1.15)' : ''}`,
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
        <div style={{
          position: 'relative', width: 110, height: 90, margin: '0 auto 16px',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 0 40px rgba(196,154,40,0.22), 0 8px 24px rgba(0,0,0,0.4)',
          border: '1px solid rgba(196,154,40,0.22)',
        }}>
          <Image src="/images/couple-avatar.png" alt="Nidhi and Parag" fill
            style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
        </div>
        <div className={styles.successTitle}>You found us.</div>
        <div className={styles.successSub}>Nidhi &amp; Parag &nbsp;·&nbsp; December 4, 2026</div>
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
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: '#8B2252',
        boxShadow: '0 0 10px #8B225299, 0 0 3px rgba(0,0,0,0.8)',
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
    </div>
  )
}
