'use client'

import { motion } from 'framer-motion'
import FadeIn from '../../components/animations/FadeIn'
import { scrollToSection } from '../../lib/utils'

export default function FinalCTA() {
  return (
    <section id="contact" className="py-32 bg-gradient-cta text-white text-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <FadeIn>
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Blaze Your Trail?
          </motion.h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.p 
            className="text-xl md:text-2xl opacity-90 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of successful businesses who've transformed their vision into reality with BlazeUp.
          </motion.p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 50px rgba(255, 107, 53, 0.5), 0 0 30px rgba(255, 107, 53, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Handle CTA action - could open a modal, redirect, etc.
              console.log('Start project clicked')
            }}
            className="bg-gradient-to-r from-white to-gray-100 text-deep-navy px-12 py-5 rounded-full font-bold text-xl shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Start Your Project Today</span>
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </FadeIn>

        {/* Additional Contact Options */}
        <FadeIn delay={0.6}>
          <motion.div 
            className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-success-green rounded-full animate-pulse" />
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
              <span>Fast Response Time</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-blaze-orange rounded-full animate-pulse" />
              <span>Free Consultation</span>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  )
}