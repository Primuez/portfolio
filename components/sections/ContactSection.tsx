'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react';
import { useUI } from '@/lib/contexts/UIContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { LiquidGlassLogo } from '@/components/ui/liquid-glass-logo';
import { ShaderLogo } from '@/components/ShaderText';
import { ShaderLogoGlow } from '@/components/ShaderLogoGlow';
import { SectionHeader } from '@/components/SectionHeader';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { trackEvent } from '@/lib/analytics';

function SocialIcon({ icon, label, href, highlight }: { icon: React.ReactNode; label: string; href: string; highlight?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className={`group relative flex items-center justify-center w-12 h-12 bg-panel rounded-lg text-text-muted hover:text-white transition-all duration-300 hover:-translate-y-1
        ${highlight 
          ? 'border border-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:border-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]' 
          : 'border border-cyan/20 hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]'}`}
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
// Piece registry for air-hockey collision resolution
// ---------------------------------------------------------------------------
interface PieceEntry {
  el: HTMLDivElement;
  controls: ReturnType<typeof useAnimation>;
  // Base scatter position (re-computed when isMobile changes)
  baseDx: number;
  baseDy: number;
  // Accumulated push offsets from collisions
  pushX: number;
  pushY: number;
}

// ---------------------------------------------------------------------------
// FallingPiece
//
// Root-cause fix for "fresh load disappear":
//   isMobile starts as false (SSR), then flips to true on client.
//   This changes xs/ys → dx/dy. Adding dx/dy to the useEffect deps means
//   pieces re-animate to the correct mobile positions automatically, so they
//   are ALWAYS inside the container when the user first interacts with them.
//   dragConstraints can then never snap pieces outside visible bounds.
//
// Throwing: dragMomentum={true} — pieces glide after release (air hockey feel).
// Drag props only passed when actually draggable — prevents Framer from
//   attaching internal gesture handlers that can snap positions on tap.
// ---------------------------------------------------------------------------
function FallingPiece({
  children,
  container,
  collapsed,
  permanent,
  dx, dy, rotate, delay,
  className = '',
  pieceId,
  onRegister,
  onPieceDragEnd,
  draggable: isDraggable,
}: {
  children: React.ReactNode;
  container: React.RefObject<HTMLDivElement | null>;
  collapsed: boolean;
  permanent: boolean;
  dx: number; dy: number; rotate: number; delay: number;
  className?: string;
  pieceId: string;
  onRegister: (id: string, el: HTMLDivElement | null, ctrl: ReturnType<typeof useAnimation>, bx: number, by: number) => void;
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

  // KEY FIX: dx/dy in deps — when isMobile corrects after hydration,
  // pieces immediately re-animate to the right position
  useEffect(() => {
    if (permanent) {
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 120, damping: 22 } });
      return;
    }
    if (collapsed) {
      controls.start({
        x: dx, y: dy, rotate,
        transition: { type: 'spring', stiffness: 48, damping: 8, mass: 1.5, delay },
      });
    } else {
      controls.start({
        x: 0, y: 0, rotate: 0,
        transition: { type: 'spring', stiffness: 110, damping: 18, delay: delay * 0.25 },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, permanent, dx, dy]);

  // Also update registry base positions whenever dx/dy change
  useEffect(() => {
    onRegister(pieceId, elRef.current!, controls, dx, dy);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dx, dy]);

  const canDrag = collapsed && isDraggable && !permanent;

  // Drag props only spread when actually draggable — prevents Framer
  // gesture handlers from running when drag is disabled
  const dragProps = canDrag ? {
    drag: true as const,
    dragConstraints: container,
    dragMomentum: true,
    // Lower power = pieces slide further after throw (air hockey)
    dragTransitionPower: 180,
    dragElastic: 0.12,
    whileDrag: { scale: 1.08, zIndex: 50, rotate: 0 },
    onDragEnd: () => onPieceDragEnd(pieceId),
  } : {};

  if (permanent) {
    return (
      <motion.div ref={elRef} className={`inline-block select-none pointer-events-auto ${className}`} animate={controls}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={elRef}
      animate={controls}
      className={`inline-block select-none pointer-events-auto ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      style={{ touchAction: canDrag ? 'none' : 'auto' }}
      {...dragProps}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// GravityCollapse
// ---------------------------------------------------------------------------
function GravityCollapse({ onContact }: { onContact: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [reassembling, setReassembling] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const [copied, setCopied] = useState(false);
  // Gate: only enable drag after scatter springs have settled
  const [draggable, setDraggable] = useState(false);
  // Mount guard — viewport enter can fire before useEffect
  const [mounted, setMounted] = useState(false);
  const pendingCollapse = useRef(false);
  const hasTriggered = useRef(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMobile = useIsMobile();

  // Piece registry for air-hockey
  const registry = useRef<Map<string, PieceEntry>>(new Map());

  const registerPiece = useCallback((
    id: string, el: HTMLDivElement | null,
    controls: ReturnType<typeof useAnimation>,
    bx: number, by: number
  ) => {
    if (el) {
      const existing = registry.current.get(id);
      registry.current.set(id, {
        el, controls, baseDx: bx, baseDy: by,
        pushX: existing?.pushX ?? 0,
        pushY: existing?.pushY ?? 0,
      });
    } else {
      registry.current.delete(id);
    }
  }, []);

  // Air-hockey: after drag+momentum settles (~900ms), check hitbox overlaps
  // and launch overlapping pieces away with a punchy spring
  const handlePieceDragEnd = useCallback((draggedId: string) => {
    setTimeout(() => {
      const dragged = registry.current.get(draggedId);
      if (!dragged?.el) return;
      const dr = dragged.el.getBoundingClientRect();

      registry.current.forEach((entry, id) => {
        if (id === draggedId || !entry.el) return;
        const er = entry.el.getBoundingClientRect();

        // Expand hitbox slightly for satisfying contact feel
        const expandedDr = { left: dr.left - 4, right: dr.right + 4, top: dr.top - 4, bottom: dr.bottom + 4 };
        const hit =
          expandedDr.left < er.right &&
          expandedDr.right > er.left &&
          expandedDr.top < er.bottom &&
          expandedDr.bottom > er.top;

        if (!hit) return;

        // Push vector: centre of other piece away from dragged piece
        const cx = (er.left + er.right) / 2 - (dr.left + dr.right) / 2;
        const cy = (er.top + er.bottom) / 2 - (dr.top + dr.bottom) / 2;
        const dist = Math.sqrt(cx * cx + cy * cy) || 1;
        // Larger force for punchy air-hockey feel
        const force = 120 + Math.random() * 40;
        entry.pushX += (cx / dist) * force;
        entry.pushY += (cy / dist) * force;

        // Punchy spring (stiff, low damping = bounces a bit)
        entry.controls.start({
          x: entry.baseDx + entry.pushX,
          y: entry.baseDy + entry.pushY,
          transition: { type: 'spring', stiffness: 500, damping: 18, mass: 0.8 },
        });
      });
    }, 900);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (pendingCollapse.current) setCollapsed(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!collapsed) {
      setDraggable(false);
      if (dragTimer.current) clearTimeout(dragTimer.current);
      // Reset push offsets on reassembly
      registry.current.forEach((e) => { e.pushX = 0; e.pushY = 0; });
    } else {
      // Enable drag after the scatter spring settles
      // Slowest piece: delay 0.73 + spring settle ≈ 2.3s total
      if (dragTimer.current) clearTimeout(dragTimer.current);
      dragTimer.current = setTimeout(() => setDraggable(true), 2350);
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
    if (dragTimer.current) clearTimeout(dragTimer.current);
  }, []);

  // Scale factors — these recompute when isMobile corrects after hydration.
  // Since xs/ys change → dx/dy change → FallingPiece effect re-runs → pieces
  // re-animate to correct positions. No more out-of-bounds pieces on mobile.
  const xs = isMobile ? 0.4 : 1;
  const ys = isMobile ? 0.55 : 1;

  // Heading words: ALL POSITIVE dy (start near container top ~48px,
  // negative dy would clip above overflow boundary)
  // Socials: start at y≈390, so negative dy (going up) is safe
  const PIECES = [
    { id: 'w0', dx: -140 * xs, dy: 200 * ys,  rot: -14, delay: 0.00 },
    { id: 'w1', dx:  350 * xs, dy: 150 * ys,  rot:  10, delay: 0.06 },
    { id: 'w2', dx: -200 * xs, dy: 380 * ys,  rot:  -8, delay: 0.12 },
    { id: 'w3', dx:   30 * xs, dy: 460 * ys,  rot:  15, delay: 0.18 },
    { id: 'sub', dx:   0 * xs, dy: 200 * ys,  rot:  -5, delay: 0.28 },
    { id: 'btn', dx:  300 * xs, dy: 170 * ys, rot:  10, delay: 0.38 },
    { id: 'eml', dx: -220 * xs, dy: 230 * ys, rot:  -9, delay: 0.46 },
    { id: 's0', dx: -188 * xs, dy: -280 * ys, rot: -22, delay: 0.55 },
    { id: 's1', dx:  500 * xs, dy: -280 * ys, rot:  14, delay: 0.58 },
    { id: 's2', dx: -148 * xs, dy:   30 * ys, rot:  -9, delay: 0.61 },
    { id: 's3', dx:   12 * xs, dy:  180 * ys, rot:  25, delay: 0.64 },
    { id: 's4', dx:  300 * xs, dy:   55 * ys, rot: -17, delay: 0.67 },
    { id: 's5', dx:  -58 * xs, dy: -150 * ys, rot:  11, delay: 0.70 },
    { id: 's6', dx:   12 * xs, dy: -200 * ys, rot: -20, delay: 0.73 },
    { id: 'c15', dx: -100 * xs, dy: -120 * ys, rot:   8, delay: 0.76 },
    { id: 'c30', dx:  220 * xs, dy: -120 * ys, rot: -12, delay: 0.79 },
  ];

  const fp = (id: string) => {
    const p = PIECES.find((x) => x.id === id)!;
    return {
      container: containerRef,
      collapsed, permanent,
      dx: p.dx, dy: p.dy, rotate: p.rot, delay: p.delay,
      pieceId: id,
      onRegister: registerPiece,
      onPieceDragEnd: handlePieceDragEnd,
      draggable,
    };
  };

  return (
    // overflow-hidden prevents thrown pieces from expanding the document scroll height
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${permanent ? '' : 'min-h-[72vh] md:min-h-[82vh]'}`}
      onMouseEnter={undefined}
    >
      {/* viewport trigger — separate element so it doesn't conflict with containerRef */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        onViewportEnter={() => {
          if (permanent || hasTriggered.current) return;
          hasTriggered.current = true;
          if (mounted) setCollapsed(true);
          else pendingCollapse.current = true;
        }}
        viewport={{ amount: 0.28, once: true }}
      />

      {/* Control buttons — top-centre, appear after scatter finishes */}
      <AnimatePresence>
        {collapsed && !permanent && (
          <motion.div
            key="ctrls"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="absolute left-1/2 -translate-x-1/2 top-3 md:top-4 z-[60] flex flex-col items-center gap-2 pointer-events-auto"
          >
            <button
              onClick={reassemble}
              disabled={reassembling}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-cyan/40 bg-bg/80 backdrop-blur-md text-cyan hover:bg-cyan hover:text-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.15)] flex items-center gap-2"
            >
              <span className={`inline-block w-2 h-2 rounded-full ${reassembling ? 'bg-amber animate-pulse' : 'bg-cyan'}`} />
              {reassembling ? 'Rebuilding...' : 'Reassemble Section'}
            </button>
            <button
              onClick={keepAssembled}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-white/20 bg-bg/80 backdrop-blur-md text-white/60 hover:border-white/50 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
              &gt; Keep it assembled
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content — pointer-events-none only in the transitional assembled state
          (collapsed=false, not permanent). When collapsed or permanent,
          pieces handle their own pointer-events. */}
      <div className={`text-center pt-12 ${!collapsed && !permanent ? 'pointer-events-none' : ''}`}>
        {/* Heading */}
        <div className="text-3xl md:text-5xl font-bold mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 leading-tight text-white">
          <FallingPiece {...fp('w0')}><span className="inline-block px-1">Ready</span></FallingPiece>
          <FallingPiece {...fp('w1')}><span className="inline-block px-1">to stop</span></FallingPiece>
          <FallingPiece {...fp('w2')}><span className="inline-block px-1">doing this</span></FallingPiece>
          <FallingPiece {...fp('w3')} className="text-cyan"><span className="inline-block px-1">manually?</span></FallingPiece>
        </div>

        {/* Subtitle */}
        <FallingPiece {...fp('sub')}>
          <p className="text-text-muted max-w-2xl mx-auto px-4 bg-bg/40 backdrop-blur-sm rounded-md py-2 font-mono text-xs uppercase tracking-wider">
            Book a free 20-min call. I&apos;ll tell you exactly what to automate and how long it&apos;ll take.
          </p>
        </FallingPiece>

        {/* CTA buttons */}
        <div className="mt-10 flex justify-center z-20 relative">
          <FallingPiece {...fp('btn')}>
            <GlassButton 
              size="lg" 
              onClick={onContact} 
              glowColor="rgba(0, 240, 255, 0.3)" 
              className="glass-btn-glow text-cyan hover:text-white relative z-20 cursor-pointer font-bold font-mono text-xs uppercase tracking-widest"
            >
              <Send size={16} /> Let&apos;s Connect / Fill Form
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
                aria-label="Copy email"
              >
                {copied ? '✓ copied' : 'copy'}
              </button>
            </p>
          </FallingPiece>
        </div>

        {/* Socials */}
        <div className="mt-12 pb-10 flex flex-wrap justify-center gap-4">
          {[
            { id: 'c15', icon: <span className="font-mono font-bold text-lg leading-none text-cyan">15</span>, label: '15-Min Quick Chat', href: 'https://cal.com/prime-s/15min', highlight: true },
            { id: 'c30', icon: <span className="font-mono font-bold text-lg leading-none text-amber">30</span>, label: '30-Min Scope Call', href: 'https://cal.com/prime-s/30min', highlight: true },
            { id: 's0', icon: <Github size={20} />,    label: 'GitHub (primuez)',  href: 'https://github.com/primuez' },
            { id: 's1', icon: <Github size={20} />,    label: 'GitHub (primmius)', href: 'https://github.com/primmius' },
            { id: 's2', icon: <Linkedin size={20} />,  label: 'LinkedIn',          href: 'https://www.linkedin.com/in/rahul-kasturiya-796910363' },
            { id: 's3', icon: <Twitter size={20} />,   label: 'X / Twitter',       href: 'https://x.com/RKasturiya6738' },
            { id: 's4', icon: <Instagram size={20} />, label: 'Instagram',         href: 'https://www.instagram.com/primuez5' },
            { id: 's5', icon: <span className="font-bold text-lg leading-none">k</span>,  label: 'Ko-fi',  href: 'https://ko-fi.com/primuez' },
            { id: 's6', icon: <span className="font-bold text-lg leading-none">Up</span>, label: 'Upwork', href: 'https://www.upwork.com/freelancers/~012ee7737a8d40746f' },
          ].map((s) => (
            <FallingPiece key={s.id} {...fp(s.id)}>
              <SocialIcon icon={s.icon} label={s.label} href={s.href} highlight={s.highlight} />
            </FallingPiece>
          ))}
        </div>
      </div>

      {/* Bottom gradient — only in non-permanent state */}
      {!permanent && !collapsed && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-[200px] h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-[200px] h-16 bg-gradient-to-t from-cyan/[0.04] to-transparent" />
        </>
      )}

      {/* Footer is now the literal boundary for GravityCollapse pieces */}
      <footer aria-label="Site footer" className={`border-t border-white/[0.06] bg-bg relative z-10 transition-opacity duration-700 ${!collapsed && !permanent ? 'opacity-30 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <div className="w-full px-4 sm:px-6 md:px-12 py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="font-mono text-cyan text-lg tracking-widest font-bold">
                <ShaderLogoGlow>
                  <LiquidGlassLogo>
                    <ShaderLogo>PRIMUEZ</ShaderLogo>
                  </LiquidGlassLogo>
                </ShaderLogoGlow>
              </span>
              <span className="font-mono text-xs text-text-muted">AI Systems & Autonomous Workflows</span>
              <a href="mailto:contact@primuez.in" className="font-mono text-xs text-cyan hover:underline mt-1">contact@primuez.in</a>
            </div>
            <div className="flex items-center gap-6 font-mono text-xs text-text-muted">
              <a href="https://github.com/primuez" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-glow-cyan transition-colors duration-200">GitHub</a>
              <a href="https://youtube.com/@Primuez" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-glow-cyan transition-colors duration-200">YouTube</a>
              <a href="https://www.linkedin.com/in/rahul-kasturiya-796910363" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-glow-cyan transition-colors duration-200">LinkedIn</a>
            </div>
            <div className="font-mono text-xs text-text-muted/60">
              &copy; 2026 Primuez &middot; Built with intent.
            </div>
          </div>
        </div>
      </footer>
    </div>
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
      <GravityCollapse onContact={() => { trackEvent('click_contact_form'); setModalType('form'); }} />
    </motion.section>
  );
}
