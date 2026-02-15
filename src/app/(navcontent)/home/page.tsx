// import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import Services from '@/components/ui/Services';
import Stats from '@/components/ui/Stats';
import Footer from '@/components/ui/Footer';
import WorkflowTabs from '@/components/ui/WorkflowTabs';
export default function HomePage() {
    return (
      <main className="min-h-screen">
        {/* <Navbar /> */}
        <Hero />
        <WorkflowTabs />
        {/* <Stats /> */}
        {/* <Services /> */}
        
        {/* <About />
        <Testimonials />
        <Contact /> */}
        {/* <Footer /> */}
      </main>
    );
  }