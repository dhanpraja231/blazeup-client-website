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
        'accent': '#C8A97E',
        'surface': '#09090B',
        'surface-raised': '#18181B',
        'surface-overlay': '#27272A',
        'text-primary': '#FAFAFA',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',
      },
      fontFamily: {
        sans: [
          'var(--font-plus-jakarta)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'var(--font-instrument-serif)',
          'Georgia',
          'Times New Roman',
          'serif',
        ],
      },
    },
  },
  plugins: [],
}
