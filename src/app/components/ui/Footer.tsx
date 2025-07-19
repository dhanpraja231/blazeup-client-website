'use client'

import { motion } from 'framer-motion'
import { scrollToSection } from '../../lib/utils'

interface FooterSection {
  title: string
  links: { label: string; href: string }[]
}

const footerSections: FooterSection[] = [
  {
    title: 'Services',
    links: [
      { label: 'Design & Creative', href: '#services' },
      { label: 'Development', href: '#services' },
      { label: 'Marketing', href: '#services' },
      { label: 'Business Strategy', href: '#services' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' },
      { label: 'Privacy Policy', href: '#privacy' },
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'Trust & Safety', href: '#trust' },
      { label: 'API Documentation', href: '#api' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#blog' },
      { label: 'Success Stories', href: '#testimonials' },
      { label: 'Case Studies', href: '#cases' },
      { label: 'Community', href: '#community' },
    ]
  }
]

export default function Footer() {
  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const sectionId = href.replace('#', '')
      scrollToSection(sectionId)
    } else {
      // Handle external links
      window.open(href, '_blank')
    }
  }

  return (
    <footer className="bg-dark-gray text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-8">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-blaze-orange font-semibold text-lg mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.4, 
                      delay: sectionIndex * 0.1 + linkIndex * 0.05 
                    }}
                  >
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-text-secondary hover:text-blaze-orange transition-colors duration-300 text-left"
                    >
                      {link.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-white/10 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-gradient animate-gradient-shift font-bold text-xl cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              BlazeUp
            </motion.div>

            {/* Copyright */}
            <p className="text-text-secondary">
              &copy; 2025 BlazeUp. All rights reserved. Transforming visions into reality.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, index) => (
                <motion.button
                  key={social}
                  whileHover={{ 
                    scale: 1.1,
                    color: "#FF6B35"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="text-text-secondary hover:text-blaze-orange transition-colors duration-300"
                  onClick={() => {
                    console.log(`${social} clicked`)
                    // Handle social media links
                  }}
                >
                  <span className="sr-only">{social}</span>
                  {/* Replace with actual social icons */}
                  <div className="w-6 h-6 bg-current rounded opacity-60 hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}