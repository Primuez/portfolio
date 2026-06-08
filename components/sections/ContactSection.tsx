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

// ---------------------------------------------------------------------------
// Scatter layout — each piece is placed at an ABSOLUTE position within the
// container (as % of container width/height) so positions are guaranteed
// non-overlapping regardless of the element's natural DOM location.
//
// Grid (desktop, container ≈ 900×680px):
//   Col L: 5-20%    Col C: 35-65%    Col R: 75-92%
//   Row T: 8-22%    Row M: 38-55%    Row B: 68-85%
//
// On mobile the same % positions are used — they scale automatically.
// ---------------------------------------------------------------------------

interface ScatterSlot {
  // absolute position as % of container
  left: string;
  top: string;
  rotate: number;
  delay: number;
}

// Heading words
const WORD_SLOTS: ScatterSlot[] = [
  { left: '4%',  top: '8%',  rotate: -14, delay: 0.00 }, // "Let's"      — top-left
  { left: '72%', top: '12%', rotate:  10, delay: 0.06 }, // "Build"      — top-right
  { left: '6%',  top: '62%', rotate:  -8, delay: 0.12 }, // "Something"  — bot-left
  { left: '60%', top: '55%', rotate:  15, delay: 0.18 }, // "Autonomous."— bot-right
];

// Subtitle, button, email — each a unique zone
const SUBTITLE_SLOT: ScatterSlot = { left: '22%', top: '35%', rotate: -5, delay: 0.28 };
const BUTTON_SLOT:   ScatterSlot = { left: '5%',  top: '42%', rotate: 10, delay: 0.38 };
const EMAIL_SLOT:    ScatterSlot = { left: '52%', top: '30%', rotate: -9, delay: 0.46 };

// Social icons — 7 unique slots filling remaining space
const SOCIAL_SLOTS: ScatterSlot[] = [
  { left: '3%',  top: '22%', rotate: -22, delay: 0.55 }, // GitHub primuez  — left col, upper-mid
  { left: '82%', top: '38%', rotate:  14, delay: 0.58 }, // GitHub primmius — right col, mid
  { left: '40%', top: '18%', rotate:  -9, delay: 0.61 }, // LinkedIn        — centre-top
  { left: '78%', top: '68%', rotate:  25, delay: 0.64 }, // Twitter         — right-bot
  { left: '22%', top: '74%', rotate: -17, delay: 0.67 }, // Instagram       — left-bot
  { left: '55%', top: '74%', rotate:  11, delay: 0.70 }, // Ko-fi           — centre-bot
  { left: '82%', top: '18%', rotate: -20, delay: 0.73 }, // Upwork          — right-top
];

// ---------------------------------------------------------------------------
// FallingPiece
// Assembled  → inline-block in normal flow (natural reading layout)
// Scattered  → absolute positioned at a unique pre-defined slot
// Permanent  → back to inline-block, fully interactive
// ---------------------------------------------------------------------------

