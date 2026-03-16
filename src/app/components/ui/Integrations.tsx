'use client';

import { motion } from 'framer-motion';
import {
  SiSap,
  SiZoho,
  SiQuickbooks,
  SiXero,
  SiSlack,
  SiWhatsapp,
  SiSalesforce,
  SiHubspot,
  SiNotion,
  SiGooglesheets,
  SiJira,
  SiAsana,
  SiTrello,
  SiOdoo,
  SiZapier,
  SiStripe,
} from 'react-icons/si';
import { FaFileInvoiceDollar, FaDatabase } from 'react-icons/fa';
import { useTheme } from '@/components/ThemeProvider';

// Row 1 - Left to right (ERP & Finance)
const integrations_row1 = [
  { name: 'SAP', color: '#0FAAFF', Icon: SiSap },
  { name: 'Oracle', color: '#F80000', Icon: FaDatabase },
  { name: 'NetSuite', color: '#1C4587', Icon: FaDatabase },
  { name: 'Zoho Expenses', color: '#D32F2F', Icon: SiZoho },
  { name: 'QuickBooks', color: '#2CA01C', Icon: SiQuickbooks },
  { name: 'Xero', color: '#13B5EA', Icon: SiXero },
  { name: 'Tally', color: '#FF0000', Icon: FaFileInvoiceDollar }
];

// Row 2 - Right to left (Communication & Collaboration)
const integrations_row2 = [
  { name: 'Slack', color: '#4A154B', Icon: SiSlack },
  { name: 'WhatsApp', color: '#25D366', Icon: SiWhatsapp },
  { name: 'Salesforce', color: '#00A1E0', Icon: SiSalesforce },
  { name: 'HubSpot', color: '#FF7A59', Icon: SiHubspot },
  { name: 'Notion', color: '#000000', Icon: SiNotion },
  { name: 'Google Sheets', color: '#0F9D58', Icon: SiGooglesheets }
];

// Row 3 - Left to right (Project Management & Automation)
const integrations_row3 = [
  { name: 'Jira', color: '#0052CC', Icon: SiJira },
  { name: 'Asana', color: '#F06A6A', Icon: SiAsana },
  { name: 'Trello', color: '#0079BF', Icon: SiTrello },
  { name: 'Odoo', color: '#714B67', Icon: SiOdoo },
  { name: 'Zapier', color: '#FF4A00', Icon: SiZapier },
  { name: 'Stripe', color: '#635BFF', Icon: SiStripe },
];

interface ScrollingRowProps {
  integrations: typeof integrations_row1;
  direction: 'left' | 'right';
  speed: number;
}

function ScrollingRow({ integrations, direction, speed }: ScrollingRowProps) {
  const { light } = useTheme();

  const IntegrationSet = () => (
    <div className="flex gap-4 pr-4 w-max">
      {integrations.map((integration, index) => {
        const Icon = integration.Icon;
        return (
          <div
            key={index}
            className="flex-shrink-0 rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02]"
            style={{
              width: '170px',
              height: '130px',
              background: light ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${light ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)'}`,
            }}
          >
            <div className="w-14 h-14 mb-3 flex items-center justify-center">
              <Icon className="w-full h-full" style={{ color: light ? '#3f3f46' : '#A1A1AA', transition: 'color 0.3s' }} />
            </div>
            <h3 className="text-xs font-medium text-center tracking-wide" style={{ color: light ? '#3f3f46' : '#A1A1AA', transition: 'color 0.3s' }}>
              {integration.name}
            </h3>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative overflow-hidden py-3">
      <motion.div
        className="flex w-max"
        animate={{
          x: direction === 'left' ? ['0%', '-12.5%'] : ['-12.5%', '0%'],
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
        {[...Array(8)].map((_, i) => (
          <IntegrationSet key={i} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Integrations() {
  const { light } = useTheme();

  return (
    <section
      id="integrations"
      className="relative py-20 sm:py-32 overflow-hidden"
      style={{
        background: light ? '#f8f8f6' : '#09090B',
        borderTop: `1px solid ${light ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'}`,
        transition: 'background 0.4s',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="text-xs font-medium tracking-[0.2em] uppercase mb-4"
            style={{ color: '#C8A97E' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Ecosystem
          </motion.p>
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display mb-6"
            style={{ color: light ? '#18181B' : '#FAFAFA', transition: 'color 0.3s', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Built to{' '}
            <span className="font-display italic" style={{ color: '#C8A97E' }}>connect</span>
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: '#71717A', transition: 'color 0.3s' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Native integrations with ERPs, communication tools, and productivity platforms.
          </motion.p>
        </motion.div>

        {/* Scrolling Integration Rows */}
        <div className="space-y-4">
          <ScrollingRow integrations={integrations_row1} direction="left" speed={24} />
          <ScrollingRow integrations={integrations_row2} direction="right" speed={29} />
          <ScrollingRow integrations={integrations_row3} direction="left" speed={27} />
        </div>

        {/* CTA Text */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm tracking-wide" style={{ color: '#71717A' }}>
            And more integrations coming soon
          </p>
        </motion.div>
      </div>
    </section>
  );
}
