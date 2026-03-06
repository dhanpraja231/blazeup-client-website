'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Corporate spends REIMAGINED.';
  const typingSpeed = 50;
  const { light } = useTheme();

  useEffect(() => {
    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [displayedText]);

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
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: light ? '#f8fafc' : 'var(--dark-gray)',
        transition: 'background 0.4s',
      }}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight min-h-[1.2em]"
              style={{ color: light ? '#0f172a' : '#fff', transition: 'color 0.3s' }}
            >
              {displayedText}
              <span className="inline-block w-1 h-[0.9em] bg-indigo-500 ml-1 animate-pulse align-middle" 
                    style={{ 
                      opacity: displayedText.length < fullText.length ? 1 : 0,
                      transition: 'opacity 0.3s'
                    }}
              />
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
              style={{ color: light ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: displayedText.length === fullText.length ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              Policies built into every payment. Real-time visibility. Credit Lines. UPI and more.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: displayedText.length === fullText.length ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              onClick={() => handleScrollToSection('product')}
              className="group relative px-8 py-4 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl overflow-hidden transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                See How It Works
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

          </motion.div>
        </div>
      </div>
    </section>
  );
}