'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

export default function VideoShowcase() {
  const { light } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
      setHasStarted(true);
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: light
          ? 'linear-gradient(180deg, #f1f5f9 0%, #e0e7ef 40%, #cbd5e1 100%)'
          : 'linear-gradient(180deg, #020617 0%, #0b1120 40%, #111827 100%)',
        transition: 'background 0.5s ease',
        padding: '80px 0 100px',
      }}
    >
      {/* Subtle radial accent glow behind the video */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '600px',
          background: light
            ? 'radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, rgba(236,72,153,0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Decorative top border line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: light
            ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-block text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4"
            style={{
              color: light ? '#f97316' : '#fb923c',
              letterSpacing: '0.15em',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See It In Action
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5"
            style={{
              color: light ? '#0f172a' : '#fff',
              transition: 'color 0.3s',
              lineHeight: 1.15,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            The Complete{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f97316, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Experience
            </span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto"
            style={{
              color: light ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.5)',
              transition: 'color 0.3s',
              lineHeight: 1.7,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Watch how BlazeUp transforms your expense management — from card design
            to policy evaluation — all in one seamless flow.
          </motion.p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative mx-auto"
          style={{
            maxWidth: '1400px',
            width: '100%',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: light
              ? '0 25px 60px -12px rgba(0,0,0,0.15)'
              : '0 25px 60px -12px rgba(0,0,0,0.7)',
          }}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              transform: 'scale(1.4)',
              transformOrigin: 'center center',
            }}
          >
            <source src="/CompleteVideo.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Decorative bottom border line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: light
            ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        }}
      />
    </section>
  );
}
