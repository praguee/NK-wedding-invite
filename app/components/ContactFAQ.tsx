import { CONTACT } from '@/lib/constants'
import { Phone } from 'lucide-react'

export default function ContactFAQ() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Questions?
        </h2>
        <p className="text-center text-slate-500 mb-12">
          Reach out to us — we&apos;re happy to help
        </p>

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
    </section>
  )
}
