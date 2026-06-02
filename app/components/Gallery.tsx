'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const photos = [
  { id: 1, alt: 'Nidhi & Parag — Photo 1' },
  { id: 2, alt: 'Nidhi & Parag — Photo 2' },
  { id: 3, alt: 'Nidhi & Parag — Photo 3' },
  { id: 4, alt: 'Nidhi & Parag — Photo 4' },
  { id: 5, alt: 'Nidhi & Parag — Photo 5' },
  { id: 6, alt: 'Nidhi & Parag — Photo 6' },
]

export default function Gallery() {
  const [lightboxId, setLightboxId] = useState<number | null>(null)

  const currentIndex = photos.findIndex((p) => p.id === lightboxId)

  const prev = () => {
    const idx = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
    setLightboxId(photos[idx].id)
  }

  const next = () => {
    const idx = currentIndex === photos.length - 1 ? 0 : currentIndex + 1
    setLightboxId(photos[idx].id)
  }

  return (
    <section id="gallery" className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Gallery
        </h2>
        <p className="text-center text-slate-500 mb-16">Photos coming soon</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setLightboxId(photo.id)}
              className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl hover:opacity-90 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center overflow-hidden"
              aria-label={`View ${photo.alt}`}
            >
              <span className="text-slate-400 text-sm">Photo {photo.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxId !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxId(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxId(null) }}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3"
            aria-label="Previous"
          >
            <ChevronLeft size={36} />
          </button>

          <div
            className="w-full max-w-3xl aspect-[4/3] bg-slate-800 rounded-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-slate-400">Photo {currentIndex + 1}</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3"
            aria-label="Next"
          >
            <ChevronRight size={36} />
          </button>

          <p className="absolute bottom-5 text-white/60 text-sm">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      )}
    </section>
  )
}
