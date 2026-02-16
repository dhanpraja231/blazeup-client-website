'use client';

import { motion } from 'framer-motion';

const companies = [
  { name: 'Solinas', logo: '🏢' },
  { name: 'XYMA Analytics', logo: '📊' },
  { name: 'NeoMotion', logo: '🚀' },
  { name: 'KCat', logo: '💼' }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-20 sm:py-32 overflow-hidden" style={{ background: 'var(--dark-gray)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Letters of <span className="text-gradient-animated">Interest</span>
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Leading companies that have expressed interest in partnering with BlazeUp to transform their expense management.
          </motion.p>
        </motion.div>

        {/* Company Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              className="group relative aspect-square rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300"
              style={{ 
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(99,102,241,0.2)'
              }}
            >
              {/* Logo emoji placeholder */}
              <div className="text-6xl mb-4">
                {company.logo}
              </div>

              {/* Company name */}
              <h4 className="text-sm font-semibold text-center text-white">
                {company.name}
              </h4>

              {/* Hover gradient */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ 
                  background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05), transparent)'
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA removed - just clean logo display */}
      </div>
    </section>
  );
}
