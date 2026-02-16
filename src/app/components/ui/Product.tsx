'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, TrendingUp, Users, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Corporate Cards',
    description: 'Virtual cards issued in 2 minutes vs 7-15 days for traditional banks. Physical cards with custom designs for branding.'
  },
  {
    icon: Shield,
    title: 'Zero Forex Fees',
    description: '0% forex markup on international transactions vs 2-3% at banks. Save ₹1-6L annually on international spend alone.'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Compliance',
    description: 'Automatic expense categorization with 95%+ accuracy. Real-time policy violation detection before submission.'
  },
  {
    icon: TrendingUp,
    title: 'Advanced Spend Controls',
    description: 'Custom approval workflows by department. Real-time budget tracking with alerts and role-based access controls.'
  },
  {
    icon: Users,
    title: 'Enterprise Integrations',
    description: 'Native ERP connectors for SAP, Oracle, NetSuite, Zoho Books, and Tally. API-first architecture for custom workflows.'
  },
  {
    icon: Globe,
    title: 'Real-Time Dashboard',
    description: 'Instant spend visibility across your company. Automated reconciliation and expense report generation in minutes.'
  }
];

export default function Product() {
  return (
    <section id="product" className="relative py-20 sm:py-32 overflow-hidden" style={{ background: 'var(--dark-gray)' }}>
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
            Our Product
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Turn every business payment into a controlled, programmable event. One platform for cards, UPI, and transfers with real-time visibility.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative rounded-2xl p-8 transition-all duration-300"
                style={{ 
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(99,102,241,0.3)'
                }}
              >
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
                    border: '1px solid rgba(99,102,241,0.3)'
                  }}
                >
                  <Icon className="w-7 h-7 text-indigo-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {feature.description}
                </p>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ 
                    background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05), transparent)'
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
