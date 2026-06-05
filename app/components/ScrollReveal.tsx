'use client'

import { motion } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

// ── Section-level fade + slide up ───────────────────────────────
export function FadeUp({
  children,
  delay = 0,
  duration = 0.72,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration, ease: EASE, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── Fade-only (for elements that shouldn't shift) ────────────────
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
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Slide in from side ───────────────────────────────────────────
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
  return (
    <motion.div
      initial={{ opacity: 0, x: from === 'left' ? -42 : 42 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-56px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
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
      staggerChildren: 0.13,
      delayChildren: 0.06,
    },
  },
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
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
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
