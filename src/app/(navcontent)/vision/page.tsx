'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, Zap, Eye, Monitor, Package, ArrowRight, Star, Globe, TrendingUp, Network, Lightbulb, Heart, Layers, Compass, Rocket, Sparkles } from 'lucide-react';

export default function VisionPage() {
  const [activeStory, setActiveStory] = useState(0);
  
  const storyBeats = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "The Genesis",
      narrative: "In a world transformed by Gen-AI, we witnessed the dawn of the gig economy revolution. Traditional employment models began to crumble, making way for something extraordinary.",
      visual: "A new chapter begins..."
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "The Bridge",
      narrative: "We saw talented individuals struggling to find meaningful work, while innovative startups desperately needed skilled professionals. A bridge was needed.",
      visual: "Connecting dreams to reality..."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "The Vision",
      narrative: "What if we could create a space where a PBC engineer could collaborate with Dream11 founders? Where talent transcends traditional boundaries?",
      visual: "Where magic happens..."
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "The Future",
      narrative: "Today, we're not just building a platform. We're crafting the future of work—one where creativity, flexibility, and excellence converge.",
      visual: "The journey continues..."
    }
  ];

  const coreValues = [
    {
      icon: <Heart className="w-16 h-16" />,
      title: "Community Over Competition",
      philosophy: "We believe in lifting each other up. When one succeeds, we all grow stronger.",
      manifestation: "Every project becomes a collaboration, every challenge an opportunity to learn together.",
      gradient: "from-rose-400 via-pink-500 to-purple-600"
    },
    {
      icon: <Compass className="w-16 h-16" />,
      title: "Purpose-Driven Excellence",
      philosophy: "Quality isn't just about deliverables—it's about creating work that matters.",
      manifestation: "We don't just build products; we craft experiences that leave lasting impact.",
      gradient: "from-blue-400 via-indigo-500 to-purple-600"
    },
    {
      icon: <Zap className="w-16 h-16" />,
      title: "Adaptive Innovation",
      philosophy: "In a world of constant change, flexibility becomes our greatest strength.",
      manifestation: "We pivot with purpose, evolve with intention, and grow through every challenge.",
      gradient: "from-amber-400 via-orange-500 to-red-500"
    },
    {
      icon: <Sparkles className="w-16 h-16" />,
      title: "Transparent Authenticity",
      philosophy: "Honest communication builds unshakeable foundations.",
      manifestation: "We share our wins, learn from our failures, and grow through radical honesty.",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % storyBeats.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 25% 60%, rgba(168, 85, 247, 0.12) 0%, transparent 60%),
              radial-gradient(circle at 75% 25%, rgba(236, 72, 153, 0.12) 0%, transparent 60%),
              radial-gradient(circle at 50% 90%, rgba(59, 130, 246, 0.12) 0%, transparent 60%)
            `
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
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

      <div className="text-white relative z-10">
        {/* Hero Story Section */}
        <section className="min-h-screen flex items-center justify-center px-8 py-20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-8 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Our Story
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Every revolution begins with a simple idea. Ours started with believing that talent knows no boundaries.
              </p>
            </motion.div>

            {/* Interactive Story Timeline */}
            <div className="relative">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-12 min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStory}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex justify-center mb-8">
                      <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                        {storyBeats[activeStory].icon}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">
                      {storyBeats[activeStory].title}
                    </h3>
                    
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                      {storyBeats[activeStory].narrative}
                    </p>
                    
                    <div className="text-purple-400/60 italic text-lg">
                      {storyBeats[activeStory].visual}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Story Progress Indicators */}
                <div className="flex justify-center mt-12 gap-3">
                  {storyBeats.map((_, index) => (
                    <button
                      key={index}
                      className={`relative h-3 rounded-full transition-all duration-500 ${
                        index === activeStory ? 'w-12 bg-gradient-to-r from-purple-400 to-pink-400' : 'w-3 bg-white/20 hover:bg-white/40'
                      }`}
                      onClick={() => setActiveStory(index)}
                    >
                      {index === activeStory && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                          layoutId="activeIndicator"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Manifesto */}
        <section className="py-32 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Our Mission
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                We're not just changing how work gets done—we're reimagining what work can become.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                className="group relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/10 transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 inline-flex mb-6">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Bridge the Gap</h3>
                  <p className="text-white/70 leading-relaxed">
                    We connect exceptional talent with visionary ideas, creating partnerships that transcend traditional boundaries and limitations.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="group relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/10 transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 inline-flex mb-6">
                    <Layers className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Enable Flexibility</h3>
                  <p className="text-white/70 leading-relaxed">
                    We empower businesses to build, pivot, and scale with the agility needed to thrive in today's dynamic landscape.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="group relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/10 transition-all duration-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.02}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 inline-flex mb-6">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Fuel Growth</h3>
                  <p className="text-white/70 leading-relaxed">
                    We provide opportunities for ambitious individuals to showcase their talents, build meaningful relationships, and create lasting impact.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values - Redesigned */}
        <section className="py-32 px-8">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Our Core Values
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                These aren't just words on a wall—they're the principles that guide every decision we make.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  className="group relative h-[420px]"
                  initial={{ opacity: 0, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                //   whileHover={{ y: -8 }}
                >
                  <div className="relative h-full backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/8 transition-all duration-300 overflow-hidden">
                    {/* Gradient overlay */}
                    {/* <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-8 transition-all duration-300`} />
                     */}
                    {/* Floating icon background */}
                    {/* <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${value.gradient} opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-all duration-500`} /> */}
                    
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Header with icon */}
                      <div className="flex items-start gap-4 mb-6">
                        {/* <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br ${value.gradient} bg-opacity-10 border border-white/10 group-hover:scale-105 transition-transform duration-300`}>
                          <div className={`text-transparent bg-gradient-to-r ${value.gradient} bg-clip-text`}>
                            {value.icon}
                          </div>
                        </div> */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors duration-300">
                            {value.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Content sections */}
                      <div className="flex-1 space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${value.gradient}`} />
                            <h4 className="text-lg font-semibold text-white/80 uppercase tracking-wide">Our Philosophy</h4>
                          </div>
                          <p className="text-white/70 leading-relaxed text-md group-hover:text-white/80 transition-colors duration-300">
                            {value.philosophy}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${value.gradient}`} />
                            <h4 className="text-lg  font-semibold text-white/80 uppercase tracking-wide">In Practice</h4>
                          </div>
                          <p className="text-white/70 leading-relaxed text-md group-hover:text-white/80 transition-colors duration-300">
                            {value.manifestation}
                          </p>
                        </div>
                      </div>
                      
                      {/* Bottom accent */}
                      <div className={`mt-6 h-1 w-full bg-gradient-to-r ${value.gradient} opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-300`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision for the Future */}
        <section className="py-32 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-12">
                The Future We're Building
              </h2>
              
              <div className="backdrop-blur-lg bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-white/10 rounded-3xl p-16">
  <div className="max-w-4xl mx-auto space-y-8 text-lg md:text-xl leading-relaxed text-white/80">
    <p>
      What if your talent wasn’t limited by geography? What if meaningful work could happen without layers of red tape or rigid roles? We're creating a space where skilled people connect freely to build, solve, and ship.
    </p>

    <p>
      This isn’t just another platform. It’s a shared workspace where a developer from a small town can pair with a founder in Silicon Valley. Where designers and engineers work shoulder to shoulder, with clear ownership and real impact.
    </p>

    <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Our aim: to make work feel real again—driven by purpose, shaped by people, and rewarding for everyone involved.
    </p>
  </div>
</div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}