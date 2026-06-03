import { HOTELS } from '@/lib/constants'
import { ExternalLink, MapPin } from 'lucide-react'

function PriceDots({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i <= count ? 'bg-purple-500' : 'bg-slate-200'}`}
        />
      ))}
    </div>
  )
}

export default function Accommodations() {
  return (
    <section id="accommodations" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Where to Stay
        </h2>
        <p className="text-center text-slate-500 mb-10 text-sm">
          Recommended premium hotels near the venue
        </p>

        <div className="glass-gold rounded-2xl overflow-hidden divide-y" style={{ borderColor: 'rgba(196,154,40,0.1)' }}>
          {HOTELS.map((hotel) => (
            <a
              key={hotel.name}
              href={hotel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-100 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate group-hover:text-purple-700 transition-colors">
                  {hotel.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin size={11} className="text-slate-400 flex-shrink-0" />
                  <p className="text-xs text-slate-500 truncate">
                    {hotel.area} · {hotel.distance} from venue
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <PriceDots count={hotel.price} />
                <ExternalLink size={13} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Need help with bookings? We&apos;re happy to assist.
        </p>
      </div>
    </section>
  )
}
