'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EarthIntroProps {
  onComplete: () => void
}

// Equirectangular SVG world map (800×400 coordinate space)
// x: 0-800 = 180°W → 180°E,  y: 0-400 = 90°N → 90°S
const EARTH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="1600" height="800">
  <defs>
    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0E4D7B"/>
      <stop offset="40%" stop-color="#1A6B9A"/>
      <stop offset="100%" stop-color="#0B3D6B"/>
    </linearGradient>
  </defs>
  <!-- Ocean -->
  <rect width="800" height="400" fill="url(#ocean)"/>
  <!-- Ice caps -->
  <rect x="0" y="0" width="800" height="16" fill="#DCE9F5" opacity="0.85"/>
  <rect x="0" y="384" width="800" height="16" fill="#C8DCF0" opacity="0.9"/>
  <!-- Greenland -->
  <path d="M245 28 L275 22 L300 30 L305 52 L290 68 L265 70 L248 58 Z" fill="#9DBFBA" opacity="0.9"/>
  <!-- North America -->
  <path d="M108 48 L155 42 L195 52 L225 72 L240 100 L248 135 L242 165 L228 192 L205 210 L185 228 L168 218 L150 195 L130 168 L112 140 L96 108 L88 78 Z" fill="#4E7A42"/>
  <!-- Central America -->
  <path d="M185 228 L205 225 L215 240 L205 258 L185 260 L175 248 Z" fill="#4E7A42"/>
  <!-- Caribbean islands (simplified) -->
  <ellipse cx="222" cy="235" rx="10" ry="5" fill="#4E7A42" opacity="0.8"/>
  <!-- South America -->
  <path d="M185 260 L225 252 L255 268 L270 300 L268 340 L255 368 L232 378 L210 368 L193 340 L182 305 L178 278 Z" fill="#4E7A42"/>
  <!-- Iceland -->
  <path d="M348 58 L368 54 L376 66 L368 78 L350 78 L342 68 Z" fill="#8BADA8" opacity="0.9"/>
  <!-- UK & Ireland -->
  <path d="M375 80 L385 74 L393 84 L388 96 L378 98 L372 88 Z" fill="#4E7A42" opacity="0.9"/>
  <!-- Norway/Scandinavia -->
  <path d="M400 56 L425 50 L440 62 L442 82 L430 96 L415 98 L402 86 Z" fill="#4E7A42"/>
  <!-- Europe (mainland) -->
  <path d="M375 98 L430 96 L465 100 L475 118 L465 135 L445 142 L420 140 L400 132 L382 120 Z" fill="#4E7A42"/>
  <!-- Iberian Peninsula -->
  <path d="M370 118 L395 112 L400 132 L390 148 L370 150 L358 138 L360 122 Z" fill="#4E7A42"/>
  <!-- North Africa -->
  <path d="M358 140 L480 132 L492 150 L490 190 L478 210 L460 218 L430 222 L400 220 L375 215 L358 200 L352 175 Z" fill="#8B7A4A"/>
  <!-- Sub-Saharan Africa -->
  <path d="M375 215 L460 218 L478 240 L480 280 L468 320 L450 348 L428 358 L405 355 L385 335 L372 295 L368 255 Z" fill="#5D8040"/>
  <!-- Arabian Peninsula -->
  <path d="M478 140 L520 135 L540 148 L542 175 L530 198 L510 208 L490 200 L478 185 Z" fill="#A89060"/>
  <!-- Middle East/Levant -->
  <path d="M460 118 L500 112 L518 125 L520 135 L478 140 L465 132 Z" fill="#6B8A50"/>
  <!-- Central Asia -->
  <path d="M490 95 L575 85 L625 92 L640 110 L630 130 L605 140 L575 138 L545 130 L515 118 L492 108 Z" fill="#6B8050"/>
  <!-- Russia (Siberia simplified) -->
  <path d="M440 48 L580 38 L680 45 L740 58 L755 78 L740 95 L700 100 L650 95 L600 88 L555 82 L510 78 L465 82 L442 72 Z" fill="#5A7848"/>
  <!-- Indian subcontinent -->
  <path d="M530 138 L565 132 L590 145 L595 168 L585 200 L568 225 L548 232 L530 220 L518 195 L515 168 Z" fill="#5A8040"/>
  <!-- Sri Lanka -->
  <ellipse cx="568" cy="240" rx="7" ry="10" fill="#5A8040" opacity="0.9"/>
  <!-- Southeast Asia (mainland) -->
  <path d="M618 130 L660 125 L680 138 L685 162 L670 178 L648 182 L630 170 L618 152 Z" fill="#4E7A42"/>
  <!-- Malay Peninsula -->
  <path d="M652 175 L665 172 L670 195 L660 212 L648 205 L645 188 Z" fill="#4E7A42"/>
  <!-- Sumatra -->
  <path d="M640 210 L680 200 L695 215 L690 235 L665 242 L645 232 Z" fill="#4E7A42"/>
  <!-- Borneo -->
  <path d="M672 185 L705 178 L722 195 L720 225 L705 238 L685 232 L672 215 Z" fill="#4E7A42"/>
  <!-- Java -->
  <path d="M665 242 L712 238 L722 248 L710 262 L672 262 L658 252 Z" fill="#4E7A42"/>
  <!-- Philippines -->
  <path d="M710 150 L725 145 L730 162 L722 175 L710 172 L705 158 Z" fill="#4E7A42" opacity="0.9"/>
  <!-- China (mainland) -->
  <path d="M628 88 L705 80 L745 92 L755 115 L745 140 L718 152 L692 155 L665 148 L638 138 L622 118 Z" fill="#5A7848"/>
  <!-- Japan -->
  <path d="M742 98 L760 88 L770 100 L762 118 L748 122 L740 110 Z" fill="#4E7A42" opacity="0.9"/>
  <!-- Korea -->
  <path d="M718 110 L732 105 L738 118 L730 128 L718 125 Z" fill="#4E7A42" opacity="0.9"/>
  <!-- Taiwan -->
  <ellipse cx="738" cy="148" rx="5" ry="8" fill="#4E7A42" opacity="0.8"/>
  <!-- Australia -->
  <path d="M638 262 L695 252 L728 262 L742 285 L745 315 L732 338 L705 348 L672 345 L648 328 L632 300 L628 275 Z" fill="#8B8040"/>
  <!-- New Guinea -->
  <path d="M718 235 L758 225 L775 238 L770 255 L748 260 L720 252 Z" fill="#4E7A42"/>
  <!-- New Zealand (North) -->
  <ellipse cx="762" cy="330" rx="8" ry="14" fill="#4E7A42" opacity="0.9"/>
  <!-- New Zealand (South) -->
  <ellipse cx="758" cy="355" rx="8" ry="16" fill="#4E7A42" opacity="0.9"/>
  <!-- Madagascar -->
  <path d="M490 268 L502 260 L510 278 L508 308 L498 320 L486 312 L482 290 Z" fill="#5A8040"/>
  <!-- DUPLICATE at x+800 for seamless wrap -->
  <!-- Greenland -->
  <path d="M1045 28 L1075 22 L1100 30 L1105 52 L1090 68 L1065 70 L1048 58 Z" fill="#9DBFBA" opacity="0.9"/>
  <!-- North America -->
  <path d="M908 48 L955 42 L995 52 L1025 72 L1040 100 L1048 135 L1042 165 L1028 192 L1005 210 L985 228 L968 218 L950 195 L930 168 L912 140 L896 108 L888 78 Z" fill="#4E7A42"/>
  <!-- South America -->
  <path d="M985 260 L1025 252 L1055 268 L1070 300 L1068 340 L1055 368 L1032 378 L1010 368 L993 340 L982 305 L978 278 Z" fill="#4E7A42"/>
  <!-- Europe (mainland) -->
  <path d="M1175 98 L1230 96 L1265 100 L1275 118 L1265 135 L1245 142 L1220 140 L1200 132 L1182 120 Z" fill="#4E7A42"/>
  <!-- North Africa -->
  <path d="M1158 140 L1280 132 L1292 150 L1290 190 L1278 210 L1260 218 L1230 222 L1200 220 L1175 215 L1158 200 L1152 175 Z" fill="#8B7A4A"/>
  <!-- Sub-Saharan Africa -->
  <path d="M1175 215 L1260 218 L1278 240 L1280 280 L1268 320 L1250 348 L1228 358 L1205 355 L1185 335 L1172 295 L1168 255 Z" fill="#5D8040"/>
  <!-- Cloud streaks -->
  <ellipse cx="170" cy="72" rx="65" ry="11" fill="white" opacity="0.22"/>
  <ellipse cx="420" cy="58" rx="90" ry="9" fill="white" opacity="0.18"/>
  <ellipse cx="620" cy="85" rx="55" ry="10" fill="white" opacity="0.20"/>
  <ellipse cx="310" cy="145" rx="45" ry="8" fill="white" opacity="0.17"/>
  <ellipse cx="545" cy="175" rx="60" ry="9" fill="white" opacity="0.16"/>
  <ellipse cx="710" cy="195" rx="48" ry="8" fill="white" opacity="0.19"/>
  <ellipse cx="140" cy="210" rx="38" ry="7" fill="white" opacity="0.14"/>
  <ellipse cx="410" cy="230" rx="55" ry="9" fill="white" opacity="0.16"/>
  <ellipse cx="560" cy="248" rx="42" ry="7" fill="white" opacity="0.15"/>
  <ellipse cx="240" cy="280" rx="35" ry="7" fill="white" opacity="0.13"/>
  <!-- Duplicate clouds -->
  <ellipse cx="970" cy="72" rx="65" ry="11" fill="white" opacity="0.22"/>
  <ellipse cx="1220" cy="58" rx="90" ry="9" fill="white" opacity="0.18"/>
  <ellipse cx="1420" cy="85" rx="55" ry="10" fill="white" opacity="0.20"/>
  <ellipse cx="1110" cy="145" rx="45" ry="8" fill="white" opacity="0.17"/>
  <ellipse cx="1345" cy="175" rx="60" ry="9" fill="white" opacity="0.16"/>
  <ellipse cx="1510" cy="195" rx="48" ry="8" fill="white" opacity="0.19"/>
