'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const handleScrollToSection = (sectionId: string) => {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ background: 'var(--surface)' }}
    >
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Single thin horizontal line accent */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '38%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, var(--accent) 20%, var(--accent) 80%, transparent 100%)',
          opacity: 0.08,
        }}
      />

      {/* Content */}
      <div className="w-full px-6 sm:px-10 lg:px-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Overline */}
          <motion.p
            className="text-xs sm:text-sm font-medium tracking-[0.25em] uppercase mb-8"
            style={{ color: 'var(--accent)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Corporate Spend Management
          </motion.p>

          {/* Main Headline */}
          <motion.h1
            className="font-display mb-8"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Every payment,{' '}
            <br className="hidden sm:block" />
            <span
              className="font-display italic"
              style={{ color: 'var(--accent)' }}
            >
              every policy
            </span>
            — one platform.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl max-w-xl mb-12"
            style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Issue corporate cards with built-in spend policies.
            Real-time visibility. Credit lines. UPI and more.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex items-center gap-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <motion.button
              onClick={() => handleScrollToSection('product')}
              className="group relative px-8 py-4 text-sm font-semibold tracking-wide uppercase rounded-none overflow-hidden transition-all duration-300"
              style={{
                background: 'var(--accent)',
                color: 'var(--surface)',
                letterSpacing: '0.08em',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                See How It Works
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              onClick={() => handleScrollToSection('integrations')}
              className="text-sm font-medium tracking-wide transition-colors duration-300"
              style={{ color: 'var(--text-muted)' }}
              whileHover={{ color: 'var(--text-primary)' }}
            >
              View Integrations
            </motion.button>
          </motion.div>

          {/* Bottom stat line */}
          <motion.div
            className="flex items-center gap-12 mt-24 pt-8"
            style={{ borderTop: '1px solid var(--border)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { label: 'Policy Engine', value: 'Real-time' },
              { label: 'Card Issuance', value: 'Instant' },
              { label: 'Integrations', value: '20+' },
            ].map((stat, i) => (
              <div key={i}>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: 'var(--accent)' }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs tracking-wide uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, var(--surface), transparent)',
        }}
      />
    </section>
  );
}
