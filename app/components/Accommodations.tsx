'use client'

import { HOTELS } from '@/lib/constants'
import { ExternalLink, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import { StaggerContainer, StaggerItem } from './ScrollReveal'

function PriceDots({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 items-center" aria-label={`Price: ${count} out of 4`}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: i <= count ? '#C49A28' : 'rgba(196,154,40,0.18)' }}
        />
      ))}
    </div>
  )
}

export default function Accommodations() {
  return (
    <section id="accommodations" className="py-20 bg-white" aria-labelledby="hotels-heading">
      <div className="max-w-2xl mx-auto px-6">
        <SectionOrnament />
        <h2 id="hotels-heading" className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          Where to Stay
        </h2>
        <p className="text-center mb-10 text-sm" style={{ color: '#9C7A5A' }}>
          Recommended premium hotels near the venue
        </p>

        <StaggerContainer>
          <div className="glass-gold rounded-2xl overflow-hidden divide-y" style={{ borderColor: 'rgba(196,154,40,0.1)' }}>
            {HOTELS.map((hotel) => (
              <StaggerItem key={hotel.name}>
                <motion.a
                  href={hotel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-4 transition-colors"
                  style={{ display: 'flex' }}
                  whileHover={{ background: 'rgba(196,154,40,0.05)' }}
                  aria-label={`${hotel.name}, ${hotel.area}, ${hotel.distance} from venue`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#2A1200' }}>
                      {hotel.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin size={11} style={{ color: '#C4B09A', flexShrink: 0 }} aria-hidden="true" />
                      <p className="text-xs truncate" style={{ color: '#9C7A5A' }}>
                        {hotel.area} · {hotel.distance} from venue
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <PriceDots count={hotel.price} />
                    <ExternalLink size={13} style={{ color: '#C4B09A' }} aria-hidden="true" />
                  </div>
                </motion.a>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <p className="text-center text-xs mt-5" style={{ color: '#9C7A5A' }}>
          Need help with bookings? We&apos;re happy to assist.
        </p>
      </div>
    </section>
  )
}
