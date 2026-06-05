import { ADDRESSES } from '@/lib/constants'
import { MapPin } from 'lucide-react'
import SectionOrnament from './SectionOrnament'

export default function Addresses() {
  const mapUrl = (address: string) =>
    `https://maps.google.com/?q=${encodeURIComponent(address)}`

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Where to Find Us
        </h2>
        <p className="text-center mb-16" style={{ color: '#9C7A5A' }}>
          Visit us before the big day
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-gold p-8 rounded-2xl">
            <div className="flex gap-3 items-center mb-6">
              <MapPin style={{ color: '#8B2252' }} size={20} />
              <span className="text-xs uppercase tracking-widest" style={{ color: '#9C7A5A' }}>Bride&apos;s Home</span>
            </div>
            <p className="font-medium mb-3" style={{ color: '#2A1200' }}>{ADDRESSES.bride.name}</p>
            <address className="not-italic text-sm leading-relaxed mb-6" style={{ color: '#7C5A3A' }}>
              {ADDRESSES.bride.street}<br />
              {ADDRESSES.bride.area}<br />
              {ADDRESSES.bride.city}, {ADDRESSES.bride.state} {ADDRESSES.bride.zip}
            </address>
            <a
              href={mapUrl(ADDRESSES.bride.fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-gold text-sm font-medium"
            >
              Get Directions →
            </a>
          </div>

          <div className="glass-gold p-8 rounded-2xl">
            <div className="flex gap-3 items-center mb-6">
              <MapPin style={{ color: '#C49A28' }} size={20} />
              <span className="text-xs uppercase tracking-widest" style={{ color: '#9C7A5A' }}>Groom&apos;s Home</span>
            </div>
            <p className="font-medium mb-3" style={{ color: '#2A1200' }}>{ADDRESSES.groom.name}</p>
            <address className="not-italic text-sm leading-relaxed mb-6" style={{ color: '#7C5A3A' }}>
              {ADDRESSES.groom.street}<br />
              {ADDRESSES.groom.area}<br />
              {ADDRESSES.groom.city}, {ADDRESSES.groom.state} {ADDRESSES.groom.zip}
            </address>
            <a
              href={mapUrl(ADDRESSES.groom.fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-gold text-sm font-medium"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
