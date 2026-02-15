//header component
'use client'

import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' }
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 navbar-entrance ${
          isScrolled 
            ? 'backdrop-blur-glass bg-black/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer logo-hover"
              onClick={() => scrollToSection('#hero')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blaze-orange to-rich-purple rounded-lg flex items-center justify-center logo-spin">
                <div className="w-4 h-4 bg-white rounded-sm logo-inner-spin" />
              </div>
              <span className="text-4xl font-bold text-gradient-animated">
                BlazeUp
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="relative text-white/80 hover:text-white transition-colors duration-300 font-medium nav-item-entrance nav-item-hover"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  {item.name}
                  <div className="nav-underline" />
                </button>
              ))}
            </div>

            {/* CTA Button */}
            {/* <div className="hidden lg:flex items-center space-x-4">
              <button className="bg-gradient-to-r from-blaze-orange to-rich-purple px-6 py-2.5 rounded-full text-white font-semibold text-sm shadow-glow hover:shadow-glow-hover transition-all duration-300 cta-entrance cta-hover">
                Get Started
              </button>
            </div> */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-6 h-6 flex flex-col justify-center items-center space-y-1 focus:outline-none mobile-btn-entrance"
            >
              <span className={`hamburger-line ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`hamburger-line ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`hamburger-line ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden backdrop-blur-glass bg-black/40 border-t border-white/10 mobile-menu ${
          isMobileMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'
        }`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-white/80 hover:text-white transition-colors duration-300 font-medium py-2 border-b border-white/5 last:border-b-0 mobile-nav-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name}
                </button>
              ))}
              {/* <button className="bg-gradient-to-r from-blaze-orange to-rich-purple px-6 py-3 rounded-full text-white font-semibold text-center shadow-glow mt-4 mobile-cta">
                Get Started
              </button> */}
            </div>
          </div>
        </div>
      </nav>



      <style jsx>{`
        .navbar-entrance {
          animation: slideDown 0.8s ease-out;
        }

        .logo-hover {
          transition: transform 0.3s ease;
        }

        .logo-hover:hover {
          transform: scale(1.05);
        }

        .logo-spin {
          position: relative;
          overflow: hidden;
        }

        .logo-inner-spin {
          animation: logoRotate 20s linear infinite;
        }

        .nav-item-entrance {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .nav-item-hover {
          position: relative;
        }

        .nav-underline {
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--blaze-orange), var(--rich-purple));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .nav-item-hover:hover .nav-underline {
          transform: scaleX(1);
        }

        .cta-entrance {
          opacity: 0;
          transform: scale(0.8);
          animation: fadeInScale 0.5s ease-out 0.6s forwards;
        }

        .cta-hover {
          transition: all 0.3s ease;
        }

        .cta-hover:hover {
          transform: scale(1.05) translateY(-2px);
        }

        .cta-hover:active {
          transform: scale(0.98);
        }

        .mobile-btn-entrance {
          opacity: 0;
          animation: fadeIn 0.5s ease-out 0.5s forwards;
        }

        .hamburger-line {
          width: 24px;
          height: 2px;
          background-color: white;
          transform-origin: center;
          transition: all 0.3s ease;
        }

        .mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .mobile-menu-open {
          max-height: 400px;
        }

        .mobile-menu-closed {
          max-height: 0;
        }

        .mobile-nav-item {
          opacity: 0;
          transform: translateX(-20px);
        }

        .mobile-menu-open .mobile-nav-item {
          animation: slideInLeft 0.3s ease-out forwards;
        }

        .mobile-cta {
          opacity: 0;
          transform: translateY(20px);
        }

        .mobile-menu-open .mobile-cta {
          animation: slideInUp 0.3s ease-out 0.4s forwards;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes logoRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}