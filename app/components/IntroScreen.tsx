'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import styles from './IntroScreen.module.css'

interface IntroScreenProps {
  onUnlock: () => void
}

// Map bounds — adjusted so Birmingham sits ~18% from left, Mumbai ~82% from right
// giving a clear diagonal flight path with breathing room on both sides
const MAP_BOUNDS = {
  minLng: -25,
  maxLng: 95,
  minLat:   3,
  maxLat:  65,
}

const BIRMINGHAM = { lat: 52.4862, lng: -1.8904, color: '#8B2252', radius: 72  }
const MUMBAI     = { lat: 19.0760, lng: 72.8770, color: '#C49A28', radius: 100 }

// Directional sarcasm — no city or person names
const GEO_ZONES: [number, number, number, number, string][] = [
  [49, 60,  -10,  3,    "Back to the start. The destination is east."],
  [36, 72,  -10, 25,    "Still in Europe. Much further east."],
  [60, 85,  -80, -10,   "Ice and nothing. Turn around."],
  [45, 82,   25, 180,   "Too far north. Head south and east."],
  [12, 42,   35, 65,    "Getting closer. Keep flying east and south."],
  [20, 36,   60, 74,    "Very close. One more push east."],
  [26, 34,   74, 82,    "Almost. Drop 1,400 km south."],
  [ 5, 20,   73, 82,    "Overshot south. Come back north."],
  [18, 55,   73, 145,   "Too far east. Come back west."],
  [-10, 28,  90, 145,   "Past it. Head west."],
  [30, 46,  128, 148,   "Way too far east. Turn around."],
  [-50, -10, 110, 180,  "Way off course. Come back."],
  [18, 38,   -5,  40,   "Wrong direction. Turn east."],
  [-35, 18,  -20,  55,  "Off route completely. Head north-east."],
  [10, 85,  -170, -50,  "Wrong continent. Try the other way."],
  [-60, 15,  -85, -30,  "Wrong side of the planet entirely."],
  [-60, 60, -180, -100, "Open ocean. Nothing here."],
  [-40, 25,   40, 100,  "Over the ocean. Destination is north-east."],
  [-60, 70,  -60,  -5,  "Over water. Keep flying east."],
]

function latLngToScreen(lat: number, lng: number, W: number, H: number) {
  const xFrac = (lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)
  const yFrac = (MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)
  return { x: xFrac * W, y: yFrac * H }
}

function screenToLatLng(x: number, y: number, W: number, H: number) {
  const lng = MAP_BOUNDS.minLng + (x / W) * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)
  const lat = MAP_BOUNDS.maxLat - (y / H) * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)
  return { lat, lng }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// Realistic top-down commercial aircraft — with engine nacelles and cockpit glint
function AircraftIcon() {
  return (
    <svg viewBox="0 0 32 48" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Fuselage */}
      <path
        d="M16 2C17.5 7 18.5 14 18.5 21L18.5 37C18.5 42 17.5 45.5 16 47.5C14.5 45.5 13.5 42 13.5 37L13.5 21C13.5 14 14.5 7 16 2Z"
        fill="#C49A28"
      />
      {/* Right wing — swept back */}
      <path d="M18.5 18L32 29L30.5 33L18.5 24Z" fill="#C49A28" />
      {/* Left wing */}
      <path d="M13.5 18L0 29L1.5 33L13.5 24Z" fill="#C49A28" />
      {/* Right engine nacelle */}
      <ellipse cx="26.5" cy="27" rx="2.8" ry="4.2" fill="#A07820" />
      <ellipse cx="26.5" cy="24.8" rx="1.8" ry="1.2" fill="#C49A28" opacity="0.6" />
      {/* Left engine nacelle */}
      <ellipse cx="5.5" cy="27" rx="2.8" ry="4.2" fill="#A07820" />
      <ellipse cx="5.5" cy="24.8" rx="1.8" ry="1.2" fill="#C49A28" opacity="0.6" />
      {/* Right horizontal stabilizer */}
      <path d="M18.5 37L27 42L26 44.5L18.5 40.5Z" fill="#C49A28" />
      {/* Left horizontal stabilizer */}
      <path d="M13.5 37L5 42L6 44.5L13.5 40.5Z" fill="#C49A28" />
      {/* Cockpit window glint */}
      <ellipse cx="16" cy="7" rx="1.6" ry="2.8" fill="rgba(255,240,160,0.45)" />
    </svg>
  )
}

