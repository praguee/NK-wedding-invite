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
  radius: 80,
  message: "Nidhi lives here! You need to drag the plane all the way to Mumbai! →",
}

const MUMBAI: CityZone = {
  name: 'Mumbai',
  lat: 19.076,
  lng: 72.877,
  color: '#fbbf24',
  label: 'Mumbai · Parag ✨',
  radius: 100,
}

// Ordered: specific cities first (small radius), then regions/countries (large radius)
// This ensures specific cities get their own message before a regional fallback catches them
const SARCASTIC_ZONES: CityZone[] = [
  // ── Specific cities ──
  { name: 'London',      lat: 51.5074,   lng: -0.1278,   color: '#fff', label: '', radius: 70,  message: "That's London! But Nidhi is from Birmingham, not London 😄 Look a bit further west!" },
  { name: 'Paris',       lat: 48.8566,   lng:  2.3522,   color: '#fff', label: '', radius: 70,  message: "Paris?! Très romantique — save that for the honeymoon 💕 The wedding is in Mumbai!" },
  { name: 'Madrid',      lat: 40.4168,   lng: -3.7038,   color: '#fff', label: '', radius: 70,  message: "Olé! But this is Madrid, not Mumbai. Head east, way east! 🇪🇸" },
  { name: 'Rome',        lat: 41.9028,   lng: 12.4964,   color: '#fff', label: '', radius: 70,  message: "When in Rome... but the wedding isn't here! Keep flying east 🍕" },
  { name: 'Istanbul',    lat: 41.0082,   lng: 28.9784,   color: '#fff', label: '', radius: 80,  message: "Istanbul? Halfway there! But the mandap is in Mumbai. Keep going east! 🕌" },
  { name: 'Dubai',       lat: 25.2048,   lng: 55.2708,   color: '#fff', label: '', radius: 80,  message: "Ooh, Dubai! Tempting… but the mandap is in Mumbai. Just a little further east! ✈️" },
  { name: 'Delhi',       lat: 28.6139,   lng: 77.2090,   color: '#fff', label: '', radius: 90,  message: "So close!! That's Delhi. Mumbai is just 1,400 km south. Almost there! 🎯" },
  { name: 'Karachi',     lat: 24.8607,   lng: 67.0011,   color: '#fff', label: '', radius: 80,  message: "Hmm, that's Karachi 👀 Mumbai is just across the border to the right →" },
  { name: 'Colombo',     lat:  6.9271,   lng: 79.8612,   color: '#fff', label: '', radius: 70,  message: "That's Sri Lanka! Beautiful island, but Mumbai is north of here ↑" },
  { name: 'Tokyo',       lat: 35.6762,   lng: 139.6503,  color: '#fff', label: '', radius: 90,  message: "Tokyo! Great sushi, wrong wedding venue 🍣 Mumbai is way west!" },
  { name: 'Beijing',     lat: 39.9042,   lng: 116.4074,  color: '#fff', label: '', radius: 90,  message: "That's Beijing! The Great Wall is impressive but the wedding isn't here 🐉" },
  { name: 'Bangkok',     lat: 13.7563,   lng: 100.5018,  color: '#fff', label: '', radius: 80,  message: "Bangkok? Lovely food, wrong destination! Mumbai is west of here ←" },
  { name: 'Singapore',   lat:  1.3521,   lng: 103.8198,  color: '#fff', label: '', radius: 80,  message: "Singapore! Clean streets, wrong country. Head way west to Mumbai! 🦁" },
  { name: 'Sydney',      lat: -33.8688,  lng: 151.2093,  color: '#fff', label: '', radius: 100, message: "You've overshot Mumbai by about 9,000 km 🦘 Come back! Way back!" },
  { name: 'Cairo',       lat: 30.0444,   lng: 31.2357,   color: '#fff', label: '', radius: 80,  message: "Cairo! The pyramids are magnificent but the wedding is in Mumbai, not Egypt 🐪" },
  { name: 'Nairobi',     lat: -1.2921,   lng: 36.8219,   color: '#fff', label: '', radius: 80,  message: "Nairobi? That's Kenya! Mumbai is across the ocean to the north-east 🦁" },
  { name: 'Moscow',      lat: 55.7558,   lng: 37.6173,   color: '#fff', label: '', radius: 90,  message: "Moscow! It's freezing there. Head south to Mumbai for a warmer welcome! 🥶" },
  { name: 'New York',    lat: 40.7128,   lng: -74.0060,  color: '#fff', label: '', radius: 100, message: "NEW YORK?! 😂 You've flown the completely wrong way. The wedding is in India, not America!" },
  { name: 'Los Angeles', lat: 34.0522,   lng: -118.2437, color: '#fff', label: '', radius: 100, message: "Los Angeles?! Hollywood isn't invited 🎬 Turn that plane around and head to Mumbai!" },
  { name: 'Mexico City', lat: 19.4326,   lng: -99.1332,  color: '#fff', label: '', radius: 90,  message: "México! Same latitude as Mumbai but 15,000 km in the wrong direction 🌮" },
  { name: 'Bogota',      lat:  4.7110,   lng: -74.0721,  color: '#fff', label: '', radius: 90,  message: "Colombia! Beautiful coffee, wrong destination. Mumbai is east, very east ☕" },
  { name: 'Buenos Aires',lat: -34.6037,  lng: -58.3816,  color: '#fff', label: '', radius: 100, message: "Buenos Aires?! You've gone to the bottom of South America 🥩 Mumbai is on the other side of the planet!" },
  { name: 'Sao Paulo',   lat: -23.5505,  lng: -46.6333,  color: '#fff', label: '', radius: 100, message: "Brazil! 🌴 Wrong hemisphere entirely. The wedding is in Mumbai, not South America!" },
  { name: 'Reykjavik',   lat: 64.1466,   lng: -21.9426,  color: '#fff', label: '', radius: 80,  message: "Iceland?! 🌋 It's beautiful but quite far from Mumbai. Head south-east — a lot south-east!" },

  // ── Countries / large regions (checked after cities) ──
  { name: 'Russia',      lat: 61.5240,   lng: 105.3188,  color: '#fff', label: '', radius: 500, message: "That's Russia! Massive country but Mumbai is to the south. Way south. 🐻" },
  { name: 'Canada',      lat: 56.1304,   lng: -106.3468, color: '#fff', label: '', radius: 400, message: "Canada! Lovely maple syrup, wrong side of the planet 🍁 Mumbai is east, very east!" },
  { name: 'USA',         lat: 37.0902,   lng: -95.7129,  color: '#fff', label: '', radius: 380, message: "United States! Great country but the wedding is in India, not America 🦅" },
  { name: 'China',       lat: 35.8617,   lng: 104.1954,  color: '#fff', label: '', radius: 280, message: "China! Interesting choice but Mumbai is to the south-west 🐼 Keep looking!" },
  { name: 'Australia',   lat: -25.2744,  lng: 133.7751,  color: '#fff', label: '', radius: 350, message: "Australia! Land of kangaroos and 9,000 km from Mumbai 🦘 Wrong direction!" },
  { name: 'Brazil',      lat: -14.2350,  lng: -51.9253,  color: '#fff', label: '', radius: 320, message: "Brazil! 🎉 The carnival is fun but the wedding celebration is in Mumbai!" },
  { name: 'Africa',      lat:  8.7832,   lng: 34.5085,   color: '#fff', label: '', radius: 350, message: "That's Africa! Mumbai is across the Indian Ocean to the north-east 🌍" },
  { name: 'Greenland',   lat: 71.7069,   lng: -42.6043,  color: '#fff', label: '', radius: 250, message: "Greenland! It's actually mostly ice 🧊 And nowhere near Mumbai. Try heading east and south!" },
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

  const [planePos, setPlanePos] = useState({ x: 0, y: 0 })
  const [planePosReady, setPlanePosReady] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [planeAngle, setPlaneAngle] = useState(45)
  const [isSnapping, setIsSnapping] = useState(false)

  const [birminghamPos, setBirminghamPos] = useState({ x: 0, y: 0 })
  const [mumbaiPos, setMumbaiPos] = useState({ x: 0, y: 0 })

  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const birminghamPosRef = useRef({ x: 0, y: 0 })
  const mumbaiPosRef = useRef({ x: 0, y: 0 })
  const sarcasticPositionsRef = useRef<{ x: number; y: number }[]>([])

  const updateCityPositions = useCallback(() => {
    if (!mapRef.current || !leafletRef.current) return
    const L = leafletRef.current
    const map = mapRef.current
    const bPt = map.latLngToContainerPoint(L.latLng(BIRMINGHAM.lat, BIRMINGHAM.lng))
    const mPt = map.latLngToContainerPoint(L.latLng(MUMBAI.lat, MUMBAI.lng))
    const bPos = { x: bPt.x, y: bPt.y }
    const mPos = { x: mPt.x, y: mPt.y }
    birminghamPosRef.current = bPos
    mumbaiPosRef.current = mPos
    setBirminghamPos(bPos)
    setMumbaiPos(mPos)
    sarcasticPositionsRef.current = SARCASTIC_ZONES.map(z => {
      const p = map.latLngToContainerPoint(L.latLng(z.lat, z.lng))
      return { x: p.x, y: p.y }
    })
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    import('leaflet').then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (mod.default ?? mod) as any
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' })
      leafletRef.current = L

      const isMobile = window.innerWidth < 768
      const map = L.map(mapContainerRef.current!, {
        center: isMobile ? [30, 40] : [35, 35],
        zoom: isMobile ? 1 : 2,
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
        const startPos = { x: bPt.x, y: bPt.y }
        birminghamPosRef.current = startPos
        setPlanePos(startPos)
        setPlanePosReady(true)
      })

      map.on('resize', updateCityPositions)
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [updateCityPositions])

  useEffect(() => {
    const onResize = () => updateCityPositions()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [updateCityPositions])

  const showSarcasticMessage = useCallback((msg: string) => {
    setMessage(msg)
    setShowMessage(true)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    messageTimerRef.current = setTimeout(() => setShowMessage(false), 4000)
  }, [])

  const snapToCity = useCallback((pos: { x: number; y: number }, msg?: string) => {
    setIsSnapping(true)
    setPlanePos(pos)
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
      const sp = sarcasticPositionsRef.current

      // Mumbai — unlock!
      if (dist(current, mp) < MUMBAI.radius) {
        setTimeout(() => triggerUnlock(), 0)
        return current
      }

      // Birmingham — snap back with hint
      if (dist(current, bp) < BIRMINGHAM.radius) {
        setTimeout(() => snapToCity(bp, BIRMINGHAM.message), 0)
        return current
      }

      // "Parag → Birmingham" — dragged westward past Mumbai toward UK
      const isDraggingTowardBirmingham =
        current.x < mp.x - 100 && Math.abs(current.y - mp.y) < 150
      if (isDraggingTowardBirmingham) {
        setTimeout(() => snapToCity(bp, "Parag going to Birmingham?! He doesn't have a flight ticket yet 😂 The wedding is in Mumbai, not Birmingham!"), 0)
        return current
      }

      // Check sarcastic zones (specific cities first, then large regions)
      for (let i = 0; i < SARCASTIC_ZONES.length; i++) {
        const zp = sp[i]
        if (zp && dist(current, zp) < SARCASTIC_ZONES[i].radius) {
          setTimeout(() => snapToCity(bp, SARCASTIC_ZONES[i].message), 0)
          return current
        }
      }

      // Nowhere special — snap back
      setTimeout(() => snapToCity(bp), 0)
      return current
    })
  }, [isDragging, snapToCity, triggerUnlock])

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
