import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#0D0600',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'serif',
        color: '#C49A28',
        fontSize: 11,
        fontWeight: 300,
        letterSpacing: '0.04em',
        gap: 1,
      }}
    >
      <span>N</span>
      <span style={{ fontSize: 7, opacity: 0.8 }}>✦</span>
      <span>P</span>
    </div>,
    { ...size }
  )
}
