'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Users, Target, Zap, Eye, Monitor, Package, ArrowRight } from 'lucide-react';

export default function ClientPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const workboardImages: any = [];

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

  const handleJoinWaitlist = () => {
    // Navigate to the client registration form
    window.location.href = '/client-registration';
  };

  return (
    <section 
      id="client"
      className="min-h-screen bg-black overflow-hidden relative"
    >
      {/* Animated Background - Matching Home Page exactly */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 120, 240, 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Floating particles - Matching Home Page */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-8 relative z-10 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 p-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Build?
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto">
              Join our client waitlist and be among the first to experience the future of product development.
            </p>
            
            <motion.button
              className="group relative px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinWaitlist}
            >
              <span className="relative z-10 flex items-center gap-2">
                Join Client Waitlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* All other sections with consistent styling */}
      <div className="text-white relative z-10">
        {/* Key Benefits */}
        <div className="py-20 px-8">
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
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group hover:border-white/20"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: 'rgba(168, 85, 247, 0.4)',
                    transitionDelay: 0
                  }}
                >
                  <div className="text-purple-400 mb-6 flex justify-center group-hover:text-pink-400 transition-colors duration-300">
                    {point.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white/90 text-center group-hover:text-white transition-colors duration-300">{point.title}</h3>
                  <p className="text-white/70 leading-relaxed text-center group-hover:text-white/80 transition-colors duration-300">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-20 px-8">
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
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 h-64 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 group hover:border-white/20"
                    whileHover={{ 
                      scale: 1.05, 
                      borderColor: 'rgba(168, 85, 247, 0.4)',
                      y: -5
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl font-black text-white/20 mb-4 group-hover:text-purple-400/30 transition-colors duration-300">{item.step}</div>
                      <h3 className="text-xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors duration-300 leading-tight">{item.title}</h3>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed text-center group-hover:text-white/80 transition-colors duration-300 mt-auto">{item.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Workboard Showcase */}
        <div className="py-20 px-8">
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
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-8 hover:border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">Interactive Workboard Preview</p>
                  <p className="text-white/40 text-sm mt-2">Coming Soon</p>
                </div>
                
                <AnimatePresence mode="wait">
                  {workboardImages.length > 0 && (
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
                  )}
                </AnimatePresence>
                
                {/* Slide indicators */}
                {workboardImages.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {workboardImages.map((_:any, index: any) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-white/30'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-center mt-8">
                <p className="text-xl text-white/70">
                  Real-time visibility into your project's progress with our interactive workboard
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="py-20 px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-center lg:text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                See The Difference
              </motion.h2>
              
              <motion.button
                className="group relative px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg shadow-purple-500/25"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(168, 85, 247, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinWaitlist}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8))",
                      "linear-gradient(45deg, rgba(236, 72, 153, 0.8), rgba(59, 130, 246, 0.8))",
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.8), rgba(168, 85, 247, 0.8))"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
                  <span className="text-white font-bold">Join Client Waitlist</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </motion.button>
            </div>

            <motion.div 
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-6 text-xl font-bold">Feature</th>
                      <th className="text-center p-6 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BlazeUp</th>
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
        </div>

        {/* Final CTA Section */}
        <div className="py-20 px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-12 hover:border-white/20"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Ready to Transform Your Ideas?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join hundreds of visionaries who are already building the future with BlazeUp.
              </p>
              <motion.button
                className="group relative px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinWaitlist}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade - Matching Home Page */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </section>
  );
}