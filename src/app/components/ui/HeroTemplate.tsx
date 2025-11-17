'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Mock HERO_WORDS data - replace with your actual import
const HERO_WORDS = ['Vision'];

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
      className="min-h-screen flex items-center justify-center text-center relative bg-black overflow-hidden"
    >
      {/* Animated Background - Matching Success Page */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          // animate={{
          //   rotate: [0, 120, 240, 360],
          //   scale: [1, 1.1, 0.9, 1],
          // }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

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

{/* 
          <motion.p
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Where talent meets opportunity. Where ideas become reality. Where your success story begins.
          </motion.p>
          

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
 
            <motion.button
              onClick={handleBuildClick}
              className="group relative px-10 py-4 text-lg font-semibold backdrop-blur-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Craft your product
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              onClick={handleFreelanceClick}
              className="group relative px-10 py-4 text-lg font-semibold backdrop-blur-lg bg-white/5 border border-white/10 text-white/90 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                Join as Freelancer
              </span>
            </motion.button>
          </motion.div> */}

          {/* Additional Context */}
          {/* <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-white/40 text-sm uppercase tracking-wider font-medium">
              Trusted by innovators worldwide
            </p>
            
            {/* Trust indicators 
            <div className="flex justify-center items-center gap-8 mt-6 text-white/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs">200+ Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-xs">95% Retention</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-xs">3.2x Faster</span>
              </div>
            </div>
          </motion.div> */}
        </motion.div> 
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </section>
  );
}