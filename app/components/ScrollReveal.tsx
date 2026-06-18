'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

// Cinematic expo-out — luxury brand feel
const EASE_EXPO   = [0.16, 1, 0.3, 1] as const
const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const

// ── Blur-into-focus + rise reveal ───────────────────────────────
// Elements emerge from a soft blur while sliding up — editorial luxury feel
export function FadeUp({
  children,
  delay = 0,
  duration = 0.78,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 8 : 36, filter: reduce ? 'blur(0px)' : 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration, ease: EASE_EXPO, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── Fade-only (for ambient / background elements) ────────────────
export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.9, ease: EASE_SMOOTH, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Crystallise-in from side — blur + scale + translate ──────────
export function SlideIn({
  children,
  from = 'left',
  delay = 0,
  className = '',
}: {
  children: ReactNode
  from?: 'left' | 'right'
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const xVal = from === 'left' ? -52 : 52
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: reduce ? 0 : xVal,
        scale: reduce ? 1 : 0.97,
        filter: reduce ? 'blur(0px)' : 'blur(8px)',
      }}
      whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-56px' }}
      transition={{ duration: 0.85, ease: EASE_EXPO, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Text curtain reveal — for section headings ───────────────────
// The overflow-hidden parent clips; the heading slides up into view.
// Gives the editorial "type being unveiled" effect used on luxury sites.
export function TextReveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <motion.div
        initial={{ y: reduce ? '4%' : '108%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-48px' }}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ── Scale-into-focus reveal — for cards and images ───────────────
export function ScaleReveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: reduce ? 1 : 0.93,
        filter: reduce ? 'blur(0px)' : 'blur(6px)',
      }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 0.7, ease: EASE_EXPO, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger container + item ─────────────────────────────────────
const staggerContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_EXPO },
  },
}

export function StaggerContainer({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-56px' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className} style={style}>
      {children}
    </motion.div>
  )
}

// ── Pressable wrapper (hover + tap micro-interaction) ────────────
export function Pressable({
  children,
  className = '',
  style,
  scale = 1.04,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  scale?: number
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
