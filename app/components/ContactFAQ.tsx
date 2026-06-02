'use client'

import { useState } from 'react'
import { CONTACT, FAQ } from '@/lib/constants'
import { ChevronDown, Phone } from 'lucide-react'

export default function ContactFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-16 tracking-tight">
          Questions?
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-xl font-light text-slate-900 mb-8">Get in Touch</h3>
            <div className="space-y-4">
              {[CONTACT.primary, CONTACT.secondary].map((contact) => (
                <div key={contact.name} className="bg-slate-50 p-6 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="p-2.5 bg-purple-50 rounded-xl">
                      <Phone className="text-purple-600" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{contact.name}</p>
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, '')}`}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-xl font-light text-slate-900 mb-8">FAQ</h3>
            <div className="space-y-3">
              {FAQ.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 p-5 rounded-2xl transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-medium text-slate-900 text-sm">{item.question}</p>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {openIdx === idx && (
                    <p className="text-slate-600 text-sm mt-3 leading-relaxed">{item.answer}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
