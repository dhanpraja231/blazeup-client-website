//stats component
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import FadeIn from '../../components/animations/FadeIn'

interface StatItem {
  number: string
  label: string
  delay: number
}

const stats: StatItem[] = [
  { number: '500K+', label: 'Projects Completed', delay: 0 },
  { number: '98%', label: 'Client Satisfaction', delay: 0.2 },
  { number: '50K+', label: 'Expert Freelancers', delay: 0.4 },
  { number: '24/7', label: 'Support Available', delay: 0.6 },
]

interface CounterProps {
  target: string
  delay: number
}

function Counter({ target, delay }: CounterProps) {
  const [count, setCount] = useState('0')
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!isInView) return

    // For percentage values
    if (target.includes('%')) {
      const numericValue = parseInt(target.replace('%', ''))
      let current = 0
      const increment = numericValue / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current) + '%')
        }
      }, 30)
      return () => clearInterval(timer)
    }
    
    // For K+ values
    if (target.includes('K+')) {
      const numericValue = parseInt(target.replace('K+', ''))
      let current = 0
      const increment = numericValue / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current) + 'K+')
        }
      }, 30)
      return () => clearInterval(timer)
    }

    // For other values like 24/7
    setTimeout(() => setCount(target), delay * 1000)
  }, [isInView, target, delay])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-5xl md:text-6xl font-extrabold text-gradient mb-2">
        {count}
      </div>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section className="py-24 bg-charcoal">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={stat.delay}>
              <div className="relative">
                <Counter target={stat.number} delay={stat.delay} />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: stat.delay + 0.3 }}
                  className="text-lg text-text-secondary uppercase tracking-wider font-medium"
                >
                  {stat.label}
                </motion.div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}