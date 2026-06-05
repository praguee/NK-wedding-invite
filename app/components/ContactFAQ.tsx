import { CONTACT } from '@/lib/constants'
import { Phone } from 'lucide-react'
import SectionOrnament from './SectionOrnament'

export default function ContactFAQ() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Questions?
        </h2>
        <p className="text-center mb-12" style={{ color: '#9C7A5A' }}>
          Reach out to us — we&apos;re happy to help
        </p>

        <div className="space-y-4">
          {[CONTACT.primary, CONTACT.secondary].map((contact) => (
            <div key={contact.name} className="glass-gold p-6 rounded-2xl">
              <div className="flex gap-4 items-center">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(196,154,40,0.1)' }}>
                  <Phone style={{ color: '#C49A28' }} size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm mb-0.5" style={{ color: '#2A1200' }}>{contact.name}</p>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="link-gold font-medium"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
