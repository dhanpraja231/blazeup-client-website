'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock HERO_WORDS data - replace with your actual import
const HERO_WORDS = ['Dreams', 'Vision', 'Future', 'Success', 'Impact', 'Legacy'];

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="hero"
      className="min-h-screen flex items-center justify-center text-center relative overflow-hidden"
      style={{ background: 'var(--dark-gray)' }}
    >
      

      <div className="container mx-auto mb-20 px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent inline-block"
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
                  {HERO_WORDS[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Where talent meets opportunity. Where ideas become reality. Where your success story begins.
          </motion.p>
          
          {/* Call to Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            {/* Get Started Button */}
            <motion.button
              onClick={() => handleScrollToSection('product')}
              className="group relative px-10 py-4 text-lg font-semibold backdrop-blur-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Product
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Learn More Button */}
            <motion.button
              onClick={() => handleScrollToSection('pricing')}
              className="group relative px-10 py-4 text-lg font-semibold backdrop-blur-lg bg-white/5 border border-white/10 text-white/90 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                View Pricing
              </span>
            </motion.button>
          </motion.div>
        </motion.div> 
      </div>
    </section>
  );
}