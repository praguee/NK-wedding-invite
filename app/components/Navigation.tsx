'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const sections = [
    { label: 'Our Story', href: '#story' },
    { label: 'Invite', href: '#invite' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Travel', href: '#travel' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'Messages', href: '#messages' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <span className="text-2xl font-light tracking-wide">N & P</span>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {sections.map((section) => (
            <a
              key={section.label}
              href={section.href}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {section.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100">
          <div className="flex flex-col py-2">
            {sections.map((section) => (
              <a
                key={section.label}
                href={section.href}
                className="px-6 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
