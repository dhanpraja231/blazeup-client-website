/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'blaze-orange': '#FF6B35',
        'deep-navy': '#0F172A',
        'rich-purple': '#6B46C1',
        'electric-blue': '#3B82F6',
        'charcoal': '#1E293B',
        'success-green': '#10B981',
        'dark-gray': '#0F0F0F',
        'medium-gray': '#1A1A1A',
        'light-gray': '#2D2D2D',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
      },
      animation: {
        'gradient-shift': 'gradient-shift 4s ease-in-out infinite',
        'shimmer': 'shimmer 6s ease-in-out infinite',
        'float-bubbles': 'float-bubbles 20s ease-in-out infinite',
        'gradient-flow': 'gradient-flow 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 8s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'shimmer': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '25%': { 'background-position': '100% 50%' },
          '50%': { 'background-position': '200% 50%' },
          '75%': { 'background-position': '300% 50%' },
        },
        'float-bubbles': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(120deg)' },
          '66%': { transform: 'translateY(10px) rotate(240deg)' },
        },
        'gradient-flow': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      backgroundSize: {
        '300': '300% 300%',
        '400': '400% 400%',
        '200': '200% 200%',
      },
    },
  },
  plugins: [],
}