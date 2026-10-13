'use client';

import React, { useRef } from 'react';
import { motion, useTransform, useInView, useSpring } from 'motion/react';
import { useScrollTarget } from '@/hooks/use-scroll-target';
import { HowWeWorkBackground } from '@/components/HowWeWorkBackground';
import { SectionHeader } from '@/components/SectionHeader';
import { useIsMobile } from '@/hooks/use-mobile';

const STEPS = [
  { step: '01', title: 'Discovery', desc: "You describe your goal or the process that's slowing you down.", icon: '◎' },
  { step: '02', title: 'Proposal', desc: 'I send a clear scope with a fixed price. No hourly surprises. (1–2 days)', icon: '▤' },
  { step: '03', title: 'Build & Iterate', desc: 'I build in small iterations and share progress with you throughout.', icon: '⟳' },
  { step: '04', title: 'Handover', desc: 'Live system + full documentation + a training session so you own it completely.', icon: '↗' },
  { step: '05', title: 'Support', desc: '30 days of free bug fixes and adjustments included after launch.', icon: '❖' },
];

function ProcessStep({ step, title, desc, icon, isLast }: { step: string; title: string; desc: string; icon: string; isLast?: boolean }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: isMobile ? '50px 0px 50px 0px' : '-20% 0px -20% 0px', once: isMobile });

  const active = isMobile || inView;

  return (
    <div ref={ref} className="relative flex items-start gap-0">
      {/* ── Mobile left track: badge only (line is in the parent container) ── */}
      <div className="flex md:hidden flex-col items-center mr-4 mt-0.5 shrink-0">
        <div
          className="w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold z-10 select-none bg-[#090b11] border-cyan/60 text-cyan shadow-[0_0_8px_rgba(0,240,255,0.3)]"
        >
          {step}
        </div>
      </div>

      {/* ── Desktop spine dot ── */}
      <div
        className={`hidden md:block absolute left-5 top-5 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
          inView
            ? 'border-cyan bg-cyan/20 shadow-[0_0_12px_rgba(0,255,255,0.6)] scale-110'
            : 'border-zinc-600 bg-zinc-900 scale-100'
        }`}
      >
        {inView && (
          <span className="absolute inset-0 rounded-full bg-cyan/40 animate-ping opacity-75" />
        )}
      </div>

      {/* Card */}
      <motion.div
        className={`ml-0 md:ml-20 w-full p-5 border rounded-lg ${isMobile ? 'bg-panel/90 border-white/[0.08]' : 'bg-[#0a0f1a]/70 backdrop-blur-sm'} cursor-default transition-all duration-300`}
        initial={isMobile ? false : { opacity: 0.35, x: 8 }}
        animate={isMobile ? { opacity: 1, x: 0 } : {
          opacity: inView ? 1 : 0.35,
          x: inView ? 0 : 8,
          borderColor: inView ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 255, 255, 0.06)',
          boxShadow: inView ? '0 0 25px rgba(0, 240, 255, 0.06)' : 'none'
        }}
        whileHover={isMobile ? undefined : {
          scale: 1.015,
          borderColor: 'rgba(0, 240, 255, 0.5)',
          boxShadow: '0 8px 30px rgba(0, 240, 255, 0.12)'
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start gap-3">
          <span
            className="text-lg leading-none mt-0.5 select-none shrink-0"
          >
            {icon}
          </span>
          <div>
            <span className="font-mono text-cyan text-xs font-bold">{step}</span>
            <h4 className="font-bold text-white text-sm mt-1 mb-1">{title}</h4>
            <p className={`text-sm leading-relaxed transition-colors duration-300 ${active ? 'text-zinc-200' : 'text-zinc-400'}`}>{desc}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProcessSection() {
  const isMobile = useIsMobile();
  const { ref: processRef, scrollYProgress: processScrollY } = useScrollTarget<HTMLElement>({ offset: ['start 0.8', 'end 0.2'] });
  const smoothScrollY = useSpring(processScrollY, { stiffness: 80, damping: 25, restDelta: 0.001 });
  const lineScale = useTransform(smoothScrollY, [0, 1], [0, 1]);

  return (
    <motion.section
      id="process"
      aria-labelledby="process-heading"
      className="pt-16 md:pt-32 relative overflow-hidden"
      initial={isMobile ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: isMobile ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: isMobile ? "80px" : "0px" }}
    >
      <HowWeWorkBackground />
      <div ref={processRef} className="relative z-10">
        <SectionHeader number="03.1" command="> ./process --steps" title="How We Usually Work Together" />
        <h2 id="process-heading" className="sr-only">How does the Primuez project engagement process work from discovery to handover?</h2>
        <div className="mt-12 relative max-w-3xl">
          {/* Spine — desktop */}
          <div className="hidden md:block">
            <div className="absolute left-7 top-10 bottom-10 w-px bg-white/10" />
            <motion.div
              className="absolute left-7 top-10 bottom-10 w-px bg-gradient-to-b from-cyan to-cyan/20"
              style={{ scaleY: lineScale, transformOrigin: 'top' }}
            />
          </div>

          {/* Spine — mobile: one continuous line behind all badges */}
          <div className="md:hidden absolute left-3.5 top-3.5 bottom-3.5 w-px bg-white/[0.08] -translate-x-1/2" />
          <motion.div
            className="md:hidden absolute left-3.5 top-3.5 bottom-3.5 w-px bg-gradient-to-b from-cyan/70 via-cyan/30 to-cyan/5 -translate-x-1/2"
            style={{ scaleY: lineScale, transformOrigin: 'top' }}
          />

          {/* Steps */}
          <div className="space-y-8 md:space-y-10">
            {STEPS.map(({ step, title, desc, icon }, idx) => (
              <ProcessStep key={step} step={step} title={title} desc={desc} icon={icon} isLast={idx === STEPS.length - 1} />
            ))}
          </div>
        </div>
        <p className="mt-8 font-mono text-xs text-text-muted tracking-widest uppercase">[ Most projects go live in 1–4 weeks. ]</p>
      </div>
    </motion.section>
  );
}
