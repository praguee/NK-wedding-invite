export default function Timeline() {
  const events = [
    {
      time: '5:00 PM',
      title: 'Guests Arrive',
      description: 'Welcome and seating begins',
      color: 'bg-slate-400',
    },
    {
      time: '5:30 PM',
      title: 'Wedding Ceremony',
      description: 'The sacred Hindu Maharashtrian ceremony',
      color: 'bg-purple-600',
    },
    {
      time: '7:30 PM',
      title: 'Evening Refreshments',
      description: 'Light snacks and beverages',
      color: 'bg-blue-500',
    },
    {
      time: '8:00 PM',
      title: 'Reception',
      description: 'Dinner, music, and celebrations',
      color: 'bg-green-500',
    },
  ]

  return (
    <section id="timeline" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
          Schedule
        </h2>
        <p className="text-center text-slate-500 mb-16">
          Friday, December 4, 2026
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-purple-200 via-blue-200 to-green-200 hidden sm:block" />

          <div className="space-y-8">
            {events.map((event, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className={`w-12 h-12 ${event.color} rounded-full flex-shrink-0 flex items-center justify-center relative z-10`}>
                  <span className="text-white text-xs font-medium">{i + 1}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl flex-1 pt-3">
                  <p className="text-purple-600 font-medium text-sm mb-1">{event.time}</p>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">{event.title}</h3>
                  <p className="text-slate-500 text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
