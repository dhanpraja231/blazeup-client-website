'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const { light } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send message');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const borderColor = light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)';

  const inputBase = {
    width: '100%',
    padding: '14px 16px 14px 44px',
    borderRadius: 12,
    border: `1px solid ${borderColor}`,
    background: light ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
    color: light ? '#0f172a' : '#fff',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.3s, color 0.3s',
    fontFamily: 'inherit',
  } as const;

  const inputFocusStyle = {
    borderColor: 'rgba(255, 107, 53, 0.5)',
    boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.08)',
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600 as const,
    color: light ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    display: 'block',
    letterSpacing: '0.02em',
    transition: 'color 0.3s',
  };

  const iconStyle = {
    position: 'absolute' as const,
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: light ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
    pointerEvents: 'none' as const,
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 20px 80px',
      position: 'relative',
      background: light ? '#f8fafc' : 'var(--dark-gray)',
      transition: 'background 0.4s',
    }}>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 560,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            <span style={{ color: light ? '#0f172a' : '#fff', transition: 'color 0.3s' }}>Get in Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: 16,
              color: light ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
              maxWidth: 400,
              margin: '0 auto',
              transition: 'color 0.3s',
            }}
          >
            Have a question or want to work together? Drop us a message and we&apos;ll get back to you.
          </motion.p>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            background: light ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 20,
            padding: '40px 36px',
            backdropFilter: 'blur(12px)',
            boxShadow: light ? '0 4px 24px rgba(0,0,0,0.04)' : 'none',
            transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
          }}
        >
          <form ref={formRef} onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="contact-name" style={labelStyle}>Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={iconStyle} />
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputBase}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="contact-email" style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={iconStyle} />
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputBase}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
              <div style={{ position: 'relative' }}>
                <FileText size={18} style={iconStyle} />
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  style={inputBase}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 32 }}>
              <label htmlFor="contact-message" style={labelStyle}>Message</label>
              <div style={{ position: 'relative' }}>
                <MessageSquare size={18} style={{ ...iconStyle, top: 18, transform: 'none' }} />
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{
                    ...inputBase,
                    resize: 'vertical' as const,
                    minHeight: 130,
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
              whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 14,
                border: 'none',
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: status === 'success'
                  ? '#10b981'
                  : status === 'error'
                    ? '#ef4444'
                    : '#ff6b35',
                opacity: status === 'sending' ? 0.7 : 1,
                transition: 'opacity 0.2s, background 0.3s',
                letterSpacing: '-0.01em',
              }}
            >
              {status === 'sending' && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
              {status === 'success' && <CheckCircle size={20} />}
              {status === 'error' && <AlertCircle size={20} />}
              {status === 'idle' && <Send size={18} />}
              {status === 'idle' && 'Send Message'}
              {status === 'sending' && 'Sending...'}
              {status === 'success' && 'Message Sent!'}
              {status === 'error' && (errorMsg || 'Failed to send')}
            </motion.button>
          </form>
        </motion.div>

        {/* Direct email fallback */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: 28,
            fontSize: 13,
            color: light ? 'rgba(15,23,42,0.35)' : 'rgba(255,255,255,0.3)',
            transition: 'color 0.3s',
          }}
        >
          Or email us directly at{' '}
          <a
            href="mailto:contact@blazeup.app"
            style={{
              color: '#ff6b35',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'opacity 0.2s',
            }}
          >
            contact@blazeup.app
          </a>
        </motion.p>
      </motion.div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

