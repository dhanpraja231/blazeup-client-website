'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Row 1 - Left to right (ERP & Finance)
const integrations_row1 = [
  { name: 'SAP', color: '#0FAAFF', logo: '/image_assets/integrations/sap.svg' },
  { name: 'Oracle', color: '#F80000', logo: '/image_assets/integrations/oracle.svg' },
  { name: 'NetSuite', color: '#1C4587', logo: '/image_assets/integrations/netsuite.svg' },
  { name: 'Zoho Expenses', color: '#D32F2F', logo: '/image_assets/integrations/zoho.svg' },
  { name: 'QuickBooks', color: '#2CA01C', logo: '/image_assets/integrations/quickbooks.svg' },
  { name: 'Xero', color: '#13B5EA', logo: '/image_assets/integrations/xero.svg' },
  { name: 'Tally', color: '#FF0000', logo: '/image_assets/integrations/tally.svg' }
];

// Row 2 - Right to left (Communication & Collaboration)
const integrations_row2 = [
  { name: 'Slack', color: '#4A154B', logo: '/image_assets/integrations/slack.svg' },
  { name: 'Microsoft Teams', color: '#5059C9', logo: '/image_assets/integrations/teams.svg' },
  { name: 'WhatsApp', color: '#25D366', logo: '/image_assets/integrations/whatsapp.svg' },
  { name: 'Salesforce', color: '#00A1E0', logo: '/image_assets/integrations/salesforce.svg' },
  { name: 'HubSpot', color: '#FF7A59', logo: '/image_assets/integrations/hubspot.svg' },
  { name: 'Notion', color: '#000000', logo: '/image_assets/integrations/notion.svg' },
  { name: 'Google Sheets', color: '#0F9D58', logo: '/image_assets/integrations/sheets.svg' }
];

// Row 3 - Left to right (Project Management & Automation)
const integrations_row3 = [
  { name: 'Jira', color: '#0052CC', logo: '/image_assets/integrations/jira.svg' },
  { name: 'Asana', color: '#F06A6A', logo: '/image_assets/integrations/asana.svg' },
  { name: 'Trello', color: '#0079BF', logo: '/image_assets/integrations/trello.svg' },
  { name: 'Odoo', color: '#714B67', logo: '/image_assets/integrations/odoo.svg' },
  { name: 'Zapier', color: '#FF4A00', logo: '/image_assets/integrations/zapier.svg' },
  { name: 'Stripe', color: '#635BFF', logo: '/image_assets/integrations/stripe.svg' },
  { name: 'Monday.com', color: '#FF3D57', logo: '/image_assets/integrations/monday.svg' }
];

interface ScrollingRowProps {
  integrations: typeof integrations_row1;
  direction: 'left' | 'right';
  speed: number;
}

function ScrollingRow({ integrations, direction, speed }: ScrollingRowProps) {
  const duplicatedIntegrations = [...integrations, ...integrations, ...integrations];
  
  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className="flex gap-6"
        animate={{
          x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {duplicatedIntegrations.map((integration, index) => (
          <div
            key={index}
            className="flex-shrink-0 rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105"
            style={{
              width: '180px',
              height: '140px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Integration Logo */}
            <div className="relative w-16 h-16 mb-3">
              <Image
                src={integration.logo}
                alt={`${integration.name} logo`}
                fill
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            {/* Company name */}
            <h3 className="text-sm font-semibold text-center text-white">
              {integration.name}
            </h3>
            {/* Color indicator */}
            <div
              className="w-8 h-1 rounded-full mt-2"
              style={{ background: integration.color }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Integrations() {
  return (
    <section id="integrations" className="relative py-20 sm:py-32 overflow-hidden" style={{ background: 'var(--dark-gray)' }}>
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
            Seamless Integrations
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with your entire tech stack. Native integrations with ERPs, communication tools, and productivity platforms.
          </motion.p>
        </motion.div>

        {/* Scrolling Integration Rows */}
        <div className="space-y-6">
          {/* Row 1: Left to right */}
          <ScrollingRow integrations={integrations_row1} direction="left" speed={25} />
          
          {/* Row 2: Right to left */}
          <ScrollingRow integrations={integrations_row2} direction="right" speed={30} />
          
          {/* Row 3: Left to right */}
          <ScrollingRow integrations={integrations_row3} direction="left" speed={28} />
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
            And 100+ more integrations coming soon...
          </p>
        </motion.div>
      </div>
    </section>
  );
}
