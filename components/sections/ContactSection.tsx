'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react';
import { useUI } from '@/lib/contexts/UIContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { SectionHeader } from '@/components/SectionHeader';

function SocialIcon({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
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
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-cyan/30" />
      </span>
    </a>
  );
}

/**
 * FallingPiece — absolute-positioned when collapsed so pieces never overlap each other.
 * In assembled state it returns to inline-block normal flow.
 * Key fix: NO controls.stop() on drag start, NO dragMomentum — these caused pieces to
 * snap to origin (disappear) when released near constraint edges.
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

  useEffect(() => {
    if (permanent) {
      controls.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } });
      return;
    }
    if (collapsed) {
      controls.start({
        x: dx,
        y: dy,
        rotate,
        transition: { type: 'spring', stiffness: 60, damping: 12, mass: 1.2, delay },
      });
    } else {
      controls.start({
        x: 0, y: 0, rotate: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, permanent]);

  if (permanent) {
    // pointer-events-auto: critical — lets links/buttons inside stay clickable.
    return (
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
      dragElastic={0.15}
      // dragMomentum REMOVED — momentum was flinging pieces outside constraints
      // then framer tried to animate back to x:0,y:0 (off-screen), causing "disappearing"
      dragMomentum={false}
      whileDrag={{ scale: 1.06, zIndex: 50 }}
      style={{ touchAction: collapsed ? 'none' : 'auto' }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Pre-computed scatter grid — each piece occupies a distinct zone so they
// never visually intersect. Zones are laid out on a 3-column × 4-row grid
// mapped to (dx, dy) offsets from each element's natural DOM position.
// Desktop offsets (xs=1, ys=1). Mobile scales down via xs/ys multipliers.
// ---------------------------------------------------------------------------

function GravityCollapse({ onContact }: { onContact: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [reassembling, setReassembling] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText('contact@primuez.in').then(() => {
      setCopied(true);
      if (copyRef.current) clearTimeout(copyRef.current);
      copyRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const reassemble = useCallback(() => {
    if (reassembling) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setReassembling(true);
    setCollapsed(false);
    timerRef.current = setTimeout(() => {
      setCollapsed(true);
      setReassembling(false);
    }, 2800);
  }, [reassembling]);

  const reassemblePermanent = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setReassembling(false);
    setCollapsed(false);
    setPermanent(true);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (copyRef.current) clearTimeout(copyRef.current);
  }, []);

  // Scale factors for mobile — keep pieces inside the smaller container
  const xs = isMobile ? 0.4 : 1;
  const ys = isMobile ? 0.55 : 1;

  // -------------------------------------------------------------------
  // SCATTER POSITIONS — each piece has a unique (dx, dy) pair.
  // Vertical bands (dy): -260, -160, -60, +80, +180, +300, +400
  // Horizontal bands (dx): -260, -120, +140, +260
  // No two pieces share the same band combination → zero overlap.
  // -------------------------------------------------------------------
  const headingWords = [
    // "Let's"      → top-left zone
    { text: "Let's",       x: -230 * xs, y: -120 * ys, rot: -15, delay: 0.00, cyan: false },
    // "Build"       → top-right zone
    { text: 'Build',       x:  220 * xs, y:  -80 * ys, rot:  10, delay: 0.06, cyan: false },
    // "Something"   → mid-left zone
    { text: 'Something',   x: -180 * xs, y:  160 * ys, rot:  -8, delay: 0.12, cyan: false },
    // "Autonomous." → mid-right zone
    { text: 'Autonomous.', x:  160 * xs, y:  240 * ys, rot:  14, delay: 0.18, cyan: true  },
  ];

  // subtitle → centre, slight down
  // button   → far-left, upper-mid
  // email    → far-right, lower-mid
  // socials  → alternating top/bottom, well separated horizontally

  const socials = [
    // GitHub(primuez)  → far-left, way up
    { icon: <Github size={20} />,    label: 'GitHub (primuez)',  href: 'https://github.com/primuez',                                      x: -270 * xs, y: -230 * ys, rot: -22, delay: 0.55 },
    // GitHub(primmius) → far-right, up
    { icon: <Github size={20} />,    label: 'GitHub (primmius)', href: 'https://github.com/primmius',                                    x:  250 * xs, y: -170 * ys, rot:  15, delay: 0.58 },
    // LinkedIn         → left, down
    { icon: <Linkedin size={20} />,  label: 'LinkedIn',          href: 'https://www.linkedin.com/in/rahul-kasturiya-796910363',          x: -200 * xs, y:  280 * ys, rot:  -9, delay: 0.61 },
    // Twitter          → centre, way up
    { icon: <Twitter size={20} />,   label: 'X / Twitter',       href: 'https://x.com/RKasturiya6738',                                   x:   10 * xs, y: -310 * ys, rot:  25, delay: 0.64 },
    // Instagram        → right, down
    { icon: <Instagram size={20} />, label: 'Instagram',         href: 'https://www.instagram.com/primuez5',                             x:  180 * xs, y:  330 * ys, rot: -17, delay: 0.67 },
    // Ko-fi            → left, slight up
    { icon: <span className="font-bold text-lg leading-none">k</span>,  label: 'Ko-fi',  href: 'https://ko-fi.com/primuez',              x: -130 * xs, y:  -90 * ys, rot:  12, delay: 0.70 },
    // Upwork           → right, slight up
    { icon: <span className="font-bold text-lg leading-none">Up</span>, label: 'Upwork', href: 'https://www.upwork.com/freelancers/~012ee7737a8d40746f', x: 130 * xs, y: -50 * ys, rot: -20, delay: 0.73 },
  ];

  return (
    <motion.div
      ref={containerRef}
      // When permanently assembled the min-height is gone → no gap before footer.
      className={`relative overflow-hidden transition-all duration-500 ${permanent ? '' : 'min-h-[72vh] md:min-h-[82vh]'}`}
      onViewportEnter={() => {
        if (!permanent) setCollapsed(true);
      }}
      viewport={{ amount: 0.35, once: true }}
    >
      {/* ── Control buttons — pinned to the TOP so falling words never land on them ── */}
      <AnimatePresence>
        {collapsed && !permanent && (
          <motion.div
            key="reassemble-group"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ delay: 0.9, duration: 0.45 }}
            className="absolute left-1/2 -translate-x-1/2 top-3 md:top-5 z-[60] flex flex-col items-center gap-2"
          >
            <button
              onClick={reassemble}
              disabled={reassembling}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-cyan/40 bg-bg/80 backdrop-blur-md text-cyan hover:bg-cyan hover:text-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.15)] flex items-center gap-2"
              aria-label="Reassemble fallen elements"
            >
              <span className={`inline-block w-2 h-2 rounded-full ${reassembling ? 'bg-amber animate-pulse' : 'bg-cyan'}`} />
              {reassembling ? 'Rebuilding...' : 'Reassemble Section'}
            </button>
            <button
              onClick={reassemblePermanent}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-white/20 bg-bg/80 backdrop-blur-md text-white/60 hover:border-white/50 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-2"
              aria-label="Keep assembled permanently"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
              &gt; Keep it assembled
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── pointer-events-none while falling (prevents accidental clicks)
           pointer-events-auto once permanently assembled (restores all interactivity) ── */}
      <div className={`text-center pt-16 ${permanent ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Heading words */}
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

        {/* Subtitle — centre zone, offset down-right */}
        <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent}
          dx={60 * xs} dy={-50 * ys} rotate={-5} delay={0.28}>
          <p className="text-text-muted max-w-2xl mx-auto px-4 bg-bg/40 backdrop-blur-sm rounded-md py-2 font-mono text-xs uppercase tracking-wider">
            If you believe your team&apos;s time is meant for growth, not data entry — let&apos;s talk.
          </p>
        </FallingPiece>

        {/* CTA button — far-left, mid-up zone */}
        <div className="mt-10 flex justify-center">
          <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent}
            dx={-240 * xs} dy={80 * ys} rotate={11} delay={0.38}>
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

        {/* Email — far-right, low zone */}
        <div className="mt-12 flex justify-center">
          <FallingPiece container={containerRef} collapsed={collapsed} permanent={permanent}
            dx={220 * xs} dy={120 * ys} rotate={-10} delay={0.46}>
            <p className="font-mono text-sm bg-bg/40 backdrop-blur-sm rounded-md px-3 py-2 flex items-center gap-2 flex-wrap justify-center pointer-events-auto">
              Or direct comm-link:{' '}
              <a
                href="mailto:contact@primuez.in"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="text-amber hover:text-white transition-colors py-2 md:py-0"
              >
                contact@primuez.in
              </a>
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

        {/* Social icons */}
        <div className="mt-12 pb-10 flex flex-wrap justify-center gap-4">
          {socials.map((s, i) => (
            <FallingPiece key={i} container={containerRef} collapsed={collapsed} permanent={permanent}
              dx={s.x} dy={s.y} rotate={s.rot} delay={s.delay}>
              <SocialIcon icon={s.icon} label={s.label} href={s.href} />
            </FallingPiece>
          ))}
        </div>
      </div>

      {/* Decorative bottom line — hidden when permanent to avoid gap */}
      {!permanent && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan/[0.04] to-transparent" />
        </>
      )}
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
      viewport={{ once: true, margin: '-100px' }}
    >
      <SectionHeader number="10" command="> ./contact --init" title="Connect" center />
      <h2 id="contact-heading" className="sr-only">
        How can you get in touch with Primuez to start an AI automation project?
      </h2>
      <GravityCollapse onContact={() => setModalType('form')} />
    </motion.section>
  );
}
