'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react';
import { useUI } from '@/lib/contexts/UIContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { SectionHeader } from '@/components/SectionHeader';

function SocialIcon({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className="group relative flex items-center justify-center w-12 h-12 bg-panel border border-cyan/20 rounded-lg text-text-muted hover:text-white hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1"
    >
      {icon}
      <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-panel border border-cyan/30 text-cyan text-xs font-mono px-3 py-1 rounded pointer-events-none whitespace-nowrap shadow-[0_0_10px_rgba(0,240,255,0.2)] flex flex-col items-center">
        {label}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-cyan/30"></div>
      </span>
    </a>
  );
}

function FallingPiece({
  children,
  container,
  collapsed,
  permanent,
  dx,
  dy,
  rotate,
  delay,
  className = '',
}: {
  children: React.ReactNode;
  container: React.RefObject<HTMLDivElement | null>;
  collapsed: boolean;
  permanent: boolean;
  dx: number;
  dy: number;
  rotate: number;
  delay: number;
  className?: string;
}) {
  const [dragged, setDragged] = useState(false);

  useEffect(() => {
    if (!collapsed) {
      setDragged(false);
    }
  }, [collapsed]);

  // When permanent, snap to assembled position, no drag allowed
  if (permanent) {
    return (
      <motion.div
        className={`inline-block select-none pointer-events-none ${className}`}
        animate={{ x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`inline-block pointer-events-auto cursor-grab active:cursor-grabbing select-none ${className}`}
      drag={collapsed}
      dragConstraints={container}
      dragElastic={0.55}
      dragMomentum
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      onDragStart={() => setDragged(true)}
      animate={dragged ? undefined : (collapsed ? { x: dx, y: dy, rotate } : { x: 0, y: 0, rotate: 0 })}
      transition={
        collapsed
          ? { type: 'spring', stiffness: 70, damping: 7, mass: 1.1, delay }
          : { duration: 0.3, ease: 'easeInOut' }
      }
      style={{ touchAction: collapsed ? 'none' : 'auto' }}
    >
      {children}
    </motion.div>
  );
}

function GravityCollapse({ onContact }: { onContact: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [reassembling, setReassembling] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('contact@primuez.in').then(() => {
      setCopied(true);
      if (copyRef.current) clearTimeout(copyRef.current);
      copyRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };
  const isMobile = useIsMobile();

  const reassemble = () => {
    if (reassembling) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setReassembling(true);
    setCollapsed(false);
    timerRef.current = setTimeout(() => {
      setCollapsed(true);
      setReassembling(false);
    }, 2800);
  };

  const reassemblePermanent = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setReassembling(false);
    setCollapsed(false);
    setPermanent(true);
  };

  const useEffectCleanup = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (copyRef.current) clearTimeout(copyRef.current);
  };
  useEffect(() => useEffectCleanup, []);
  const xs = isMobile ? 0.45 : 1;
  const ys = isMobile ? 0.7 : 1;

  const headingWords = [
    { text: "Let's", x: -180 * xs, y: 360 * ys, rot: -14, delay: 0.00, cyan: false },
    { text: 'Build', x: -60 * xs, y: 410 * ys, rot: 9, delay: 0.06, cyan: false },
    { text: 'Something', x: 80 * xs, y: 380 * ys, rot: -7, delay: 0.12, cyan: false },
    { text: 'Autonomous.', x: 200 * xs, y: 340 * ys, rot: 16, delay: 0.18, cyan: true },
  ];

  const socials = [
    { icon: <Github size={20} />, label: 'GitHub (primuez)', href: 'https://github.com/primuez', x: -260 * xs, y: 60 * ys, rot: -22, delay: 0.55 },
    { icon: <Github size={20} />, label: 'GitHub (primmius)', href: 'https://github.com/primmius', x: -180 * xs, y: 80 * ys, rot: 14, delay: 0.58 },
    { icon: <Linkedin size={20} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahul-kasturiya-796910363', x: -90 * xs, y: 50 * ys, rot: -9, delay: 0.61 },
    { icon: <Twitter size={20} />, label: 'X / Twitter', href: 'https://x.com/RKasturiya6738', x: 0, y: 90 * ys, rot: 28, delay: 0.64 },
    { icon: <Instagram size={20} />, label: 'Instagram', href: 'https://www.instagram.com/primuez5', x: 100 * xs, y: 60 * ys, rot: -18, delay: 0.67 },
    { icon: <span className="font-bold text-lg leading-none">k</span>, label: 'Ko-fi', href: 'https://ko-fi.com/primuez', x: 190 * xs, y: 80 * ys, rot: 11, delay: 0.70 },
    { icon: <span className="font-bold text-lg leading-none">Up</span>, label: 'Upwork', href: 'https://www.upwork.com/freelancers/~012ee7737a8d40746f', x: 270 * xs, y: 50 * ys, rot: -25, delay: 0.73 },
  ];

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-[70vh] md:min-h-[85vh] overflow-hidden"
      onViewportEnter={() => { 
        if (!permanent) {
          setCollapsed(true);
        }
      }}
      viewport={{ amount: 0.4, once: true }}
    >
      <div className="text-center pt-12 pointer-events-none">
        <div className="text-3xl md:text-5xl font-bold mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 leading-tight">
          {headingWords.map((w, i) => (
            <FallingPiece
              key={i}
              container={containerRef}
              collapsed={collapsed}
              permanent={permanent}
              dx={w.x}
              dy={w.y}
              rotate={w.rot}
              delay={w.delay}
              className={w.cyan ? 'text-cyan' : ''}
            >
              <span className="inline-block px-1">{w.text}</span>
            </FallingPiece>
          ))}
        </div>

        <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent} dx={-140 * xs} dy={300 * ys} rotate={-6} delay={0.28}>
          <p className="text-text-muted max-w-2xl mx-auto px-4 bg-bg/40 backdrop-blur-sm rounded-md py-2 font-mono text-xs uppercase tracking-wider">
            If you believe your team&apos;s time is meant for growth, not data entry — let&apos;s talk.
          </p>
        </FallingPiece>

        <div className="mt-10 flex justify-center">
          <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent} dx={120 * xs} dy={240 * ys} rotate={12} delay={0.4}>
            <GlassButton
              size="lg"
              onClick={onContact}
              glowColor="rgba(0, 240, 255, 0.3)"
              className="glass-btn-glow text-cyan hover:text-white"
            >
              <Send size={16} /> Let&apos;s Connect
            </GlassButton>
          </FallingPiece>
        </div>

        <div className="mt-12 flex justify-center">
          <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent} dx={-200 * xs} dy={180 * ys} rotate={-11} delay={0.48}>
            <p className="font-mono text-sm bg-bg/40 backdrop-blur-sm rounded-md px-3 py-2 flex items-center gap-2 flex-wrap justify-center pointer-events-auto">
              Or direct comm-link: <a href="mailto:contact@primuez.in" draggable={false} onDragStart={(e) => e.preventDefault()} className="text-amber hover:text-white transition-colors py-2 md:py-0">contact@primuez.in</a>
              <button
                onClick={copyEmail}
                className={`inline-flex items-center gap-1 px-3 py-2 md:px-2 md:py-0.5 rounded border text-[10px] uppercase tracking-widest transition-all duration-200 ${copied ? 'border-cyan/60 text-cyan bg-cyan/10' : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/70'}`}
                aria-label="Copy email address"
              >
                {copied ? '✓ copied' : 'copy'}
              </button>
            </p>
          </FallingPiece>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {socials.map((s, i) => (
            <FallingPiece key={i} container={containerRef} collapsed={collapsed} permanent={permanent} dx={s.x} dy={s.y} rotate={s.rot} delay={s.delay}>
              <SocialIcon icon={s.icon} label={s.label} href={s.href} />
            </FallingPiece>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan/[0.04] to-transparent" />

      <AnimatePresence>
        {collapsed && !permanent && (
          <motion.div
            key="reassemble-group"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-10 z-[60] flex flex-col items-center gap-2"
          >
            <button
              onClick={reassemble}
              disabled={reassembling}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-cyan/40 bg-bg/70 backdrop-blur-sm text-cyan hover:bg-cyan hover:text-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.15)] flex items-center gap-2"
              aria-label="Reassemble fallen elements"
            >
              <span className={`inline-block w-2 h-2 rounded-full ${reassembling ? 'bg-amber animate-pulse' : 'bg-cyan'}`} />
              {reassembling ? 'Rebuilding...' : 'Reassemble Section'}
            </button>
            <button
              onClick={reassemblePermanent}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-white/20 bg-bg/70 backdrop-blur-sm text-white/60 hover:border-white/50 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-2"
              aria-label="Reassemble permanently"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
              &gt; Keep it assembled
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactSection() {
  const { setModalType } = useUI();

  return (
    <motion.section 
      id="contact" 
      aria-labelledby="contact-heading"
      className="pt-16 md:pt-32 text-center pb-28 md:pb-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader number="10" command="> ./contact --init" title="Connect" center />
      <h2 id="contact-heading" className="sr-only">How can you get in touch with Primuez to start an AI automation project?</h2>
      
      <GravityCollapse onContact={() => setModalType('form')} />
    </motion.section>
  );
}
