'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Users, Target, Zap, Eye, Monitor, Package } from 'lucide-react';

export default function ClientPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const workboardImages: any = [
    // "/api/placeholder/800/500",
    // "/api/placeholder/800/500", 
    // "/api/placeholder/800/500",
    // "/api/placeholder/800/500"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % workboardImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const comparisonData = [
    { 
      feature: "Product Management", 
      blazeup: { status: "success", text: "PM's provided" },
      freelancer: { status: "error", text: "Not provided" },
      agency: { status: "warning", text: "Extra cost" }
    },
    { 
      feature: "Talent Quality", 
      blazeup: { status: "success", text: "Vetted experts only" },
      freelancer: { status: "warning", text: "Hit or miss" },
      agency: { status: "warning", text: "Hit or miss" }
    },
    { 
      feature: "Resource Drop", 
      blazeup: { status: "success", text: "No disruption" },
      freelancer: { status: "error", text: "Progress halts" },
      agency: { status: "warning", text: "Slow replacements" }
    },
    { 
      feature: "Pricing", 
      blazeup: { status: "success", text: "Pay only for work done" },
      freelancer: { status: "warning", text: "Risky bids" },
      agency: { status: "error", text: "High overhead" }
    },
    { 
      feature: "Core Team", 
      blazeup: { status: "success", text: "Own your team" },
      freelancer: { status: "error", text: "No long-term focus" },
      agency: { status: "error", text: "Locked contracts" }
    },
    { 
      feature: "Scalability", 
      blazeup: { status: "success", text: "Scale fast" },
      freelancer: { status: "warning", text: "Manual scaling" },
      agency: { status: "error", text: "Rigid processes" }
    },
    { 
      feature: "Monitoring", 
      blazeup: { status: "success", text: "Real-time workboard" },
      freelancer: { status: "error", text: "Low transparency" },
      agency: { status: "warning", text: "Filtered updates" }
    },
    { 
      feature: "One-Stop Shop", 
      blazeup: { status: "success", text: "Dev, design & more" },
      freelancer: { status: "error", text: "Hire each role" },
      agency: { status: "warning", text: "Inflexible bundles" }
    }
  ];

  const keyPoints = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team of Verified Freelancers",
      description: "Access our network of vetted professionals across multiple domains, regularly verified for quality assurance."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Complete Tech Stack Management",
      description: "We handle all technical decisions. No more comparing Angular vs React - we've got you covered."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Seamless Team Transition",
      description: "When your product takes off, we help you form your core team using the freelancers who built it."
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Real-Time Project Visibility",
      description: "Access the BlazeUp workboard to watch your projects come to life in real-time."
    }
  ];

  const StatusIcon = ({ status}: any) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 120, 240, 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(107, 70, 193, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Additional Gradient Overlay */}
      {/* <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(45deg, transparent 0%, rgba(255, 107, 53, 0.02) 25%, transparent 50%),
            linear-gradient(-45deg, transparent 0%, rgba(107, 70, 193, 0.02) 25%, transparent 50%)
          `
        }}
      /> */}

      {/* Comparison Chart */}
      <section className="py-20 px-8 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            See The Difference
          </motion.h2>
          
          <motion.div 
            className="backdrop-blur-glass bg-black/20 border border-white/10 rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-xl font-bold">Feature</th>
                    <th className="text-center p-6 text-2xl font-bold text-gradient-animated">BlazeUp</th>
                    <th className="text-center p-6 text-xl font-bold text-white/60">Freelancer Platforms</th>
                    <th className="text-center p-6 text-xl font-bold text-white/60">Tech Agencies</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <motion.tr 
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <td className="p-6 font-semibold text-lg text-white/90">{row.feature}</td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon status={row.blazeup.status} />
                          <span className="text-sm font-medium text-white/90">{row.blazeup.text}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon status={row.freelancer.status} />
                          <span className="text-sm font-medium text-white/60">{row.freelancer.text}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon status={row.agency.status} />
                          <span className="text-sm font-medium text-white/60">{row.agency.text}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose BlazeUp?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {keyPoints.map((point, index) => (
              <motion.div
                key={index}
                className="backdrop-blur-glass bg-black/20 border border-white/10 rounded-2xl p-8 hover:bg-black/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  y: -5
                }}
              >
                <div className="text-gradient-animated mb-4">
                  {point.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white/90">{point.title}</h3>
                <p className="text-white/70 text-lg leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Dedicated PM Assigned",
                description: "Get a product manager who takes your idea from 0-1 and beyond"
              },
              {
                step: "02", 
                title: "We Handle Everything",
                description: "Human resources, NDAs, payouts - all managed seamlessly"
              },
              {
                step: "03",
                title: "Real-Time Monitoring",
                description: "Watch your product come to life through our workboard"
              },
              {
                step: "04",
                title: "Pay-As-You-Go",
                description: "Only pay for completed deliverables that add real value"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-6xl font-black text-gradient-animated mb-4 opacity-30">{item.step}</div>
                <h3 className="text-xl font-bold mb-4 text-white/90">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workboard Showcase */}
      <section className="py-20 px-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            See Your Progress Live
          </motion.h2>
          
          <motion.div 
            className="backdrop-blur-glass bg-black/20 border border-white/10 rounded-3xl overflow-hidden p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={workboardImages[currentSlide]}
                  alt={`Workboard view ${currentSlide + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {workboardImages.map((_:any, index: any) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-gradient-to-r from-pink-400 to-purple-500' : 'bg-white/30'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-xl text-white/70">
                Real-time visibility into your project's progress with our interactive workboard
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Join our client waitlist and be among the first to experience the future of product development.
            </p>
            
            <motion.button
              className="group relative px-12 py-4 text-lg font-semibold bg-transparent border-2 text-pink-400 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm"
              style={{
                background: 'rgba(236, 72, 153, 0.1)',
                borderColor: 'rgba(244, 63, 94, 0.1)'
              }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(236, 72, 153, 0.15)',
                borderColor: 'rgba(236, 72, 153, 0.8)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://forms.google.com/your-form-link', '_blank')}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-pink-300">
                Join Client Waitlist
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* <style jsx global>{`
        

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .bg-gradient-hero {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a0b2e 25%);
          background-size: 400% 400%;
          animation: gradientFlow 15s ease infinite;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .backdrop-blur-glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style> */}
    </div>
  );
}