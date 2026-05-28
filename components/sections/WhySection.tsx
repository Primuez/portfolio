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
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const bg = useTransform(
    scrollYProgress,
    [start, start + step * 0.1, end - step * 0.1, end],
    ['rgba(255,255,255,0.1)', 'rgba(0,240,255,1)', 'rgba(0,240,255,1)', 'rgba(255,255,255,0.1)']
  );

  const shadow = useTransform(
    scrollYProgress,
    [start, start + step * 0.1, end - step * 0.1, end],
    ['0px 0px 0px rgba(0,240,255,0)', '0px 0px 8px rgba(0,240,255,0.8)', '0px 0px 8px rgba(0,240,255,0.8)', '0px 0px 0px rgba(0,240,255,0)']
  );

  return (
    <motion.div
      style={{ backgroundColor: bg, boxShadow: shadow }}
      className="w-1.5 h-1.5 rounded-full"
    />
  );
}

function WhyPrimuezSlide({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: (typeof WHY_ITEMS)[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const opacity = useTransform(scrollYProgress, [start, start + step * 0.08, end - step * 0.08, end], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, start + step * 0.08, end - step * 0.08, end], [40, 0, 0, -40]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col md:flex-row items-center justify-between gap-12 pointer-events-auto"
    >
      <div className="flex-1">
        <span className="font-mono text-cyan text-sm tracking-[0.25em] font-semibold block mb-3">
          [ ARGUMENT {item.num} ]
        </span>
        <h3 className="font-sans font-black text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] tracking-tight whitespace-pre-line">
          {item.title}
        </h3>
      </div>
      <div className="flex-1 max-w-md">
        <p className="text-text-muted text-base md:text-lg lg:text-xl font-mono leading-relaxed">
          {item.detail}
        </p>
      </div>
    </motion.div>
  );
}

function WhyPrimuez() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full">
      <div className="sticky top-[100px] h-[75vh] flex flex-col justify-center overflow-hidden">
        <div className="relative w-full h-[50vh] max-w-5xl mx-auto pointer-events-none">
          {WHY_ITEMS.map((item, i) => (
            <WhyPrimuezSlide
              key={item.num}
              item={item}
              index={i}
              total={WHY_ITEMS.length}
              scrollYProgress={smoothProgress}
            />
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-8">
          {WHY_ITEMS.map((_, i) => (
            <WhyPrimuezDot
              key={i}
              index={i}
              total={WHY_ITEMS.length}
              scrollYProgress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileWhyDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const bg = useTransform(
    scrollYProgress,
    [start, start + step * 0.1, end - step * 0.1, end],
    ['rgba(255,255,255,0.15)', 'rgba(0,240,255,1)', 'rgba(0,240,255,1)', 'rgba(255,255,255,0.15)']
  );

  return (
    <motion.div
      style={{ backgroundColor: bg }}
      className="w-1.5 h-1.5 rounded-full"
    />
  );
}

function MobileWhySlide({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: (typeof WHY_ITEMS)[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + step * 0.08, end - step * 0.08, end],
    [0, 1, 1, 0]
  );
  
  const y = useTransform(
    scrollYProgress,
    [start, start + step * 0.08, end - step * 0.08, end],
    [24, 0, 0, -24]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0 flex flex-col justify-center min-h-[300px] text-center px-4"
    >
      <span className="font-mono text-cyan text-[10px] tracking-[0.3em] uppercase block mb-3">[ Argument {item.num} ]</span>
      <h3 className="font-sans font-black text-2xl text-white leading-tight mb-4 whitespace-pre-line">{item.title}</h3>
      <p className="text-text-muted text-sm font-mono leading-relaxed max-w-sm mx-auto">{item.detail}</p>
    </motion.div>
  );
}

function MobileWhyPrimuez() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full">
      <div className="sticky top-[100px] h-[55vh] flex flex-col justify-between overflow-hidden">
        <div className="relative w-full h-[40vh] pointer-events-none mt-4">
          {WHY_ITEMS.map((item, i) => (
            <MobileWhySlide
              key={item.num}
              item={item}
              index={i}
              total={WHY_ITEMS.length}
              scrollYProgress={smoothProgress}
            />
          ))}
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {WHY_ITEMS.map((_, i) => (
            <MobileWhyDot
              key={i}
              index={i}
              total={WHY_ITEMS.length}
              scrollYProgress={smoothProgress}
            />
          ))}
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
      <p className="text-text-muted mt-4 mb-10 max-w-2xl text-base leading-relaxed">
        Four sharp arguments for working with us — not a pitch deck, just the truth.
      </p>
      {isMobile ? <MobileWhyPrimuez /> : <WhyPrimuez />}
    </section>
  );
}
