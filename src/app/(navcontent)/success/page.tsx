'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ArrowRight, Users, Briefcase, TrendingUp, Award, ChevronLeft, ChevronRight, Target, Zap, Eye, Monitor, Package, Globe, Network, Lightbulb, Heart, Layers, Compass, Rocket, Sparkles, Building2, Code, Palette, BarChart3, Leaf, Stethoscope, BookOpen, ShoppingBag, CheckCircle, MessageSquare, Clock, Handshake } from 'lucide-react';

export default function SuccessPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeMetricStory, setActiveMetricStory] = useState(0);

  const testimonials = [
    {
      quote: "DSA doesn't crack SDE jobs at unicorns anymore, your verified profile at BlazeUp does.",
      author: "Priya Sharma",
      role: "Software Engineer at Zomato",
      icon: <Code className="w-6 h-6" />,
      category: "Career Growth",
      impact: "Landed dream job at unicorn",
      rating: 5
    },
    {
      quote: "Working with the best designers at S&P helped me showcase my skills to the best and land referrals.",
      author: "Arjun Patel",
      role: "UI/UX Designer",
      icon: <Palette className="w-6 h-6" />,
      category: "Network Expansion",
      impact: "Got referrals to top companies",
      rating: 5
    },
    {
      quote: "We wanted to build an inventory management app but cancelled last minute due to changes in business strategy. BlazeUp's flexibility saved us thousands.",
      author: "Sarah Chen",
      role: "Startup Founder",
      icon: <Briefcase className="w-6 h-6" />,
      category: "Business Flexibility",
      impact: "Saved $50K+ on cancelled project",
      rating: 5
    },
    {
      quote: "Freelance is the new open source. BlazeUp made me realize that contributing to real products while earning is the future.",
      author: "Dev Sharma",
      role: "Full Stack Developer",
      icon: <Code className="w-6 h-6" />,
      category: "Future of Work",
      impact: "Built 5+ products in 6 months",
      rating: 5
    },
    {
      quote: "From 0 to MVP in just 3 weeks. The dedicated PM helped us navigate every technical decision seamlessly.",
      author: "Lisa Rodriguez",
      role: "Product Manager at TechCorp",
      icon: <Rocket className="w-6 h-6" />,
      category: "Speed to Market",
      impact: "Launched MVP 70% faster",
      rating: 5
    },
    {
      quote: "The real-time workboard gave us confidence in our investment. We could see our product come to life daily.",
      author: "Michael Zhang",
      role: "Angel Investor",
      icon: <Eye className="w-6 h-6" />,
      category: "Transparency",
      impact: "Invested in 3 more projects",
      rating: 5
    },
    {
      quote: "BlazeUp's verified freelancer network is unmatched. We found our core team within weeks of launch.",
      author: "Ananya Gupta",
      role: "CEO at FinTech Startup",
      icon: <Users className="w-6 h-6" />,
      category: "Team Building",
      impact: "Built entire tech team",
      rating: 5
    },
    {
      quote: "The flat hierarchy and gen-z work environment helped me thrive. I've never been more productive.",
      author: "Rahul Kapoor",
      role: "Frontend Developer",
      icon: <TrendingUp className="w-6 h-6" />,
      category: "Work Culture",
      impact: "200% productivity increase",
      rating: 5
    }
  ];

  const metricStories = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Trust Earned",
      narrative: "When clients choose to stay, it's not just about satisfaction—it's about trust. Our 95% retention rate tells the story of partnerships that grow stronger with every project.",
      value: "95%",
      label: "Client Retention",
      gradient: "from-purple-400 to-pink-400",
      visual: "Building lasting relationships..."
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Speed Redefined",
      narrative: "In a world where time is the ultimate currency, we've cracked the code. Our streamlined processes and expert teams deliver results 3.2x faster than traditional methods.",
      value: "3.2x",
      label: "Faster Delivery",
      gradient: "from-blue-400 to-purple-400",
      visual: "Where urgency meets excellence..."
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Excellence Standard",
      narrative: "Quality isn't negotiable. With a 98% quality score, we don't just meet expectations—we redefine what's possible when talent meets purpose.",
      value: "98%",
      label: "Quality Score",
      gradient: "from-green-400 to-blue-400",
      visual: "Crafting perfection, every time..."
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Impact Delivered",
      narrative: "Each project represents a dream realized, a problem solved, an idea brought to life. Our 200+ completed projects are testimonies to the power of collaborative excellence.",
      value: "200+",
      label: "Projects Completed",
      gradient: "from-pink-400 to-orange-400",
      visual: "Turning visions into reality..."
    }
  ];

  const impactValues = [
    {
      icon: <Handshake className="w-16 h-16" />,
      title: "Authentic Partnerships",
      philosophy: "We don't just complete projects—we build relationships that last beyond the final delivery.",
      manifestation: "Every collaboration becomes a stepping stone to bigger opportunities and stronger networks.",
      gradient: "from-blue-400 via-purple-500 to-pink-600"
    },
    {
      icon: <CheckCircle className="w-16 h-16" />,
      title: "Quality at Scale",
      philosophy: "Excellence isn't about perfection—it's about consistent value that exceeds expectations.",
      manifestation: "We maintain the highest standards while scaling rapidly, proving that quality and speed can coexist.",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600"
    },
    {
      icon: <MessageSquare className="w-16 h-16" />,
      title: "Transparent Communication",
      philosophy: "Trust is built through clarity. We keep everyone informed, involved, and inspired.",
      manifestation: "Real-time updates, honest feedback, and open dialogue create the foundation for exceptional results.",
      gradient: "from-amber-400 via-orange-500 to-red-500"
    },
    {
      icon: <Clock className="w-16 h-16" />,
      title: "Adaptive Efficiency",
      philosophy: "Speed without sacrifice. We move fast while maintaining the quality that defines us.",
      manifestation: "Our processes evolve with each project, becoming more refined and efficient without losing human touch.",
      gradient: "from-purple-400 via-indigo-500 to-blue-600"
    }
  ];

  const industries = [
    { name: "Enterprise Software", icon: <Building2 className="w-8 h-8" />, projects: 45, highlight: "CRM & Analytics Platforms" },
    { name: "FinTech Innovation", icon: <BarChart3 className="w-8 h-8" />, projects: 38, highlight: "Payment & Trading Solutions" },
    { name: "Creative Technology", icon: <Palette className="w-8 h-8" />, projects: 32, highlight: "Design & Media Platforms" },
    { name: "HealthTech Solutions", icon: <Stethoscope className="w-8 h-8" />, projects: 28, highlight: "Telemedicine & Care Apps" },
    { name: "EdTech Platforms", icon: <BookOpen className="w-8 h-8" />, projects: 25, highlight: "Learning & Assessment Tools" },
    { name: "E-commerce Innovation", icon: <ShoppingBag className="w-8 h-8" />, projects: 22, highlight: "Retail & Marketplace Solutions" },
    { name: "Sustainability Tech", icon: <Leaf className="w-8 h-8" />, projects: 18, highlight: "Carbon & Environmental Tracking" }
  ];

  const categories = ["All", "Career Growth", "Network Expansion", "Business Flexibility", "Speed to Market", "Transparency", "Team Building", "Work Culture"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTestimonials = selectedCategory === "All" 
    ? testimonials 
    : testimonials.filter(t => t.category === selectedCategory);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % filteredTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [filteredTestimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetricStory((prev) => (prev + 1) % metricStories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black">
      {/* Animated Background */}
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
        
        {/* Floating particles */}
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

      <div className="text-white relative z-10">
        {/* Hero Section with Metric Story */}
        <section className="min-h-screen flex items-center justify-center px-8 mt-20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Success Stories
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
                Every number tells a story. Every story shapes the future.
              </p>
            </motion.div>

            {/* Interactive Metric Story */}
            <div className="relative">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-12 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMetricStory}
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex justify-center mb-8">
                      <div className={`p-6 rounded-full bg-gradient-to-r ${metricStories[activeMetricStory].gradient} bg-opacity-20 border border-white/20`}>
                        <div className={`text-transparent bg-gradient-to-r ${metricStories[activeMetricStory].gradient} bg-clip-text`}>
                          {metricStories[activeMetricStory].icon}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-bold mb-6">
                      {metricStories[activeMetricStory].title}
                    </h3>
                    
                    <div className={`text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r ${metricStories[activeMetricStory].gradient} bg-clip-text text-transparent`}>
                      {metricStories[activeMetricStory].value}
                    </div>
                    
                    <p className="text-lg font-medium text-white/60 mb-8">
                      {metricStories[activeMetricStory].label}
                    </p>
                    
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                      {metricStories[activeMetricStory].narrative}
                    </p>
                    
                    <div className="text-purple-400/60 italic text-lg">
                      {metricStories[activeMetricStory].visual}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Story Progress Indicators */}
                <div className="flex justify-center mt-12 gap-3">
                  {metricStories.map((_, index) => (
                    <button
                      key={index}
                      className={`relative h-3 rounded-full transition-all duration-500 ${
                        index === activeMetricStory ? 'w-12 bg-gradient-to-r from-purple-400 to-pink-400' : 'w-3 bg-white/20 hover:bg-white/40'
                      }`}
                      onClick={() => setActiveMetricStory(index)}
                    >
                      {index === activeMetricStory && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                          layoutId="activeMetricIndicator"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Values Section */}
        <section className="py-32 px-8">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                What Makes Us Different
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                Our success isn't just measured in numbers—it's defined by the principles that guide every interaction.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {impactValues.map((value, index) => (
                <motion.div
                  key={index}
                  className="group relative h-[420px]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <div className="relative h-full backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/8 transition-all duration-300 overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-6">
                        {/* <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br ${value.gradient} bg-opacity-10 border border-white/10 group-hover:scale-105 transition-transform duration-300`}>
                          <div className={`text-transparent bg-gradient-to-r ${value.gradient} bg-clip-text`}>
                            {value.icon}
                          </div>
                        </div> */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-3xl font-bold text-white group-hover:text-white transition-colors duration-300">
                            {value.title}
                          </h3>
                        </div>
                      </div>
                      
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
                            <h4 className="text-lg font-semibold text-white/80 uppercase tracking-wide">In Practice</h4>
                          </div>
                          <p className="text-white/70 leading-relaxed text-md group-hover:text-white/80 transition-colors duration-300">
                            {value.manifestation}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`mt-6 h-1 w-full bg-gradient-to-r ${value.gradient} opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-300`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

       {/* Voices of Success - Redesigned */}
       <section className="py-32 px-8">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Voices of Success
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                Real stories from the people who chose to build something extraordinary with us.
              </p>
            </motion.div>

            {/* Featured Testimonial */}
            <div className="mb-20">
              <div className="relative max-w-5xl mx-auto">
                <div className="backdrop-blur-lg bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/10 rounded-3xl overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      className="p-16 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Quote Icon */}
                      <div className="flex justify-center mb-8">
                        <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20">
                          <Quote className="w-8 h-8 text-purple-400" />
                        </div>
                      </div>
                      
                      {/* Quote */}
                      <blockquote className="text-2xl md:text-4xl font-light text-white leading-relaxed mb-12 max-w-4xl mx-auto">
                        "{testimonials[currentTestimonial]?.quote}"
                      </blockquote>
                      
                      {/* Author Info */}
                      <div className="flex items-center justify-center gap-6 mb-8">
                        <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10">
                          {testimonials[currentTestimonial]?.icon}
                        </div>
                        <div className="text-left">
                          <h4 className="text-2xl font-bold text-white mb-1">
                            {testimonials[currentTestimonial]?.author}
                          </h4>
                          <p className="text-lg text-white/60">
                            {testimonials[currentTestimonial]?.role}
                          </p>
                        </div>
                      </div>
                      
                      {/* Impact Badge */}
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                        <span className="text-white/80 font-medium">
                          {testimonials[currentTestimonial]?.impact}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Navigation */}
                <button
                  onClick={prevTestimonial}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 backdrop-blur-lg bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300 group"
                >
                  <ChevronLeft className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
                </button>
                
                <button
                  onClick={nextTestimonial}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 backdrop-blur-lg bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300 group"
                >
                  <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
                </button>
              </div>
              
              {/* Progress Indicators */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`relative h-2 rounded-full transition-all duration-500 ${
                      index === currentTestimonial ? 'w-16 bg-gradient-to-r from-purple-400 to-pink-400' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>

            {/* Testimonial Mosaic */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.slice(0, 6).map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="h-full backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300 cursor-pointer"
                       onClick={() => setCurrentTestimonial(index)}>
                    
                    {/* Quote Preview */}
                    <div className="mb-6">
                      <p className="text-white/80 leading-relaxed line-clamp-3 group-hover:text-white transition-colors duration-300">
                        "{testimonial.quote.substring(0, 120)}..."
                      </p>
                    </div>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        {testimonial.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                          {testimonial.author}
                        </h4>
                        <p className="text-white/60 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                        {testimonial.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries We Impact */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Industries We Transform
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      {industry.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{industry.name}</h3>
                      <p className="text-white/60 text-sm">{industry.projects} projects completed</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm group-hover:text-white/80 transition-colors duration-300">
                    {industry.highlight}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Grid */}
        <section className="py-20 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              More Success Stories
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.slice(0, 6).map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10">
                      {testimonial.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{testimonial.author}</h4>
                      <p className="text-white/60 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-white/10 text-xs text-white/70">
                      {testimonial.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32 px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-12">
                Ready to Write Your Success Story?
              </h2>
              
              <div className="backdrop-blur-lg bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-white/10 rounded-3xl p-16">
                <div className="max-w-4xl mx-auto space-y-8 text-lg md:text-xl leading-relaxed text-white/80">
                  <p>
                    Every success story starts with a single decision—the choice to believe that extraordinary results come from extraordinary partnerships.
                  </p>

                  <p>
                    Whether you're a visionary founder with an idea that could change the world, or a talented professional ready to build something meaningful, your story is waiting to be written.
                  </p>

                  <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Join the community where talent meets opportunity, where ideas become reality, and where success stories are born every day.
                  </p>
                  
                  <motion.div 
                    className="pt-8"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                      <span className="flex items-center gap-2">
                        Start Your Journey
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}