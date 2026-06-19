'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EarthIntroProps {
  onComplete: () => void
}

export default function EarthIntro({ onComplete }: EarthIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef<number>(0)
  const [phase, setPhase]           = useState<'space' | 'done'>('space')
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete(); return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false

    // Dynamic import keeps Three.js out of Vercel's SSR/static analysis
    import('three').then((THREE) => {
      if (cancelled) return

      const W = window.innerWidth, H = window.innerHeight

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
      camera.position.z = 3

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.setClearColor(0x010408, 1)

      // Stars
      const starGeo = new THREE.BufferGeometry()
      const starPos = new Float32Array(2000 * 3)
      for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 200
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12 })
      const stars   = new THREE.Points(starGeo, starMat)
      scene.add(stars)

      // Earth sphere with real NASA texture
      const geo      = new THREE.SphereGeometry(1, 64, 64)
      const loader   = new THREE.TextureLoader()
      const earthMat = new THREE.MeshPhongMaterial({
        map:       loader.load('/images/earth-texture.jpg'),
        specular:  new THREE.Color(0x2a4a6a),
        shininess: 18,
      })
      const earth = new THREE.Mesh(geo, earthMat)
      earth.rotation.z = THREE.MathUtils.degToRad(23.5) // real axial tilt
      scene.add(earth)

      // Atmosphere
      const atmosMat = new THREE.MeshPhongMaterial({
        color: 0x4488cc, transparent: true, opacity: 0.12, side: THREE.FrontSide,
      })
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.035, 64, 64), atmosMat))

      // Rim halo
      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.12, 64, 64),
        new THREE.MeshPhongMaterial({ color: 0x88bbff, transparent: true, opacity: 0.07, side: THREE.BackSide })
      ))

      // Lighting — sun from upper-left (Apple-style)
      const sun = new THREE.DirectionalLight(0xfff4e8, 1.8)
      sun.position.set(5, 3, 5)
      scene.add(sun)
      scene.add(new THREE.AmbientLight(0x112244, 0.6))

      // Animation: Phase 1 (0-2s) slow, Phase 2 (2-4.2s) zoom+accelerate
      const START = performance.now()
      let completed = false

      function easeInQuad(t: number)  { return t * t }
      function easeInCubic(t: number) { return t * t * t }

      function animate() {
        if (cancelled) return
        frameRef.current = requestAnimationFrame(animate)
        const elapsed = (performance.now() - START) / 1000

        if (elapsed < 2) {
          earth.rotation.y = elapsed * 0.08
          camera.position.z = 3
          starMat.opacity = 1
        } else if (elapsed < 4.2) {
          const t      = (elapsed - 2) / 2.2
          const tEased = easeInCubic(t)
          earth.rotation.y   = 2 * 0.08 + (0.08 + (2.5 - 0.08) * easeInQuad(t)) * (elapsed - 2)
          camera.position.z  = 3 - 2.82 * tEased
          starMat.opacity    = Math.max(0, 1 - t * 2)
          atmosMat.opacity   = 0.12 + tEased * 0.22
        } else if (!completed) {
          completed = true
          setPhase('done')
        }

        renderer.render(scene, camera)
      }

      animate()

      const t1 = setTimeout(() => setTextVisible(true), 800)
      const t2 = setTimeout(onComplete, 5400)

      // Cleanup stored on closure
      ;(canvas as HTMLCanvasElement & { __earthCleanup?: () => void }).__earthCleanup = () => {
        clearTimeout(t1); clearTimeout(t2)
        cancelAnimationFrame(frameRef.current)
        renderer.dispose()
        geo.dispose(); earthMat.dispose(); starGeo.dispose()
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frameRef.current)
      const cleanup = (canvasRef.current as HTMLCanvasElement & { __earthCleanup?: () => void })?.__earthCleanup
      cleanup?.()
    }
  }, [onComplete])

  function skip() {
    setPhase('done')
    setTimeout(onComplete, 600)
  }

  return (
    <AnimatePresence>
      <motion.div
        key="earth-intro"
        initial={{ opacity: 1 }}
        animate={phase === 'done' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.4, 0, 1, 1] }}
        style={{ position: 'fixed', inset: 0, zIndex: 100 }}
        onClick={skip}
        role="button"
        tabIndex={0}
        aria-label="Tap to skip"
        onKeyDown={e => e.key === 'Enter' && skip()}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

        {/* Name overlay */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={textVisible && phase !== 'done' ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'absolute', bottom: 'clamp(48px, 10vh, 96px)',
            left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(28px, 5.5vw, 44px)', fontWeight: 300,
            letterSpacing: '0.08em', color: 'rgba(255,253,246,0.92)',
            lineHeight: 1.1, textShadow: '0 2px 24px rgba(0,0,0,0.6)', marginBottom: 8,
          }}>
            Nidhi <span style={{ color: '#C49A28', fontSize: '0.58em' }}>✦</span> Parag
          </p>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 'clamp(10px, 2vw, 12px)', fontWeight: 400,
            letterSpacing: '0.28em', textTransform: 'uppercase' as const,
            color: 'rgba(196,154,40,0.75)', textShadow: '0 1px 12px rgba(0,0,0,0.5)',
          }}>
            Birmingham · Mumbai · December 2026
          </p>
        </motion.div>

        {/* Skip hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={textVisible && phase !== 'done' ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            position: 'absolute', top: 'clamp(20px, 4vh, 36px)', right: 'clamp(20px, 4vw, 36px)',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            color: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
          }}
        >
          Tap to skip
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
