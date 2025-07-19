'use client'

import { motion } from 'framer-motion'
import AnimatedText from '../animations/AnimatedText'
import { scrollToSection } from '../../lib/utils'

export default function Hero() {
  return (
    <section 
      id="hero"
      className="min-h-screen flex items-center justify-center text-center relative bg-gradient-hero overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 120, 240, 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(107, 70, 193, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Additional Gradient Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(45deg, transparent 0%, rgba(255, 107, 53, 0.02) 25%, transparent 50%),
            linear-gradient(-45deg, transparent 0%, rgba(107, 70, 193, 0.02) 25%, transparent 50%)
          `
        }}
      />

      <div className="container mx-auto px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-text-primary">Transform Your Vision Into </span>
            <br />
            <AnimatedText 
              text="Reality" 
              variant="shimmer"
              delay={0.5}
              className="block"
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect with world-class freelancers who turn ambitious ideas into exceptional results. 
            From concept to completion, we make it happen.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 40px rgba(255, 107, 53, 0.4), 0 0 20px rgba(255, 107, 53, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('services')}
              className="bg-gradient-brand text-white px-10 py-4 rounded-full font-semibold text-lg shadow-glow transition-all duration-300 hover:shadow-glow-strong relative overflow-hidden"
            >
              <span className="relative z-10">Start Your Project</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(59, 130, 246, 1)",
                color: "white",
                boxShadow: "0 15px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('testimonials')}
              className="bg-light-gray/90 text-text-primary px-10 py-4 rounded-full font-semibold text-lg border-2 border-electric-blue backdrop-blur-glass transition-all duration-300"
            >
              See Success Stories
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}