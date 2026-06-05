'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useInView, animate, MotionValue } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from '@/components/SectionHeader';

const VIP_CARD = {
  tier: 'Enterprise / Fractional CTO & Custom Solutions',
  usd: 'Custom Retainer / Project-Based',
  inr: 'Open for discussion',
  features: [
    'Full architecture ownership',
    'Multi-department automation',
    'Ongoing async support',
    'Weekly strategic check-ins',
    'Architecture reviews',
    'Roadmap planning',
  ],
  cta: 'Request System Architecture Consultation',
};

function VipReceiptCard({
  clipPct,
  ctaOpacity,
  ctaY,
}: {
  clipPct: MotionValue<number>;
  ctaOpacity: MotionValue<number>;
  ctaY: MotionValue<number>;
}) {
  const clipPath    = useTransform(clipPct, v => `inset(0 0 ${v.toFixed(1)}% 0)`);
  const lineTop     = useTransform(clipPct, v => `${(100 - v).toFixed(1)}%`);
  const lineOpacity = useTransform(clipPct, [0, 4, 96, 100], [0, 1, 1, 0]);

  return (
    <div className="group relative flex flex-col bg-[#05060a]/95 rounded-xl overflow-visible
      border border-cyan/40
      shadow-[0_14px_44px_rgba(0,0,0,0.65)]
      transition-shadow duration-500
      hover:shadow-[0_0_0_1px_rgba(0,240,255,0.5),0_0_30px_rgba(0,240,255,0.25),0_14px_44px_rgba(0,0,0,0.65)]">

      {/* ── HEADER ── */}
      <div className="p-6 md:p-8 pb-4 md:pb-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
              {VIP_CARD.tier}
            </p>
            <h2 className="font-sans font-bold text-3xl md:text-4xl leading-tight text-cyan">
              {VIP_CARD.usd}
            </h2>
            <span className="font-mono text-sm text-text-muted block mt-1">{VIP_CARD.inr}</span>
          </div>
          <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="hidden md:block shrink-0">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-mono text-xs uppercase tracking-widest border border-cyan/60 text-cyan
                px-8 py-3 rounded transition-all duration-300
                hover:bg-cyan/10 hover:border-cyan
                shadow-[0_0_14px_rgba(0,240,255,0.15)] cursor-pointer"
            >
              {VIP_CARD.cta}
            </button>
          </motion.div>
        </div>
      </div>

      {/* paper edge divider */}
      <div className="h-px mx-6 md:mx-8 bg-cyan/20" />

      {/* ── RECEIPT BODY ── */}
      <div className="relative flex-1 overflow-hidden rounded-b-xl">
        <motion.div style={{ clipPath }} className="px-6 md:px-8 pt-5 pb-6">
          {/* Featured Footnote Callout */}
          <div className="mb-6 p-4 rounded-lg bg-cyan/5 border border-cyan/20 font-mono text-xs text-cyan/95 leading-relaxed text-left">
            📢 <strong className="text-white">Note:</strong> All systems are project-based, never hourly. Scope and value metrics are mapped and locked down before a single line of code is written.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
            {VIP_CARD.features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-text-main font-mono">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-cyan" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>

        {/* glowing cyan print line */}
        <motion.div
          className="absolute left-4 right-4 h-px pointer-events-none
            bg-cyan shadow-[0_0_6px_#00f0ff,0_0_16px_rgba(0,240,255,0.4)]"
          style={{ top: lineTop, opacity: lineOpacity }}
        />
      </div>

      {/* CTA — mobile only (bottom) */}
      <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="md:hidden px-6 pb-6 pt-2">
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full font-mono text-xs uppercase tracking-widest border border-cyan/60 text-cyan
            py-3 rounded transition-all duration-300
            hover:bg-cyan/10 hover:border-cyan cursor-pointer"
        >
          {VIP_CARD.cta}
        </button>
      </motion.div>
    </div>
  );
}

function MobileVipCard() {
  const clipPct    = useMotionValue(100);
  const ctaOpacity = useMotionValue(0);
  const ctaY       = useMotionValue(14);
  const ref        = useRef<HTMLDivElement>(null);
  const inView     = useInView(ref, { once: true, margin: '-40px 0px -40px 0px' });

  useEffect(() => {
    if (!inView) return;
    const c1 = animate(clipPct, 0, { duration: 2.0, ease: [0.16, 1, 0.3, 1] });
    const c2 = animate(ctaOpacity, 1, { duration: 0.8, delay: 1.6, ease: 'easeOut' });
    const c3 = animate(ctaY, 0, { duration: 0.8, delay: 1.6, ease: 'easeOut' });
    return () => { c1.stop(); c2.stop(); c3.stop(); };
  }, [inView, clipPct, ctaOpacity, ctaY]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <VipReceiptCard clipPct={clipPct} ctaOpacity={ctaOpacity} ctaY={ctaY} />
    </motion.div>
  );
}

export default function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 160, damping: 40, restDelta: 0.001 });

  // Singular card unrolling
  const clipPct    = useTransform(smoothP, [0.08, 0.76], [100, 0]);
  const ctaOpacity = useTransform(smoothP, [0.70, 0.88], [0, 1]);
  const ctaY       = useTransform(smoothP, [0.70, 0.88], [14, 0]);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      ref={containerRef}
      style={isMobile ? undefined : { height: '170vh', position: 'relative' }}
      className={isMobile ? 'pt-16' : ''}
    >
      <div
        style={isMobile ? undefined : { position: 'sticky', top: '72px' }}
        className={isMobile ? '' : 'pt-16 md:pt-20 pb-16'}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader number="04" command="> ./pricing --transparent" title="Pricing" />
          <h2 id="pricing-heading" className="sr-only">What does Primuez charge for AI automation, n8n workflows, and SaaS development projects?</h2>
          <p className="text-text-muted mt-4 mb-10 max-w-2xl text-base leading-relaxed">
            No hidden rates. No surprise scope creep. All systems are project-based, never hourly. Scope and value metrics are mapped and locked down before a single line of code is written.
          </p>
          {!isMobile && (
            <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2">
              <span className="text-cyan animate-pulse">▼</span> scroll to print pricing
            </p>
          )}
        </motion.div>

        {/* ── Desktop layout ── */}
        {!isMobile && (
          <div className="max-w-4xl mx-auto pt-6">
            <VipReceiptCard clipPct={clipPct} ctaOpacity={ctaOpacity} ctaY={ctaY} />
          </div>
        )}

        {/* ── Mobile layout ── */}
        {isMobile && (
          <div className="flex flex-col gap-8 pt-6">
            <MobileVipCard />
          </div>
        )}

        <p className="mt-10 text-center font-mono text-xs text-text-muted tracking-widest">
          All systems are project-based, never hourly. Scope and value metrics are mapped and locked down before a single line of code is written.
        </p>
      </div>
    </section>
  );
}
