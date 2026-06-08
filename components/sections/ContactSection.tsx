'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
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

/**
 * FallingPiece — uses the imperative useAnimation API so the drag gesture
 * never fights a declarative animate-prop animation.
 */
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
  const controls = useAnimation();
  const isDragging = useRef(false);

  useEffect(() => {
    if (permanent) {
      controls.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.4, ease: 'easeInOut' } });
      return;
    }
    if (collapsed) {
      controls.start({
        x: dx,
        y: dy,
        rotate,
        transition: { type: 'spring', stiffness: 70, damping: 7, mass: 1.1, delay },
      });
    } else {
      if (!isDragging.current) {
        controls.start({
          x: 0, y: 0, rotate: 0,
          transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, permanent]);

  if (permanent) {
    return (
      // pointer-events-auto is critical here — without it every link/button
      // inside is dead even if the ancestor div allows pointer events.
      <motion.div
        className={`inline-block select-none pointer-events-auto ${className}`}
        animate={controls}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`inline-block pointer-events-auto ${collapsed ? 'cursor-grab active:cursor-grabbing' : ''} select-none ${className}`}
      animate={controls}
      drag={collapsed}
      dragConstraints={container}
      dragElastic={0.55}
      dragMomentum
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      onDragStart={() => {
        isDragging.current = true;
        controls.stop();
      }}
      onDragEnd={() => {
        isDragging.current = false;
      }}
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

  // Scatter positions redesigned so every piece lands at a unique (x,y) zone.
  // dy values span 80–390 with ≥80px gap between any two pieces vertically,
  // and dx values push pieces to opposite sides horizontally.
  const headingWords = [
    { text: "Let's",      x: -220 * xs, y: 110 * ys, rot: -14, delay: 0.00, cyan: false },
    { text: 'Build',      x:  210 * xs, y: 200 * ys, rot:   9, delay: 0.06, cyan: false },
    { text: 'Something',  x: -160 * xs, y: 320 * ys, rot:  -7, delay: 0.12, cyan: false },
    { text: 'Autonomous.', x: 170 * xs, y: 390 * ys, rot:  16, delay: 0.18, cyan: true  },
  ];

  const socials = [
    // Socials naturally sit at the bottom of the layout. Half go UP, half go DOWN
    // so they scatter into different vertical zones and never bunch together.
    { icon: <Github size={20} />,   label: 'GitHub (primuez)', href: 'https://github.com/primuez',                                         x: -270 * xs, y: -200 * ys, rot: -22, delay: 0.55 },
    { icon: <Github size={20} />,   label: 'GitHub (primmius)', href: 'https://github.com/primmius',                                       x:  230 * xs, y: -130 * ys, rot:  14, delay: 0.58 },
    { icon: <Linkedin size={20} />, label: 'LinkedIn',          href: 'https://www.linkedin.com/in/rahul-kasturiya-796910363',            x: -140 * xs, y:  130 * ys, rot:  -9, delay: 0.61 },
    { icon: <Twitter size={20} />,  label: 'X / Twitter',       href: 'https://x.com/RKasturiya6738',                                     x:    0 * xs, y: -280 * ys, rot:  28, delay: 0.64 },
    { icon: <Instagram size={20} />,label: 'Instagram',          href: 'https://www.instagram.com/primuez5',                               x:  170 * xs, y:  150 * ys, rot: -18, delay: 0.67 },
    { icon: <span className="font-bold text-lg leading-none">k</span>,  label: 'Ko-fi',   href: 'https://ko-fi.com/primuez',                x: -240 * xs, y:  100 * ys, rot:  11, delay: 0.70 },
    { icon: <span className="font-bold text-lg leading-none">Up</span>, label: 'Upwork',  href: 'https://www.upwork.com/freelancers/~012ee7737a8d40746f', x: 250 * xs, y: -60 * ys, rot: -25, delay: 0.73 },
  ];

  return (
    <motion.div
      ref={containerRef}
      // Drop the min-height once permanently assembled so no empty gap shows
      // between the Connect section and the footer.
      className={`relative overflow-hidden ${permanent ? 'min-h-0' : 'min-h-[70vh] md:min-h-[85vh]'}`}
      onViewportEnter={() => { 
        if (!permanent) {
          setCollapsed(true);
        }
      }}
      viewport={{ amount: 0.4, once: true }}
    >
      {/* Buttons pinned to TOP so they never overlap the falling pieces */}
      <AnimatePresence>
        {collapsed && !permanent && (
          <motion.div
            key="reassemble-group"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute left-1/2 -translate-x-1/2 top-4 md:top-6 z-[60] flex flex-col items-center gap-2"
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

      {/* Content — pointer-events restored when permanent so links/buttons stay clickable */}
      <div className={`text-center pt-12 ${permanent ? 'pointer-events-auto' : 'pointer-events-none'}`}>
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
              {/* Each piece gets its own z-index so they stack distinctly instead of overlapping */}
              <span className="inline-block px-1" style={{ position: 'relative', zIndex: i + 1 }}>{w.text}</span>
            </FallingPiece>
          ))}
        </div>

        <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent} dx={50 * xs} dy={260 * ys} rotate={-6} delay={0.28}>
          <p className="text-text-muted max-w-2xl mx-auto px-4 bg-bg/40 backdrop-blur-sm rounded-md py-2 font-mono text-xs uppercase tracking-wider">
            If you believe your team&apos;s time is meant for growth, not data entry — let&apos;s talk.
          </p>
        </FallingPiece>

        <div className="mt-10 flex justify-center">
          <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent} dx={-190 * xs} dy={160 * ys} rotate={12} delay={0.4}>
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
          <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent} dx={160 * xs} dy={60 * ys} rotate={-11} delay={0.48}>
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
    </motion.div>
  );
}

export default function ContactSection() {
  const { setModalType } = useUI();

  return (
    <motion.section 
      id="contact" 
      aria-labelledby="contact-heading"
      className="pt-16 md:pt-32 text-center pb-0"
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
