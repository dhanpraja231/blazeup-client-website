'use client';

import { motion } from 'framer-motion';
import { Slack, Github, Figma, Chrome, Database, Cloud, Cpu, Lock } from 'lucide-react';

const integrations = [
  { icon: Slack, name: 'Slack', color: '#E01E5A' },
  { icon: Github, name: 'GitHub', color: '#6366F1' },
  { icon: Figma, name: 'Figma', color: '#A855F7' },
  { icon: Chrome, name: 'Chrome', color: '#10B981' },
  { icon: Database, name: 'Database', color: '#F59E0B' },
  { icon: Cloud, name: 'Cloud Storage', color: '#3B82F6' },
  { icon: Cpu, name: 'API Platform', color: '#EF4444' },
  { icon: Lock, name: 'Security', color: '#8B5CF6' }
];

export default function Integrations() {
  return (
    <section id="integrations" className="relative py-20 sm:py-32 overflow-hidden" style={{ background: 'var(--medium-gray)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

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
            Seamless <span className="text-gradient-animated">Integrations</span>
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with your favorite tools and services. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </motion.p>
        </motion.div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={index}
                className="group relative aspect-square rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer"
                style={{ 
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: integration.color + '40'
                }}
              >
                {/* Icon with glow effect */}
                <div 
                  className="relative mb-4 transition-all duration-300 group-hover:scale-110"
                >
                  <div 
                    className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                    style={{ background: integration.color }}
                  />
                  <Icon 
                    className="w-12 h-12 sm:w-16 sm:h-16 relative z-10 transition-colors duration-300" 
                    style={{ color: integration.color }}
                  />
                </div>

                {/* Name */}
                <h3 className="text-sm sm:text-base font-semibold text-center text-white">
                  {integration.name}
                </h3>

                {/* Hover gradient */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ 
                    background: `radial-gradient(circle at 50% 50%, ${integration.color}10, transparent)`
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA Text */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
            And many more coming soon...
          </p>
        </motion.div>
      </div>
    </section>
  );
}
