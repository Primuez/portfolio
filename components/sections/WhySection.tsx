'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'motion/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from '@/components/SectionHeader';
import { CheckCircle2, XCircle } from 'lucide-react';

const WHY_ITEMS = [
  {
    num: '01',
    title: 'We Ship,\nNot Just Plan',
    detail: "Real products. Live URLs. InkTwin and PrimuezSure aren't concepts on a slide deck — they're deployed, working SaaS tools built by a solo developer from Raipur.",
    longDetail: "We build live, production-grade assets, not speculative wireframes. Both InkTwin and PrimuezSure are active, production-deployed SaaS applications serving actual users. We engineer the complete lifecycle: responsive glass-refraction frontends, resilient background workers, and automated security controls. We sell the exact same execution we use to power our own business.",
  },
  {
    num: '02',
    title: 'Automation-First\nThinking',
    detail: 'Every solution starts with: what can be automated? Powered by n8n, LLMs, autonomous agents, and custom API pipelines — we remove the manual work before it becomes your problem.',
    longDetail: 'Every business bottleneck is solved at the architecture level. By combining high-density n8n workflow grids, Cloudflare Edge workers, and self-correcting AI sandboxes, we bypass human latency. We construct automated data bridges from lead sources like IndiaMART directly to enterprise systems like Odoo CRM, keeping your operations fully autonomic.',
  },
  {
    num: '03',
    title: 'Certified &\nSelf-Taught',
    detail: "n8n Official Badge Holder. SimpliLearn Certified. But more importantly — everything here was built by doing, not just studying.",
    longDetail: "Holding official n8n creator badges and developer certifications is just the baseline. The real proof is in the code. We operate with a deep, self-taught systems knowledge that can only be forged by hands-on engineering. We don't just understand the tools — we master how to integrate them securely under strict compliance.",
  },
  {
    num: '04',
    title: 'Young, Hungry\n& Agile',
    detail: "Still in college, already running a SaaS brand. Zero bureaucratic red tape. That means faster turnaround, lower overhead, and direct access to the architect.",
    longDetail: "Free from the bloat of traditional agencies and legacy processes. We operate with rapid dev cycles, delivering custom integrations in days rather than months. You deal directly with the system architect who writes the code, ensuring zero communication drift, absolute transparency, and extreme speed.",
  },
  {
    num: '05',
    title: 'Is This\na Fit?',
    detail: "I value your time and mine. A transparent look at who I work best with (manufacturers, traders, CAs, fast-moving founders) and who is not a good match (cheapest option seekers, bureaucratic layers).",
    longDetail: "Good Fit / Not a Fit columns.",
  },
];

function FitCheckDetails({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'} w-full text-left font-sans mt-2`}>
      {/* Good Fit */}
      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 backdrop-blur-sm shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
        <h4 className="text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5 border-b border-emerald-500/10 pb-2">
          <CheckCircle2 size={12} className="shrink-0" /> ✅ Good Fit
        </h4>
        <ul className="space-y-2 text-[11px] md:text-xs text-zinc-300 leading-relaxed">
          <li className="flex items-start gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <span>Manufacturers & traders drowning in manual data entry (IndiaMART, Odoo, custom ERPs).</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <span>CAs handling GST, reconciliation, or reporting by hand.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <span>Founders who need a working SaaS MVP shipped fast without hiring a full team.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <span>Business owners who want always-on AI agents handling customer queries.</span>
          </li>
        </ul>
      </div>

      {/* Not a Fit */}
      <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 backdrop-blur-sm shadow-[0_4px_20px_rgba(244,63,94,0.05)]">
        <h4 className="text-rose-400 font-mono text-[10px] uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5 border-b border-rose-500/10 pb-2">
          <XCircle size={12} className="shrink-0" /> ❌ Not a Fit
        </h4>
        <ul className="space-y-2 text-[11px] md:text-xs text-zinc-300 leading-relaxed">
          <li className="flex items-start gap-1.5">
            <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
            <span>Cheapest option seekers. I write custom, robust production code built for long-term reliability.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
            <span>Projects requiring large ongoing teams or bureaucratic management layers.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
            <span>Anyone who is not clear on what business outcome they want to automate.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function WhyPrimuezDot({
  index, total, scrollYProgress,
}: { index: number; total: number; scrollYProgress: MotionValue<number> }) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollYProgress, (v) => (v >= start && v < end) ? 1 : 0.25);
  const scale = useTransform(scrollYProgress, [start, Math.min(start + 0.08, end), Math.max(end - 0.08, start), end], [1, 1.7, 1.7, 1]);
  return (
    <motion.div
      className="w-1.5 h-1.5 rounded-full bg-indigo-400"
      style={{ opacity, scale }}
    />
  );
}

