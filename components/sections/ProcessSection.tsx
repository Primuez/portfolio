'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'motion/react';
import { HowWeWorkBackground } from '@/components/HowWeWorkBackground';
import { SectionHeader } from '@/components/SectionHeader';

function ProcessStep({ step, title, desc, icon }: { step: string; title: string; desc: string; icon: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px', once: true });

  return (
    <div ref={ref} className="relative flex items-start">
      {/* Dot on spine - desktop only */}
      <div
        className={`hidden md:block absolute left-5 top-5 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
          inView
            ? 'border-cyan bg-cyan/20 shadow-[0_0_12px_rgba(0,255,255,0.6)]'
            : 'border-zinc-600 bg-zinc-900'
        }`}
      />
      {/* Card */}
      <motion.div
        className="ml-0 md:ml-20 w-full p-5 border border-cyan/15 rounded-lg bg-[#0a0f1a]/70 backdrop-blur-sm cursor-default"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 16 }}
        whileHover={{ 
          scale: 1.015, 
          borderColor: 'rgba(0, 240, 255, 0.35)', 
          boxShadow: '0 8px 30px rgba(0, 240, 255, 0.08)' 
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5 select-none">{icon}</span>
          <div>
            <span className="font-mono text-cyan text-xs font-bold">{step}</span>
            <h4 className="font-bold text-white text-sm mt-1 mb-1">{title}</h4>
            <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProcessSection() {
  const processRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: processScrollY } = useScroll({ target: processRef, offset: ['start 0.8', 'end 0.2'] });
  const smoothScrollY = useSpring(processScrollY, { stiffness: 80, damping: 25, restDelta: 0.001 });
  const lineScale = useTransform(smoothScrollY, [0, 1], [0, 1]);

  return (
    <motion.section
      id="process"
      className="pt-16 md:pt-32 relative overflow-hidden"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <HowWeWorkBackground />
      <div ref={processRef} className="relative z-10">
        <SectionHeader number="03.1" command="> ./process --steps" title="How We Usually Work Together" />
        <div className="mt-12 relative max-w-3xl">
          {/* Spine - desktop only */}
          <div className="hidden md:block">
            {/* Grey track */}
            <div className="absolute left-7 top-10 bottom-10 w-px bg-white/10" />
            {/* Cyan fill */}
            <motion.div
              className="absolute left-7 top-10 bottom-10 w-px bg-gradient-to-b from-cyan to-cyan/20"
              style={{ scaleY: lineScale, transformOrigin: 'top' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-8 md:space-y-10">
            {[
              { step: '01', title: 'Discovery', desc: 'You describe your goal or the process that’s slowing you down.', icon: '◎' },
              { step: '02', title: 'Proposal', desc: 'I send a clear scope with a fixed price. No hourly surprises. (1–2 days)', icon: '▤' },
              { step: '03', title: 'Build & Iterate', desc: 'I build in small iterations and share progress with you throughout.', icon: '⟳' },
              { step: '04', title: 'Handover', desc: 'Live system + full documentation + a training session so you own it completely.', icon: '↗' },
              { step: '05', title: 'Support', desc: '30 days of free bug fixes and adjustments included after launch.', icon: '❖' },
            ].map(({ step, title, desc, icon }) => (
              <ProcessStep key={step} step={step} title={title} desc={desc} icon={icon} />
            ))}
          </div>
        </div>
        <p className="mt-8 font-mono text-xs text-text-muted tracking-widest uppercase">[ Most projects go live in 1–4 weeks. ]</p>
      </div>
    </motion.section>
  );
}
