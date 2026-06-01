'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { MapPin, GraduationCap, Calendar, Languages, Terminal, Activity, Brain } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { ShaderIridescentText } from '@/components/ShaderText';
import { useIsMobile } from '@/hooks/use-mobile';

export const AboutSection: React.FC = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom parallax scroll progress (called unconditionally to comply with React Hook Rules)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 });

  // Custom staggered scroll transformations for cards to create haptic depth
  const yLeft = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const yRight1 = useTransform(smoothProgress, [0, 1], [-50, 50]);
  const yRight2 = useTransform(smoothProgress, [0, 1], [-10, 10]);
  const yRight3 = useTransform(smoothProgress, [0, 1], [30, -30]);

  const springLeft = useSpring(yLeft, { stiffness: 90, damping: 25 });
  const springRight1 = useSpring(yRight1, { stiffness: 90, damping: 25 });
  const springRight2 = useSpring(yRight2, { stiffness: 90, damping: 25 });
  const springRight3 = useSpring(yRight3, { stiffness: 90, damping: 25 });

  // Mobile bypass (prevent parallax reflows on small viewport touches)
  const yL = isMobile ? 0 : springLeft;
  const yR1 = isMobile ? 0 : springRight1;
  const yR2 = isMobile ? 0 : springRight2;
  const yR3 = isMobile ? 0 : springRight3;

  return (
    <motion.section 
      id="whoami" 
      ref={containerRef}
      className="relative py-24 md:py-36 overflow-hidden"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Background Glowing Radial Mesh Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <SectionHeader number="01" command="> whoami --verbose" title="Architecting Autonomy" />
      
      {/* Editorial Split Layout Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-12 z-10">
        
        {/* Left Column: Sticky Core Info & Huge Typography */}
        <motion.div
          style={{ y: yL }}
          className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em] font-semibold">
              system_operator_profile
            </span>
          </div>

          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.08] font-sans">
            I am <ShaderIridescentText className="font-bold block lg:inline">Rahul Kasturiya</ShaderIridescentText> 
            <span className="text-zinc-400 block mt-2 text-2xl md:text-3xl font-medium">Known as Primuez.</span>
          </h3>

          <div className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans mt-4 max-w-md">
            I build self-governing networks of automation, replacing expensive human latency loops with highly robust agent architectures. My systems think, execute, and self-correct 24/7.
          </div>

          {/* Telemetry Status Bar */}
          <div className="flex flex-col gap-2 p-4 bg-[#050608]/85 border border-white/[0.05] rounded-2xl font-mono text-[10px] text-zinc-500 max-w-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
            <div className="flex justify-between items-center">
              <span>STATUS:</span>
              <span className="text-cyan font-bold flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan animate-ping" />
                ACTIVE ENGINE
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>COORDINATES:</span>
              <span className="text-white">RAIPUR CORE // INDIA</span>
            </div>
            <div className="flex justify-between items-center">
              <span>ACTIVE PIPELINES:</span>
              <span className="text-amber">NOMINAL</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Cascading Double-Bezel Hardware-like Cards */}
        <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12">
          
          {/* Card 1: Autonomic Brain */}
          <motion.div
            style={{ y: yR1 }}
            className="group relative rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-cyan/35 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[#05060a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span>[ 01 ]</span>
                  <span className="text-zinc-300 font-semibold uppercase tracking-wider">autonomic_brain</span>
                </div>
                <Brain size={16} strokeWidth={1.2} className="text-cyan animate-pulse" />
              </div>

              <div className="space-y-4 text-zinc-300 text-sm md:text-base leading-relaxed font-sans">
                <p>
                  I orchestrate high-availability pipelines that seamlessly tie external tools to central enterprise databases. Inbound streams from IndiaMART flow cleanly into Odoo, sales orders compile automatically, and active follow-up systems run with absolute zero maintenance.
                </p>
                <p className="text-zinc-400 text-xs md:text-sm">
                  By nesting <strong className="text-white font-medium">n8n workflow networks</strong>, <strong className="text-white font-medium">autonomous AI sandboxes</strong>, and <strong className="text-white font-medium">Cloudflare Edge workers</strong>, I solve workflow bottlenecks at the architectural level.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: System Specs (Compartments) */}
          <motion.div
            style={{ y: yR2 }}
            className="group relative rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-amber/35 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[#05060a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span>[ 02 ]</span>
                  <span className="text-zinc-300 font-semibold uppercase tracking-wider">system_specs</span>
                </div>
                <Activity size={16} strokeWidth={1.2} className="text-amber animate-pulse" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Experience */}
                <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col justify-between">
                  <div>
                    <Calendar size={18} strokeWidth={1.2} className="text-cyan mb-3" />
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest block mb-1">Experience</span>
                    <span className="text-white text-xs md:text-sm font-bold block">AI Automation Architect</span>
                  </div>
                  <span className="text-zinc-500 text-[10px] block mt-2">Since July 2025</span>
                </div>

                {/* Location */}
                <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col justify-between">
                  <div>
                    <MapPin size={18} strokeWidth={1.2} className="text-rose-400 mb-3" />
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest block mb-1">Coordinates</span>
                    <span className="text-white text-xs md:text-sm font-bold block">Indore, MP, India</span>
                  </div>
                  <span className="text-zinc-500 text-[10px] block mt-2">Raipur Core Center</span>
                </div>

                {/* Education */}
                <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col justify-between">
                  <div>
                    <GraduationCap size={18} strokeWidth={1.2} className="text-purple-400 mb-3" />
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest block mb-1">Education</span>
                    <span className="text-white text-xs md:text-sm font-bold block">KPS · SSIPS (BCA)</span>
                  </div>
                  <span className="text-zinc-500 text-[10px] block mt-2">Logic & Systems Foundations</span>
                </div>

                {/* Languages */}
                <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col justify-between">
                  <div>
                    <Languages size={18} strokeWidth={1.2} className="text-emerald-400 mb-3" />
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest block mb-1">Dialect Compilers</span>
                    <span className="text-white text-xs md:text-sm font-bold block">Hindi · English · Sindhi</span>
                  </div>
                  <span className="text-zinc-500 text-[10px] block mt-2">Multi-channel communication</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Creed */}
          <motion.div
            style={{ y: yR3 }}
            className="group relative rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-purple-500/35 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[#05060a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span>[ 03 ]</span>
                  <span className="text-zinc-300 font-semibold uppercase tracking-wider">operator_creed</span>
                </div>
                <Terminal size={16} strokeWidth={1.2} className="text-purple-400 animate-pulse" />
              </div>

              <div className="space-y-4">
                <blockquote className="text-zinc-300 italic text-sm md:text-base border-l-2 border-cyan/40 pl-4 py-1 leading-relaxed font-sans">
                  &quot;Self-taught. No CS degree. No team. Everything here was built by directly doing — from central India, one working pipeline at a time.&quot;
                </blockquote>
                <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-sans">
                  I believe in engineering working blueprints over theoretical ideals. Production deployments should be resilient, scalable, and completely autonomic.
                </p>
                
                {/* Ascii terminal visualization */}
                <div className="mt-4 bg-black/50 p-4 rounded-xl border border-white/[0.03] font-mono text-[10px] text-zinc-400 space-y-1.5">
                  <div className="text-emerald-400 font-semibold">$&gt; primuez --execute-creed</div>
                  <div>[SUCCESS] PRACTICALITY_OVER_HYPOTHESIS = TRUE</div>
                  <div>[SUCCESS] BARE_METAL_AUTONOMY = ACTIVE</div>
                  <div className="text-zinc-600">// Raipur Core Integration // रायपुर, छ.ग.</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </motion.section>
  );
};
