'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import styles from './IntroScreen.module.css'

interface IntroScreenProps {
  onUnlock: () => void
}

const BIRMINGHAM = { lat: 52.4862, lng: -1.8904, color: '#8B2252', radius: 90  }
const MUMBAI     = { lat: 19.076,  lng: 72.877,  color: '#C49A28', radius: 110 }

// Geographic zones — no emojis, sharper sarcasm
const GEO_ZONES: [number, number, number, number, string][] = [
  [49, 60,  -10, 3,    "Still in the UK. Nidhi lives here, not the wedding. Head east."],
  [36, 72,  -10, 25,   "Europe. Lovely. The wedding is 7,000 km further east."],
  [60, 85, -80, -10,   "This is ice. Nothing marries here in December. Turn around."],
  [45, 82,  25, 180,   "Russia. Vast, cold, and not where anyone is getting married."],
  [12, 42,  35, 65,    "Middle East. Getting warmer — Mumbai is further east and south."],
  [20, 36,  60, 74,    "Pakistan. One border east and you're there. So close."],
  [26, 34,  74, 82,    "North India. Very close. Drop 1,400 km south and you've got it."],
  [ 5, 20,  73, 82,    "India, but overshot south. Mumbai is north of here."],
  [18, 55,  73, 145,   "East Asia. Great Wall, wrong wedding."],
  [-10, 28, 90, 145,   "South East Asia. Excellent beaches, completely wrong country."],
  [30, 46, 128, 148,   "Tokyo. Excellent sushi. Wrong continent entirely."],
  [-50, -10, 110, 180, "Australia. You've overshot Mumbai by roughly 9,000 km."],
  [18, 38,  -5, 40,    "Egypt. The pyramids are magnificent. The wedding isn't here."],
  [-35, 18, -20, 55,   "Africa. Cross the Indian Ocean north-east and you'll find Mumbai."],
  [10, 85, -170, -50,  "Wrong continent. This is North America. India is east — very east."],
  [-60, 15, -85, -30,  "South America. You're somehow on the wrong side of the planet."],
  [-60, 60, -180, -100,"The Pacific Ocean. Nothing here but water. Head west."],
  [-40, 25, 40, 100,   "Indian Ocean. You're close — Mumbai is north-east from here."],
  [-60, 70, -60, -5,   "The Atlantic. Keep flying east. Mumbai is a long way from here."],
]

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// Elegant SVG location pin — teardrop pointing down
function LocationPin({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 28 38" width="22" height="30" aria-hidden="true">
      <path
        d="M14 1C8.477 1 4 5.477 4 11c0 7.333 10 26 10 26S24 18.333 24 11c0-5.523-4.477-10-10-10z"
        fill={color}
        opacity="0.95"
      />
      <circle cx="14" cy="11" r="4.5" fill="rgba(0,0,0,0.28)" />
      <circle cx="14" cy="11" r="2.5" fill="rgba(255,255,255,0.18)" />
    </svg>
  )
}

// Realistic top-down aircraft SVG pointing north (up)
function AircraftIcon() {
  return (
    <svg viewBox="0 0 40 52" width="40" height="52" aria-hidden="true" fill="#C49A28">
      {/* Fuselage */}
      <ellipse cx="20" cy="26" rx="3.5" ry="22" />
      {/* Nose cone */}
      <path d="M16.5 6 C16.5 2 17.5 0 20 0 C22.5 0 23.5 2 23.5 6 Z" />
      {/* Right wing — swept back */}
      <path d="M23 18 L39 30 L37 34 L23 24 Z" />
      {/* Left wing — swept back */}
      <path d="M17 18 L1 30 L3 34 L17 24 Z" />
      {/* Right horizontal stabilizer */}
      <path d="M23 40 L33 46 L32 48.5 L23 44 Z" />
      {/* Left horizontal stabilizer */}
      <path d="M17 40 L7 46 L8 48.5 L17 44 Z" />
      {/* Cockpit glint */}
      <ellipse cx="20" cy="8" rx="1.8" ry="3" fill="rgba(255,220,120,0.35)" />
    </svg>
  )
}

