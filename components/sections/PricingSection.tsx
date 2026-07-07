'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useInView, animate, MotionValue } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from '@/components/SectionHeader';

const RECEIPT_CARDS = [
  {
    tier: 'Professional Automation',
    usd: 'Starts at $150',
    inr: '₹12,000+',
    color: 'cyan' as const,
    desc: 'Multi-step workflows & CRM setups. Documentation + handover call.',
    features: [
      'Multi-step workflows & CRM setups',
      'Full error handling & logging',
      '3-6 node workflow or AI agent',
      'Documentation + handover call',
      '30-day bug support',
    ],
    cta: 'Get Professional Build',
    url: 'https://cal.com/prime-s/30min',
  },
  {
    tier: 'Premium AI Integration',
    usd: '$300 - $800',
    inr: '₹25,000 - ₹65,000',
    color: 'amber' as const,
    popular: true,
    desc: 'End-to-end AI systems, SaaS MVPs & enterprise pipelines.',
    features: [
      'End-to-end AI systems',
      'Multi-model orchestration',
      'SaaS MVPs & enterprise pipelines',
      'Full system architecture',
      'Unlimited revisions in scope',
    ],
    cta: 'Build Something Premium',
    url: 'https://cal.com/prime-s/30min',
  },
  {
    tier: 'Advanced Enterprise Systems',
    usd: 'Up to $1,000',
    inr: '₹75,000 - ₹1,00,000+',
    color: 'violet' as const,
    desc: 'High-level complex architectures. Full architecture ownership.',
    features: [
      'Complex architectures',
      'Full architecture ownership',
      'Multi-department automation',
      'Ongoing async support',
      'Architecture reviews & Roadmap planning',
    ],
    cta: 'Discuss Scope',
    url: 'https://cal.com/prime-s/30min',
  },
];

const VIP_CARD = {
  tier: 'Monthly Retainer / Fractional CTO',
  usd: 'Open for discussion',
  inr: 'Custom Retainer',
  features: [
    'Full architecture ownership',
    'Multi-department automation',
    'Ongoing async support',
    'Weekly strategic check-ins',
    'Architecture reviews',
    'Roadmap planning',
  ],
  cta: 'Discuss Retainer',
};

type ReceiptCardData = (typeof RECEIPT_CARDS)[0];

function cardClasses(c: string) {
  return {
    border:   c === 'cyan' ? 'border-cyan/40'   : c === 'amber' ? 'border-amber/50'   : 'border-violet-400/40',
    ring:     c === 'cyan' ? 'ring-cyan/25'      : c === 'amber' ? 'ring-amber/30'      : 'ring-violet-400/25',
    text:     c === 'cyan' ? 'text-cyan'         : c === 'amber' ? 'text-amber'         : 'text-violet-400',
    divider:  c === 'cyan' ? 'bg-cyan/20'        : c === 'amber' ? 'bg-amber/20'        : 'bg-violet-400/20',
    line:     c === 'cyan'
      ? 'bg-cyan shadow-[0_0_6px_#00f0ff,0_0_16px_rgba(0,240,255,0.4)]'
      : c === 'amber'
      ? 'bg-amber shadow-[0_0_6px_#f5a623,0_0_16px_rgba(245,166,35,0.4)]'
      : 'bg-violet-400 shadow-[0_0_6px_#a78bfa,0_0_16px_rgba(167,139,250,0.4)]',
    btn:      c === 'cyan'
      ? 'border-cyan text-cyan hover:bg-cyan hover:text-bg shadow-[0_0_14px_rgba(0,240,255,0.15)]'
      : c === 'amber'
      ? 'border-amber text-amber hover:bg-amber hover:text-bg shadow-[0_0_14px_rgba(245,166,35,0.15)]'
      : 'border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-bg shadow-[0_0_14px_rgba(167,139,250,0.15)]',
  };
}

