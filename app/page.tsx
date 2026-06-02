import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Story from './components/Story'
import InviteDetails from './components/InviteDetails'
import Addresses from './components/Addresses'
import Gallery from './components/Gallery'
import Accommodations from './components/Accommodations'
import Transportation from './components/Transportation'
import Timeline from './components/Timeline'
import RSVPForm from './components/RSVPForm'
import GuestBook from './components/GuestBook'
import ContactFAQ from './components/ContactFAQ'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Story />
        <InviteDetails />
        <Addresses />
        <Gallery />
        <Accommodations />
        <Transportation />
        <Timeline />
        <RSVPForm />
        <GuestBook />
        <ContactFAQ />
      </main>
      <footer className="bg-slate-900 text-white py-12 text-center">
        <p className="text-slate-400 text-sm">
          © 2026 Nidhi & Parag · Made with love
        </p>
      </footer>
    </>
  )
}
