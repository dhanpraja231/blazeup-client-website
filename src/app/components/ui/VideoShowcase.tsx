'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import gsap from 'gsap';

export default function VideoShowcase() {
  const { light } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const companionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const companionInView = useInView(companionRef as React.RefObject<Element>, { once: true, amount: 0.3 });
  const [hasStarted, setHasStarted] = useState(false);
  const [companionAnimated, setCompanionAnimated] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
      setHasStarted(true);
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  // GSAP companion text animation
  useEffect(() => {
    if (!companionInView || companionAnimated || !companionRef.current) return;
    setCompanionAnimated(true);

    const items = companionRef.current.querySelectorAll('.companion-item');
    const divider = companionRef.current.querySelectorAll('.companion-divider');

    gsap.fromTo(items,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      }
    );

    gsap.fromTo(divider,
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1, opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: 'power2.out',
      }
    );

    // Animate counter numbers
    const counters = companionRef.current.querySelectorAll('.counter-value');
    counters.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.5,
        delay: 0.4,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toLocaleString() + (el.getAttribute('data-suffix') || '');
        }
      });
    });
  }, [companionInView, companionAnimated]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: light
          ? 'linear-gradient(180deg, #cbd5e1 0%, #e0e7ef 40%, #f1f5f9 100%)'
          : 'linear-gradient(180deg, #020617 0%, #0b1120 40%, #111827 100%)',
        transition: 'background 0.5s ease',
        padding: '80px 0 100px',
      }}
    >
      {/* Subtle radial accent glow behind the video */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '600px',
          background: light
            ? 'radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, rgba(236,72,153,0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        }}
      />



      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-block text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4"
            style={{
              color: light ? '#f97316' : '#fb923c',
              letterSpacing: '0.15em',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See It In Action
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5"
            style={{
              color: light ? '#0f172a' : '#fff',
              transition: 'color 0.3s',
              lineHeight: 1.15,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            The Complete{' '}
            <span
              style={{
                color: light ? '#f97316' : '#fb923c',
              }}
            >
              Experience
            </span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto"
            style={{
              color: light ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.5)',
              transition: 'color 0.3s',
              lineHeight: 1.7,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Watch how BlazeUp transforms your expense management — from card design
            to policy evaluation — all in one seamless flow.
          </motion.p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative mx-auto"
          style={{
            maxWidth: '1400px',
            width: '100%',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: light
              ? '0 25px 60px -12px rgba(0,0,0,0.15)'
              : '0 25px 60px -12px rgba(0,0,0,0.7)',
          }}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              transform: 'scale(1.4)',
              transformOrigin: 'center center',
            }}
          >
            <source src="/CompleteVideo.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* ── Companion Stats Below Video ── */}
        <div
          ref={companionRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: 0,
            maxWidth: '900px',
            margin: '56px auto 0',
            flexWrap: 'wrap',
          }}
        >
          {/* Stat 1 */}
          <div className="companion-item" style={{ flex: 1, minWidth: 180, textAlign: 'center', padding: '0 24px', opacity: 0 }}>
            <div
              className="counter-value"
              data-target="15"
              data-suffix="+"
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: light ? '#0f172a' : '#fff',
                marginBottom: 8,
                transition: 'color 0.3s',
              }}
            >
              0
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: light ? '#f97316' : '#fb923c',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}>
              Policy Templates
            </div>
            <div style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: light ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.4)',
              transition: 'color 0.3s',
            }}>
              Pre-built workflows to get started in minutes
            </div>
          </div>

          {/* Divider */}
          <div className="companion-divider" style={{
            width: 1,
            alignSelf: 'stretch',
            background: light
              ? 'linear-gradient(180deg, transparent, rgba(0,0,0,0.12), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)',
            opacity: 0,
            transformOrigin: 'center top',
          }} />

          {/* Stat 2 */}
          <div className="companion-item" style={{ flex: 1, minWidth: 180, textAlign: 'center', padding: '0 24px', opacity: 0 }}>
            <div
              className="counter-value"
              data-target="500"
              data-suffix="ms"
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: light ? '#0f172a' : '#fff',
                marginBottom: 8,
                transition: 'color 0.3s',
              }}
            >
              0
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: light ? '#6366f1' : '#818cf8',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}>
              Evaluation Speed
            </div>
            <div style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: light ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.4)',
              transition: 'color 0.3s',
            }}>
              Real-time policy decisions at scale
            </div>
          </div>

          {/* Divider */}
          <div className="companion-divider" style={{
            width: 1,
            alignSelf: 'stretch',
            background: light
              ? 'linear-gradient(180deg, transparent, rgba(0,0,0,0.12), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)',
            opacity: 0,
            transformOrigin: 'center top',
          }} />

          {/* Stat 3 */}
          <div className="companion-item" style={{ flex: 1, minWidth: 180, textAlign: 'center', padding: '0 24px', opacity: 0 }}>
            <div
              className="counter-value"
              data-target="100"
              data-suffix="%"
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: light ? '#0f172a' : '#fff',
                marginBottom: 8,
                transition: 'color 0.3s',
              }}
            >
              0
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: light ? '#10b981' : '#34d399',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}>
              Audit Coverage
            </div>
            <div style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: light ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.4)',
              transition: 'color 0.3s',
            }}>
              Every transaction tracked and verified
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
