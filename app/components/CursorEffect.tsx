'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number   // 0–1, decreasing each frame
  decay: number
  size: number
  isBurst: boolean
}

const GOLD       = '#C49A28'
const GOLD_LIGHT = '#D4AA38'
const RING_BASE  = 20   // radius at rest
const RING_HOVER = 30   // radius over interactive elements
const LERP_RING  = 0.18 // ring follow speed (higher = snappier)
const LERP_SCALE = 0.14 // ring size transition speed

export default function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    // All state lives in mutable vars — no React involvement whatsoever
    let cursorX = -300, cursorY = -300
    let ringX = -300,   ringY = -300
    let ringR = RING_BASE
    let isHovering = false
    let isDown = false
    const particles: Particle[] = []
    let lastTrailX = -300, lastTrailY = -300
    let rafId: number

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMove = (e: MouseEvent) => {
      cursorX = e.clientX
      cursorY = e.clientY

      // Hover detection from event target — cheaper than elementFromPoint
      const t = e.target as Element | null
      isHovering = !!t?.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]')

      // Spawn trail diamond every ~9px of travel
      const dx = cursorX - lastTrailX
      const dy = cursorY - lastTrailY
      if (dx * dx + dy * dy > 81 && particles.length < 80) {
        lastTrailX = cursorX
        lastTrailY = cursorY
        particles.push({
          x: cursorX + (Math.random() - 0.5) * 5,
          y: cursorY + (Math.random() - 0.5) * 5,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -Math.random() * 1.4 - 0.2,
          life: 0.85 + Math.random() * 0.15,
          decay: 0.022 + Math.random() * 0.018,
          size: 1.8 + Math.random() * 2.2,
          isBurst: false,
        })
      }
    }

    const onClick = (e: MouseEvent) => {
      // 12 burst diamonds radiating from click
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const speed = 2.5 + Math.random() * 3.5
        particles.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.038 + Math.random() * 0.025,
          size: 2.8 + Math.random() * 2.8,
          isBurst: true,
        })
      }
    }

    const onDown = () => { isDown = true  }
    const onUp   = () => { isDown = false }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click',     onClick, { passive: true })
    window.addEventListener('mousedown', onDown,  { passive: true })
    window.addEventListener('mouseup',   onUp,    { passive: true })
    document.body.style.cursor = 'none'

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // ── Ring: lerp position + lerp radius ─────────────────
      ringX += (cursorX - ringX) * LERP_RING
      ringY += (cursorY - ringY) * LERP_RING
      const targetR = isHovering ? RING_HOVER : RING_BASE
      ringR += (targetR - ringR) * LERP_SCALE

      // ── Trail particles ────────────────────────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x  += p.vx
        p.y  += p.vy
        p.vy += 0.045   // slight gravity
        p.life -= p.decay
        if (p.life <= 0) { particles.splice(i, 1); continue }

        ctx.save()
        ctx.globalAlpha = p.life * (p.isBurst ? 0.88 : 0.55)
        ctx.fillStyle   = p.isBurst ? GOLD_LIGHT : GOLD
        ctx.shadowColor = GOLD
        ctx.shadowBlur  = p.isBurst ? 6 : 3
        ctx.translate(p.x, p.y)
        ctx.rotate(Math.PI / 4)     // rotated square = diamond
        const s = p.size
        ctx.fillRect(-s / 2, -s / 2, s, s)
        ctx.restore()
      }

      // ── Ring ──────────────────────────────────────────────
      const ringAlpha = isDown ? 0.95 : (isHovering ? 0.82 : 0.68)

      ctx.save()
      ctx.beginPath()
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(196, 154, 40, ${ringAlpha})`
      ctx.lineWidth   = isHovering ? 1.5 : 1
      ctx.shadowColor = GOLD
      ctx.shadowBlur  = isHovering ? 12 : 7
      ctx.stroke()

      // Press fill
      if (isDown) {
        ctx.beginPath()
        ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(196, 154, 40, 0.10)'
        ctx.fill()
      }
      ctx.restore()

      // ── Inner dot — exact cursor position, no delay ────────
      if (cursorX > -200) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(cursorX, cursorY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle   = `rgba(196, 154, 40, ${isDown ? 1 : 0.9})`
        ctx.shadowColor = GOLD
        ctx.shadowBlur  = isDown ? 10 : 5
        ctx.fill()
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize',    resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click',     onClick)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}
    />
  )
}
