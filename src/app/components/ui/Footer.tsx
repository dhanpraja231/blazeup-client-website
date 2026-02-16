'use client'

import { motion } from 'framer-motion'
import { scrollToSection } from '../../lib/utils'

export default function Footer() {
  return (
    <footer className="bg-dark-gray text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-8">
        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-gradient animate-gradient-shift font-bold text-xl cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              BlazeUp
            </motion.div>

            {/* Copyright */}
            <p className="text-text-secondary">
              &copy; 2026 BlazeUp. All rights reserved. Transforming visions into reality.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, index) => (
                <motion.button
                  key={social}
                  whileHover={{ 
                    scale: 1.1,
                    color: "#FF6B35"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="text-text-secondary hover:text-blaze-orange transition-colors duration-300"
                  onClick={() => {
                    console.log(`${social} clicked`)
                    // Handle social media links
                  }}
                >
                  <span className="sr-only">{social}</span>
                  {/* Replace with actual social icons */}
                  <div className="w-6 h-6 bg-current rounded opacity-60 hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}