import { ADDRESSES } from '@/lib/constants'
import { MapPin } from 'lucide-react'

export default function Addresses() {
  const mapUrl = (address: string) =>
    `https://maps.google.com/?q=${encodeURIComponent(address)}`

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Where to Find Us
        </h2>
        <p className="text-center text-slate-500 mb-16">
          Visit us before the big day
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-2xl">
            <div className="flex gap-3 items-center mb-6">
              <MapPin className="text-purple-600" size={20} />
              <span className="text-xs uppercase tracking-widest text-slate-500">Bride&apos;s Home</span>
            </div>
            <p className="font-medium text-slate-900 mb-3">{ADDRESSES.bride.name}</p>
            <address className="not-italic text-slate-600 text-sm leading-relaxed mb-6">
              {ADDRESSES.bride.street}<br />
              {ADDRESSES.bride.area}<br />
              {ADDRESSES.bride.city}, {ADDRESSES.bride.state} {ADDRESSES.bride.zip}
            </address>
            <a
              href={mapUrl(ADDRESSES.bride.fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Get Directions →
            </a>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl">
            <div className="flex gap-3 items-center mb-6">
              <MapPin className="text-blue-600" size={20} />
              <span className="text-xs uppercase tracking-widest text-slate-500">Groom&apos;s Home</span>
            </div>
            <p className="font-medium text-slate-900 mb-3">{ADDRESSES.groom.name}</p>
            <address className="not-italic text-slate-600 text-sm leading-relaxed mb-6">
              {ADDRESSES.groom.street}<br />
              {ADDRESSES.groom.area}<br />
              {ADDRESSES.groom.city}, {ADDRESSES.groom.state} {ADDRESSES.groom.zip}
            </address>
            <a
              href={mapUrl(ADDRESSES.groom.fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
