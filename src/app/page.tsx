import Header from './components/ui/Header'
import Hero from './components/ui/Hero'
import Stats from './components/ui/Stats'
import Services from './components/ui/Services'
import FinalCTA from './components/archive/FinalCTA'
import Footer from '@/components/ui/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Services />
      {/* <FinalCTA /> */}
      <Footer />
    </main>
  )
}