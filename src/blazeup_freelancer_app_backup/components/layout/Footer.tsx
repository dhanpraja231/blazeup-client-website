'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black/90 opacity-85 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center py-6 space-y-4 sm:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-white/40 text-sm">
            © {currentYear} BlazeUp. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <motion.a
              href="#"
              className="text-white/40 hover:text-white/60 transition-colors duration-300"
              whileHover={{ y: -1 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="text-white/40 hover:text-white/60 transition-colors duration-300"
              whileHover={{ y: -1 }}
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}