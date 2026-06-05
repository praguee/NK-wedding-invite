'use client'

import Image from 'next/image'
import { VENUE } from '@/lib/constants'
import { Car, Navigation, MapPin } from 'lucide-react'
import SectionOrnament from './SectionOrnament'
import { StaggerContainer, StaggerItem } from './ScrollReveal'
import { motion } from 'framer-motion'

export default function Transportation() {
  return (
    <section id="travel" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Venue & Getting There
        </h2>
        <p className="text-center mb-12 text-sm" style={{ color: '#9C7A5A' }}>
          Everything you need to find us — and get home safely
        </p>

        {/* Venue photo card */}
        <div
          className="relative rounded-3xl overflow-hidden mb-8"
          style={{ height: 300, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
        >
          <Image
            src="/images/venue-cover.jpg"
            alt="Abhishek Farms — venue"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center 40%',
              filter: 'contrast(1.08) saturate(1.15) brightness(0.82)',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(5,2,15,0.9) 0%, rgba(10,5,20,0.35) 45%, rgba(0,0,0,0.05) 100%)',
          }} />
          {/* Gold shimmer top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #C49A28, transparent)',
            opacity: 0.9,
          }} />

          {/* Venue info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(196,154,40,0.9)' }}>
                  Wedding Venue · December 4, 2026
                </p>
                <h3 className="text-2xl font-light mb-1">{VENUE.name}</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Narlepada, Yeoor Hills · Thane West, Maharashtra
                </p>
              </div>
              <motion.a
                href={VENUE.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
                  color: '#2A1200',
                  boxShadow: '0 2px 12px rgba(196,154,40,0.45)',
                  textDecoration: 'none',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                Directions →
              </motion.a>
            </div>
          </div>
        </div>

        {/* Address card */}
        <div className="glass-gold p-6 rounded-2xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(139,34,82,0.1)' }}>
                <MapPin style={{ color: '#8B2252' }} size={18} />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase font-semibold mb-1" style={{ color: '#9C7A5A' }}>Address</p>
                <p className="text-sm leading-relaxed" style={{ color: '#3B1F00' }}>{VENUE.fullAddress}</p>
              </div>
            </div>
            <motion.a
              href={VENUE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full text-center"
              style={{
                background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)',
                color: '#2A1200',
                textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(196,154,40,0.3)',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              Open in Google Maps →
            </motion.a>
          </div>
        </div>

        {/* Transport info cards */}
        <StaggerContainer className="grid md:grid-cols-2 gap-5">

          {/* Card 1: Parking */}
          <StaggerItem>
            <div className="glass-gold p-6 rounded-2xl h-full">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(196,154,40,0.12)' }}>
                  <Car style={{ color: '#C49A28' }} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5" style={{ color: '#3B1F00' }}>Parking & Valet</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7C5A3A' }}>
                    Ample parking at Abhishek Farms. Valet attendants will guide you from the entrance — just roll up and hand over the keys.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Card 2: Getting There */}
          <StaggerItem>
            <div className="glass-gold p-6 rounded-2xl h-full">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(196,154,40,0.12)' }}>
                  <Navigation style={{ color: '#C49A28' }} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5" style={{ color: '#3B1F00' }}>Getting to the Venue</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7C5A3A' }}>
                    Uber, Ola, and autos work fine heading <em>up</em> to Yeoor Hills. Tell your driver:{' '}
                    <strong style={{ color: '#3B1F00' }}>&ldquo;Abhishek Farms, Narlepada, Yeoor Hills, Thane West&rdquo;</strong>
                    {' '}— about 20 mins from Thane station.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Card 3: Getting Back Down — SPECIAL */}
          <StaggerItem className="md:col-span-2">
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(139,34,82,0.08) 0%, rgba(196,154,40,0.08) 100%)',
                border: '1.5px solid rgba(139,34,82,0.22)',
                boxShadow: '0 2px 20px rgba(139,34,82,0.08)',
              }}
            >
              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(139,34,82,0.12)' }}>
                  <Car style={{ color: '#8B2252' }} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-semibold" style={{ color: '#3B1F00' }}>Getting Back Down the Hill</h3>
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #B8850A, #E8C547)',
                        color: '#2A1200',
                      }}
                    >
                      ★ We&apos;ve arranged this
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#7C5A3A' }}>
                    After the reception, getting an auto or Uber/Ola from Yeoor Hills at night can be a bit of a mission — they don&apos;t venture up here much. So we&apos;ve sorted it.{' '}
                    <strong style={{ color: '#3B1F00' }}>Cars with drivers will be stationed at the venue all evening</strong>{' '}
                    to drop guests back down to Thane city, where you can easily pick up a ride home. Just find us before you&apos;re ready to leave and we&apos;ll get you a car.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>

        </StaggerContainer>
      </div>
    </section>
  )
}
