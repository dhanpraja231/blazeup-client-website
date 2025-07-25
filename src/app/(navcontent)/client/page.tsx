'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Users, Target, Zap, Eye, Monitor, Package } from 'lucide-react';

export default function ClientPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const workboardImages = [
    "/api/placeholder/800/500",
    "/api/placeholder/800/500", 
    "/api/placeholder/800/500",
    "/api/placeholder/800/500"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-black mb-6 text-gradient-animated">
              Build Smarter
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              From concept to launch, we provide everything you need to build exceptional products without the complexity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-8">
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
                className="bg-gradient-to-br from-gray-800/50 to-purple-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: 'rgba(147, 51, 234, 0.4)' }}
              >
                <div className="text-purple-400 mb-4">
                  {point.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{point.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Chart */}
      <section className="py-20 px-8">
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
            className="bg-gradient-to-br from-gray-800/30 to-purple-800/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left p-6 text-xl font-bold">Feature</th>
                    <th className="text-center p-6 text-xl font-bold text-purple-400">BlazeUp</th>
                    <th className="text-center p-6 text-xl font-bold text-gray-400">Freelancer Platforms</th>
                    <th className="text-center p-6 text-xl font-bold text-gray-400">Tech Agencies</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <motion.tr 
                      key={index}
                      className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <td className="p-6 font-semibold text-lg">{row.feature}</td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon status={row.blazeup.status} />
                          <span className="text-sm font-medium">{row.blazeup.text}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon status={row.freelancer.status} />
                          <span className="text-sm font-medium text-gray-400">{row.freelancer.text}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon status={row.agency.status} />
                          <span className="text-sm font-medium text-gray-400">{row.agency.text}</span>
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
                <div className="text-6xl font-black text-purple-400/30 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workboard Showcase */}
      <section className="py-20 px-8">
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
            className="relative bg-gradient-to-br from-gray-800/30 to-purple-800/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl overflow-hidden p-8"
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
                {workboardImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-purple-400' : 'bg-white/30'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-xl text-gray-300">
                Real-time visibility into your project's progress with our interactive workboard
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join our client waitlist and be among the first to experience the future of product development.
            </p>
            
            <motion.a
              href="https://forms.google.com/your-form-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Client Waitlist
            </motion.a>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        .text-gradient-animated {
          background: linear-gradient(
            45deg,
            #ff6b35,
            #f7931e,
            #ffd23f,
            #06ffa5,
            #36c9ff,
            #6b46c1,
            #d946ef,
            #ff6b35
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}