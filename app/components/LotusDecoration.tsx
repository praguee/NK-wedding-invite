import type { CSSProperties } from 'react'

interface LotusDecorationProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number    // px, default 160
  opacity?: number // 0–1, default 0.07
  animate?: boolean // enables lotusRotate, default true
}

export default function LotusDecoration({
  position,
  size = 160,
  opacity = 0.07,
  animate = true,
}: LotusDecorationProps) {
  const offset = -(size / 3)

  const posStyle: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    zIndex: 2,
    ...(position === 'top-left'     && { top: offset, left: offset }),
    ...(position === 'top-right'    && { top: offset, right: offset }),
    ...(position === 'bottom-left'  && { bottom: offset, left: offset }),
    ...(position === 'bottom-right' && { bottom: offset, right: offset }),
  }

  return (
    <div style={posStyle} aria-hidden="true">
      <svg
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        className={animate ? 'lotus-animate' : undefined}
        style={{ opacity, display: 'block', width: '100%', height: '100%' }}
      >
        <g transform="translate(80,80)">
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={i}
              d="M0,0 Q5,-28 0,-58 Q-5,-28 0,0"
              fill="#C49A28"
              transform={`rotate(${i * 45})`}
            />
          ))}
          <circle r="12" fill="none" stroke="#C49A28" strokeWidth="1.2" />
          <circle r="4" fill="#C49A28" />
        </g>
      </svg>
    </div>
  )
}
