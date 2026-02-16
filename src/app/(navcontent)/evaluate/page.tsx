'use client';

import { motion } from 'framer-motion';
import PolicyPlayground from '@/components/composer/PolicyPlayground';

export default function EvaluatePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--dark-gray)', color: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <motion.h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#fff' }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            Policy <span className="text-gradient-animated">Composer</span>
          </motion.h1>
          <motion.p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            Design and evaluate credit card policy workflows
          </motion.p>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <PolicyPlayground />
      </div>
    </div>
  );
}