export default function IntroScreen({ onUnlock }: IntroScreenProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imgRef       = useRef<HTMLImageElement | null>(null)

  const [planePos, setPlanePos]           = useState({ x: 0, y: 0 })
  const [planePosReady, setPlanePosReady] = useState(false)
  const [isDragging, setIsDragging]       = useState(false)
  const [planeAngle, setPlaneAngle]       = useState(45)
  const [isSnapping, setIsSnapping]       = useState(false)

  const [birminghamPos, setBirminghamPos] = useState({ x: 0, y: 0 })
  const [mumbaiPos, setMumbaiPos]         = useState({ x: 0, y: 0 })

  const [message, setMessage]         = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showHint, setShowHint]       = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [burstPos, setBurstPos]       = useState<{ x: number; y: number } | null>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const messageTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hintTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPosRef       = useRef({ x: 0, y: 0 })
  const birminghamPosRef = useRef({ x: 0, y: 0 })
  const mumbaiPosRef     = useRef({ x: 0, y: 0 })

  // Draw the map — no ctx.filter (Safari/iOS 16 doesn't support it)
  // CSS filter applied to the canvas element instead
  const drawMap = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W   = window.innerWidth
    const H   = window.innerHeight

    canvas.width        = W * dpr
    canvas.height       = H * dpr
    canvas.style.width  = `${W}px`
    canvas.style.height = `${H}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    // earth-map.jpg is 2048×1024 equirectangular, cloud-free NASA topo
    const TEX_W = 2048, TEX_H = 1024
    const srcX = (MAP_BOUNDS.minLng + 180) / 360 * TEX_W
    const srcW = (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng) / 360 * TEX_W
    const srcY = (90 - MAP_BOUNDS.maxLat) / 180 * TEX_H
    const srcH = (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) / 180 * TEX_H

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, W, H)
  }, [])

  const updatePositions = useCallback(() => {
    const W = window.innerWidth
    const H = window.innerHeight
    const b = latLngToScreen(BIRMINGHAM.lat, BIRMINGHAM.lng, W, H)
    const m = latLngToScreen(MUMBAI.lat, MUMBAI.lng, W, H)
    birminghamPosRef.current = b
    mumbaiPosRef.current     = m
    setBirminghamPos(b)
    setMumbaiPos(m)
    return { b, m }
  }, [])

  useEffect(() => {
    const img = new window.Image()
    imgRef.current = img
    // Cloud-free NASA physical map texture
    img.src = '/images/earth-map.jpg'
    img.onload = () => {
      drawMap(img)
      const { b } = updatePositions()
      setPlanePos(b)
      setPlanePosReady(true)

      hintTimerRef.current = setTimeout(() => {
        setShowHint(true)
        hintTimerRef.current = setTimeout(() => setShowHint(false), 3200)
      }, 1400)
    }

    const onResize = () => {
      if (imgRef.current?.complete) drawMap(imgRef.current)
      updatePositions()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    }
  }, [drawMap, updatePositions])

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
    setShowHint(false)
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
        setTimeout(() => snapToBirmingham("Back to the start. The destination is east."), 0)
        return current
      }

      const W = window.innerWidth, H = window.innerHeight
      const { lat, lng } = screenToLatLng(current.x, current.y, W, H)
      for (const [minLat, maxLat, minLng, maxLng, msg] of GEO_ZONES) {
        if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
          setTimeout(() => snapToBirmingham(msg), 0)
          return current
        }
      }

      setTimeout(() => snapToBirmingham(), 0)
      return current
    })
  }, [isDragging, snapToBirmingham, triggerUnlock])

  const renderArc = () => {
    if (!planePosReady) return null
    const { x: bx, y: by } = birminghamPos
    const { x: mx, y: my } = mumbaiPos
    const cpx = (bx + mx) / 2
    const cpy = Math.min(by, my) - Math.abs(mx - bx) * 0.2
    const d   = `M ${bx} ${by} Q ${cpx} ${cpy} ${mx} ${my}`

    return (
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <path d={d} stroke="rgba(196,154,40,0.2)" strokeWidth="1" strokeDasharray="4 9" fill="none" />
      </svg>
    )
  }

  return (
    <div className={`${styles.overlay} ${isUnlocking ? styles.overlayFadingOut : ''}`}>

      {/* Cloud-free NASA topo map — CSS filter for cross-browser contrast/saturation */}
      <canvas
        ref={canvasRef}
        className={styles.mapCanvas}
        aria-hidden="true"
      />

      {/* Vignette overlay — CSS radial gradient, works everywhere */}
      <div className={styles.mapVignette} aria-hidden="true" />

      {/* Faint route arc */}
      {renderArc()}

      {/* Origin dot — Birmingham */}
      {planePosReady && (
        <div style={{ position: 'absolute', left: birminghamPos.x, top: birminghamPos.y,
          transform: 'translate(-50%,-50%)', zIndex: 5, pointerEvents: 'none' }}>
          <div className={styles.pulseRing} style={{ color: BIRMINGHAM.color }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: BIRMINGHAM.color,
            boxShadow: `0 0 10px ${BIRMINGHAM.color}CC`, position: 'relative', zIndex: 2 }} />
        </div>
      )}

      {/* Destination glow — Mumbai (double pulse, brighter) */}
      {planePosReady && (
        <div style={{ position: 'absolute', left: mumbaiPos.x, top: mumbaiPos.y,
          transform: 'translate(-50%,-50%)', zIndex: 5, pointerEvents: 'none' }}>
          <div className={styles.pulseRing} style={{ color: MUMBAI.color }} />
          <div className={styles.pulseRing} style={{ color: MUMBAI.color, animationDelay: '1.2s' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: MUMBAI.color,
            boxShadow: `0 0 14px ${MUMBAI.color}EE, 0 0 30px ${MUMBAI.color}55`,
            position: 'relative', zIndex: 2 }} />
        </div>
      )}

      {/* Draggable aircraft */}
      {planePosReady && (
        <div
          className={`${styles.airplane} ${isDragging ? styles.airplaneDragging : ''} ${isSnapping ? styles.airplaneSnapping : ''}`}
          style={{
            left: planePos.x,
            top: planePos.y,
            transform: `translate(-50%, -50%) rotate(${planeAngle}deg) ${isDragging ? 'scale(1.12)' : ''}`,
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
        <div style={{
          position: 'relative', width: 110, height: 90, margin: '0 auto 16px',
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 0 40px rgba(196,154,40,0.22), 0 8px 24px rgba(0,0,0,0.4)',
          border: '1px solid rgba(196,154,40,0.22)',
        }}>
          <Image src="/images/couple-avatar.png" alt="Nidhi and Parag" fill
            style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
        </div>
        <div className={styles.successTitle}>You found us.</div>
        <div className={styles.successSub}>Nidhi &amp; Parag &nbsp;·&nbsp; December 4, 2026</div>
      </div>

      {/* "make it fly" hint — same style as Skip, fades in briefly, gone after first drag */}
      <p
        className={styles.flyHint}
        style={{ opacity: showHint ? 1 : 0 }}
        aria-hidden="true"
      >
        make it fly
      </p>

      {/* Skip */}
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
