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

function WireframeCard({ icon, title, outcome, desc, tags, index }: (typeof SERVICES_DATA)[0] & { index: number }) {
  const sysCodes = ['SYS-N8N', 'VOX-AI', 'API-INT', 'AUD-GEN', 'VID-GEN', 'APP-MVP'];
  return (
    <div className="flex flex-col p-6 rounded-2xl border border-dashed border-white/10 bg-transparent min-h-[260px] relative select-none">
      <div className="absolute top-3 right-3 font-mono text-[8px] text-[#444] tracking-wider">
        {sysCodes[index]}
      </div>
      <div className="flex items-center gap-4 mb-4 opacity-40">
        <div className="w-12 h-12 rounded-xl border border-dashed border-[#333] flex items-center justify-center text-2xl grayscale">
          {icon}
        </div>
        <div>
          <h4 className="text-base font-bold text-[#555] leading-tight">{title}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#444]">{outcome}</span>
          </div>
        </div>
      </div>
      <p className="text-[#3a3a3a] text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {tags.map((tag, i) => (
          <span key={i} className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full border border-[#333] text-[#444] bg-transparent flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#333]" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function RenderedCard({ icon, title, outcome, desc, tags, index }: (typeof SERVICES_DATA)[0] & { index: number }) {
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

  const glowColors = [
    'from-cyan-500/10 via-cyan-500/5 to-transparent',      // n8n
    'from-purple-500/10 via-purple-500/5 to-transparent',  // Voice AI
    'from-emerald-500/10 via-emerald-500/5 to-transparent', // API
    'from-amber-500/10 via-amber-500/5 to-transparent',    // Music
    'from-rose-500/10 via-rose-500/5 to-transparent',      // Video
    'from-blue-500/10 via-blue-500/5 to-transparent',      // SaaS
  ];
  
  const glowDots = [
    'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
    'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]',
  ];
  
  const neonBorders = [
    'group-hover:border-cyan-500/30',
    'group-hover:border-purple-500/30',
    'group-hover:border-emerald-500/30',
    'group-hover:border-amber-500/30',
    'group-hover:border-rose-500/30',
    'group-hover:border-blue-500/30',
  ];
  
  const sysCodes = ['SYS-N8N', 'VOX-AI', 'API-INT', 'AUD-GEN', 'VID-GEN', 'APP-MVP'];

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
        className="flex flex-col p-6 rounded-2xl border border-white/[0.06] bg-[#07090e]/95 backdrop-blur-md min-h-[260px] h-full
          shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.03)] relative overflow-hidden liquid-glass-card group"
      >
        {/* Futuristic Subtle Background Grid */}
        <div className="absolute inset-0 bg-blueprint opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none" />

        {/* Dynamic mesh glow at the top right */}
        <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-[40px] bg-gradient-to-br ${glowColors[index]} opacity-30 group-hover:opacity-75 transition-all duration-500 pointer-events-none`} />

        {/* Outer/Inner Bezel Enclosure Details */}
        <div className={`absolute inset-[3px] rounded-2xl border border-white/[0.02] ${neonBorders[index]} transition-colors duration-300 pointer-events-none z-10`} />

        {/* Technical Coordinate Indicators */}
        <div className="absolute top-3 right-3 font-mono text-[8px] text-white/20 tracking-wider group-hover:text-white/40 transition-colors duration-300 pointer-events-none z-20 select-none">
          {sysCodes[index]}
        </div>

        {/* Hardware corner details */}
        <div className="absolute top-2.5 left-2.5 w-1 h-1 rounded-full bg-white/5 group-hover:bg-white/25 transition-colors duration-300 pointer-events-none z-20" />
        <div className="absolute bottom-2.5 left-2.5 w-1 h-1 rounded-full bg-white/5 group-hover:bg-white/25 transition-colors duration-300 pointer-events-none z-20" />
        <div className="absolute bottom-2.5 right-2.5 w-1 h-1 rounded-full bg-white/5 group-hover:bg-white/25 transition-colors duration-300 pointer-events-none z-20" />

        {/* Dynamic Spotlight Glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{ background: spotlightBg }}
        />

        {/* Content Layout */}
        <div className="flex items-center gap-4 mb-4 z-20">
          {/* Futuristic Icon Frame */}
          <div className="relative w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] flex items-center justify-center overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-white/[0.05] opacity-50" />
            <span className="text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300 select-none">{icon}</span>
          </div>

          <div>
            <h4 className="text-base font-bold text-white tracking-wide group-hover:text-glow-cyan transition-all duration-300 leading-tight">{title}</h4>
            {/* Outcome Tag with pulsing dot */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${glowDots[index]} animate-pulse`} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/50">{outcome}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1 z-20 group-hover:text-white/70 transition-colors duration-300">
          {desc}
        </p>

        {/* Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto z-20">
          {tags.map((tag, i) => (
            <motion.span 
              key={i} 
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/5 text-white/40 bg-white/[0.01] cursor-default transition-all duration-200 flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-white/20" />
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MobileServiceCard({ card, index }: { card: (typeof SERVICES_DATA)[0]; index: number }) {
  const scanEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
  
  const glowColors = [
    'from-cyan-500/10 via-cyan-500/5 to-transparent',      // n8n
    'from-purple-500/10 via-purple-500/5 to-transparent',  // Voice AI
    'from-emerald-500/10 via-emerald-500/5 to-transparent', // API
    'from-amber-500/10 via-amber-500/5 to-transparent',    // Music
    'from-rose-500/10 via-rose-500/5 to-transparent',      // Video
    'from-blue-500/10 via-blue-500/5 to-transparent',      // SaaS
  ];
  
  const glowDots = [
    'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
    'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]',
  ];
  
  const neonBorders = [
    'border-cyan-500/30',
    'border-purple-500/30',
    'border-emerald-500/30',
    'border-amber-500/30',
    'border-rose-500/30',
    'border-blue-500/30',
  ];
  
  const laserGlows = [
    'bg-cyan shadow-[0_0_12px_#00f0ff,0_0_24px_rgba(0,240,255,0.6)]',
    'bg-purple-400 shadow-[0_0_12px_#a78bfa,0_0_24px_rgba(167,139,250,0.6)]',
    'bg-emerald-400 shadow-[0_0_12px_#10b981,0_0_24px_rgba(16,185,129,0.6)]',
    'bg-amber-400 shadow-[0_0_12px_#f5a623,0_0_24px_rgba(245,166,35,0.6)]',
    'bg-rose-400 shadow-[0_0_12px_#f43f5e,0_0_24px_rgba(244,63,94,0.6)]',
    'bg-blue-400 shadow-[0_0_12px_#3b82f6,0_0_24px_rgba(59,130,246,0.6)]',
  ];
  
  const sysCodes = ['SYS-N8N', 'VOX-AI', 'API-INT', 'AUD-GEN', 'VID-GEN', 'APP-MVP'];

  return (
    <motion.div
      className="relative"
      whileInView="visible"
      initial="hidden"
      viewport={{ margin: '-80px 0px -80px 0px', once: true }}
    >
      {/* ── Bottom layer: Wireframe blueprint ── */}
      <div className="flex flex-col p-6 rounded-2xl border border-dashed border-white/10 bg-transparent min-h-[260px] relative select-none">
        <div className="absolute top-3 right-3 font-mono text-[8px] text-[#444] tracking-wider">
          {sysCodes[index]}
        </div>
        <div className="flex items-center gap-4 mb-4 opacity-40">
          <div className="w-12 h-12 rounded-xl border border-dashed border-[#333] flex items-center justify-center text-2xl grayscale">
            {card.icon}
          </div>
          <div>
            <h4 className="text-base font-bold text-[#555] leading-tight">{card.title}</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#444]">{card.outcome}</span>
            </div>
          </div>
        </div>
        <p className="text-[#3a3a3a] text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {card.tags.map((tag, i) => (
            <span key={i} className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full border border-[#333] text-[#444] bg-transparent flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#333]" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Top layer: Rendered card, revealed by clip-path scan ── */}
      <motion.div
        className="absolute inset-0 flex flex-col p-6 rounded-2xl border border-white/[0.06] bg-[#07090e] min-h-[260px] shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.03)] overflow-hidden"
        variants={{
          hidden:  { clipPath: 'inset(0 0 100% 0)' },
          visible: { clipPath: 'inset(0 0 0% 0)' },
        }}
        transition={{ duration: 1.2, ease: scanEase }}
      >
        {/* Futuristic Subtle Background Grid */}
        <div className="absolute inset-0 bg-blueprint opacity-[0.02] pointer-events-none" />

        {/* Dynamic mesh glow at the top right */}
        <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-[40px] bg-gradient-to-br ${glowColors[index]} opacity-50 pointer-events-none`} />

        {/* Outer/Inner Bezel Enclosure Details */}
        <div className={`absolute inset-[3px] rounded-2xl border border-white/[0.02] ${neonBorders[index]} pointer-events-none z-10`} />

        {/* Technical Coordinate Indicators */}
        <div className="absolute top-3 right-3 font-mono text-[8px] text-white/30 tracking-wider pointer-events-none z-20 select-none">
          {sysCodes[index]}
        </div>

        {/* Hardware corner details */}
        <div className="absolute top-2.5 left-2.5 w-1 h-1 rounded-full bg-white/10 pointer-events-none z-20" />

        {/* Content Layout */}
        <div className="flex items-center gap-4 mb-4 z-20">
          {/* Futuristic Icon Frame */}
          <div className="relative w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-white/[0.05] opacity-50" />
            <span className="text-2xl relative z-10 select-none">{card.icon}</span>
          </div>

          <div>
            <h4 className="text-base font-bold text-white tracking-wide leading-tight">{card.title}</h4>
            {/* Outcome Tag with pulsing dot */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${glowDots[index]} animate-pulse`} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/50">{card.outcome}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1 z-20">
          {card.desc}
        </p>

        {/* Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto z-20">
          {card.tags.map((tag, i) => (
            <span 
              key={i} 
              className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/5 text-white/40 bg-white/[0.01] flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-white/20" />
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Laser line: sweeps from top to bottom in sync with the reveal ── */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none z-10"
        variants={{
          hidden:  { top: '0%', opacity: 0 },
          visible: { top: '100%', opacity: [0, 1, 1, 0] },
        }}
        transition={{ duration: 1.2, ease: scanEase }}
      >
        <div className={`w-full h-[2px] ${laserGlows[index]}`} />
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
              {SERVICES_DATA.map((s, i) => <WireframeCard key={i} index={i} {...s} />)}
            </div>

            {/* Top layer — rendered, clipped by laser */}
            <motion.div
              className="absolute inset-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{ clipPath }}
            >
              {SERVICES_DATA.map((s, i) => <RenderedCard key={i} index={i} {...s} />)}
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
              <MobileServiceCard key={i} card={s} index={i} />
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
