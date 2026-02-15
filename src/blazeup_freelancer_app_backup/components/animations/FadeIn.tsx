'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { fadeInVariants, cn } from '../../lib/utils'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}

export default function FadeIn({ 
  children, 
  className, 
  delay = 0,
  direction = 'up',
  distance = 30
}: FadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance }
      case 'down':
        return { opacity: 0, y: -distance }
      case 'left':
        return { opacity: 0, x: distance }
      case 'right':
        return { opacity: 0, x: -distance }
      default:
        return { opacity: 0, y: distance }
    }
  }

  const getAnimatePosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 }
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={getAnimatePosition()}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut" 
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}