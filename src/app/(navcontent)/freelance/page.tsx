'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Zap, Target, Code, Palette, Brain, Star, ArrowRight, CheckCircle, Coffee, Laptop, GraduationCap } from 'lucide-react';

export default function FreelancerPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const workEnvironmentImages = [
    "/api/placeholder/800/500",
    "/api/placeholder/800/500", 
    "/api/placeholder/800/500"
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
    "Respect the community",
    "Embrace flat hierarchy", 
    "Transparent communication",
    "Set clear expectations",
    "Maintain professionalism"
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
      <div className=" text-white relative z-10">
        {/* Key Benefits */}
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
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    y: -5
                  }}
                >
                  <div className="text-purple-400 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white/90">{benefit.title}</h3>
                  <p className="text-white/70 leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Who You Are */}
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
                  className="text-center backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-pink-400 mb-6 flex justify-center">
                    {profile.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white/90">{profile.title}</h3>
                  <p className="text-white/70 leading-relaxed">{profile.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Qualities */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              What We Expect
            </motion.h2>
            
            <motion.p 
              className="text-xl text-center text-white/70 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              No compromises on these core values
            </motion.p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {coreQualities.map((quality, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg font-medium text-white/90">{quality}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gen-Z Work Environment Showcase */}
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
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <AnimatePresence mode="wait">
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
                </AnimatePresence>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {workEnvironmentImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-white/30'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-xl text-white/70">
                  A modern, collaborative environment designed for Gen-Z talent to thrive
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
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
                  className="text-center relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 mb-4 hover:bg-white/10 transition-all duration-300">
                    <div className="text-purple-400 mb-4 flex justify-center">
                      {step.icon}
                    </div>
                    <div className="text-4xl font-black text-white/20 mb-4">{step.step}</div>
                    <h3 className="text-xl font-bold mb-3 text-white/90">{step.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-purple-400/50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-12"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                "Freelance is the new open source"
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                With Gen-AI, we're moving to a gig-based economy. Join our platform to build a strong freelancer 
                community that addresses gaps in the startup space while providing opportunities for those on the grind.
              </p>
              <p className="text-lg text-white/60">
                Build systems of scale and create art that makes a difference, while expanding your network 
                and connecting with industry leaders.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Ready to Shape the Future?
              </h2>
              <p className="text-xl text-white/70 mb-12">
                Join our freelancer community and be part of the next generation of work.
              </p>
              
              <motion.button
                className="group relative px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl overflow-hidden transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://forms.google.com/your-freelancer-form', '_blank')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Join Freelancer Waitlist
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
              
              <p className="text-sm text-white/50 mt-6">
                No commitment required • Join the waitlist today
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}