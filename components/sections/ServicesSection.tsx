'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionTemplate } from 'motion/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from '@/components/SectionHeader';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';

const SERVICES_DATA = [
  {
    icon: '⚙️',
    title: 'n8n Workflow Automation',
    outcome: 'Your manual processes run themselves',
    desc: "Custom n8n workflows that automate lead capture, CRM injection, email sequences, GST reconciliation, WhatsApp outreach — whatever you're doing by hand today.",
    tags: ['n8n', 'Webhooks', 'API Chains', 'Scheduling'],
  },
  {
    icon: '🎙️',
    title: 'Voice AI Agents',
    outcome: 'An agent that listens, reasons & acts',
    desc: 'Voice-first AI agents that go beyond talking — they execute multi-step tasks across your stack while your hands stay free. Deployable to WhatsApp, web, or phone.',
    tags: ['Voice AI', 'LLM', 'n8n', 'Real-Time'],
  },
  {
    icon: '🔗',
    title: 'Custom API Integration',
    outcome: 'Any system connected to any other',
    desc: 'ERP ↔ CRM ↔ WhatsApp ↔ payment gateway ↔ government portals. If there\'s an API or webhook, I can wire it into your workflow with full error handling and fallback logic.',
    tags: ['REST APIs', 'Webhooks', 'OAuth', 'Odoo', 'IndiaMART'],
  },
  {
    icon: '🎵',
    title: 'AI Music Generation',
    outcome: 'Original tracks on demand, zero licensing fees',
    desc: 'Automated music generation pipelines via Suno — jingles, background scores, brand tracks, YouTube intros. Fully automated, batch-ready, and copyright-clean.',
    tags: ['Suno', 'AI Audio', 'Automation', 'Content'],
  },
  {
    icon: '🎬',
    title: 'AI Video / Movie Clips',
    outcome: 'UGC-style ad creatives at scale',
    desc: 'AI-generated video clips for ads, product demos, and social content. UGC-style scripts, voiceovers, and visuals — all automated and batch-produced.',
    tags: ['UGC Ads', 'AI Video', 'Content Automation'],
  },
  {
    icon: '🚀',
    title: 'SaaS MVP Build',
    outcome: 'A working product your users can log into',
    desc: 'Full-stack SaaS products built on Cloudflare Workers — fast, globally deployed, no server bills. From idea to live URL. InkTwin and PrimuezSure are examples of what ships.',
    tags: ['Next.js', 'Hono', 'Cloudflare', 'D1', 'Drizzle'],
  },
];

