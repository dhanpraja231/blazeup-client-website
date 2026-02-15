'use client'

import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface AnimatedTextProps {
  text: string
  className?: string
  variant?: 'shimmer' | 'gradient' | 'glow'
  delay?: number
}

export default function AnimatedText({ 
  text, 
  className, 
  variant = 'shimmer',
  delay = 0 
}: AnimatedTextProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'shimmer':
        return 'text-gradient-animated'
      case 'gradient':
        return 'text-gradient animate-gradient-shift'
      case 'glow':
        return 'text-gradient-animated drop-shadow-lg'
      default:
        return 'text-gradient-animated'
    }
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: "easeOut" 
      }}
      className={cn(getVariantClasses(), className)}
    >
      {text}
    </motion.span>
  )
}