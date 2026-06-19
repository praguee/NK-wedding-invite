'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

interface EarthIntroProps {
  onComplete: () => void
}

export default function EarthIntro({ onComplete }: EarthIntroProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef    = useRef<number>(0)
  const [phase, setPhase] = useState<'space' | 'zooming' | 'done'>('space')
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete(); return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    // ── Three.js scene setup ─────────────────────────────────────
    const W = window.innerWidth, H = window.innerHeight
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x010408, 1) // deep space near-black
    rendererRef.current = renderer

    // Stars background
    const starGeo = new THREE.BufferGeometry()
    const starCount = 2000
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 200
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12 }))
    scene.add(stars)

    // Earth sphere
    const geo = new THREE.SphereGeometry(1, 64, 64)
    const loader = new THREE.TextureLoader()
    const earthMat = new THREE.MeshPhongMaterial({
      map:           loader.load('/images/earth-texture.jpg'),
      specular:      new THREE.Color(0x2a4a6a),
      shininess:     18,
    })
    const earth = new THREE.Mesh(geo, earthMat)
    // Start tilted like real Earth axis
    earth.rotation.z = THREE.MathUtils.degToRad(23.5)
    scene.add(earth)

    // Atmosphere glow (slightly larger transparent sphere)
    const atmosMat = new THREE.MeshPhongMaterial({
      color:       0x4488cc,
      transparent: true,
      opacity:     0.12,
      side:        THREE.FrontSide,
    })
    const atmos = new THREE.Mesh(new THREE.SphereGeometry(1.035, 64, 64), atmosMat)
    scene.add(atmos)

    // Atmosphere rim halo
    const haloMat = new THREE.MeshPhongMaterial({
      color:       0x88bbff,
      transparent: true,
      opacity:     0.07,
      side:        THREE.BackSide,
    })
    const halo = new THREE.Mesh(new THREE.SphereGeometry(1.12, 64, 64), haloMat)
    scene.add(halo)

    // Lighting — sun from upper-left like Apple's reference
    const sunLight = new THREE.DirectionalLight(0xfff4e8, 1.8)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)
    scene.add(new THREE.AmbientLight(0x112244, 0.6))

    // ── Animation timeline ────────────────────────────────────────
    // Phase 1 (0–2s):   Slow rotation, camera at z=3 (globe fills ~30% of screen)
    // Phase 2 (2–4.2s): Rotation accelerates, camera rushes in z: 3→0.2
    // Phase 3 (4.2s+):  Transition out

    const START = performance.now()
    let completed = false

    function easeInQuad(t: number) { return t * t }
    function easeInCubic(t: number) { return t * t * t }

    function animate() {
      frameRef.current = requestAnimationFrame(animate)
      const elapsed = (performance.now() - START) / 1000

      if (elapsed < 2) {
        // Phase 1: slow drift — 0.08 rad/s
        earth.rotation.y = elapsed * 0.08
        camera.position.z = 3
        stars.material.opacity = 1

      } else if (elapsed < 4.2) {
        // Phase 2: zoom in + accelerate spin
        const t = (elapsed - 2) / 2.2             // 0→1 over 2.2s
        const tEased = easeInCubic(t)

        // Rotation: 0.08 → 2.5 rad/s
        earth.rotation.y = 2 * 0.08 + (0.08 + (2.5 - 0.08) * easeInQuad(t)) * (elapsed - 2)

        // Camera: z 3 → 0.18 (into the surface)
        camera.position.z = 3 - 2.82 * tEased

        // Stars fade out as we approach
        ;(stars.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - t * 2)

        // Atmosphere brightens slightly on approach
        atmosMat.opacity = 0.12 + tEased * 0.22

      } else if (!completed) {
        completed = true
        setPhase('done')
      }

      renderer.render(scene, camera)
    }

    animate()

    // Show text at 0.8s
    const t1 = setTimeout(() => setTextVisible(true), 800)
    // Trigger onComplete after transition animation finishes
    const t2 = setTimeout(onComplete, 5400)

    return () => {
      clearTimeout(t1); clearTimeout(t2)
      cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      geo.dispose()
      earthMat.dispose()
      starGeo.dispose()
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
        {/* WebGL canvas */}
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />

        {/* Nidhi ✦ Parag text overlay */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={textVisible && phase !== 'done' ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'absolute',
            bottom: 'clamp(48px, 10vh, 96px)',
            left: 0, right: 0,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(28px, 5.5vw, 44px)',
            fontWeight: 300,
            letterSpacing: '0.08em',
            color: 'rgba(255,253,246,0.92)',
            lineHeight: 1.1,
            textShadow: '0 2px 24px rgba(0,0,0,0.6)',
            marginBottom: 8,
          }}>
            Nidhi <span style={{ color: '#C49A28', fontSize: '0.58em' }}>✦</span> Parag
          </p>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 'clamp(10px, 2vw, 12px)',
            fontWeight: 400,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(196,154,40,0.75)',
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
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
            position: 'absolute',
            top: 'clamp(20px, 4vh, 36px)',
            right: 'clamp(20px, 4vw, 36px)',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            pointerEvents: 'none',
          }}
        >
          Tap to skip
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
