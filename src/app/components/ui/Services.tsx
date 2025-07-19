'use client'

import { motion } from 'framer-motion'
import FadeIn from '../../components/animations/FadeIn'

interface Service {
  icon: string
  title: string
  description: string
  delay: number
}

const services: Service[] = [
  {
    icon: '🎨',
    title: 'Design & Creative',
    description: 'Brand identity, UI/UX design, graphic design, and creative campaigns that captivate your audience and drive results.',
    delay: 0
  },
  {
    icon: '⚡',
    title: 'Development & Tech',
    description: 'Full-stack development, mobile apps, AI solutions, and cutting-edge technology implementations.',
    delay: 0.1
  },
  {
    icon: '📈',
    title: 'Marketing & Growth',
    description: 'Digital marketing, SEO, content strategy, and growth hacking to scale your business exponentially.',
    delay: 0.2
  },
  {
    icon: '💼',
    title: 'Business Strategy',
    description: 'Consulting, market research, business planning, and strategic guidance from industry experts.',
    delay: 0.3
  },
  {
    icon: '✍️',
    title: 'Content & Writing',
    description: 'Compelling copy, technical writing, content marketing, and storytelling that converts.',
    delay: 0.4
  },
  {
    icon: '🤖',
    title: 'AI & Automation',
    description: 'Machine learning, AI integration, process automation, and intelligent solutions for modern businesses.',
    delay: 0.5
  }
]

function ServiceCard({ service }: { service: Service }) {
  return (
    <FadeIn delay={service.delay}>
      <motion.div
        whileHover={{ 
          y: -15, 
          scale: 1.02,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)"
        }}
        className="bg-light-gray p-8 rounded-3xl border-gradient relative overflow-hidden group transition-all duration-300 h-full"
      >
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blaze-orange via-rich-purple to-electric-blue bg-200 animate-gradient-flow" />
        
        {/* Service Icon */}
        <motion.div
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 30px rgba(255, 107, 53, 0.4)"
          }}
          className="w-20 h-20 bg-gradient-brand rounded-3xl flex items-center justify-center text-3xl mb-6 transition-all duration-300"
        >
          {service.icon}
        </motion.div>

        {/* Service Title */}
        <h3 className="text-2xl font-semibold text-text-primary mb-4">
          {service.title}
        </h3>

        {/* Service Description */}
        <p className="text-text-secondary leading-relaxed">
          {service.description}
        </p>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blaze-orange/5 to-rich-purple/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </motion.div>
    </FadeIn>
  )
}

export default function Services() {
  return (
    <section id="services" className="py-32 bg-gradient-services">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Services We Deliver
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              From design to development, marketing to strategy - we've got the talent you need
            </p>
          </FadeIn>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}