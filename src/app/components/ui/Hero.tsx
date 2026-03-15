'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Corporate spends REIMAGINED.';
  const typingSpeed = 50;

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
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const typingDone = displayedText.length === fullText.length;

  // Split text: "Corporate spends " (0-17) and "REIMAGINED." (17+)
  const line1 = displayedText.slice(0, Math.min(displayedText.length, 17));
  const line2 = displayedText.length > 17 ? displayedText.slice(17) : '';

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ background: '#020a06' }}
    >
      {/* === Background Gradient Layers === */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(5,150,105,0.15) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 60% 80% at 70% 30%, rgba(16,185,129,0.08) 0%, transparent 60%), ' +
            'linear-gradient(160deg, #020a06 0%, #022c22 30%, #064e3b 55%, #022c22 80%, #020a06 100%)',
        }}
      />

      {/* === Dot Pattern Overlay === */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(16,185,129,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* === Glowing Orbs === */}
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: '500px',
          height: '500px',
          top: '10%',
          left: '-5%',
          background: 'rgba(5,150,105,0.2)',
        }}
      />
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: '400px',
          height: '400px',
          bottom: '5%',
          right: '10%',
          background: 'rgba(16,185,129,0.12)',
        }}
      />
      <div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: '200px',
          height: '200px',
          top: '60%',
          left: '40%',
          background: 'rgba(52,211,153,0.08)',
        }}
      />

      {/* === Content === */}
      <div className="w-full px-6 sm:px-10 lg:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-30">

          {/* Left Side — Text */}
          <div className="flex-1 text-left max-w-4xl pl-6 sm:pl-8 lg:pl-30">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white whitespace-nowrap">{line1}</span>
                {line2 && (
                  <>
                    <br />
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #34d399, #6ee7b7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {line2}
                    </span>
                  </>
                )}
                {!typingDone && (
                  <span
                    className="inline-block w-[3px] h-[0.85em] ml-1 animate-pulse align-middle"
                    style={{ background: '#10b981' }}
                  />
                )}
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg sm:text-xl mb-10 leading-relaxed max-w-xl"
                style={{ color: 'rgba(167,212,194,0.7)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: typingDone ? 1 : 0, y: typingDone ? 0 : 10 }}
                transition={{ duration: 0.6 }}
              >
                Policies built into every payment. Real-time visibility. Credit Lines. UPI and more.
              </motion.p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: typingDone ? 1 : 0, y: typingDone ? 0 : 10 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.button
                onClick={() => handleScrollToSection('product')}
                className="group relative px-8 py-4 text-base font-semibold text-white rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  boxShadow: '0 4px 25px rgba(16,185,129,0.35), 0 0 60px rgba(16,185,129,0.1)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 6px 35px rgba(16,185,129,0.5), 0 0 80px rgba(16,185,129,0.15)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  See How It Works
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Side — Card Image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: typingDone ? 1 : 0, x: typingDone ? 0 : 60 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5)) drop-shadow(0 10px 20px rgba(16,185,129,0.15))',
              }}
            >
              <Image
                src="/Hero_Image_NoBG.png"
                alt="Premium corporate credit cards"
                width={800}
                height={800}
                priority
                className="w-[75vw] sm:w-[55vw] lg:w-[38vw] h-auto"
              />
            </motion.div>
          </motion.div>
            

        </div>
      </div>

      {/* === Bottom Fade === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, #0a0a0a, transparent)',
        }}
      />
    </section>
  );
}
