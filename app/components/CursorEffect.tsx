'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number
  decay: number
  size: number
  isBurst: boolean
}

const GOLD        = '#C49A28'
const GOLD_LIGHT  = '#D4AA38'
const BLOB_REST   = 18   // glow blob radius at rest
const BLOB_HOVER  = 42   // glow blob radius over interactive elements
const LERP_BLOB   = 0.12 // blob follow speed (lower = dreamier)
const LERP_SCALE  = 0.10 // blob radius lerp

export default function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    let cursorX = -300, cursorY = -300
    let blobX = -300,   blobY = -300
    let blobR = BLOB_REST
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

      const t = e.target as Element | null
      isHovering = !!t?.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]')

      // Trail diamond every ~10px
      const dx = cursorX - lastTrailX
      const dy = cursorY - lastTrailY
      if (dx * dx + dy * dy > 100 && particles.length < 70) {
        lastTrailX = cursorX
        lastTrailY = cursorY
        particles.push({
          x: cursorX + (Math.random() - 0.5) * 6,
          y: cursorY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.0,
          vy: -Math.random() * 1.6 - 0.2,
          life: 0.8 + Math.random() * 0.2,
          decay: 0.020 + Math.random() * 0.016,
          size: 1.6 + Math.random() * 2.4,
          isBurst: false,
        })
      }
    }

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2
        const speed = 2.0 + Math.random() * 4.0
        particles.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.032 + Math.random() * 0.024,
          size: 2.5 + Math.random() * 3.0,
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

      // Blob: lerp position + radius
      blobX += (cursorX - blobX) * LERP_BLOB
      blobY += (cursorY - blobY) * LERP_BLOB
      const targetR = isHovering ? BLOB_HOVER : BLOB_REST
      blobR += (targetR - blobR) * LERP_SCALE

      // ── Trail diamonds ─────────────────────────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x  += p.vx
        p.y  += p.vy
        p.vy += 0.04
        p.life -= p.decay
        if (p.life <= 0) { particles.splice(i, 1); continue }

        ctx.save()
        ctx.globalAlpha = p.life * (p.isBurst ? 0.85 : 0.50)
        ctx.fillStyle   = p.isBurst ? GOLD_LIGHT : GOLD
        ctx.shadowColor = GOLD
        ctx.shadowBlur  = p.isBurst ? 8 : 4
        ctx.translate(p.x, p.y)
        ctx.rotate(Math.PI / 4)
        const s = p.size
        ctx.fillRect(-s / 2, -s / 2, s, s)
        ctx.restore()
      }

      // ── Bokeh glow blob (replaces ring — no outline, just warm light) ──
      if (blobX > -200) {
        const alpha = isDown ? 0.60 : (isHovering ? 0.52 : 0.40)
        const grad = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, blobR)
        grad.addColorStop(0,    `rgba(220, 178, 60, ${alpha})`)
        grad.addColorStop(0.30, `rgba(196, 154, 40, ${alpha * 0.5})`)
        grad.addColorStop(0.65, `rgba(196, 154, 40, ${alpha * 0.15})`)
        grad.addColorStop(1,    'rgba(196, 154, 40, 0)')

        ctx.save()
        ctx.beginPath()
        ctx.arc(blobX, blobY, blobR, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()
      }

      // ── Crisp center dot — no delay, exact cursor position ──
      if (cursorX > -200) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(cursorX, cursorY, 2.8, 0, Math.PI * 2)
        ctx.fillStyle   = `rgba(220, 178, 60, ${isDown ? 1 : 0.92})`
        ctx.shadowColor = GOLD
        ctx.shadowBlur  = isDown ? 12 : 6
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
