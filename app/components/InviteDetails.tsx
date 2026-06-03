import { VENUE, EVENT } from '@/lib/constants'
import { MapPin, Clock } from 'lucide-react'
import SectionOrnament from './SectionOrnament'

export default function InviteDetails() {
  return (
    <section id="invite" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-16 tracking-tight">
          You&apos;re Invited
        </h2>

        <div className="space-y-6">
          <div className="glass-gold p-8 rounded-2xl">
            <div className="flex gap-5 items-start">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Clock className="text-purple-600" size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Wedding Ceremony</p>
                <h3 className="text-2xl font-light text-slate-900 mb-1">{EVENT.weddingTime}</h3>
                <p className="text-slate-500">Friday, December 4, 2026</p>
              </div>
            </div>
          </div>

          <div className="glass-gold p-8 rounded-2xl">
            <div className="flex gap-5 items-start">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="text-blue-600" size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Reception</p>
                <h3 className="text-2xl font-light text-slate-900 mb-1">{EVENT.receptionTime} onwards</h3>
                <p className="text-slate-500">Friday, December 4, 2026</p>
              </div>
            </div>
          </div>

          <div className="glass-gold p-8 rounded-2xl">
            <div className="flex gap-5 items-start">
              <div className="p-3 bg-green-50 rounded-xl">
                <MapPin className="text-green-600" size={22} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Venue</p>
                <h3 className="text-2xl font-light text-slate-900 mb-2">{VENUE.name}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{VENUE.fullAddress}</p>
                <a
                  href={VENUE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
