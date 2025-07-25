'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HERO_WORDS } from '@/data';

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleBuildClick = () => {
    router.push('/build');
  };

  const handleFreelanceClick = () => {
    router.push('/freelance');
  };

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

      <div className="container mx-auto mb-20 px-8 relative z-10">
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
                  {HERO_WORDS[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>
          
          {/* Call to Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            {(() => {
              // COLOR SCHEME OPTIONS - Uncomment one to use:
              
              // Option 1: Pink & Purple (Current)
              const colors = {
                primary: { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(244, 63, 94, 0.1)', text: 'ftext-pink-400', hoverText: 'group-hover:text-pink-300', hoverBg: 'rgba(236, 72, 153, 0.15)', hoverBorder: 'rgba(236, 72, 153, 0.8)' },
                secondary: { bg: 'rgba(147, 51, 234, 0.1)', border: 'rgba(147, 51, 234, 0.1)', text: 'ftext-purple-500', hoverText: 'group-hover:text-purple-300', hoverBg: 'rgba(147, 51, 234, 0.15)', hoverBorder: 'rgba(147, 51, 234, 0.8)' }
              };
              
              return (
                <>
                  {/* Build Button */}
                  <motion.button
                    onClick={handleBuildClick}
                    className={`group relative px-10 py-4 text-lg font-semibold bg-transparent border-2 ${colors.primary.text} rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm`}
                    style={{
                      background: colors.primary.bg,
                      borderColor: colors.primary.border
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: colors.primary.hoverBg,
                      borderColor: colors.primary.hoverBorder
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={`relative z-10 transition-colors duration-300 ${colors.primary.hoverText}`}>
                      Build
                    </span>
                  </motion.button>

                  {/* Freelance Button */}
                  <motion.button
                    onClick={handleFreelanceClick}
                    className={`group relative px-10 py-4 text-lg font-semibold bg-transparent border-2 ${colors.secondary.text} rounded-xl overflow-hidden transition-all duration-300 backdrop-blur-sm`}
                    style={{
                      background: colors.secondary.bg,
                      borderColor: colors.secondary.border
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: colors.secondary.hoverBg,
                      borderColor: colors.secondary.hoverBorder
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={`relative z-10 transition-colors duration-300 ${colors.secondary.hoverText}`}>
                      Freelance
                    </span>
                  </motion.button>
                </>
              );
            })()}
          </motion.div>
        </motion.div> 
      </div>
    </section>
  );
}