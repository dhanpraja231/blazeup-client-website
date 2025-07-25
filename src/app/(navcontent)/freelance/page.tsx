'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Zap, Target, Code, Palette, Brain, Star, ArrowRight, CheckCircle, Coffee, Laptop, GraduationCap, Sparkles } from 'lucide-react';

export default function FreelancerPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const workEnvironmentImages: any = [
    // "/api/placeholder/800/500",
    // "/api/placeholder/800/500", 
    // "/api/placeholder/800/500"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % workEnvironmentImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const keyBenefits = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Focus on Your Craft",
      description: "We handle client acquisition so you can concentrate on polishing your skills and delivering exceptional work."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Flexible Contracts",
      description: "Our contracts understand your priorities with highly flexible terms that work around your schedule."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Network",
      description: "Work alongside the best - every freelancer in our network is regularly verified for quality."
    },
  ];

  const whoYouAre = [
    {
      icon: <Coffee className="w-12 h-12" />,
      title: "Working Professional",
      description: "Looking to expand your skills and income with exciting side projects"
    },
    {
      icon: <Laptop className="w-12 h-12" />,
      title: "Budding Freelancer",
      description: "Ready to take your freelance career to the next level"
    },
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "University Student",
      description: "Driven to learn real-world skills while earning money"
    }
  ];

  const coreQualities = [
    {
      text: "Respect the community",
      description: "Treat every team member with dignity and foster collaborative relationships"
    },
    {
      text: "Transparent communication",
      description: "Keep stakeholders informed with honest, timely updates on project progress"
    },
    {
      text: "Set clear expectations",
      description: "Define deliverables, timelines, and requirements upfront to avoid confusion"
    },
    {
      text: "Maintain professionalism",
      description: "Uphold high standards in all interactions and deliverables"
    }
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "We Find Clients",
      description: "Our team actively sources and qualifies clients looking for top talent",
      icon: <Target className="w-8 h-8" />
    },
    {
      step: "02", 
      title: "Team Assembly",
      description: "We match you with projects based on your skills, budget preferences, and availability",
      icon: <Users className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Build & Create",
      description: "Focus on what you do best - building amazing product features and solutions",
      icon: <Code className="w-8 h-8" />
    },
    {
      step: "04",
      title: "Get Paid 100%",
      description: "Receive 100% of what you quote for each completed feature development",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Full Screen Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
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
              radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 relative z-10 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Join the Future of Work
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto">
              Build systems of scale and create art that transcends time while earning for your skills
            </p>
            
            <motion.button
              className="group relative px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl overflow-hidden transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://forms.google.com/your-freelancer-form', '_blank')}
            >
              <span className="relative z-10 flex items-center gap-2">
                Join Freelancer Waitlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* All other sections with dark background */}
      <div className="text-white relative z-10">
        {/* Key Benefits - Improved */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Why Freelancers Choose BlazeUp
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {keyBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: 'rgba(168, 85, 247, 0.4)',
                    y: -8
                  }}
                >
                  <div className="text-purple-400 mb-4 group-hover:text-pink-400 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors duration-300">{benefit.title}</h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Who You Are - Improved */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Who You Are
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {whoYouAre.map((profile, index) => (
                <motion.div
                  key={index}
                  className="text-center backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group h-72 flex flex-col justify-between"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: 'rgba(168, 85, 247, 0.4)',
                    y: -5
                  }}
                >
                  <div className="text-pink-400 mb-6 flex justify-center group-hover:text-purple-400 transition-colors duration-300">
                    {profile.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white/90 group-hover:text-white transition-colors duration-300">{profile.title}</h3>
                    <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">{profile.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Qualities - Completely Redesigned */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What We Expect
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                No compromises on these core values that define our community
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {coreQualities.map((quality, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: 'rgba(168, 85, 247, 0.4)',
                    y: -5
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="relative">
                        <CheckCircle className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                        <motion.div
                          className="absolute inset-0 w-8 h-8 rounded-full bg-green-400/20 group-hover:bg-green-400/30 transition-colors duration-300"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white/90 mb-3 group-hover:text-white transition-colors duration-300">
                        {quality.text}
                      </h3>
                      <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                        {quality.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Creative Workspace - Completely Redesigned */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Your Creative Workspace
            </motion.h2>
            
            <motion.div 
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-8 group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              whileHover={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20">
                {/* Enhanced placeholder when no images */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white/80 mb-2">Modern Creative Environment</h3>
                    <p className="text-white/60 text-lg">Where innovation meets inspiration</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {workEnvironmentImages.length > 0 && (
                    <motion.img
                      key={currentSlide}
                      src={workEnvironmentImages[currentSlide]}
                      alt={`Work environment ${currentSlide + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Enhanced slide indicators */}
                {workEnvironmentImages.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                    {workEnvironmentImages.map((_: any, index: any) => (
                      <motion.button
                        key={index}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg' : 'bg-white/30 hover:bg-white/50'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                )}

                {/* Floating elements for visual appeal */}
                <motion.div
                  className="absolute top-6 left-6 text-purple-400/30"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Code className="w-8 h-8" />
                </motion.div>
                
                <motion.div
                  className="absolute top-6 right-6 text-pink-400/30"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Palette className="w-8 h-8" />
                </motion.div>
              </div>
              
              
            </motion.div>
          </div>
        </section>

        {/* How It Works - Improved with uniform sizing */}
        <section className="py-20 px-8">
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
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 h-72 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 group"
                    whileHover={{ 
                      scale: 1.05,
                      borderColor: 'rgba(168, 85, 247, 0.4)',
                      y: -5
                    }}
                  >
                    <div className="text-center">
                      <div className="text-purple-400 mb-4 flex justify-center group-hover:text-pink-400 transition-colors duration-300">
                        {step.icon}
                      </div>
                      <div className="text-4xl font-black text-white/20 mb-4 group-hover:text-purple-400/30 transition-colors duration-300">{step.step}</div>
                      <h3 className="text-xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors duration-300 leading-tight">{step.title}</h3>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed text-center group-hover:text-white/80 transition-colors duration-300 mt-auto">{step.description}</p>
                  </motion.div>
                  
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {/* <ArrowRight className="w-6 h-6 m-3 text-purple-400/50" /> */}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      
      </div>
    </div>
  );
}