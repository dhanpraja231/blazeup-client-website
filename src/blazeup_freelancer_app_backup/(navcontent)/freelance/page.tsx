'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Zap, Target, Code, Palette, Brain, Star, ArrowRight, CheckCircle, Coffee, Laptop, GraduationCap, Sparkles, Play, User, Calendar, Clock } from 'lucide-react';

// Types for the workboard
interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'review';
  avatar: string;
}

interface Column {
  id: 'open' | 'in-progress' | 'review';
  title: string;
  color: string;
}

// Interactive Workboard Preview Component
const InteractiveWorkboardPreview: React.FC = () => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Design Homepage",
      assignee: "Sarah",
      priority: "high",
      status: "open",
      avatar: "👩‍🎨"
    },
    {
      id: 2,
      title: "API Integration",
      assignee: "Alex",
      priority: "medium",
      status: "in-progress",
      avatar: "👨‍💻"
    },
    {
      id: 3,
      title: "User Testing",
      assignee: "Maya",
      priority: "low",
      status: "review",
      avatar: "👩‍🔬"
    },
    {
      id: 4,
      title: "Database Setup",
      assignee: "Jake",
      priority: "high",
      status: "open",
      avatar: "👨‍🔧"
    },
    {
      id: 5,
      title: "Mobile Responsive",
      assignee: "Lisa",
      priority: "medium",
      status: "in-progress",
      avatar: "👩‍💻"
    }
  ]);

  const columns: Column[] = [
    { id: "open", title: "Open", color: "from-purple-400 to-purple-500" },
    { id: "in-progress", title: "In Progress", color: "from-pink-400 to-pink-500" },
    { id: "review", title: "Review", color: "from-blue-400 to-blue-500" }
  ];

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high': return 'bg-red-400/80';
      case 'medium': return 'bg-yellow-400/80';
      case 'low': return 'bg-green-400/80';
      default: return 'bg-gray-400/80';
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task): void => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnId: Column['id']): void => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== columnId) {
      setTasks(prev => prev.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: columnId }
          : task
      ));
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: Task['status']): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 min-h-96 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            whileHover={{ scale: 1.01, borderColor: 'rgba(168, 85, 247, 0.3)' }}
          >
            <div className={`bg-gradient-to-r ${column.color} rounded-xl p-4 mb-6 shadow-lg`}>
              <h3 className="text-white font-bold text-center text-lg">{column.title}</h3>
              <div className="text-center text-white/90 text-sm mt-1">
                {getTasksByStatus(column.id).length} tasks
              </div>
            </div>
            
            <div className="space-y-4">
              {getTasksByStatus(column.id).map((task) => (
                <motion.div
                  key={task.id}
                  className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-4 cursor-move hover:bg-white/15 hover:border-white/30 transition-all duration-200 shadow-lg group"
                  draggable
                  onDragStart={(e) => handleDragStart(e as unknown as  React.DragEvent<HTMLDivElement>, task)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileDrag={{ scale: 1.05, rotate: 2 }}
                  layout
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-white font-semibold text-sm flex-1 leading-tight group-hover:text-white/90">
                      {task.title}
                    </h4>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} ml-2 mt-0.5 shadow-sm`}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{task.avatar}</span>
                      <span className="text-white/80 text-xs font-medium">{task.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white/60">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">2d</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Add task placeholder */}
              <motion.div
                className="border-2 border-dashed border-white/30 rounded-xl p-4 text-center text-white/50 hover:border-white/50 hover:text-white/70 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <div className="text-sm font-medium">+ Add task</div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Demo Instructions */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-4 inline-block">
          <p className="text-white/70 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Try dragging tasks between columns to see the interactive workflow in action!
            <Sparkles className="w-4 h-4 text-pink-400" />
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default function FreelancerPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const workEnvironmentImages: any = [];

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

  const handleJoinWaitlist = () => {
    // Navigate to the registration form
    window.location.href = '/freelancer-registration';
  };

  return (
    <section 
      id="freelancer"
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Join the Future of Work
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto">
              Build systems of scale and create art that transcends time while earning for your skills
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
                Join Freelancer Network
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
              Why Freelancers Choose BlazeUp
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {keyBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group hover:border-white/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: 'rgba(168, 85, 247, 0.4)',
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
        </div>

        {/* Core Qualities */}
        <div className="py-20 px-8">
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
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group hover:border-white/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
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
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 h-72 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 group hover:border-white/20"
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Who You Are */}
        <div className="py-20 px-8">
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
                  className="text-center backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 group h-72 flex flex-col justify-between hover:border-white/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: 'rgba(168, 85, 247, 0.4)'
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
        </div>
      </div>

      {/* Bottom Gradient Fade - Matching Home Page */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </section>
  );
}