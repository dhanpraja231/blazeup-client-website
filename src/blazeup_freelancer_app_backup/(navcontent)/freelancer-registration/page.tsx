'use client'
import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader2, FileText, X } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  country: string;
  domain: string;
  customDomain: string;
  speciality: string;
  customSpeciality: string;
  workMobile: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  domain?: string;
  customDomain?: string;
  speciality?: string;
  customSpeciality?: string;
  resume?: string;
}

interface SubmitStatus {
  type: 'success' | 'error';
  message: string;
}

type Domain = 'Design' | 'Development' | 'Marketing' | 'Content Creation' | 'Video/Animation' | 'Data & Analytics' | 'Product Management' | 'QA & Testing' | 'Customer Support' | 'Business/Consulting';

const FreelancerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    country: 'India',
    domain: '',
    customDomain: '',
    speciality: '',
    customSpeciality: '',
    workMobile: ''
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const countries: string[] = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Netherlands', 'Singapore', 'UAE', 'Other'
  ];

  const domains: (Domain | 'Other')[] = [
    'Design', 'Development', 'Marketing', 'Content Creation',
    'Video/Animation', 'Data & Analytics', 'Product Management',
    'QA & Testing', 'Customer Support', 'Business/Consulting', 'Other'
  ];

  const specialities: Record<Domain, (string | 'Other')[]> = {
    'Design': [
      'UI/UX Design', 'Web Design', 'Mobile App Design', 'Graphic Design',
      'Product Design', 'Branding & Identity', 'Illustration', 'Motion Graphics',
      'Presentation Design', 'Other'
    ],
    'Development': [
      'Frontend Development', 'Backend Development', 'Full Stack Development',
      'Mobile App Development', 'WordPress / CMS', 'E-commerce', 'DevOps / Cloud',
      'Game Development', 'API Integration', 'AI/ML', 'Embedded Systems', 'Other'
    ],
    'Marketing': [
      'Social Media Marketing', 'SEO / SEM', 'Email Marketing', 'Paid Ads (PPC)',
      'Influencer Marketing', 'Marketing Automation', 'Growth Hacking',
      'Brand Strategy', 'Content Strategy', 'Other'
    ],
    'Content Creation': [
      'Copywriting', 'Technical Writing', 'Scriptwriting', 'Blogging',
      'Editing / Proofreading', 'Translation', 'Creative Writing', 'Other'
    ],
    'Video/Animation': [
      'Video Editing', '2D / 3D Animation', 'Motion Design', 'Explainer Videos',
      'Voiceover', 'Sound Design', 'Subtitling', 'Other'
    ],
    'Data & Analytics': [
      'Data Analysis', 'Data Engineering', 'Visualization', 'BI Tools',
      'ML / AI', 'Statistical Modeling', 'Database Admin', 'Other'
    ],
    'Product Management': [
      'Product Strategy', 'Agile PM', 'User Research', 'Roadmap Planning',
      'Technical PM', 'Other'
    ],
    'QA & Testing': [
      'Manual Testing', 'Automated Testing', 'QA Strategy', 'Performance Testing',
      'Security Testing', 'Other'
    ],
    'Customer Support': [
      'Tech Support', 'Customer Success', 'Live Chat Support',
      'Community Management', 'Help Desk CRM', 'Other'
    ],
    'Business/Consulting': [
      'Strategy Consulting', 'Financial Planning', 'HR / Recruitment',
      'Legal Advisory', 'Startup Mentorship', 'Project Management', 'Other'
    ]
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'domain' ? { 
        speciality: '', 
        customSpeciality: '',
        ...(value !== 'Other' ? { customDomain: '' } : {})
      } : {}),
      ...(name === 'speciality' && value !== 'Other' ? { customSpeciality: '' } : {})
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document' }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'File size must be less than 10MB' }));
        return;
      }
      setResumeFile(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const removeFile = (): void => {
    setResumeFile(null);
    const fileInput = document.getElementById('resume') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.domain) newErrors.domain = 'Please select a domain';
    if (formData.domain === 'Other' && !formData.customDomain.trim()) {
      newErrors.customDomain = 'Please specify your domain';
    }
    
    // For speciality validation, we need to handle different scenarios
    if (formData.domain === 'Other') {
      // When domain is Other, speciality field is not shown, so we need customSpeciality
      if (!formData.customSpeciality.trim()) {
        newErrors.customSpeciality = 'Please specify your speciality';
      }
    } else {
      // When domain is not Other, we need either speciality or customSpeciality
      if (!formData.speciality) {
        newErrors.speciality = 'Please select a speciality';
      } else if (formData.speciality === 'Other' && !formData.customSpeciality.trim()) {
        newErrors.customSpeciality = 'Please specify your speciality';
      }
    }
    
    if (!resumeFile) newErrors.resume = 'Resume is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof FormData];
        formDataToSend.append(key, value);
      });
      
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }
      
      const response = await fetch('/api/freelancer-registration', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        // Reset form
        setFormData({
          name: '', email: '', country: 'India', domain: '', customDomain: '',
          speciality: '', customSpeciality: '', workMobile: ''
        });
        setResumeFile(null);
        const fileInput = document.getElementById('resume') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
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
            Join Our Freelancer Network
          </h1>
          <p className="text-xl text-white/70">
            Take the first step towards an exciting freelance journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="space-y-6">
            {/* Name */}
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

            {/* Email */}
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
            </div>

            {/* Country and Work Mobile */}
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
                  Work Mobile
                </label>
                <input
                  type="tel"
                  name="workMobile"
                  value={formData.workMobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Domain *
              </label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="" className="bg-gray-800">Select your domain</option>
                {domains.map(domain => (
                  <option key={domain} value={domain} className="bg-gray-800">
                    {domain}
                  </option>
                ))}
              </select>
              {errors.domain && <p className="text-red-400 text-sm mt-1">{errors.domain}</p>}
            </div>

            {/* Custom Domain Input */}
            {formData.domain === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Please specify your domain *
                </label>
                <input
                  type="text"
                  name="customDomain"
                  value={formData.customDomain}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your domain"
                />
                {errors.customDomain && <p className="text-red-400 text-sm mt-1">{errors.customDomain}</p>}
              </motion.div>
            )}

            {/* Speciality */}
            {formData.domain && formData.domain !== 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Speciality *
                </label>
                <select
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="" className="bg-gray-800">Select your speciality</option>
                  {specialities[formData.domain as Domain]?.map(speciality => (
                    <option key={speciality} value={speciality} className="bg-gray-800">
                      {speciality}
                    </option>
                  ))}
                </select>
                {errors.speciality && <p className="text-red-400 text-sm mt-1">{errors.speciality}</p>}
              </motion.div>
            )}

            {/* Custom Speciality Input for Domain = Other */}
            {formData.domain === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Please specify your speciality *
                </label>
                <input
                  type="text"
                  name="customSpeciality"
                  value={formData.customSpeciality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your speciality"
                />
                {errors.customSpeciality && <p className="text-red-400 text-sm mt-1">{errors.customSpeciality}</p>}
              </motion.div>
            )}

            {/* Custom Speciality Input for Speciality = Other */}
            {formData.speciality === 'Other' && formData.domain !== 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Please specify your speciality *
                </label>
                <input
                  type="text"
                  name="customSpeciality"
                  value={formData.customSpeciality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your speciality"
                />
                {errors.customSpeciality && <p className="text-red-400 text-sm mt-1">{errors.customSpeciality}</p>}
              </motion.div>
            )}

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Resume Upload *
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                {!resumeFile ? (
                  <label
                    htmlFor="resume"
                    className="flex items-center justify-center w-full px-4 py-6 bg-white/10 border-2 border-dashed border-white/20 rounded-xl text-white/70 hover:bg-white/20 hover:border-purple-500 transition-all duration-300 cursor-pointer group"
                  >
                    <Upload className="w-6 h-6 mr-2 group-hover:text-purple-400 transition-colors duration-300" />
                    <span className="group-hover:text-white transition-colors duration-300">
                      Click to upload resume (PDF, DOC, DOCX)
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between w-full px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      <span className="text-sm truncate">{resumeFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
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
                'Submit Application'
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

export default FreelancerRegistrationForm;