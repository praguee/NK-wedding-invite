'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type Burst = { id: number; x: number; y: number }

const TRAIL = [
  { stiffness: 800, damping: 45, size: 7, opacity: 1.0 },
  { stiffness: 240, damping: 26, size: 5, opacity: 0.55 },
  { stiffness: 140, damping: 22, size: 4, opacity: 0.38 },
  { stiffness: 85,  damping: 18, size: 3, opacity: 0.22 },
  { stiffness: 50,  damping: 14, size: 2, opacity: 0.12 },
]

const BURST_ANGLES = [0, 60, 120, 180, 240, 300]

export default function CursorEffect() {
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  // Fixed-length springs declared at top level (no hooks in loops)
  const x0 = useSpring(mouseX, { stiffness: TRAIL[0].stiffness, damping: TRAIL[0].damping })
  const y0 = useSpring(mouseY, { stiffness: TRAIL[0].stiffness, damping: TRAIL[0].damping })
  const x1 = useSpring(mouseX, { stiffness: TRAIL[1].stiffness, damping: TRAIL[1].damping })
  const y1 = useSpring(mouseY, { stiffness: TRAIL[1].stiffness, damping: TRAIL[1].damping })
  const x2 = useSpring(mouseX, { stiffness: TRAIL[2].stiffness, damping: TRAIL[2].damping })
  const y2 = useSpring(mouseY, { stiffness: TRAIL[2].stiffness, damping: TRAIL[2].damping })
  const x3 = useSpring(mouseX, { stiffness: TRAIL[3].stiffness, damping: TRAIL[3].damping })
  const y3 = useSpring(mouseY, { stiffness: TRAIL[3].stiffness, damping: TRAIL[3].damping })
  const x4 = useSpring(mouseX, { stiffness: TRAIL[4].stiffness, damping: TRAIL[4].damping })
  const y4 = useSpring(mouseY, { stiffness: TRAIL[4].stiffness, damping: TRAIL[4].damping })

  const springs = [
    { x: x0, y: y0 }, { x: x1, y: y1 }, { x: x2, y: y2 },
    { x: x3, y: y3 }, { x: x4, y: y4 },
  ]

  const [bursts, setBursts] = useState<Burst[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    const onClick = (e: MouseEvent) => {
      const id = ++idRef.current
      setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 700)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      document.body.style.cursor = ''
    }
  }, [mouseX, mouseY])

  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 9999 }}>
      {TRAIL.map((cfg, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            x: springs[i].x,
            y: springs[i].y,
            width: cfg.size,
            height: cfg.size,
            background: '#C49A28',
            opacity: cfg.opacity,
            rotate: 45,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      ))}

      {bursts.map(burst => (
        <div key={burst.id} style={{ position: 'fixed', left: burst.x, top: burst.y }}>
          {BURST_ANGLES.map(angle => (
            <div
              key={angle}
              className="cursor-petal"
              style={{
                position: 'absolute',
                width: 5,
                height: 12,
                background: '#C49A28',
                borderRadius: '50% 50% 0 0',
                transformOrigin: 'bottom center',
                ['--petal-transform' as string]: `rotate(${angle}deg)`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
