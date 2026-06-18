'use client'

import { VENUE, EVENT } from '@/lib/constants'
import { MapPin, Clock } from 'lucide-react'
import SectionOrnament from './SectionOrnament'
import { ScaleReveal, TextReveal } from './ScrollReveal'

export default function InviteDetails() {
  return (
    <section id="invite" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <SectionOrnament />
        <TextReveal delay={0.05}>
          <h2 className="text-4xl md:text-5xl font-extralight text-center mb-16 tracking-tight">
            You&apos;re Invited
          </h2>
        </TextReveal>

        <div className="space-y-6">

          <ScaleReveal delay={0.1}>
            <div className="glass-gold p-8 rounded-2xl">
              <div className="flex gap-5 items-start">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(196,154,40,0.1)' }}>
                  <Clock style={{ color: '#C49A28' }} size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#9C7A5A' }}>
                    Wedding Ceremony
                  </p>
                  <h3 className="text-2xl font-light mb-1" style={{ color: '#2A1200' }}>
                    {EVENT.weddingTime}
                  </h3>
                  <p style={{ color: '#7C5A3A' }}>Friday, December 4, 2026</p>
                </div>
              </div>
            </div>
          </ScaleReveal>

          <ScaleReveal delay={0.2}>
            <div className="glass-gold p-8 rounded-2xl">
              <div className="flex gap-5 items-start">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(196,154,40,0.1)' }}>
                  <Clock style={{ color: '#C49A28' }} size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#9C7A5A' }}>
                    Reception
                  </p>
                  <h3 className="text-2xl font-light mb-1" style={{ color: '#2A1200' }}>
                    {EVENT.receptionTime} onwards
                  </h3>
                  <p style={{ color: '#7C5A3A' }}>Friday, December 4, 2026</p>
                </div>
              </div>
            </div>
          </ScaleReveal>

          <ScaleReveal delay={0.3}>
            <div className="glass-gold p-8 rounded-2xl">
              <div className="flex gap-5 items-start">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(139,34,82,0.08)' }}>
                  <MapPin style={{ color: '#8B2252' }} size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#9C7A5A' }}>
                    Venue
                  </p>
                  <h3 className="text-2xl font-light mb-2" style={{ color: '#2A1200' }}>
                    {VENUE.name}
                  </h3>
                  <p className="leading-relaxed mb-4" style={{ color: '#7C5A3A' }}>
                    {VENUE.fullAddress}
                  </p>
                  <a
                    href={VENUE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-gold text-sm font-medium"
                    style={{ textDecoration: 'none' }}
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </ScaleReveal>

        </div>
      </div>
    </section>
  )
}
