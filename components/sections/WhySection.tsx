'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'motion/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from '@/components/SectionHeader';

const WHY_ITEMS = [
  {
    num: '01',
    title: 'We Ship,\nNot Just Plan',
    detail: "Real products. Live URLs. InkTwin and PrimuezSure aren't concepts on a slide deck — they're deployed, working SaaS tools built by a solo developer from Raipur.",
  },
  {
    num: '02',
    title: 'Automation-First\nThinking',
    detail: 'Every solution starts with: what can be automated? Powered by n8n, LLMs, autonomous agents, and custom API pipelines — we remove the manual work before it becomes your problem.',
  },
  {
    num: '03',
    title: 'Certified &\nSelf-Taught',
    detail: "n8n Official Badge Holder. SimpliLearn Certified. But more importantly — everything here was built by doing, not just studying.",
  },
  {
    num: '04',
    title: 'Young, Hungry\n& Agile',
    detail: "Still in college, already running a SaaS brand. Zero bureaucratic red tape. That means faster turnaround, lower overhead, and direct access to the architect.",
  },
];

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
  item, index, total, scrollYProgress,
}: {
  item: typeof WHY_ITEMS[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const inEnd = start + (end - start) * 0.40;
  const outStart = start + (end - start) * 0.60;

  const isFirst = index === 0;
  const opacityInput  = isFirst ? [outStart, end]         : [start, inEnd, outStart, end];
  const opacityOutput = isFirst ? [1, 0]                  : [0, 1, 1, 0];
  const opacity    = useTransform(scrollYProgress, opacityInput, opacityOutput);
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
            {item.num} / 04
          </span>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-sans"
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
      <div className="w-1/2 flex items-center justify-start pl-10 md:pl-16 lg:pl-24">
        <motion.div style={{ y: rightY, clipPath: rightClip }} className="max-w-xs md:max-w-sm">
          <p className="text-base md:text-lg text-gray-300 leading-relaxed font-sans">
            {item.detail}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function WhyPrimuez() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 45, restDelta: 0.001 });

  return (
    <div ref={containerRef} style={{ height: `${WHY_ITEMS.length * 100}vh` }} className="relative -mx-4 sm:-mx-6">
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
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
        </div>
      </div>
    </div>
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

function MobileWhySlide({
  item, index, total, scrollYProgress,
}: {
  item: typeof WHY_ITEMS[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
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
          {item.num} / 04
        </span>
        <h3
          className="text-2xl sm:text-3xl font-bold text-white leading-tight font-sans"
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
      <motion.div style={{ y: detailY }} className="max-w-xs text-center">
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
          {item.detail}
        </p>
      </motion.div>
    </motion.div>
  );
}

function MobileWhyPrimuez() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 40, restDelta: 0.001 });

  return (
    <div ref={containerRef} style={{ height: `${WHY_ITEMS.length * 50}vh` }} className="relative -mx-4 sm:-mx-6">
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
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
        </div>
      </div>
    </div>
  );
}

export default function WhySection() {
  const isMobile = useIsMobile();

  return (
    <section id="why-primuez" className="pt-16 md:pt-32">
      <SectionHeader number="03.5" command="> ./why --us" title="Why Primuez?" />
      <p className="text-text-muted mt-4 mb-10 max-w-2xl text-base leading-relaxed font-sans">
        Four sharp arguments for working with us — not a pitch deck, just the truth.
      </p>
      {isMobile ? <MobileWhyPrimuez /> : <WhyPrimuez />}
    </section>
  );
}
