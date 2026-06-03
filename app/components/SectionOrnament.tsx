export default function SectionOrnament({ light = false }: { light?: boolean }) {
  const lineColor  = light ? 'rgba(255,255,255,0.3)' : 'rgba(196,154,40,0.35)'
  const motifColor = light ? 'rgba(255,255,255,0.7)' : '#C49A28'

  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      {/* Left ornamental arm */}
      <svg width="80" height="12" viewBox="0 0 80 12" fill="none">
        <line x1="0" y1="6" x2="56" y2="6" stroke={lineColor} strokeWidth="0.8"/>
        <path d="M60 6 L66 2 L72 6 L66 10 Z" fill={motifColor} opacity="0.5"/>
        <path d="M72 6 L76 4 L80 6 L76 8 Z" fill={motifColor} opacity="0.3"/>
      </svg>

      {/* Central lotus diamond motif */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Outer diamond */}
        <path d="M14 1 L27 14 L14 27 L1 14 Z" stroke={motifColor} strokeWidth="0.9" opacity="0.6"/>
        {/* 4 petals */}
        <path d="M14 8 Q17 11 14 14 Q11 11 14 8Z"  fill={motifColor} opacity="0.55"/>
        <path d="M14 20 Q17 17 14 14 Q11 17 14 20Z" fill={motifColor} opacity="0.55"/>
        <path d="M8  14 Q11 11 14 14 Q11 17  8 14Z"  fill={motifColor} opacity="0.45"/>
        <path d="M20 14 Q17 11 14 14 Q17 17 20 14Z"  fill={motifColor} opacity="0.45"/>
        {/* Center */}
        <circle cx="14" cy="14" r="2.2" fill={motifColor} opacity="0.7"/>
        <circle cx="14" cy="14" r="1"   fill={light ? 'rgba(255,255,255,0.9)' : '#FAF3E0'} opacity="0.9"/>
      </svg>

      {/* Right ornamental arm (mirrored) */}
      <svg width="80" height="12" viewBox="0 0 80 12" fill="none">
        <path d="M0 6 L4 4 L8 6 L4 8 Z"   fill={motifColor} opacity="0.3"/>
        <path d="M8 6 L14 2 L20 6 L14 10 Z" fill={motifColor} opacity="0.5"/>
        <line x1="24" y1="6" x2="80" y2="6" stroke={lineColor} strokeWidth="0.8"/>
      </svg>
    </div>
  )
}
