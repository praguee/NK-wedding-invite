import SectionOrnament from './SectionOrnament'

export default function JabWeMet() {
  return (
    <section id="jab-we-met" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Jab We Met
        </h2>
        <p className="text-center mb-14 text-sm" style={{ color: '#9C7A5A' }}>
          How it all started — in their own words
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Story placeholder */}
          <div className="space-y-5">
            <div className="glass-gold rounded-2xl p-8">
              <p className="text-sm italic mb-4" style={{ color: '#C49A28' }}>Coming soon…</p>
              <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
                Every great love story has a beginning. Theirs is one worth telling — and they&apos;ll tell it here, in their own words, soon.
              </p>
              <p className="leading-relaxed mt-4" style={{ color: '#5C3A2E', fontSize: 16 }}>
                Check back closer to the wedding for the full story of how Parag and Nidhi went from strangers to this.
              </p>
            </div>

            {/* Fun fact placeholders */}
            <div className="flex gap-3">
              <div className="glass-gold rounded-xl p-4 flex-1 text-center">
                <p className="text-2xl font-extralight" style={{ color: '#C49A28' }}>?</p>
                <p className="text-xs mt-1" style={{ color: '#9C7A5A' }}>years together</p>
              </div>
              <div className="glass-gold rounded-xl p-4 flex-1 text-center">
                <p className="text-2xl font-extralight" style={{ color: '#C49A28' }}>∞</p>
                <p className="text-xs mt-1" style={{ color: '#9C7A5A' }}>memories made</p>
              </div>
              <div className="glass-gold rounded-xl p-4 flex-1 text-center">
                <p className="text-2xl font-extralight" style={{ color: '#C49A28' }}>1</p>
                <p className="text-xs mt-1" style={{ color: '#9C7A5A' }}>forever to go</p>
              </div>
            </div>
          </div>

          {/* Photo placeholder */}
          <div
            className="aspect-[4/5] rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #f0e8d8, #e8d5c4)',
              boxShadow: '0 8px 40px rgba(196,154,40,0.12)',
            }}
          >
            {/* Corner flourishes */}
            {[
              { style: { top: 12, left: 12 }, d: 'M0 32 L0 0 L32 0', cx: 0, cy: 0 },
              { style: { top: 12, right: 12 }, d: 'M32 32 L32 0 L0 0', cx: 32, cy: 0 },
              { style: { bottom: 12, left: 12 }, d: 'M0 0 L0 32 L32 32', cx: 0, cy: 32 },
              { style: { bottom: 12, right: 12 }, d: 'M32 0 L32 32 L0 32', cx: 32, cy: 32 },
            ].map((f, i) => (
              <svg key={i} style={{ position: 'absolute', width: 32, height: 32, opacity: 0.35, ...f.style }} viewBox="0 0 32 32">
                <path d={f.d} fill="none" stroke="#C49A28" strokeWidth="1.5"/>
                <circle cx={f.cx} cy={f.cy} r="3" fill="#C49A28"/>
              </svg>
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
              <span style={{ fontSize: 40 }}>📸</span>
              <p className="text-center text-sm italic" style={{ color: '#9C7A5A' }}>
                Photos from when they met<br/>— coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
