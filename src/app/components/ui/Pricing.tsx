'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Rocket } from 'lucide-react';

const plans = [
  {
    name: 'Standard',
    price: '$10',
    period: '/month per card',
    description: 'Simple, transparent pricing for every card',
    icon: Sparkles,
    features: [
      'Instant virtual card issuance',
      'Real-time expense tracking',
      'Mobile & web app access',
      'Basic spend controls',
      'Email support',
      'Standard reporting & analytics'
    ],
    cta: 'Get Started',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations',
    icon: Rocket,
    features: [
      'Everything in Standard',
      'Single Sign-On (SSO)',
      'Agentic fraud detection',
      'Advanced AI-powered compliance',
      'Custom credit limits & workflows',
      'Dedicated account manager',
      'Full ERP integrations (SAP, Oracle, etc.)',
      'White-label options',
      '24/7 priority support'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 sm:py-32 overflow-hidden" style={{ background: 'var(--dark-gray)' }}>
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
            Simple Pricing
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pay only for what you use. $10 per card per month with no hidden fees. Scale as you grow with custom Enterprise solutions.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                className="relative rounded-3xl p-8 transition-all duration-300"
                style={{ 
                  background: plan.popular ? 'rgba(232, 90, 42, 0.05)' : 'rgba(255,255,255,0.02)',
                  border: plan.popular ? '2px solid rgba(232, 90, 42, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: plan.popular ? 1.08 : 1.02,
                  borderColor: plan.popular ? 'rgba(232, 90, 42, 0.5)' : 'rgba(232, 90, 42, 0.2)'
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      background: '#e85a2a',
                      color: 'white'
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                {/* Icon */}
                {/* <div className="mb-6">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ 
                      background: plan.popular 
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))'
                        : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(99,102,241,0.3)'
                    }}
                  >
                    <Icon className="w-8 h-8 text-indigo-400" />
                  </div>
                </div> */}

                {/* Plan details */}
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <p className="mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#e85a2a' }} />
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    background: plan.popular 
                      ? '#e85a2a'
                      : 'rgba(255,255,255,0.05)',
                    border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = plan.popular 
                      ? '0 10px 30px rgba(232, 90, 42, 0.35)'
                      : '0 10px 30px rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