function WireframeCard({ icon, title, outcome, desc, tags }: (typeof SERVICES_DATA)[0]) {
  return (
    <div className="flex flex-col p-6 rounded-xl border-2 border-dashed border-[#333] bg-transparent min-h-[260px]">
      <div className="text-3xl mb-4 grayscale opacity-40">{icon}</div>
      <h4 className="text-base font-bold mb-1 text-[#555]">{title}</h4>
      <p className="font-mono text-xs uppercase tracking-widest mb-4 text-[#444]">→ {outcome}</p>
      <p className="text-[#3a3a3a] text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag, i) => (
          <span key={i} className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-[#333] text-[#444] bg-transparent">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function RenderedCard({ icon, title, outcome, desc, tags }: (typeof SERVICES_DATA)[0]) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 22 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);

  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);

    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const spotlightBg = useMotionTemplate`radial-gradient(280px circle at ${spotlightX}px ${spotlightY}px, rgba(0, 240, 255, 0.15), transparent 80%)`;

  return (
    <div 
      className="perspective-1000 w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex flex-col p-6 rounded-xl border border-cyan/40 bg-[#12161E]/80 backdrop-blur-md min-h-[260px] h-full
          shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_20px_rgba(0,240,255,0.06)] relative overflow-hidden liquid-glass-card group"
      >
        {/* Dynamic Cursor Spotlight Border */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{ background: spotlightBg }}
        />
        
        {/* Glass edge highlight */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent pointer-events-none z-10"></div>
        <div className="text-3xl mb-4 z-20">{icon}</div>
        <h4 className="text-base font-bold mb-1 text-white z-20">{title}</h4>
        <p className="font-mono text-xs uppercase tracking-widest mb-4 text-cyan z-20">→ {outcome}</p>
        <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1 z-20">{desc}</p>
        <div className="flex flex-wrap gap-2 mt-auto z-20">
          {tags.map((tag, i) => (
            <motion.span 
              key={i} 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 240, 255, 0.18)' }}
              className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-cyan/40 text-cyan bg-cyan/10 cursor-default transition-all duration-200"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MobileServiceCard({ card }: { card: (typeof SERVICES_DATA)[0] }) {
  const scanEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      className="relative"
      whileInView="visible"
      initial="hidden"
      viewport={{ margin: '-80px 0px -80px 0px', once: true }}
    >
      {/* ── Bottom layer: Wireframe blueprint ── */}
      <div className="flex flex-col p-6 rounded-xl border-2 border-dashed border-[#333] bg-transparent min-h-[260px]">
        <div className="text-3xl mb-4 grayscale opacity-40">{card.icon}</div>
        <h4 className="text-base font-bold mb-1 text-[#666]">{card.title}</h4>
        <p className="font-mono text-xs uppercase tracking-widest mb-4 text-[#555]">→ {card.outcome}</p>
        <p className="text-[#444] text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {card.tags.map((tag, i) => (
            <span key={i} className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-[#333] text-[#555] bg-transparent">{tag}</span>
          ))}
        </div>
      </div>

      {/* ── Top layer: Rendered card, revealed by clip-path scan ── */}
      <motion.div
        className="absolute inset-0 flex flex-col p-6 rounded-xl border border-cyan/20 bg-[#12161E] min-h-[260px] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        variants={{
          hidden:  { clipPath: 'inset(0 0 100% 0)' },
          visible: { clipPath: 'inset(0 0 0% 0)' },
        }}
        transition={{ duration: 1.1, ease: scanEase }}
      >
        <div className="text-3xl mb-4">{card.icon}</div>
        <h4 className="text-base font-bold mb-1 text-white">{card.title}</h4>
        <p className="font-mono text-xs uppercase tracking-widest mb-4 text-[#00FFCC]">→ {card.outcome}</p>
        <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
        <div className="flex flex-wrap gap-2 mt-auto font-mono text-[10px] text-cyan">
          {card.tags.map((tag, i) => (
            <span key={i} className="uppercase px-2 py-1 rounded border border-cyan/25 bg-cyan/5">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* ── Laser line: sweeps from top to bottom in sync with the reveal ── */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none z-10"
        variants={{
          hidden:  { top: '0%' },
          visible: { top: '100%' },
        }}
        transition={{ duration: 1.1, ease: scanEase }}
      >
        <div className="w-full h-[2px] bg-[#00FFCC]"
          style={{ boxShadow: '0 0 15px #00FFCC, 0 0 30px rgba(0,255,204,0.5)' }} />
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection({ onWorkWithMe }: { onWorkWithMe: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile     = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // scrub: smooth lag (equivalent to GSAP scrub: 1)
  const smoothP = useSpring(scrollYProgress, { stiffness: 55, damping: 18, restDelta: 0.001 });

  // clipBottom: 100 → 0 as user scrolls through section
  const clipBottom  = useTransform(smoothP, [0.04, 0.88], [100, 0]);
  const clipPath    = useTransform(clipBottom, v => {
    const clamped = Math.max(0, Math.min(100, isNaN(v) ? 100 : v));
    return `inset(0 0 ${clamped.toFixed(2)}% 0)`;
  });

  // laser sits right at the clip boundary
  const laserTop    = useTransform(clipBottom, v => {
    const clamped = Math.max(0, Math.min(100, isNaN(v) ? 100 : v));
    return `${(100 - clamped).toFixed(2)}%`;
  });
  const laserOpacity= useTransform(clipBottom, [100, 96, 4, 0], [0, 1, 1, 0]);

  // section height: desktop ~290vh gives plenty of scroll room through 2 card rows
  // mobile: auto height, no scroll-jacking
  const sectionHeight = '290vh';

  return (
    <section
      id="services"
      ref={containerRef}
      style={isMobile ? undefined : { height: sectionHeight, position: 'relative' }}
      className={isMobile ? 'pt-16' : ''}
    >
      <div
        style={isMobile ? undefined : { position: 'sticky', top: '72px' }}
        className={isMobile ? '' : 'pt-16 md:pt-20 pb-16'}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader number="03" command="> ./services --what-i-build-for-you" title="What I Build For You" />
          <p className="text-text-muted mt-4 mb-3 max-w-2xl text-base leading-relaxed">
            Every service below ships as a working system — not a prototype, not a template. You describe the outcome you need; I design, build, and hand it over ready to run.
          </p>
          {!isMobile && (
            <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2">
              <span className="text-[#00FFCC] animate-pulse">▼</span> scroll to scan services
            </p>
          )}
        </motion.div>

        {/* ── Blueprint Scanner Grid ── */}
        {!isMobile ? (
          /* Desktop: scroll-driven laser scanner */
          <div className="relative" style={{ position: 'relative' }}>
            {/* Bottom layer — wireframe blueprint */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES_DATA.map((s, i) => <WireframeCard key={i} {...s} />)}
            </div>

            {/* Top layer — rendered, clipped by laser */}
            <motion.div
              className="absolute inset-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{ clipPath }}
            >
              {SERVICES_DATA.map((s, i) => <RenderedCard key={i} {...s} />)}
            </motion.div>

            {/* Glowing laser line */}
            <motion.div
              className="absolute left-0 right-0 pointer-events-none z-10"
              style={{ top: laserTop, opacity: laserOpacity }}
            >
              <div className="w-full h-[2px] bg-[#00FFCC]
                shadow-[0_0_8px_#00FFCC,0_0_20px_#00FFCC,0_0_40px_rgba(0,255,204,0.6)]" />
            </motion.div>
          </div>
        ) : (
          /* Mobile: each card fades+slides in as user scrolls */
          <div className="grid grid-cols-1 gap-6 mt-8">
            {SERVICES_DATA.map((s, i) => (
              <MobileServiceCard key={i} card={s} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="font-mono text-xs text-text-muted tracking-widest mb-4">[ NOT SURE WHICH ONE YOU NEED? ]</p>
          <GlassButton
            size="lg"
            onClick={onWorkWithMe}
            glowColor="rgba(0, 240, 255, 0.2)"
            className="glass-btn-glow text-cyan hover:text-white"
          >
            Describe your project &rarr; I&apos;ll figure out the rest
          </GlassButton>
        </div>
      </div>
    </section>
  );
}