</svg>`

const EARTH_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(EARTH_SVG)}`

export default function EarthIntro({ onComplete }: EarthIntroProps) {
  const [phase, setPhase] = useState<'idle' | 'text' | 'exiting'>('idle')
  const [prefersReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (prefersReduced) { onComplete(); return }
    const t1 = setTimeout(() => setPhase('text'), 1800)
    const t2 = setTimeout(() => setPhase('exiting'), 4200)
    const t3 = setTimeout(onComplete, 5500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete, prefersReduced])

  function skip() {
    setPhase('exiting')
    setTimeout(onComplete, 900)
  }

  return (
    <AnimatePresence>
      <motion.div
        key="earth-intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={phase === 'exiting' ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        onClick={skip}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse 80% 70% at 50% 45%, #FFFDF6 0%, #F5ECE0 55%, #EDE0CC 100%)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        aria-label="Tap to skip globe animation"
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && skip()}
      >
        {/* Outer atmosphere ring */}
        <div style={{
          position: 'relative',
          width: 'min(340px, 72vw)',
          height: 'min(340px, 72vw)',
        }}>
          {/* Atmosphere glow */}
          <div style={{
            position: 'absolute',
            inset: -18,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 38% 35%, rgba(180,220,255,0.28) 0%, rgba(100,170,230,0.12) 50%, transparent 75%)',
            filter: 'blur(12px)',
            pointerEvents: 'none',
          }} />

          {/* Earth sphere */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: [
              '0 0 0 1px rgba(100,160,220,0.18)',
              '0 8px 48px rgba(0,0,0,0.22)',
              '0 2px 16px rgba(0,0,0,0.14)',
            ].join(', '),
          }}>
            {/* Rotating texture */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url("${EARTH_DATA_URI}")`,
              backgroundSize: '200% 100%',
              backgroundRepeat: 'repeat-x',
              animation: 'earthSpin 28s linear infinite',
            }} />

            {/* Shading: shadow side (right) */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at 72% 50%, rgba(0,10,30,0.55) 0%, rgba(0,10,30,0.12) 55%, transparent 72%)',
              pointerEvents: 'none',
            }} />

            {/* Specular highlight (fixed, top-left) */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at 32% 28%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, transparent 65%)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Text beneath globe */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={phase === 'text' || phase === 'exiting' ? { opacity: phase === 'exiting' ? 0 : 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: 'center', marginTop: 36, pointerEvents: 'none' }}
        >
          <p style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(28px, 6vw, 42px)',
            fontWeight: 300,
            letterSpacing: '0.06em',
            color: '#5C3A1E',
            lineHeight: 1.1,
            marginBottom: 8,
          }}>
            Nidhi <span style={{ color: '#C49A28', fontSize: '0.6em' }}>✦</span> Parag
          </p>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 'clamp(11px, 2.2vw, 13px)',
            fontWeight: 400,
            letterSpacing: '0.22em',
            color: '#9C7A5A',
            textTransform: 'uppercase',
          }}>
            Birmingham · Mumbai · December 2026
          </p>
        </motion.div>

        {/* Skip hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase === 'text' ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            position: 'absolute',
            bottom: 32,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(156, 122, 90, 0.5)',
            pointerEvents: 'none',
          }}
        >
          Tap to continue
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
