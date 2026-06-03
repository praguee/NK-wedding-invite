import Image from 'next/image'
import { VENUE } from '@/lib/constants'
import { Car, Navigation, Clock, Info } from 'lucide-react'
import SectionOrnament from './SectionOrnament'

export default function Transportation() {
  return (
    <section id="travel" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Getting There
        </h2>
        <p className="text-center mb-12 text-sm" style={{ color: '#9C7A5A' }}>
          Everything you need to find us
        </p>

        {/* Venue photo card */}
        <div
          className="relative rounded-3xl overflow-hidden mb-10"
          style={{ height: 260, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
        >
          <Image
            src="/images/venue-cover.jpg"
            alt="Abhishek Farms — venue"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center 40%',
              filter: 'contrast(1.08) saturate(1.2) brightness(0.85)',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(5,2,15,0.85) 0%, rgba(10,5,20,0.4) 45%, rgba(0,0,0,0.1) 100%)',
          }} />
          {/* Gold shimmer top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #C49A28, transparent)',
            opacity: 0.8,
          }} />

          {/* Venue info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(196,154,40,0.85)' }}>
                  Wedding Venue
                </p>
                <h3 className="text-xl font-light mb-1">{VENUE.name}</h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {VENUE.street}, {VENUE.area}, {VENUE.city}
                </p>
              </div>
              <a
                href={VENUE.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 ml-4 text-xs font-medium px-4 py-2 rounded-full transition"
                style={{
                  background: 'linear-gradient(135deg, #C49A28, #E8C547)',
                  color: '#2A1200',
                  boxShadow: '0 2px 10px rgba(196,154,40,0.4)',
                }}
              >
                Directions →
              </a>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass-gold p-6 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(196,154,40,0.12)' }}>
                <Car style={{ color: '#C49A28' }} size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1.5" style={{ color: '#3B1F00' }}>Parking &amp; Valet</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7C5A3A' }}>
                  Ample parking available at Abhishek Farms. Valet parking is available at the entrance — attendants will guide you from arrival.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-gold p-6 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(196,154,40,0.12)' }}>
                <Navigation style={{ color: '#C49A28' }} size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1.5" style={{ color: '#3B1F00' }}>Uber, Ola & the OG Auto</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7C5A3A' }}>
                  Uber and Ola work fine, but honestly — you&apos;re in Thane. The auto-rickshaw is king here. Cheaper, faster, and you&apos;ll have a story to tell. Just say &quot;Abhishek Farms, Yeoor&quot; and hold on.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-gold p-6 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(196,154,40,0.12)' }}>
                <Info style={{ color: '#C49A28' }} size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1.5" style={{ color: '#3B1F00' }}>Address</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#7C5A3A' }}>
                  {VENUE.fullAddress}
                </p>
                <a
                  href={VENUE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium"
                  style={{ color: '#C49A28' }}
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          <div className="glass-gold p-6 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(196,154,40,0.12)' }}>
                <Clock style={{ color: '#C49A28' }} size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1.5" style={{ color: '#3B1F00' }}>Arrival Time</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7C5A3A' }}>
                  Please arrive by <strong style={{ color: '#C49A28' }}>5:00 PM</strong> for the wedding ceremony starting at 5:30 PM. Reception begins at 8:00 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
