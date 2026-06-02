export default function Story() {
  return (
    <section id="story" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extralight text-center mb-16 tracking-tight">
          Our Story
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <p className="text-lg text-slate-600 leading-relaxed">
              Our story is one of friendship, laughter, and a love that grew quietly and beautifully over time. We found in each other not just a partner, but a best friend.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              We can&apos;t wait to celebrate the beginning of our forever with the people who matter most to us.
            </p>
            <p className="text-slate-400 text-sm italic">
              — More of our story coming soon
            </p>
          </div>

          <div className="order-1 md:order-2 aspect-[4/5] bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
            <p className="text-slate-400 text-sm">Photo coming soon</p>
          </div>
        </div>
      </div>
    </section>
  )
}
