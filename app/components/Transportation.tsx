import { VENUE } from '@/lib/constants'
import { Car, Navigation, Clock, Info } from 'lucide-react'

export default function Transportation() {
  return (
    <section id="travel" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Getting There
        </h2>
        <p className="text-center text-slate-500 mb-16">
          Everything you need to find us
        </p>

        {/* Map Placeholder */}
        <div className="bg-gradient-to-br from-slate-200 to-slate-300 aspect-video rounded-2xl flex flex-col items-center justify-center mb-10 gap-3">
          <Navigation size={32} className="text-slate-400" />
          <p className="text-slate-500 text-sm">Abhishek Farms, Yeoor Hills, Thane</p>
          <a
            href={VENUE.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Open in Google Maps →
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-7 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-purple-50 rounded-xl">
                <Car className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Parking & Valet</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ample free parking available at Abhishek Farms. Valet parking is available at the entrance — attendants will guide you from arrival.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Navigation className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Ride Share & Taxis</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Uber and Ola are available throughout Thane. Auto-rickshaws are also easily available near local hotels.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-green-50 rounded-xl">
                <Info className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Venue Address</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  {VENUE.fullAddress}
                </p>
                <a
                  href={VENUE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-orange-50 rounded-xl">
                <Clock className="text-orange-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Arrival Time</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Please arrive by <strong>5:00 PM</strong> for the wedding ceremony starting at 5:30 PM. Reception begins at 8:00 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
