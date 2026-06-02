import { HOTELS } from '@/lib/constants'
import { MapPin, ExternalLink } from 'lucide-react'

export default function Accommodations() {
  return (
    <section id="accommodations" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Where to Stay
        </h2>
        <p className="text-center text-slate-500 mb-16">
          Recommended premium hotels near the venue
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {HOTELS.map((hotel) => (
            <a
              key={hotel.name}
              href={hotel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 p-7 rounded-2xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-slate-900 group-hover:text-purple-700 transition-colors">
                  {hotel.name}
                </h3>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-purple-600 flex-shrink-0 mt-0.5 transition-colors" />
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex gap-2 items-center">
                  <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                  <span>{hotel.area} · {hotel.distance} from venue</span>
                </div>
                <p className="text-slate-400">{hotel.priceRange}</p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-10">
          Have questions about accommodation? Reach out to us — we&apos;re happy to help.
        </p>
      </div>
    </section>
  )
}
