'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { NAV_ITEMS } from '@/data';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-glass bg-black/90' 
            : 'backdrop-blur-glass bg-black/90'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleLogoClick}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-blaze-orange to-rich-purple rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-4 h-4 bg-white rounded-sm" />
              </motion.div>
              <span className="text-4xl font-bold text-gradient-animated">
                BlazeUp
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="relative text-white/80 hover:text-white transition-colors duration-300 font-medium nav-item-hover"
                  // initial={{ opacity: 0, y: -20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  // whileHover={{ y: -2 }}
                >
                  {item.name}
                  <div className="nav-underline" />
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-6 h-6 flex flex-col justify-center items-center space-y-1 focus:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`} 
              />
              <motion.span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`} 
              />
              <motion.span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`} 
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          className={`lg:hidden backdrop-blur-glass bg-black/40 border-t border-white/10 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
          initial={false}
          animate={{ 
            maxHeight: isMobileMenuOpen ? 400 : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left text-white/80 hover:text-white transition-colors duration-300 font-medium py-2 border-b border-white/5 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : -20
                  }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </nav>
    </>
  );
}