export default function IntroScreen({ onUnlock }: IntroScreenProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef = useRef<any>(null)

  const [planePos, setPlanePos]           = useState({ x: 0, y: 0 })
  const [planePosReady, setPlanePosReady] = useState(false)
  const [isDragging, setIsDragging]       = useState(false)
  const [planeAngle, setPlaneAngle]       = useState(45)
  const [isSnapping, setIsSnapping]       = useState(false)

  const [birminghamPos, setBirminghamPos] = useState({ x: 0, y: 0 })
  const [mumbaiPos, setMumbaiPos]         = useState({ x: 0, y: 0 })

  const [message, setMessage]           = useState('')
  const [showMessage, setShowMessage]   = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const [showSuccess, setShowSuccess]   = useState(false)
  const [burstPos, setBurstPos]         = useState<{ x: number; y: number } | null>(null)
  const [isUnlocking, setIsUnlocking]   = useState(false)

  const messageTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPosRef       = useRef({ x: 0, y: 0 })
  const birminghamPosRef = useRef({ x: 0, y: 0 })
  const mumbaiPosRef     = useRef({ x: 0, y: 0 })

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

      // Dark Matter tiles — cinematic, matches EarthIntro
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map

      const bounds = L.latLngBounds(
        [MUMBAI.lat - 5,    BIRMINGHAM.lng - 18],
        [BIRMINGHAM.lat + 2, MUMBAI.lng  + 14]
      )

      const getPadding = () => {
        const portrait = window.innerHeight > window.innerWidth
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

          let direction = 1
          const breathe = () => {
            if (!mapRef.current) return
            const base   = mapRef.current.getBoundsZoom(bounds, false, [getPadding()[1], getPadding()[0]])
            const target = base + direction * 0.12
            mapRef.current.setZoom(target, { animate: true, duration: 9 })
            direction *= -1
            setTimeout(breathe, 10000)
          }
          setTimeout(breathe, 2000)
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
    messageTimerRef.current = setTimeout(() => setShowMessage(false), 4200)
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
      }, 1800)
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

      if (dist(current, mp) < MUMBAI.radius) {
        setTimeout(() => triggerUnlock(), 0)
        return current
      }

      if (dist(current, bp) < BIRMINGHAM.radius) {
        setTimeout(() => snapToBirmingham("That's Birmingham — where Nidhi is studying. Mumbai is where the wedding is."), 0)
        return current
      }

      if (mapRef.current && leafletRef.current) {
        const L   = leafletRef.current
        const map = mapRef.current
        try {
          const ll  = map.containerPointToLatLng(L.point(current.x, current.y))
          const lat = ll.lat
          const lng = ll.lng
          for (const [minLat, maxLat, minLng, maxLng, msg] of GEO_ZONES) {
            if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
              setTimeout(() => snapToBirmingham(msg), 0)
              return current
            }
          }
        } catch {
          // fall through
        }
      }

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
    const pathD = `M ${bx} ${by} Q ${cpx} ${cpy} ${mx} ${my}`

    return (
      <svg className={styles.flightPath}>
        <defs>
          <filter id="arc-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Static dashed route */}
        <path
          d={pathD}
          stroke="rgba(196,154,40,0.15)"
          strokeWidth="1"
          strokeDasharray="3 8"
          fill="none"
        />

        {/* Animated glowing pulse travelling the route */}
        <path
          d={pathD}
          stroke="rgba(196,154,40,0.55)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="50 9999"
          filter="url(#arc-glow)"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="50"
            to="-9999"
            dur="5.5s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </path>

        {/* Ghost plane flying the route */}
        <g filter="url(#arc-glow)" opacity="0.4">
          <animateMotion
            dur="5.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.4 0 0.6 1"
            rotate="auto"
          >
            <mpath href="#arc-path-ref" />
          </animateMotion>
          <path d="M0,-6 L2.5,3 L0,1 L-2.5,3 Z" fill="#C49A28" transform="scale(1.3)" />
        </g>

        <path id="arc-path-ref" d={pathD} fill="none" stroke="none" />
      </svg>
    )
  }

  return (
    <div className={`${styles.overlay} ${isUnlocking ? styles.overlayFadingOut : ''}`}>
      {/* Leaflet map */}
      <div ref={mapContainerRef} className={styles.mapContainer} />

      {/* Radial vignette */}
      <div className={styles.mapOverlay} />

      {/* Flight arc */}
      {renderFlightArc()}

      {/* ── Birmingham marker ── */}
      {planePosReady && (
        <div
          style={{
            position: 'absolute',
            left: birminghamPos.x,
            top: birminghamPos.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            marginTop: -6,
          }}
        >
          {/* Label */}
          <div className={styles.cityLabel} style={{ marginBottom: 6, borderColor: `${BIRMINGHAM.color}40` }}>
            <span className={styles.cityLabelName}>Birmingham</span>
            Nidhi
          </div>
          {/* Pin */}
          <div style={{ filter: `drop-shadow(0 0 10px ${BIRMINGHAM.color}88)` }}>
            <LocationPin color={BIRMINGHAM.color} />
          </div>
        </div>
      )}
      {/* Birmingham dot */}
      {planePosReady && (
        <div style={{
          position: 'absolute', left: birminghamPos.x, top: birminghamPos.y,
          transform: 'translate(-50%,-50%)', zIndex: 8, pointerEvents: 'none',
        }}>
          <div className={styles.pulseRing} style={{ color: BIRMINGHAM.color }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: BIRMINGHAM.color, boxShadow: `0 0 10px ${BIRMINGHAM.color}`, position: 'relative', zIndex: 2 }} />
        </div>
      )}

      {/* ── Mumbai marker ── */}
      {planePosReady && (
        <div
          style={{
            position: 'absolute',
            left: mumbaiPos.x,
            top: mumbaiPos.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            marginTop: -6,
          }}
        >
          <div className={styles.cityLabel} style={{ marginBottom: 6, borderColor: `${MUMBAI.color}40` }}>
            <span className={styles.cityLabelName}>Mumbai</span>
            Parag
          </div>
          <div style={{ filter: `drop-shadow(0 0 10px ${MUMBAI.color}88)` }}>
            <LocationPin color={MUMBAI.color} />
          </div>
        </div>
      )}
      {/* Mumbai dot */}
      {planePosReady && (
        <div style={{
          position: 'absolute', left: mumbaiPos.x, top: mumbaiPos.y,
          transform: 'translate(-50%,-50%)', zIndex: 8, pointerEvents: 'none',
        }}>
          <div className={styles.pulseRing} style={{ color: MUMBAI.color }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: MUMBAI.color, boxShadow: `0 0 10px ${MUMBAI.color}`, position: 'relative', zIndex: 2 }} />
        </div>
      )}

      {/* ── Draggable aircraft ── */}
      {planePosReady && (
        <div
          className={`${styles.airplane} ${isDragging ? styles.airplaneDragging : ''} ${isSnapping ? styles.airplaneSnapping : ''}`}
          style={{
            left: planePos.x,
            top: planePos.y,
            transform: `translate(-50%, -50%) rotate(${planeAngle}deg) ${isDragging ? 'scale(1.15)' : ''}`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <AircraftIcon />
        </div>
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
        {/* Couple Bitmoji — slightly larger, gold glow behind */}
        <div style={{
          position: 'relative', width: 110, height: 90, margin: '0 auto 16px',
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 0 40px rgba(196,154,40,0.22), 0 8px 24px rgba(0,0,0,0.4)',
          border: '1px solid rgba(196,154,40,0.22)',
        }}>
          <Image
            src="/images/couple-avatar.png"
            alt="Nidhi and Parag"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
          />
        </div>
        <div className={styles.successTitle}>You found us.</div>
        <div className={styles.successSub}>Nidhi &amp; Parag &nbsp;·&nbsp; December 4, 2026</div>
      </div>

      {/* Instruction bar */}
      <div className={`${styles.instructionBar} ${!showInstruction ? styles.instructionBarHidden : ''}`}>
        {/* Inline aircraft SVG icon */}
        <svg viewBox="0 0 40 52" width="11" height="14" fill="currentColor" aria-hidden="true" style={{ transform: 'rotate(90deg)', opacity: 0.6, flexShrink: 0 }}>
          <ellipse cx="20" cy="26" rx="3.5" ry="22" />
          <path d="M16.5 6 C16.5 2 17.5 0 20 0 C22.5 0 23.5 2 23.5 6 Z" />
          <path d="M23 18 L39 30 L37 34 L23 24 Z" />
          <path d="M17 18 L1 30 L3 34 L17 24 Z" />
          <path d="M23 40 L33 46 L32 48.5 L23 44 Z" />
          <path d="M17 40 L7 46 L8 48.5 L17 44 Z" />
        </svg>
        Drag the plane to Mumbai
      </div>

      {/* Skip — top right, subtle */}
      <button
        onClick={triggerUnlock}
        className={styles.skipButton}
        aria-label="Skip intro and go to invitation"
      >
        Skip
      </button>
    </div>
  )
}
