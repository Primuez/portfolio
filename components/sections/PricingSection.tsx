'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useInView, animate, MotionValue } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from '@/components/SectionHeader';

const RECEIPT_CARDS = [
  {
    tier: 'Starter Automation',
    usd: 'Starts at $180',
    inr: 'Starting at ₹15,000',
    color: 'cyan' as const,
    desc: 'Single workflow. n8n, WhatsApp, API, or AI agent build.',
    features: [
      'Single n8n workflow or AI agent',
      'WhatsApp / custom API integration',
      'Full error handling & logging',
      'Fixed-price proposal — no surprises',
      '30-day free support included',
    ],
    cta: 'Book Scope Call',
    url: 'https://cal.com/prime-s/30min',
  },
  {
    tier: 'Enterprise Automation',
    usd: 'Starts at $900',
    inr: 'Starting at ₹75,000',
    color: 'amber' as const,
    popular: true,
    desc: 'Multi-system architecture. Odoo, AI agents, n8n pipelines, full integration.',
    features: [
      'Multi-system enterprise architecture',
      'Odoo ERP / CRM lead integrations',
      'Multi-agent AI workflows',
      'Fixed-price proposal — no surprises',
      '30-day free support included',
    ],
    cta: 'Book Scope Call',
    url: 'https://cal.com/prime-s/30min',
  },
  {
    tier: 'SaaS MVP',
    usd: 'Starts at $1,450',
    inr: 'Starting at ₹1,20,000',
    color: 'violet' as const,
    desc: 'Full product on Cloudflare Workers. Idea to live in 4–6 weeks.',
    features: [
      'Full-stack SaaS MVP build',
      'Serverless edge (Cloudflare Workers)',
      'Database setup (Supabase / D1)',
      'Modern responsive glassmorphic UI',
      '30-day free support included',
    ],
    cta: 'Book Scope Call',
    url: 'https://cal.com/prime-s/30min',
  },
];

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
        <h3 className={`font-sans font-bold text-3xl leading-tight ${cls.text}`}>{card.inr}</h3>
        <span className="font-mono text-xs text-text-muted block mt-1">{card.usd}</span>
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

export default function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 160, damping: 40, restDelta: 0.001 });

  // Top-3 cards: unroll 8% → 90% of scroll
  const clipPct    = useTransform(smoothP, [0.06, 0.85], [100, 0]);
  const ctaOpacity = useTransform(smoothP, [0.80, 0.95], [0, 1]);
  const ctaY       = useTransform(smoothP, [0.80, 0.95], [14, 0]);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      ref={containerRef}
      style={isMobile ? undefined : { height: '210vh', position: 'relative' }}
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
        )}

        {/* ── Mobile layout ── */}
        {isMobile && (
          <div className="flex flex-col gap-8 pt-6">
            {RECEIPT_CARDS.map((card, i) => (
              <MobileReceiptCard key={i} card={card} />
            ))}
          </div>
        )}

        {/* Credibility / Trust / CTA */}
        <div className="mt-12 text-center max-w-xl mx-auto border border-dashed border-cyan/20 rounded-xl bg-panel/30 p-6 backdrop-blur-sm">
          <p className="font-mono text-xs text-text-muted tracking-widest mb-4 uppercase">[ WANT AN EXACT QUOTE? ]</p>
          <a
            href="https://cal.com/prime-s/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/35 px-6 py-3.5 hover:bg-cyan hover:text-bg transition-all duration-300 font-bold"
          >
            📅 Book a free scope call for an exact quote
          </a>
        </div>
      </div>
    </section>
  );
}
