'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { NAV_ITEMS } from '@/data';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { light, toggleLight } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // If it's a page route (starts with /), navigate to it
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }

    // If it's a hash link (#section), check if we're on the home page
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        // Section exists on current page   smooth scroll
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        // Section doesn't exist   navigate to home page with hash
        window.location.href = `/home${href}`;
      }
    }
  };

  const handleLogoClick = () => {
    if (window.location.pathname === '/home' || window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/home';
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500`}
        style={{
          backdropFilter: 'blur(16px)',
          background: isScrolled ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0.9)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          transition: 'background 0.4s',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleLogoClick}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-8 h-8 flex items-center justify-center"
                whileHover={{ scale: 1.25 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/image_assets/BlazeUp_fire_bw_no_bg.svg"
                  alt="BlazeUp Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                  style={{ filter: 'none' }}
                  suppressHydrationWarning
                />
              </motion.div>
              <span className="text-3xl font-bold" style={{ color: '#fff' }}>
                BlazeUp
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="relative font-medium nav-item-hover"
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                  }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                >
                  {item.name}
                  <div className="nav-underline" />
                </motion.button>
              ))}

              {/* Light/Dark Toggle */}
              <motion.button
                onClick={toggleLight}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              {/* Mobile Light/Dark Toggle */}
              <button
                onClick={toggleLight}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s',
                }}
              >
                {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-6 h-6 flex flex-col justify-center items-center space-y-1 focus:outline-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.span 
                  className={`w-6 h-0.5 transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                  style={{ background: '#fff' }}
                />
                <motion.span 
                  className={`w-6 h-0.5 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ background: '#fff' }}
                />
                <motion.span 
                  className={`w-6 h-0.5 transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                  style={{ background: '#fff' }}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          className={`lg:hidden overflow-hidden`}
          style={{
            backdropFilter: 'blur(16px)',
            background: 'rgba(0,0,0,0.4)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
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
                  className="text-left font-medium py-2 last:border-b-0"
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
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