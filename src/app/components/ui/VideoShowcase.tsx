'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VideoShowcase() {
  const { light } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const video1WrapRef = useRef<HTMLDivElement>(null);
  const video2WrapRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const companionRef = useRef<HTMLDivElement>(null);
  const companionAnimatedRef = useRef(false);

  // ScrollTrigger: video1 exits left, video2 enters from right
  useEffect(() => {
    const section = sectionRef.current;
    const wrap1 = video1WrapRef.current;
    const wrap2 = video2WrapRef.current;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!section || !wrap1 || !wrap2 || !v1 || !v2) return;

    // Auto-play video 1 when visible
    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            v1.play().catch(() => {});
          } else {
            v1.pause();
            v2.pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    playObserver.observe(section);

    // Set initial state: video2 fully offscreen right
    gsap.set(wrap2, { x: '100vw' });
    gsap.set(wrap1, { x: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'center center',
          end: '+=100%',
          pin: true,
          scrub: 0.3,
          onUpdate: (self) => {
            if (self.progress > 0.3) {
              v2.play().catch(() => {});
              v1.pause();
            } else {
              v1.play().catch(() => {});
              v2.pause();
            }
          },
        },
      });

      // Video 1 slides fully off to the left
      tl.to(wrap1, {
        x: '-100vw',
        duration: 1,
        ease: 'power2.inOut',
      }, 0);

      // Video 2 slides in from the right to center
      tl.to(wrap2, {
        x: 0,
        duration: 1,
        ease: 'power2.inOut',
      }, 0);
    }, section);

    return () => {
      ctx.revert();
      playObserver.disconnect();
    };
  }, []);

  // Companion text reveal
  useEffect(() => {
    const el = companionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !companionAnimatedRef.current) {
            companionAnimatedRef.current = true;
            const items = el.querySelectorAll('.companion-item');
            const dividers = el.querySelectorAll('.companion-divider');
            gsap.fromTo(items,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
            );
            gsap.fromTo(dividers,
              { scaleY: 0, opacity: 0 },
              { scaleY: 1, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const videoContainerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: light
      ? '0 25px 60px -12px rgba(0,0,0,0.15)'
      : '0 25px 60px -12px rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  };

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
      {/* Subtle radial accent glow */}
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
            style={{ color: light ? '#f97316' : '#fb923c', letterSpacing: '0.15em' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See It In Action
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5"
            style={{ color: light ? '#0f172a' : '#fff', transition: 'color 0.3s', lineHeight: 1.15 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            The Complete{' '}
            <span style={{ color: light ? '#f97316' : '#fb923c' }}>Experience</span>
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

        {/* ── Video Swap Area ── */}
        <div
          className="relative mx-auto"
          style={{ maxWidth: '1400px', width: '100%' }}
        >
          {/* Invisible spacer to maintain height based on video aspect ratio */}
          <div style={{ width: '100%', paddingTop: '56.25%' /* 16:9 */ }} />

          {/* Video 1 — Complete Experience */}
          <div ref={video1WrapRef} style={videoContainerStyle}>
            <video
              ref={video1Ref}
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
          </div>

          {/* Video 2 — Consumer */}
          <div ref={video2WrapRef} style={videoContainerStyle}>
            <video
              ref={video2Ref}
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
              }}
            >
              <source src="/consumer.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* ── Companion Text Below Video ── */}
        <div
          ref={companionRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: 0,
            maxWidth: '960px',
            margin: '56px auto 0',
            flexWrap: 'wrap',
          }}
        >
          <div className="companion-item" style={{ flex: 1, minWidth: 200, textAlign: 'center', padding: '0 28px', opacity: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: light ? '#0f172a' : '#fff', marginBottom: 10, transition: 'color 0.3s' }}>
              Craft Your Card
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: light ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.45)', transition: 'color 0.3s' }}>
              Design branded corporate cards with live preview — pick colors, logos, and layouts in seconds.
            </div>
          </div>

          <div className="companion-divider" style={{
            width: 1, alignSelf: 'stretch', opacity: 0, transformOrigin: 'center top',
            background: light
              ? 'linear-gradient(180deg, transparent, rgba(0,0,0,0.12), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)',
          }} />

          <div className="companion-item" style={{ flex: 1, minWidth: 200, textAlign: 'center', padding: '0 28px', opacity: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: light ? '#0f172a' : '#fff', marginBottom: 10, transition: 'color 0.3s' }}>
              Set the Rules
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: light ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.45)', transition: 'color 0.3s' }}>
              Build spending policies visually — drag-and-drop approval flows that enforce limits automatically.
            </div>
          </div>

          <div className="companion-divider" style={{
            width: 1, alignSelf: 'stretch', opacity: 0, transformOrigin: 'center top',
            background: light
              ? 'linear-gradient(180deg, transparent, rgba(0,0,0,0.12), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)',
          }} />

          <div className="companion-item" style={{ flex: 1, minWidth: 200, textAlign: 'center', padding: '0 28px', opacity: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: light ? '#0f172a' : '#fff', marginBottom: 10, transition: 'color 0.3s' }}>
              See Everything
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: light ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.45)', transition: 'color 0.3s' }}>
              Real-time dashboards that break down every transaction — by category, team, and trend.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