function ReceiptCardInner({
  card,
  clipPct,
  ctaOpacity,
  ctaY,
}: {
  card: ReceiptCardData;
  clipPct: MotionValue<number>;
  ctaOpacity: MotionValue<number>;
  ctaY: MotionValue<number>;
}) {
  const cls = cardClasses(card.color);
  const clipPath    = useTransform(clipPct, v => `inset(0 0 ${v.toFixed(1)}% 0)`);
  const lineTop     = useTransform(clipPct, v => `${(100 - v).toFixed(1)}%`);
  const lineOpacity = useTransform(clipPct, [0, 4, 96, 100], [0, 1, 1, 0]);

  return (
    <div
      className={`relative flex flex-col bg-panel border ${cls.border} rounded-xl overflow-visible
        shadow-[0_14px_44px_rgba(0,0,0,0.65),0_3px_10px_rgba(0,0,0,0.45)]
        ${card.popular ? `ring-1 ${cls.ring}` : ''}`}
    >
      {/* ── MOST POPULAR badge ── */}
      {card.popular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 rounded-full
            font-mono text-[11px] font-bold uppercase tracking-widest whitespace-nowrap
            bg-[#00FFCC] text-[#0a0a0f]
            shadow-[0_0_18px_rgba(0,255,204,0.7),0_2px_8px_rgba(0,0,0,0.5)]"
        >
          ★ Most Popular
        </div>
      )}

      {/* ── HEADER ── */}
      <div className={`p-6 pb-4 ${card.popular ? 'pt-8' : ''}`}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-2">{card.tier}</p>
        <h3 className={`font-sans font-bold text-3xl leading-tight ${cls.text}`}>{card.usd}</h3>
        <span className="font-mono text-xs text-text-muted block mt-1">{card.inr}</span>
        <p className="text-zinc-400 text-xs mt-2 font-sans leading-relaxed min-h-[32px]">{card.desc}</p>
      </div>

      {/* paper edge divider */}
      <div className={`h-px mx-6 ${cls.divider}`} />

      {/* ── RECEIPT BODY ── */}
      <div className="relative flex-1 overflow-hidden rounded-b-xl">
        <motion.div style={{ clipPath }} className="px-6 pt-4">
          <ul className="space-y-2.5 pb-6">
            {card.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-text-main font-mono leading-normal">
                <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${cls.text}`} />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* glowing print line */}
        <motion.div
          className={`absolute left-4 right-4 h-px pointer-events-none ${cls.line}`}
          style={{ top: lineTop, opacity: lineOpacity }}
        />
      </div>

      {/* ── CTA ── */}
      <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="px-6 pb-6 pt-2 z-20">
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full block text-center font-mono text-xs uppercase tracking-widest border py-3.5 transition-all duration-300 rounded font-bold ${cls.btn}`}
        >
          {card.cta}
        </a>
      </motion.div>
    </div>
  );
}

