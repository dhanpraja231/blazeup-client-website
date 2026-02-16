import Hero from '@/components/ui/Hero';
import WorkflowTabs from '@/components/ui/WorkflowTabs';
import Integrations from '@/components/ui/Integrations';
import Pricing from '@/components/ui/Pricing';
import Testimonials from '@/components/ui/Testimonials';
import Footer from '@/components/ui/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WorkflowTabs />
      <Integrations />
      <Pricing />
      <Testimonials />
      <Footer />
    </main>
  );
}