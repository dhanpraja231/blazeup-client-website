'use client';

import { motion } from 'framer-motion';
import CreditCardDesigner from '@/components/ui/credit-card-designer';

export default function CardDesignerPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--dark-gray)', color: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <motion.h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#fff' }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            Credit Card Designer
          </motion.h1>
          <motion.p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            Design custom credit cards with AI-powered templates and live preview
          </motion.p>
        </div>
      </div>
      <CreditCardDesigner />
    </div>
  );
}