function MobileReceiptCard({ card }: { card: ReceiptCardData }) {
  const clipPct    = useMotionValue(100);
  const ctaOpacity = useMotionValue(0);
  const ctaY       = useMotionValue(14);
  const ref        = useRef<HTMLDivElement>(null);
  const inView     = useInView(ref, { once: true, margin: '-40px 0px -40px 0px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(clipPct, 0, { duration: 2.0, ease: [0.16, 1, 0.3, 1] });
    const ctaCtrl  = animate(ctaOpacity, 1, { duration: 0.8, delay: 1.6, ease: 'easeOut' });
    const ctaYCtrl = animate(ctaY, 0, { duration: 0.8, delay: 1.6, ease: 'easeOut' });
    return () => { controls.stop(); ctaCtrl.stop(); ctaYCtrl.stop(); };
  }, [inView, clipPct, ctaOpacity, ctaY]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <ReceiptCardInner card={card} clipPct={clipPct} ctaOpacity={ctaOpacity} ctaY={ctaY} />
    </motion.div>
  );
}

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
    <div className="group relative flex flex-col bg-panel rounded-xl overflow-visible
      border border-red-500/30
      shadow-[0_14px_44px_rgba(0,0,0,0.65)]
      transition-shadow duration-500
      hover:shadow-[0_0_0_1px_rgba(239,68,68,0.5),0_0_30px_rgba(239,68,68,0.25),0_14px_44px_rgba(0,0,0,0.65)]">

      {/* ── HEADER ── */}
      <div className="p-6 md:p-8 pb-4 md:pb-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
              {VIP_CARD.tier}
            </p>
            <h2 className="font-sans font-bold text-3xl md:text-4xl leading-tight text-red-400">
              {VIP_CARD.usd}
            </h2>
            <span className="font-mono text-sm text-text-muted block mt-1">{VIP_CARD.inr}</span>
          </div>
          <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="hidden md:block shrink-0">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-mono text-xs uppercase tracking-widest border border-red-500/60 text-red-400
                px-8 py-3.5 rounded transition-all duration-300
                hover:bg-red-500/10 hover:border-red-400
                shadow-[0_0_14px_rgba(239,68,68,0.1)] cursor-pointer font-bold"
            >
              {VIP_CARD.cta}
            </button>
          </motion.div>
        </div>
      </div>

      {/* paper edge divider */}
      <div className="h-px mx-6 md:mx-8 bg-red-500/20" />

      {/* ── RECEIPT BODY ── */}
      <div className="relative flex-1 overflow-hidden rounded-b-xl">
        <motion.div style={{ clipPath }} className="px-6 md:px-8 pt-5 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
            {VIP_CARD.features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-text-main font-mono">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-red-400" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>

        {/* glowing red print line */}
        <motion.div
          className="absolute left-4 right-4 h-px pointer-events-none
            bg-red-500 shadow-[0_0_6px_#ef4444,0_0_16px_rgba(239,68,68,0.4)]"
          style={{ top: lineTop, opacity: lineOpacity }}
        />
      </div>

      {/* CTA — mobile only (bottom) */}
      <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="md:hidden px-6 pb-6 pt-2">
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full font-mono text-xs uppercase tracking-widest border border-red-500/60 text-red-400
            py-3 rounded transition-all duration-300
            hover:bg-red-500/10 hover:border-red-400 cursor-pointer font-bold"
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
    const c1 = animate(clipPct, 0, { duration: 2.4, ease: [0.16, 1, 0.3, 1] });
    const c2 = animate(ctaOpacity, 1, { duration: 0.8, delay: 2.0, ease: 'easeOut' });
    const c3 = animate(ctaY, 0, { duration: 0.8, delay: 2.0, ease: 'easeOut' });
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

  // Top-3 cards: unroll 8% → 62% of scroll
  const clipPct    = useTransform(smoothP, [0.06, 0.62], [100, 0]);
  const ctaOpacity = useTransform(smoothP, [0.60, 0.72], [0, 1]);
  const ctaY       = useTransform(smoothP, [0.60, 0.72], [14, 0]);

  // VIP card: unroll after top-3 are done, 72% → 92%
  const vipClip    = useTransform(smoothP, [0.72, 0.93], [100, 0]);
  const vipCtaOp   = useTransform(smoothP, [0.91, 0.98], [0, 1]);
  const vipCtaY    = useTransform(smoothP, [0.91, 0.98], [14, 0]);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      ref={containerRef}
      style={isMobile ? undefined : { height: '240vh', position: 'relative' }}
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
          <SectionHeader number="04" command="> ./pricing --transparent" title="What's the Investment?" />
          <h2 id="pricing-heading" className="sr-only">What does Primuez charge for AI automation, n8n workflows, and SaaS development projects?</h2>
          
          <p className="text-text-muted mt-4 mb-6 max-w-2xl text-base leading-relaxed font-sans">
            No hidden rates. No surprise scope creep. Fixed-price proposals, 30-day free support, and clear delivery timelines.
          </p>
          {!isMobile && (
            <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2">
              <span className="text-cyan animate-pulse">▼</span> scroll to print receipts
            </p>
          )}
        </motion.div>

        {/* ── Desktop layout ── */}
        {!isMobile && (
          <>
            <div className="grid lg:grid-cols-3 gap-6 pt-6">
              {RECEIPT_CARDS.map((card, i) => (
                <ReceiptCardInner
                  key={i}
                  card={card}
                  clipPct={clipPct}
                  ctaOpacity={ctaOpacity}
                  ctaY={ctaY}
                />
              ))}
            </div>

            <div className="mt-6">
              <VipReceiptCard clipPct={vipClip} ctaOpacity={vipCtaOp} ctaY={vipCtaY} />
            </div>
          </>
        )}

        {/* ── Mobile layout ── */}
        {isMobile && (
          <div className="flex flex-col gap-8 pt-6">
            {RECEIPT_CARDS.map((card, i) => (
              <MobileReceiptCard key={i} card={card} />
            ))}
            <MobileVipCard />
          </div>
        )}

      </div>
    </section>
  );
}
