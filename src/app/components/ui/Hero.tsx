'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const words = ["Team", "Startup", "Idea", "Product", "Vision"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 3000) // Change word every 3 seconds

    return () => clearInterval(interval)
  }, [words.length])

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
            className="text-5xl md:text-7xl lg:text-7xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.span 
              className="text-white block mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Build Your
            </motion.span>
            
            <div className="relative inline-block min-h-[1.2em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  className="text-gradient-animated inline-block"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ 
                    opacity: [0, 0.5, 1, 1],
                    x: [20, -10, 5, 0],
                    transition: { duration: 0.6, times: [0, 0.3, 0.7, 1] }
                  }}
                  exit={{ 
                    opacity: [1, 0.5, 0],
                    x: [0, 15, -20],
                    transition: { duration: 0.4, times: [0, 0.5, 1] }
                  }}
                >
                  {words[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Transform your vision into reality with cutting-edge solutions that{' '}
            <span className="text-blaze-orange font-semibold">blaze</span>{' '}
            new trails in the digital landscape.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-blaze-orange to-rich-purple px-8 py-4 rounded-full text-white font-semibold text-lg shadow-glow hover:shadow-glow-hover transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Launch
            </motion.button>
          </motion.div>
        </motion.div> 
      </div>
    </section>
  )
}