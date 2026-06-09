'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SectionOrnament from '../components/SectionOrnament'

const MENU = [
  {
    id: 'arrival',
    title: 'On Arrival',
    subtitle: 'As you find your seat',
    items: [
      { name: 'Pani Puri Station', description: 'Live counter with tamarind & mint water' },
      { name: 'Dahi Sev Puri', description: 'Crisp shells, yoghurt, fresh chutneys' },
      { name: 'Hara Bhara Kebab', description: 'Spinach & pea cakes, mint chutney' },
      { name: 'Paneer Tikka', description: 'Tandoor-spiced cottage cheese, onion salad' },
      { name: 'Veg Spring Rolls', description: 'Crispy rolls with sweet chilli dip' },
    ],
  },
  {
    id: 'mains',
    title: 'Main Course',
    subtitle: 'The heart of the feast',
    items: [
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils, cream, butter' },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato gravy' },
      { name: 'Dum Aloo', description: 'Baby potatoes in aromatic Kashmiri sauce' },
      { name: 'Mixed Vegetable Sabzi', description: 'Seasonal vegetables, dry spice blend' },
      { name: 'Biryani', description: 'Fragrant long-grain rice, whole spices, saffron' },
      { name: 'Naan & Phulka', description: 'Tandoor breads, butter on request' },
      { name: 'Steamed Rice', description: 'Basmati, with papad & pickle' },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    subtitle: 'Sweet endings',
    items: [
      { name: 'Gulab Jamun', description: 'Warm milk-solid dumplings in rose syrup' },
      { name: 'Gajar Halwa', description: 'Slow-cooked carrot pudding, topped with rabri' },
      { name: 'Rasmalai', description: 'Soft cottage cheese discs in chilled saffron milk' },
      { name: 'Kulfi', description: 'Pistachio & rose, on a stick' },
      { name: 'Wedding Cake', description: 'Cut at 9 PM — you will know when' },
    ],
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

export default function MenuPage() {
  return (
    <main
      className="min-h-screen py-20 px-4"
      style={{ background: '#FFFDF6' }}
    >
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-12 text-xs uppercase tracking-widest transition-colors"
          style={{ color: '#9C7A5A' }}
        >
          ← Invitation
        </Link>
        <SectionOrnament />

        <h1 className="text-4xl md:text-5xl font-extralight text-center mb-3 tracking-tight">
          The Menu
        </h1>
        <p className="text-center text-sm mb-20" style={{ color: '#9C7A5A' }}>
          December 4 · Abhishek Farms
        </p>

        <div className="space-y-20">
          {MENU.map((section) => (
            <motion.section
              key={section.id}
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              {/* Section header */}
              <div className="text-center mb-10">
                <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: '#C49A28' }}>
                  {section.title}
                </p>
                <p className="text-sm font-light" style={{ color: '#9C7A5A' }}>
                  {section.subtitle}
                </p>
                <div
                  className="mx-auto mt-5"
                  style={{
                    width: 40,
                    height: 1,
                    background: 'linear-gradient(to right, transparent, #C49A28, transparent)',
                  }}
                />
              </div>

              {/* Items */}
              <div className="glass-gold rounded-2xl overflow-hidden divide-y" style={{ borderColor: 'rgba(196,154,40,0.1)' }}>
                {section.items.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    className="flex items-start justify-between px-6 py-4 gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#2A1200' }}>
                        {item.name}
                      </p>
                      <p className="text-xs mt-0.5 font-light" style={{ color: '#9C7A5A' }}>
                        {item.description}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      style={{ color: 'rgba(196,154,40,0.35)', fontSize: 16, flexShrink: 0, marginTop: 2 }}
                    >
                      ✦
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <p className="text-center text-xs mt-20" style={{ color: 'rgba(156,122,90,0.5)' }}>
          Menu subject to change · All dishes vegetarian
        </p>
      </div>
    </main>
  )
}
