'use client'

import { ADDRESSES } from '@/lib/constants'
import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionOrnament from './SectionOrnament'
import { StaggerContainer, StaggerItem } from './ScrollReveal'

export default function Addresses() {
  const mapUrl = (address: string) =>
    `https://maps.google.com/?q=${encodeURIComponent(address)}`

  return (
    <section className="py-24 bg-white" aria-labelledby="addresses-heading">
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <h2 id="addresses-heading" className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Where to Find Us
        </h2>
        <p className="text-center mb-16" style={{ color: '#9C7A5A' }}>
          Visit us before the big day
        </p>

        <StaggerContainer className="grid md:grid-cols-2 gap-8">

          <StaggerItem>
            <motion.div
              className="glass-gold p-8 rounded-2xl h-full"
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(196,154,40,0.16)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-3 items-center mb-6">
                <MapPin style={{ color: '#8B2252' }} size={20} aria-hidden="true" />
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
                aria-label={`Get directions to ${ADDRESSES.bride.name}'s home`}
              >
                Get Directions →
              </a>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              className="glass-gold p-8 rounded-2xl h-full"
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(196,154,40,0.16)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-3 items-center mb-6">
                <MapPin style={{ color: '#C49A28' }} size={20} aria-hidden="true" />
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
                aria-label={`Get directions to ${ADDRESSES.groom.name}'s home`}
              >
                Get Directions →
              </a>
            </motion.div>
          </StaggerItem>

        </StaggerContainer>
      </div>
    </section>
  )
}
