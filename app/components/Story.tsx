import SectionOrnament from './SectionOrnament'

export default function Story() {
  return (
    <section id="story" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Our Story
        </h2>
        <p className="text-center mb-14 text-sm" style={{ color: '#9C7A5A' }}>
          A love story written in water 💧
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Story text */}
          <div className="space-y-5 order-2 md:order-1">
            <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
              Nidhi has always had a deep, unshakeable love for water. Whether it&apos;s a long bath after a long day or the sound of rain on a window — water is where she finds peace. Parag noticed this early on, and when the moment came to ask if she&apos;d be his girlfriend, he didn&apos;t go for a candlelit dinner or a rooftop view.
            </p>
            <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
              He asked her in the shower. Yes, really. 🚿
            </p>
            <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
              She said yes — and honestly, we think she had no choice. It was too original to refuse.
            </p>
            <p className="leading-relaxed" style={{ color: '#5C3A2E', fontSize: 16 }}>
              So when it came to the wedding, there was really only one way to do it properly. They&apos;re exchanging vows on a <strong style={{ color: '#C49A28' }}>floating mandap, right in the middle of a pool</strong> — surrounded by flowers, family, and the element that started it all.
            </p>
            <p className="text-sm italic mt-4" style={{ color: '#9C7A5A' }}>
              Water brought us together. Water will witness our forever.
            </p>
          </div>

          {/* Photo / decorative panel */}
          <div className="order-1 md:order-2 space-y-4">
            <div
              className="aspect-[4/5] rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #e8d5f0 0%, #bfcfee 50%, #c8e8f0 100%)',
                boxShadow: '0 8px 40px rgba(196,154,40,0.15)',
              }}
            >
              <div className="text-center p-8">
                <p className="text-5xl mb-4">💧</p>
                <p className="font-light text-slate-500 text-sm italic leading-relaxed">
                  Engagement &amp; pre-wedding<br />photos coming soon
                </p>
              </div>
              {/* Decorative gold corner flourishes */}
              <svg style={{ position:'absolute', top:12, left:12, width:32, height:32, opacity:0.35 }} viewBox="0 0 32 32">
                <path d="M0 32 L0 0 L32 0" fill="none" stroke="#C49A28" strokeWidth="1.5"/>
                <circle cx="0" cy="0" r="3" fill="#C49A28"/>
              </svg>
              <svg style={{ position:'absolute', top:12, right:12, width:32, height:32, opacity:0.35 }} viewBox="0 0 32 32">
                <path d="M32 32 L32 0 L0 0" fill="none" stroke="#C49A28" strokeWidth="1.5"/>
                <circle cx="32" cy="0" r="3" fill="#C49A28"/>
              </svg>
              <svg style={{ position:'absolute', bottom:12, left:12, width:32, height:32, opacity:0.35 }} viewBox="0 0 32 32">
                <path d="M0 0 L0 32 L32 32" fill="none" stroke="#C49A28" strokeWidth="1.5"/>
                <circle cx="0" cy="32" r="3" fill="#C49A28"/>
              </svg>
              <svg style={{ position:'absolute', bottom:12, right:12, width:32, height:32, opacity:0.35 }} viewBox="0 0 32 32">
                <path d="M32 0 L32 32 L0 32" fill="none" stroke="#C49A28" strokeWidth="1.5"/>
                <circle cx="32" cy="32" r="3" fill="#C49A28"/>
              </svg>
            </div>

            {/* Floating mandap note */}
            <div
              className="glass-gold rounded-2xl px-5 py-4 text-center"
            >
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C49A28' }}>The Wedding</p>
              <p className="text-sm font-light" style={{ color: '#5C3A2E' }}>
                A floating mandap · in the middle of a pool ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
