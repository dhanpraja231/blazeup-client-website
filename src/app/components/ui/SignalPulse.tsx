'use client';

import { motion } from 'framer-motion';

export default function SignalPulse() {
  return (
    <div className="fixed left-[10%] top-0 bottom-0 w-[2px] z-[100] pointer-events-none hidden lg:block">
      {/* Vertical line */}
      <div 
        className="absolute top-0 bottom-0 w-full"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.3) 20%, rgba(139, 92, 246, 0.3) 80%, transparent)'
        }}
      />
      
      {/* Pulsing dots traveling down */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full left-1/2 -translate-x-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 1) 0%, rgba(139, 92, 246, 0.6) 40%, transparent 70%)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)'
          }}
          animate={{
            top: ['0%', '100%'],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 4,
            delay: i * 1.3,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1]
          }}
        />
      ))}

      {/* Glowing nodes at intervals */}
      {[15, 30, 45, 60, 75, 90].map((percentage, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{
            top: `${percentage}%`,
            background: 'rgba(139, 92, 246, 0.6)',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Ring pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400"
            animate={{
              scale: [1, 2.5],
              opacity: [0.8, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>
      ))}

      {/* Data packets traveling down */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`packet-${i}`}
          className="absolute left-1/2 -translate-x-1/2 w-1 h-6 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.8), transparent)'
          }}
          animate={{
            top: ['-5%', '105%']
          }}
          transition={{
            duration: 6,
            delay: i * 1.8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
