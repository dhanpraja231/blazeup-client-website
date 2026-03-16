'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { light } = useTheme();

  return (
    <footer
      className="w-full"
      style={{
        background: light ? '#f8f8f6' : '#09090B',
        borderTop: `1px solid ${light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'background 0.4s, border-top 0.4s',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center py-6 space-y-4 sm:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm" style={{ color: '#71717A' }}>
            &copy; {currentYear} BlazeUp. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <motion.a
              href="#"
              style={{ color: '#71717A' }}
              whileHover={{ y: -1, color: '#C8A97E' }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              style={{ color: '#71717A' }}
              whileHover={{ y: -1, color: '#C8A97E' }}
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
