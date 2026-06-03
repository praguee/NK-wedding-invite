import SectionOrnament from './SectionOrnament'

const EVENTS = [
  {
    time: '5:00 PM',
    title: 'Guests Arrive',
    desc: 'Welcome and seating begins — find your spot and settle in',
    accent: '#a78bfa',
    dot: '#a78bfa',
  },
  {
    time: '5:30 PM',
    title: 'Wedding Ceremony',
    desc: 'The sacred Hindu Maharashtrian ceremony — on a floating mandap, in the middle of a pool',
    accent: '#c084fc',
    dot: '#c084fc',
  },
  {
    time: '7:30 PM',
    title: 'Evening Refreshments',
    desc: 'Light snacks, beverages, and good company while we transition',
    accent: '#818cf8',
    dot: '#818cf8',
  },
  {
    time: '8:00 PM',
    title: 'Reception',
    desc: 'Dinner, music, dancing, and celebrations till the night gives up',
    accent: '#34d399',
    dot: '#34d399',
  },
]

export default function Timeline() {
  return (
    <section id="timeline" className="py-20 bg-white">
      <div className="max-w-lg mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Schedule
        </h2>
        <p className="text-center mb-12 text-sm" style={{ color: '#9C7A5A' }}>
          Friday, December 4, 2026
        </p>

        <div className="relative">
          {/* Vertical connecting line */}
          <div
            style={{
              position: 'absolute',
              left: 19,
              top: 20,
              bottom: 20,
              width: 1,
              background: 'linear-gradient(to bottom, #a78bfa, #c084fc, #818cf8, #34d399)',
              opacity: 0.25,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {EVENTS.map((event, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '16px 0' }}>
                {/* Dot */}
                <div style={{ flexShrink: 0, paddingTop: 3 }}>
                  <div style={{
                    width: 38, height: 38,
                    borderRadius: '50%',
                    background: `${event.dot}18`,
                    border: `1.5px solid ${event.dot}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 12px ${event.dot}22`,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: event.dot, opacity: 0.8,
                    }} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  {/* Time badge */}
                  <span style={{
                    display: 'inline-block',
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: event.accent,
                    background: `${event.accent}14`,
                    border: `1px solid ${event.accent}30`,
                    borderRadius: 100,
                    padding: '3px 10px',
                    marginBottom: 6,
                  }}>
                    {event.time}
                  </span>
                  <h3 style={{
                    fontSize: 16, fontWeight: 600,
                    color: '#1C0F0A', marginBottom: 4,
                    lineHeight: 1.3,
                  }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#7C5A3A', lineHeight: 1.6 }}>
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
