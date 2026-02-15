'use client'
import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, ChevronDown, X } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  country: string;
  companyName: string;
  mobile: string;
  broadCategories: string[];
  detailedUsecases: Record<string, string[]>;
  customNeeds: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  broadCategories?: string;
  customNeeds?: string;
}

interface SubmitStatus {
  type: 'success' | 'error';
  message: string;
}

const ClientRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    country: 'India',
    companyName: '',
    mobile: '',
    broadCategories: [],
    detailedUsecases: {},
    customNeeds: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const countries: string[] = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Netherlands', 'Singapore', 'UAE', 'Other'
  ];

  const broadCategories = [
    'Design Needs',
    'Development Projects', 
    'Marketing Support',
    'Content Production',
    'Analytics & Insights',
    'Product Building',
    'Internal Tools',
    'Customer Engagement',
    'Other'
  ];

  const detailedOptions: Record<string, string[]> = {
    'Design Needs': [
      'Branding & Identity',
      'UI/UX Design', 
      'Product Design',
      'Presentations & Decks',
      'Graphic Assets'
    ],
    'Development Projects': [
      'Website Development',
      'Web App / SaaS',
      'Mobile App Development', 
      'MVP for Startup',
      'API / Backend Services'
    ],
    'Marketing Support': [
      'SEO / SEM',
      'Social Media Content',
      'Email Campaigns',
      'Paid Ads / Performance',
      'Marketing Strategy'
    ],
    'Content Production': [
      'Blog Articles',
      'Technical Writing',
      'Video Scripts',
      'Product Descriptions', 
      'Translation / Localization'
    ],
    'Analytics & Insights': [
      'Dashboards',
      'Market Research',
      'Customer Data Analysis',
      'Sales Reports'
    ],
    'Product Building': [
      'End-to-End Product',
      'Feature Planning',
      'MVP Scoping',
      'Product Design + Dev'
    ],
    'Internal Tools': [
      'Automation Tools',
      'CRM / ERP Systems',
      'Custom Dashboards',
      'Workflow Tools'
    ],
    'Customer Engagement': [
      'Chatbots',
      'Support Center Content',
      'Email Sequences',
      'Customer Success Portals'
    ]
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => {
      const newCategories = checked 
        ? [...prev.broadCategories, category]
        : prev.broadCategories.filter(c => c !== category);
      
      const newDetailedUsecases = { ...prev.detailedUsecases };
      if (!checked) {
        delete newDetailedUsecases[category];
      }
      
      return {
        ...prev,
        broadCategories: newCategories,
        detailedUsecases: newDetailedUsecases
      };
    });
  };

  const handleDetailedUsecaseChange = (category: string, usecase: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      detailedUsecases: {
        ...prev.detailedUsecases,
        [category]: checked 
          ? [...(prev.detailedUsecases[category] || []), usecase]
          : (prev.detailedUsecases[category] || []).filter(u => u !== usecase)
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.broadCategories.length === 0) {
      newErrors.broadCategories = 'Please select at least one category';
    }
    
    if (formData.broadCategories.includes('Other') && !formData.customNeeds.trim()) {
      newErrors.customNeeds = 'Please describe your specific needs';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/client-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        // Reset form
        setFormData({
          name: '', email: '', country: 'India', companyName: '', mobile: '',
          broadCategories: [], detailedUsecases: {}, customNeeds: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: result.error });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden bg-gray-900">
      {/* Animated background */}
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

      <div className="container mx-auto max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Join Our Client Waitlist
          </h1>
          <p className="text-xl text-white/70">
            Tell us about your project and we'll match you with the perfect team
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                <p className="text-white/50 text-xs mt-1">We'll email you once the platform is ready</p>
              </div>
            </div>

            {/* Country and Company */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  {countries.map(country => (
                    <option key={country} value={country} className="bg-gray-800">
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="BlazeUp"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Mobile (Optional)
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Your mobile number"
              />
            </div>

            {/* Use Cases Section */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">
                What do you need help with? *
              </h4>
              <p className="text-white/60 text-sm mb-6">
                If you're not sure of what you want, we've got you covered. We'll layout the chart for you. Just type in what you know below.
              </p>

              {/* Level 1: Broad Categories */}
              <div className="mb-6">
                <h5 className="text-lg font-medium text-white/90 mb-3">Choose Broad Categories:</h5>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {broadCategories.map(category => (
                    <label
                      key={category}
                      className="flex items-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.broadCategories.includes(category)}
                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-transparent border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 text-white/80 group-hover:text-white transition-colors duration-300">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.broadCategories && <p className="text-red-400 text-sm mt-2">{errors.broadCategories}</p>}
              </div>

              {/* Level 2: Detailed Options */}
              {formData.broadCategories.filter(cat => cat !== 'Other').map(category => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <h6 className="text-lg font-medium text-white/90 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    {category} - Select specific needs:
                  </h6>
                  <div className="grid md:grid-cols-2 gap-2">
                    {detailedOptions[category]?.map(option => (
                      <label
                        key={option}
                        className="flex items-center p-2 hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.detailedUsecases[category]?.includes(option) || false}
                          onChange={(e) => handleDetailedUsecaseChange(category, option, e.target.checked)}
                          className="w-3 h-3 text-purple-500 bg-transparent border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-white/70 hover:text-white/90 transition-colors duration-300">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Other/Custom Needs */}
              {formData.broadCategories.includes('Other') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Please describe your specific needs *
                  </label>
                  <textarea
                    name="customNeeds"
                    value={formData.customNeeds}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about your project requirements..."
                  />
                  {errors.customNeeds && <p className="text-red-400 text-sm mt-1">{errors.customNeeds}</p>}
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Join Client Waitlist'
              )}
            </motion.button>

            {/* Status Messages */}
            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center gap-2 p-4 rounded-xl ${
                    submitStatus.type === 'success'
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span>{submitStatus.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientRegistrationPage;