'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './IntroScreen.module.css'

interface IntroScreenProps {
  onUnlock: () => void
}

interface CityZone {
  name: string
  lat: number
  lng: number
  color: string
  label: string
  radius: number
  message?: string
}

const BIRMINGHAM: CityZone = {
  name: 'Birmingham',
  lat: 52.4862,
  lng: -1.8904,
  color: '#fb7185',
  label: 'Birmingham · Nidhi 💙',
  radius: 50,
  message: 'Nidhi is waiting here! Drag the plane east toward Mumbai! →',
}

const MUMBAI: CityZone = {
  name: 'Mumbai',
  lat: 19.076,
  lng: 72.877,
  color: '#fbbf24',
  label: 'Mumbai · Parag ✨',
  radius: 60,
}

const SARCASTIC_ZONES: CityZone[] = [
  { name: 'London',   lat: 51.5074,  lng: -0.1278,   color: '#fff', label: '', radius: 55, message: "That's London! Nidhi actually moved to Birmingham 😄 Try a bit north-west!" },
  { name: 'Paris',    lat: 48.8566,  lng:  2.3522,   color: '#fff', label: '', radius: 55, message: "Paris?! Très romantique — save that for the honeymoon 💕 The wedding is in Mumbai!" },
  { name: 'Dubai',    lat: 25.2048,  lng: 55.2708,   color: '#fff', label: '', radius: 60, message: "Ooh, Dubai! Tempting… but the mandap is in Mumbai. Just a little further east! ✈️" },
  { name: 'Delhi',    lat: 28.6139,  lng: 77.2090,   color: '#fff', label: '', radius: 60, message: "So close!! That's Delhi. Mumbai is just 1,400 km south. Almost there! 🎯" },
  { name: 'Karachi',  lat: 24.8607,  lng: 67.0011,   color: '#fff', label: '', radius: 55, message: "Hmm, that's Karachi 👀 Mumbai is just across the border to the right →" },
  { name: 'New York', lat: 40.7128,  lng: -74.0060,  color: '#fff', label: '', radius: 70, message: "WRONG DIRECTION 😂 You've flown the wrong way across the planet. Turn around!" },
  { name: 'Sydney',   lat: -33.8688, lng: 151.2093,  color: '#fff', label: '', radius: 70, message: "You've overshot Mumbai by about 9,000 km 🦘 Come back!" },
  { name: 'Tokyo',    lat: 35.6762,  lng: 139.6503,  color: '#fff', label: '', radius: 65, message: "Tokyo! Great sushi, wrong wedding venue 🍣 Mumbai is way west!" },
]

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export default function IntroScreen({ onUnlock }: IntroScreenProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)

  const [planePos, setPlanePos] = useState({ x: 0, y: 0 })
  const [planePosReady, setPlanePosReady] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [planeAngle, setPlaneAngle] = useState(45)
  const [isSnapping, setIsSnapping] = useState(false)

  const [birminghamPos, setBirminghamPos] = useState({ x: 0, y: 0 })
  const [mumbaiPos, setMumbaiPos] = useState({ x: 0, y: 0 })
  const [sarcasticPositions, setSarcasticPositions] = useState<{ x: number; y: number }[]>([])

  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const updateCityPositions = useCallback(() => {
    if (!mapRef.current || !leafletRef.current) return
    const L = leafletRef.current
    const map = mapRef.current
    const bPt = map.latLngToContainerPoint(L.latLng(BIRMINGHAM.lat, BIRMINGHAM.lng))
    const mPt = map.latLngToContainerPoint(L.latLng(MUMBAI.lat, MUMBAI.lng))
    setBirminghamPos({ x: bPt.x, y: bPt.y })
    setMumbaiPos({ x: mPt.x, y: mPt.y })
    setSarcasticPositions(
      SARCASTIC_ZONES.map(z => {
        const p = map.latLngToContainerPoint(L.latLng(z.lat, z.lng))
        return { x: p.x, y: p.y }
      })
    )
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    import('leaflet').then((mod) => {
      const L = (mod.default ?? mod) as any
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' })
      leafletRef.current = L

      const map = L.map(mapContainerRef.current!, {
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

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map

      map.whenReady(() => {
        updateCityPositions()
        const bPt = map.latLngToContainerPoint(L.latLng(BIRMINGHAM.lat, BIRMINGHAM.lng))
        setPlanePos({ x: bPt.x, y: bPt.y })
        setPlanePosReady(true)
      })

      map.on('resize', updateCityPositions)
    })

    return () => {
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
    messageTimerRef.current = setTimeout(() => setShowMessage(false), 3500)
  }, [])

  const snapToCity = useCallback((pos: { x: number; y: number }, msg?: string) => {
    setIsSnapping(true)
    setPlanePos(pos)
    setTimeout(() => setIsSnapping(false), 350)
    if (msg) showSarcasticMessage(msg)
    setShowInstruction(true)
  }, [showSarcasticMessage])

  // Capture mumbaiPos in a ref so triggerUnlock always uses the latest value
  const mumbaiPosRef = useRef(mumbaiPos)
  useEffect(() => { mumbaiPosRef.current = mumbaiPos }, [mumbaiPos])

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

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)

    // Use functional updater to read latest planePos
    setPlanePos(current => {
      // Mumbai check
      if (dist(current, mumbaiPosRef.current) < MUMBAI.radius) {
        setTimeout(() => triggerUnlock(), 0)
        return current
      }
      // Birmingham check
      if (dist(current, birminghamPos) < BIRMINGHAM.radius) {
        setTimeout(() => snapToCity(birminghamPos, BIRMINGHAM.message), 0)
        return current
      }
      // Parag → Birmingham direction (westward near Mumbai latitude)
      if (Math.abs(e.clientY - mumbaiPosRef.current.y) < 80 && e.clientX < mumbaiPosRef.current.x - 60) {
        setTimeout(() => snapToCity(birminghamPos, "Parag going to Birmingham?! He doesn't have a flight ticket yet 😂 The wedding is in Mumbai, not Birmingham!"), 0)
        return current
      }
      // Sarcastic zones
      for (let i = 0; i < SARCASTIC_ZONES.length; i++) {
        const zp = sarcasticPositions[i]
        if (zp && dist(current, zp) < SARCASTIC_ZONES[i].radius) {
          setTimeout(() => snapToCity(birminghamPos, SARCASTIC_ZONES[i].message), 0)
          return current
        }
      }
      // No zone — snap back silently
      setTimeout(() => snapToCity(birminghamPos), 0)
      return current
    })
  }, [isDragging, birminghamPos, sarcasticPositions, snapToCity, triggerUnlock])

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
            transform: `translate(-50%, -50%) rotate(${planeAngle}deg) ${isDragging ? 'scale(1.15)' : ''}`,
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
        <div
          className={styles.unlockBurst}
          style={{ left: burstPos.x, top: burstPos.y }}
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
  )
}
