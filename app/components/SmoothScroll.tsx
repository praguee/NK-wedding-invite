'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({
      // 1.001 - 2^(-10t) — the classic studio freight easing
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 0,
    })

    lenisRef.current = lenis
    // Expose for Navigation's handleNavClick
    ;(window as unknown as { __lenis: Lenis }).__lenis = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Pause Lenis when nav overlay or lightbox is open
    const onMenu = (e: Event) => {
      const open = (e as CustomEvent<{ open: boolean }>).detail.open
      if (open) lenis.stop(); else lenis.start()
    }
    const onLightbox = (e: Event) => {
      const open = (e as CustomEvent<{ open: boolean }>).detail.open
      if (open) lenis.stop(); else lenis.start()
    }
    window.addEventListener('nk:menu',     onMenu)
    window.addEventListener('nk:lightbox', onLightbox)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      window.removeEventListener('nk:menu',     onMenu)
      window.removeEventListener('nk:lightbox', onLightbox)
    }
  }, [])

  // Jump to top on route change (admin, games, etc.)
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  return <>{children}</>
}