function FallingPiece({
  children,
  collapsed,
  permanent,
  slot,
  className = '',
}: {
  children: React.ReactNode;
  collapsed: boolean;
  permanent: boolean;
  slot: ScatterSlot;
  className?: string;
}) {
  const controls = useAnimation();

  useEffect(() => {
    if (permanent) {
      // Animate x/y/rotate back to zero (natural position)
      controls.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } });
      return;
    }
    if (collapsed) {
      // Opacity fade-in after a short delay so pieces appear to "fall in"
      controls.start({ opacity: 1, transition: { duration: 0.2, delay: slot.delay } });
    } else {
      controls.start({ opacity: 1, transition: { duration: 0.3 } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, permanent]);

  // ── ASSEMBLED / PERMANENT: normal inline-block flow ──
  if (!collapsed || permanent) {
    return (
      <motion.div
        className={`inline-block select-none pointer-events-auto ${className}`}
        animate={controls}
        initial={false}
        layout
      >
        {children}
      </motion.div>
    );
  }

  // ── SCATTERED: absolute position, draggable ──
  return (
    <motion.div
      className={`absolute cursor-grab active:cursor-grabbing select-none pointer-events-auto ${className}`}
      style={{
        left: slot.left,
        top: slot.top,
        rotate: slot.rotate,
        zIndex: 10,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: slot.delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      drag
      dragMomentum={false}
      dragElastic={0.05}
      whileDrag={{ scale: 1.06, zIndex: 50, rotate: 0 }}
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
  // Gate collapse until component is mounted so isMobile is settled
  const [mounted, setMounted] = useState(false);
  // Track if viewport enter fired before mount
  const pendingCollapse = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    // If viewport enter already fired before mount, trigger collapse now
    if (pendingCollapse.current) {
      setCollapsed(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const headingWords = [
    { text: "Let's",       cyan: false, slot: WORD_SLOTS[0] },
    { text: 'Build',       cyan: false, slot: WORD_SLOTS[1] },
    { text: 'Something',   cyan: false, slot: WORD_SLOTS[2] },
    { text: 'Autonomous.', cyan: true,  slot: WORD_SLOTS[3] },
  ];

  const socials = [
    { icon: <Github size={20} />,    label: 'GitHub (primuez)',  href: 'https://github.com/primuez',                                    slot: SOCIAL_SLOTS[0] },
    { icon: <Github size={20} />,    label: 'GitHub (primmius)', href: 'https://github.com/primmius',                                  slot: SOCIAL_SLOTS[1] },
    { icon: <Linkedin size={20} />,  label: 'LinkedIn',          href: 'https://www.linkedin.com/in/rahul-kasturiya-796910363',        slot: SOCIAL_SLOTS[2] },
    { icon: <Twitter size={20} />,   label: 'X / Twitter',       href: 'https://x.com/RKasturiya6738',                                 slot: SOCIAL_SLOTS[3] },
    { icon: <Instagram size={20} />, label: 'Instagram',         href: 'https://www.instagram.com/primuez5',                           slot: SOCIAL_SLOTS[4] },
    { icon: <span className="font-bold text-lg leading-none">k</span>,  label: 'Ko-fi',  href: 'https://ko-fi.com/primuez',            slot: SOCIAL_SLOTS[5] },
    { icon: <span className="font-bold text-lg leading-none">Up</span>, label: 'Upwork', href: 'https://www.upwork.com/freelancers/~012ee7737a8d40746f', slot: SOCIAL_SLOTS[6] },
  ];

  // Container needs explicit height in scattered state so absolute children are contained
  const containerClass = permanent
    ? 'relative'
    : collapsed
      ? `relative ${isMobile ? 'h-[68vh]' : 'h-[78vh]'}`
      : 'relative';

  return (
    <motion.div
      ref={containerRef}
      className={containerClass}
      onViewportEnter={() => {
        if (permanent) return;
        if (mounted) {
          setCollapsed(true);
        } else {
          // Component not yet mounted — flag for post-mount trigger
          pendingCollapse.current = true;
        }
      }}
      viewport={{ amount: 0.3, once: true }}
    >
      {/* ── Control buttons — absolute, centred at top ── */}
      <AnimatePresence>
        {collapsed && !permanent && (
          <motion.div
            key="reassemble-group"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="absolute left-1/2 -translate-x-1/2 top-3 md:top-4 z-[60] flex flex-col items-center gap-2"
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

      {/* ── Assembled / Permanent layout (normal flow) ── */}
      {(!collapsed || permanent) && (
        <div className={`text-center pt-12 ${permanent ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className="text-3xl md:text-5xl font-bold mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 leading-tight">
            {headingWords.map((w, i) => (
              <FallingPiece key={i} collapsed={false} permanent={permanent} slot={w.slot} className={w.cyan ? 'text-cyan' : ''}>
                <span className="inline-block px-1">{w.text}</span>
              </FallingPiece>
            ))}
          </div>

          <FallingPiece collapsed={false} permanent={permanent} slot={SUBTITLE_SLOT}>
            <p className="text-text-muted max-w-2xl mx-auto px-4 bg-bg/40 backdrop-blur-sm rounded-md py-2 font-mono text-xs uppercase tracking-wider">
              If you believe your team&apos;s time is meant for growth, not data entry — let&apos;s talk.
            </p>
          </FallingPiece>

          <div className="mt-10 flex justify-center">
            <FallingPiece collapsed={false} permanent={permanent} slot={BUTTON_SLOT}>
              <GlassButton size="lg" onClick={onContact} glowColor="rgba(0, 240, 255, 0.3)" className="glass-btn-glow text-cyan hover:text-white">
                <Send size={16} /> Let&apos;s Connect
              </GlassButton>
            </FallingPiece>
          </div>

          <div className="mt-12 flex justify-center">
            <FallingPiece collapsed={false} permanent={permanent} slot={EMAIL_SLOT}>
              <p className="font-mono text-sm bg-bg/40 backdrop-blur-sm rounded-md px-3 py-2 flex items-center gap-2 flex-wrap justify-center pointer-events-auto">
                Or direct comm-link:{' '}
                <a href="mailto:contact@primuez.in" draggable={false} onDragStart={(e) => e.preventDefault()} className="text-amber hover:text-white transition-colors py-2 md:py-0">
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

          <div className="mt-12 pb-10 flex flex-wrap justify-center gap-4">
            {socials.map((s, i) => (
              <FallingPiece key={i} collapsed={false} permanent={permanent} slot={s.slot}>
                <SocialIcon icon={s.icon} label={s.label} href={s.href} />
              </FallingPiece>
            ))}
          </div>
        </div>
      )}

      {/* ── Scattered layout — each piece at its absolute slot ── */}
      {collapsed && !permanent && (
        <>
          {headingWords.map((w, i) => (
            <FallingPiece key={`sw-${i}`} collapsed permanent={false} slot={w.slot} className={w.cyan ? 'text-cyan' : ''}>
              <span className="text-3xl md:text-5xl font-bold px-1">{w.text}</span>
            </FallingPiece>
          ))}

          <FallingPiece collapsed permanent={false} slot={SUBTITLE_SLOT}>
            <p className="text-text-muted bg-bg/60 backdrop-blur-sm rounded-md py-2 px-4 font-mono text-xs uppercase tracking-wider whitespace-nowrap">
              If you believe your team&apos;s time is meant for growth — let&apos;s talk.
            </p>
          </FallingPiece>

          <FallingPiece collapsed permanent={false} slot={BUTTON_SLOT}>
            <GlassButton size="lg" onClick={onContact} glowColor="rgba(0, 240, 255, 0.3)" className="glass-btn-glow text-cyan hover:text-white pointer-events-auto">
              <Send size={16} /> Let&apos;s Connect
            </GlassButton>
          </FallingPiece>

          <FallingPiece collapsed permanent={false} slot={EMAIL_SLOT}>
            <p className="font-mono text-sm bg-bg/60 backdrop-blur-sm rounded-md px-3 py-2 flex items-center gap-2 pointer-events-auto whitespace-nowrap">
              <a href="mailto:contact@primuez.in" className="text-amber hover:text-white transition-colors">
                contact@primuez.in
              </a>
              <button
                onClick={copyEmail}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] uppercase tracking-widest transition-all duration-200 ${copied ? 'border-cyan/60 text-cyan bg-cyan/10' : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/70'}`}
              >
                {copied ? '✓ copied' : 'copy'}
              </button>
            </p>
          </FallingPiece>

          {socials.map((s, i) => (
            <FallingPiece key={`ss-${i}`} collapsed permanent={false} slot={s.slot}>
              <SocialIcon icon={s.icon} label={s.label} href={s.href} />
            </FallingPiece>
          ))}
        </>
      )}

      {/* Decorative bottom gradient — only when not permanent */}
      {!permanent && !collapsed && (
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
