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
// Piece registry — parent stores references to each piece so it can:
// 1. Check bounding rects after drag ends
// 2. Push overlapping pieces away with spring animations (air-hockey)
// ---------------------------------------------------------------------------
interface PieceEntry {
  el: HTMLDivElement;
  controls: ReturnType<typeof useAnimation>;
  baseX: number; // original scatter dx
  baseY: number; // original scatter dy
  pushX: number; // accumulated push offset
  pushY: number;
}

// ---------------------------------------------------------------------------
// FallingPiece
// • Spring-animates from natural DOM position → (dx, dy) when collapsed
// • Spring-animates back to (0, 0) on reassembly — smooth "coming together"
// • drag only enabled after the spring has settled (prevents fresh-load jank)
// • Registers itself with parent for air-hockey collision resolution
// ---------------------------------------------------------------------------
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
  pieceId,
  onRegister,
  onPieceDragEnd,
  draggable,
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
  pieceId: string;
  onRegister: (id: string, el: HTMLDivElement | null, controls: ReturnType<typeof useAnimation>, bx: number, by: number) => void;
  onPieceDragEnd: (id: string) => void;
  draggable: boolean;
}) {
  const controls = useAnimation();
  const elRef = useRef<HTMLDivElement>(null);

  // Register with parent on mount
  useEffect(() => {
    if (elRef.current) onRegister(pieceId, elRef.current, controls, dx, dy);
    return () => onRegister(pieceId, null, controls, dx, dy);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieceId]);

  // Scatter / reassemble animation
  useEffect(() => {
    if (permanent) {
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } });
      return;
    }
    if (collapsed) {
      // SPRING FALL — the satisfying "break apart" animation
      controls.start({
        x: dx,
        y: dy,
        rotate,
        transition: { type: 'spring', stiffness: 50, damping: 9, mass: 1.4, delay },
      });
    } else {
      // SPRING REASSEMBLY — snaps back to natural position
      controls.start({
        x: 0, y: 0, rotate: 0,
        transition: { type: 'spring', stiffness: 120, damping: 18, delay: delay * 0.3 },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, permanent]);

  const isDraggable = collapsed && draggable && !permanent;

  if (permanent) {
    return (
      <motion.div
        ref={elRef}
        className={`inline-block select-none pointer-events-auto ${className}`}
        animate={controls}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={elRef}
      className={`inline-block select-none pointer-events-auto ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      animate={controls}
      drag={isDraggable}
      dragConstraints={container}
      dragMomentum={false}
      dragElastic={0.08}
      whileDrag={{ scale: 1.07, zIndex: 50 }}
      onDragEnd={() => onPieceDragEnd(pieceId)}
      style={{ touchAction: isDraggable ? 'none' : 'auto' }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// GravityCollapse — orchestrates the scatter/reassemble lifecycle
// ---------------------------------------------------------------------------
function GravityCollapse({ onContact }: { onContact: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [reassembling, setReassembling] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const [copied, setCopied] = useState(false);
  // Gate: only enable drag after the scatter spring has settled
  const [draggable, setDraggable] = useState(false);
  // Mount guard — prevents SSR/hydration race with onViewportEnter
  const [mounted, setMounted] = useState(false);
  const pendingCollapse = useRef(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragableTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  // Air-hockey registry
  const pieceRegistry = useRef<Map<string, PieceEntry>>(new Map());

  const registerPiece = useCallback((
    id: string, el: HTMLDivElement | null,
    controls: ReturnType<typeof useAnimation>,
    bx: number, by: number
  ) => {
    if (el) {
      pieceRegistry.current.set(id, { el, controls, baseX: bx, baseY: by, pushX: 0, pushY: 0 });
    } else {
      pieceRegistry.current.delete(id);
    }
  }, []);

  // Air-hockey collision resolution — fires 80ms after drag settles
  const handlePieceDragEnd = useCallback((draggedId: string) => {
    setTimeout(() => {
      const dragged = pieceRegistry.current.get(draggedId);
      if (!dragged?.el) return;
      const dr = dragged.el.getBoundingClientRect();

      pieceRegistry.current.forEach((entry, id) => {
        if (id === draggedId || !entry.el) return;
        const er = entry.el.getBoundingClientRect();
        const overlapX = dr.left < er.right && dr.right > er.left;
        const overlapY = dr.top < er.bottom && dr.bottom > er.top;
        if (!overlapX || !overlapY) return;

        // Vector from dragged centre → other piece centre
        const cx = (er.left + er.right) / 2 - (dr.left + dr.right) / 2;
        const cy = (er.top + er.bottom) / 2 - (dr.top + dr.bottom) / 2;
        const dist = Math.sqrt(cx * cx + cy * cy) || 1;
        const force = 90;
        entry.pushX += (cx / dist) * force;
        entry.pushY += (cy / dist) * force;

        // Spring push to accumulated position
        entry.controls.start({
          x: entry.baseX + entry.pushX,
          y: entry.baseY + entry.pushY,
          transition: { type: 'spring', stiffness: 350, damping: 22 },
        });
      });
    }, 80);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (pendingCollapse.current) setCollapsed(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset push offsets on any reassembly
  useEffect(() => {
    if (!collapsed) {
      setDraggable(false);
      pieceRegistry.current.forEach((e) => { e.pushX = 0; e.pushY = 0; });
    } else {
      // Enable drag after the slowest spring finishes (~longest delay + spring settle)
      if (dragableTimer.current) clearTimeout(dragableTimer.current);
      dragableTimer.current = setTimeout(() => setDraggable(true), 2400);
    }
  }, [collapsed]);

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

  const keepAssembled = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setReassembling(false);
    setCollapsed(false);
    setPermanent(true);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (copyRef.current) clearTimeout(copyRef.current);
    if (dragableTimer.current) clearTimeout(dragableTimer.current);
  }, []);

  // ── Scale factors (kept for documentation; values below already account for mobile)
  // Desktop scatter distances. Mobile values are xs=0.4, ys=0.55 of these.
  const xs = isMobile ? 0.4 : 1;
  const ys = isMobile ? 0.55 : 1;

  // ── Scatter positions ──────────────────────────────────────────────────────
  // RULE: heading words must have POSITIVE dy only (they start near y≈48-73px
  //       in the container; negative dy would push them above the container top
  //       which gets clipped by overflow-hidden → the "disappearing" bug).
  // Social icons start at y≈390px so negative dy is safe for them.
  //
  // Desktop final positions (approximate, no visual overlap at ≥20px gap):
  //   "Let's"     → (80, 273)    "Build"       → (713, 223)
  //   "Something" → (286, 453)   "Autonomous." → (702, 533)
  //   Subtitle    → (450, 326)   Button        → (750, 378)
  //   Email       → (230, 528)
  //   Socials spread across remaining whitespace
  // ──────────────────────────────────────────────────────────────────────────

  const pieces = [
    // ── Heading ──
    { id: 'w0', dx: -140 * xs, dy: 200 * ys,  rot: -14, delay: 0.00 },
    { id: 'w1', dx:  350 * xs, dy: 150 * ys,  rot:  10, delay: 0.06 },
    { id: 'w2', dx: -200 * xs, dy: 380 * ys,  rot:  -8, delay: 0.12 },
    { id: 'w3', dx:   30 * xs, dy: 460 * ys,  rot:  15, delay: 0.18 },
    // ── Subtitle ──
    { id: 'sub', dx:    0 * xs, dy: 200 * ys,  rot:  -5, delay: 0.28 },
    // ── Button ──
    { id: 'btn', dx:  300 * xs, dy: 170 * ys,  rot:  10, delay: 0.38 },
    // ── Email ──
    { id: 'eml', dx: -220 * xs, dy: 230 * ys,  rot:  -9, delay: 0.46 },
    // ── Socials — negative dy OK (start at y≈390, going up is safe) ──
    { id: 's0', dx: -188 * xs, dy: -300 * ys, rot: -22, delay: 0.55 },
    { id: 's1', dx:  522 * xs, dy: -300 * ys, rot:  14, delay: 0.58 },
    { id: 's2', dx: -148 * xs, dy:   30 * ys, rot:  -9, delay: 0.61 },
    { id: 's3', dx:   12 * xs, dy:  180 * ys, rot:  25, delay: 0.64 },
    { id: 's4', dx:  322 * xs, dy:   60 * ys, rot: -17, delay: 0.67 },
    { id: 's5', dx:  -58 * xs, dy: -150 * ys, rot:  11, delay: 0.70 },
    { id: 's6', dx:   12 * xs, dy: -200 * ys, rot: -20, delay: 0.73 },
  ];

  // Shared FallingPiece props
  const fp = (id: string) => {
    const p = pieces.find((x) => x.id === id)!;
    return {
      container: containerRef,
      collapsed,
      permanent,
      dx: p.dx,
      dy: p.dy,
      rotate: p.rot,
      delay: p.delay,
      pieceId: id,
      onRegister: registerPiece,
      onPieceDragEnd: handlePieceDragEnd,
      draggable,
    };
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden transition-all duration-500 ${permanent ? '' : 'min-h-[72vh] md:min-h-[82vh]'}`}
      onViewportEnter={() => {
        if (permanent) return;
        if (mounted) setCollapsed(true);
        else pendingCollapse.current = true;
      }}
      viewport={{ amount: 0.3, once: true }}
    >
      {/* ── Control buttons — pinned top-centre, appear after scatter settles ── */}
      <AnimatePresence>
        {collapsed && !permanent && (
          <motion.div
            key="ctrls"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="absolute left-1/2 -translate-x-1/2 top-3 md:top-4 z-[60] flex flex-col items-center gap-2 pointer-events-auto"
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
              onClick={keepAssembled}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-white/20 bg-bg/80 backdrop-blur-md text-white/60 hover:border-white/50 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-2"
              aria-label="Keep assembled permanently"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
              &gt; Keep it assembled
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content — pointer-events-none while scattered, restored when permanent ── */}
      <div className={`text-center pt-12 ${permanent ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Heading */}
        <div className="text-3xl md:text-5xl font-bold mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 leading-tight">
          <FallingPiece {...fp('w0')}><span className="inline-block px-1">Let&apos;s</span></FallingPiece>
          <FallingPiece {...fp('w1')}><span className="inline-block px-1">Build</span></FallingPiece>
          <FallingPiece {...fp('w2')}><span className="inline-block px-1">Something</span></FallingPiece>
          <FallingPiece {...fp('w3')} className="text-cyan"><span className="inline-block px-1">Autonomous.</span></FallingPiece>
        </div>

        {/* Subtitle */}
        <FallingPiece {...fp('sub')}>
          <p className="text-text-muted max-w-2xl mx-auto px-4 bg-bg/40 backdrop-blur-sm rounded-md py-2 font-mono text-xs uppercase tracking-wider">
            If you believe your team&apos;s time is meant for growth, not data entry — let&apos;s talk.
          </p>
        </FallingPiece>

        {/* CTA button */}
        <div className="mt-10 flex justify-center">
          <FallingPiece {...fp('btn')}>
            <GlassButton size="lg" onClick={onContact} glowColor="rgba(0, 240, 255, 0.3)" className="glass-btn-glow text-cyan hover:text-white">
              <Send size={16} /> Let&apos;s Connect
            </GlassButton>
          </FallingPiece>
        </div>

        {/* Email */}
        <div className="mt-12 flex justify-center">
          <FallingPiece {...fp('eml')}>
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

        {/* Social icons */}
        <div className="mt-12 pb-10 flex flex-wrap justify-center gap-4">
          {[
            { id: 's0', icon: <Github size={20} />,    label: 'GitHub (primuez)',  href: 'https://github.com/primuez' },
            { id: 's1', icon: <Github size={20} />,    label: 'GitHub (primmius)', href: 'https://github.com/primmius' },
            { id: 's2', icon: <Linkedin size={20} />,  label: 'LinkedIn',          href: 'https://www.linkedin.com/in/rahul-kasturiya-796910363' },
            { id: 's3', icon: <Twitter size={20} />,   label: 'X / Twitter',       href: 'https://x.com/RKasturiya6738' },
            { id: 's4', icon: <Instagram size={20} />, label: 'Instagram',         href: 'https://www.instagram.com/primuez5' },
            { id: 's5', icon: <span className="font-bold text-lg leading-none">k</span>,  label: 'Ko-fi',  href: 'https://ko-fi.com/primuez' },
            { id: 's6', icon: <span className="font-bold text-lg leading-none">Up</span>, label: 'Upwork', href: 'https://www.upwork.com/freelancers/~012ee7737a8d40746f' },
          ].map((s) => (
            <FallingPiece key={s.id} {...fp(s.id)}>
              <SocialIcon icon={s.icon} label={s.label} href={s.href} />
            </FallingPiece>
          ))}
        </div>
      </div>

      {/* Decorative bottom gradient — hidden when permanent */}
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
