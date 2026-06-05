import { Phone } from 'lucide-react'
import SectionOrnament from './SectionOrnament'

const CONTACTS = [
  { name: 'Parag Khalde',      role: 'Groom',              phone: '+91 98190 48377', tel: '+919819048377' },
  { name: 'Raksha Kesarkar',   role: "Bride's Sister",     phone: '+91 91375 40056', tel: '+919137540056' },
  { name: 'Charu Kesarkar',    role: "Bride's Mom",        phone: '+91 98692 00282', tel: '+919869200282' },
  { name: 'Sushma Khalde',     role: "Groom's Mom",        phone: '+91 88501 40931', tel: '+918850140931' },
  { name: 'Mukul Khalde',      role: "Groom's Brother",    phone: '+91 79775 80983', tel: '+917977580983' },
  { name: 'Deepak Khalde',     role: "Groom's Dad",        phone: '+91 81080 99117', tel: '+918108099117' },
]

export default function ContactFAQ() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <SectionOrnament />
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Questions?
        </h2>
        <p className="text-center mb-12" style={{ color: '#9C7A5A' }}>
          Reach out to any of us — we&apos;re happy to help
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {CONTACTS.map((contact) => (
            <div key={contact.tel} className="glass-gold p-5 rounded-2xl">
              <div className="flex gap-4 items-center">
                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(196,154,40,0.1)' }}>
                  <Phone style={{ color: '#C49A28' }} size={17} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#2A1200' }}>{contact.name}</p>
                  <p className="text-xs mb-1" style={{ color: '#9C7A5A' }}>{contact.role}</p>
                  <a
                    href={`tel:${contact.tel}`}
                    className="link-gold text-sm font-medium"
                    style={{ textDecoration: 'none' }}
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