function WhyPrimuezSlide({
  item, index, total, scrollYProgress, detailMode,
}: {
  item: typeof WHY_ITEMS[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  detailMode: 'brief' | 'detailed';
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const inEnd = start + (end - start) * 0.40;
  const outStart = start + (end - start) * 0.60;

  const isFirst = index === 0;
  const opacityInput  = isFirst ? [outStart, end]         : [start, inEnd, outStart, end];
  const opacityOutput = isFirst ? [1, 0]                  : [0, 1, 1, 0];
  const opacity    = useTransform(scrollYProgress, opacityInput,  opacityOutput);
  const leftY      = useTransform(scrollYProgress, [start, inEnd], isFirst ? [0, 0] : [-50, 0]);
  const rightY     = useTransform(scrollYProgress, [start, inEnd], isFirst ? [0, 0] : [50, 0]);
  const leftClip   = useTransform(scrollYProgress, [start, inEnd], isFirst ? ['inset(0 0 0% 0)', 'inset(0 0 0% 0)'] : ['inset(0 0 110% 0)', 'inset(0 0 0% 0)']);
  const rightClip  = useTransform(scrollYProgress, [start, inEnd], isFirst ? ['inset(0% 0 0 0)', 'inset(0% 0 0 0)'] : ['inset(110% 0 0 0)', 'inset(0% 0 0 0)']);
  const lineScaleY = useTransform(scrollYProgress, isFirst ? [start, outStart, end] : [start, inEnd, outStart, end], isFirst ? [1, 1, 0] : [0, 1, 1, 0]);

  return (
    <motion.div className="absolute inset-0 flex" style={{ opacity }}>
      {/* Left panel — title */}
      <div className="w-1/2 flex items-center justify-end pr-10 md:pr-16 lg:pr-24">
        <motion.div style={{ y: leftY, clipPath: leftClip }} className="text-right">
          <span className="font-mono text-indigo-400 text-xs uppercase tracking-[0.25em] block mb-3">
            {item.num} / 05
          </span>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ whiteSpace: 'pre-line' }}
          >
            {item.title}
          </h3>
        </motion.div>
      </div>

      {/* Center lock line */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px bg-indigo-500"
        style={{ scaleY: lineScaleY, height: '80px', originY: '50%' }}
      />

      {/* Right panel — detail */}
      <div className="w-1/2 flex items-center justify-start pl-10 md:pl-16 lg:pr-24">
        <motion.div style={{ y: rightY, clipPath: rightClip }} className="max-w-xs md:max-w-md lg:max-w-xl w-full">
          {index === 4 && detailMode === 'detailed' ? (
            <FitCheckDetails />
          ) : (
            <p className="text-base md:text-lg text-gray-300 leading-relaxed font-sans text-balance">
              {detailMode === 'detailed' ? item.longDetail : item.detail}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function WhyPrimuez({ detailMode, setDetailMode }: { detailMode: 'brief' | 'detailed'; setDetailMode: (v: 'brief' | 'detailed') => void }) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (isMobile) {
    return (
      <MobileWhyPrimuez detailMode={detailMode} setDetailMode={setDetailMode} />
    );
  }

  return (
    <div ref={containerRef} style={{ height: `${WHY_ITEMS.length * 70}vh` }} className="relative -mx-4 sm:-mx-6 md:-mx-12">
      <div
        className="sticky top-0 h-screen w-full origin-center overflow-hidden flex items-center"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.6) 0%, rgba(10,10,15,0.97) 15%, rgba(10,10,15,0.97) 85%, rgba(10,10,15,0.6) 100%)' }}
      >
        <div className="relative w-full h-full">
          {WHY_ITEMS.map((item, i) => (
            <WhyPrimuezSlide
              key={i}
              item={item}
              index={i}
              total={WHY_ITEMS.length}
              scrollYProgress={smoothProgress}
              detailMode={detailMode}
            />
          ))}

          {/* Dot nav */}
          <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {WHY_ITEMS.map((_, i) => (
              <WhyPrimuezDot key={i} index={i} total={WHY_ITEMS.length} scrollYProgress={smoothProgress} />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2 pointer-events-none">
            <span className="w-4 h-px bg-gray-700" />
            scroll to explore
            <span className="w-4 h-px bg-gray-700" />
          </div>

          {/* Toggle — at 30% from top: below the site header, above centred slide content */}
          <div className="absolute top-[30%] left-6 md:left-10 z-30 flex bg-[#05060a]/90 border border-white/10 p-1 rounded-xl font-mono text-[9px] tracking-widest uppercase shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setDetailMode('brief')}
              className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${detailMode === 'brief' ? 'bg-indigo-600/30 border border-indigo-500/50 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
            >
              Brief
            </button>
            <button
              onClick={() => setDetailMode('detailed')}
              className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${detailMode === 'detailed' ? 'bg-indigo-600/30 border border-indigo-500/50 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
            >
              Full
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileWhyPrimuez({ detailMode, setDetailMode }: { detailMode: 'brief' | 'detailed'; setDetailMode: (v: 'brief' | 'detailed') => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={containerRef} style={{ height: `${WHY_ITEMS.length * 50}vh` }} className="relative -mx-4 sm:-mx-6 md:-mx-12">
      <div
        className="sticky top-0 h-screen w-full origin-center overflow-hidden flex items-center"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.6) 0%, rgba(10,10,15,0.97) 15%, rgba(10,10,15,0.97) 85%, rgba(10,10,15,0.6) 100%)' }}
      >
        <div className="relative w-full h-full">
          {WHY_ITEMS.map((item, i) => (
            <MobileWhySlide
              key={i}
              item={item}
              index={i}
              total={WHY_ITEMS.length}
              scrollYProgress={smoothProgress}
              detailMode={detailMode}
            />
          ))}

          {/* Dot nav */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {WHY_ITEMS.map((_, i) => (
              <MobileWhyDot key={i} index={i} total={WHY_ITEMS.length} scrollYProgress={smoothProgress} />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2 pointer-events-none">
            <span className="w-3 h-px bg-gray-700" />
            scroll
            <span className="w-3 h-px bg-gray-700" />
          </div>

          {/* Toggle — left side, 15% from top: clears header, above centred content */}
          <div className="absolute top-[15%] left-4 z-30 flex bg-[#05060a]/90 border border-white/10 p-0.5 rounded-xl font-mono text-[8px] tracking-widest uppercase shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setDetailMode('brief')}
              className={`px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-300 ${detailMode === 'brief' ? 'bg-indigo-600/30 border border-indigo-500/50 text-white' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
            >
              Brief
            </button>
            <button
              onClick={() => setDetailMode('detailed')}
              className={`px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-300 ${detailMode === 'detailed' ? 'bg-indigo-600/30 border border-indigo-500/50 text-white' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
            >
              Full
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileWhySlide({
  item, index, total, scrollYProgress, detailMode,
}: {
  item: typeof WHY_ITEMS[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  detailMode: 'brief' | 'detailed';
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const inEnd = start + (end - start) * 0.40;
  const outStart = start + (end - start) * 0.60;

  const isFirst = index === 0;
  const opacityInput  = isFirst ? [outStart, end]         : [start, inEnd, outStart, end];
  const opacityOutput = isFirst ? [1, 0]                  : [0, 1, 1, 0];
  const opacity    = useTransform(scrollYProgress, opacityInput, opacityOutput);
  const titleY     = useTransform(scrollYProgress, [start, inEnd], isFirst ? [0, 0] : [-30, 0]);
  const detailY    = useTransform(scrollYProgress, [start, inEnd], isFirst ? [0, 0] : [30, 0]);
  const lineScaleY = useTransform(scrollYProgress, isFirst ? [start, outStart, end] : [start, inEnd, outStart, end], isFirst ? [1, 1, 0] : [0, 1, 1, 0]);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ opacity }}>
      {/* Title */}
      <motion.div style={{ y: titleY }} className="text-center mb-6">
        <span className="font-mono text-indigo-400 text-xs uppercase tracking-[0.25em] block mb-3">
          {item.num} / 05
        </span>
        <h3
          className="text-2xl sm:text-3xl font-bold text-white leading-tight"
          style={{ whiteSpace: 'pre-line' }}
        >
          {item.title}
        </h3>
      </motion.div>

      {/* Center lock line */}
      <motion.div
        className="w-px bg-indigo-500 mb-6"
        style={{ scaleY: lineScaleY, height: '50px', originY: '50%' }}
      />

      {/* Detail */}
      <motion.div style={{ y: detailY }} className="max-w-xs text-center w-full">
        {index === 4 && detailMode === 'detailed' ? (
          <FitCheckDetails isMobile={true} />
        ) : (
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
            {detailMode === 'detailed' ? item.longDetail : item.detail}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

function MobileWhyDot({
  index, total, scrollYProgress,
}: { index: number; total: number; scrollYProgress: MotionValue<number> }) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollYProgress, (v) => (v >= start && v < end) ? 1 : 0.25);
  const scale = useTransform(scrollYProgress, [start, Math.min(start + 0.05, end), Math.max(end - 0.05, start), end], [1, 1.8, 1.8, 1]);
  return (
    <motion.div
      className="w-1.5 h-1.5 rounded-full bg-indigo-400"
      style={{ opacity, scale }}
    />
  );
}

export default function WhySection() {
  const [detailMode, setDetailMode] = React.useState<'brief' | 'detailed'>('brief');

  return (
    <section id="why-primuez" aria-labelledby="why-heading" className="pt-16 md:pt-32">
      <div className="mb-10">
        <SectionHeader number="03.5" command="> ./why --us" title="Why Primuez?" />
        <h2 id="why-heading" className="sr-only">Why should you choose Primuez over other AI developers and automation engineers?</h2>
        <p className="text-text-muted mt-4 max-w-2xl text-base leading-relaxed">
          Five sharp arguments for working with us — not a pitch deck, just the truth.
          <span className="ml-3 font-mono text-[10px] text-indigo-400/70 uppercase tracking-widest">[ toggle detail level inside ↓ ]</span>
        </p>
      </div>
      <WhyPrimuez detailMode={detailMode} setDetailMode={setDetailMode} />
    </section>
  );
}
