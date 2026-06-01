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
  
  // Custom parallax scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 });

  // Columns move slightly differently for premium parallax
  const yLeft = useTransform(smoothProgress, [0, 1], [-40, 40]);
  const yRight = useTransform(smoothProgress, [0, 1], [40, -40]);

  const yL = isMobile ? 0 : useSpring(yLeft, { stiffness: 90, damping: 25 });
  const yR = isMobile ? 0 : useSpring(yRight, { stiffness: 90, damping: 25 });

  return (
    <motion.section 
      id="whoami" 
      ref={containerRef}
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader number="01" command="> whoami --verbose" title="Architecting Autonomy" />
      
      <p className="text-text-muted mt-4 mb-12 max-w-2xl text-base leading-relaxed">
        Turning repetitive business operations into self-correcting, autonomous systems. Built one pipeline at a time.
      </p>

      {/* Cyber Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        
        {/* Core Bio Panel (Left Columns) */}
        <motion.div
          style={{ y: yL }}
          className="lg:col-span-2 flex flex-col p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-[#07090e]/95 backdrop-blur-md 
            shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group hover:border-cyan/20 transition-colors duration-300"
        >
          {/* Subtle Cyber Grid lines inside panel */}
          <div className="absolute inset-0 bg-blueprint opacity-5 pointer-events-none" />
          <div className="absolute inset-[4px] rounded-[14px] border border-white/[0.03] pointer-events-none z-10" />
          
          {/* Screw rivets */}
          <div className="absolute top-3 left-3 w-1 h-1 rounded-full bg-white/10" />
          <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-white/10" />
          <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-white/10" />
          <div className="absolute bottom-3 right-3 w-1 h-1 rounded-full bg-white/10" />

          <div className="text-[10px] font-mono text-cyan uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
            core_biography_kernel
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
            I am <ShaderIridescentText as="span" className="font-bold">Rahul Kasturiya (Primuez)</ShaderIridescentText>
          </h3>

          <div className="space-y-4 text-zinc-300 text-sm md:text-base leading-relaxed font-sans z-20 relative font-normal">
            <p>
              I design autonomous systems that orchestrate tools, adapt to data flows, and execute workflows without manual oversight. Leads flow automatically from IndiaMART into Odoo, invoices reconcile without errors, and follow-ups fire exactly when needed.
            </p>
            <p>
              My stack sits at the center of <strong className="text-cyan font-mono">n8n workflow pipelines</strong>, <strong className="text-white">autonomous LLM agent environments</strong>, and <strong className="text-white">edge serverless environments</strong>. I focus strictly on modularity, zero-maintenance fallback systems, and eliminating human labor loops.
            </p>
            <p className="text-zinc-400">
              I believe in architecting the blueprint before writing code. Systems should be practical first, bulletproof second, and completely autonomous always.
            </p>
          </div>
        </motion.div>

        {/* Live Systems Dashboard Panel (Right Column) */}
        <motion.div
          style={{ y: yR }}
          className="flex flex-col p-6 rounded-2xl border border-white/[0.08] bg-[#07090e]/95 backdrop-blur-md 
            shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group hover:border-amber/20 transition-colors duration-300 justify-between"
        >
          <div className="absolute inset-[4px] rounded-[14px] border border-white/[0.03] pointer-events-none" />
          
          <div>
            <div className="text-[10px] font-mono text-amber uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
              live_telemetry_status
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 border border-white/[0.04] font-mono text-[11px] text-zinc-400 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>SYSTEM STATE:</span>
                <span className="text-emerald-400 font-bold">NOMINAL</span>
              </div>
              <div className="flex justify-between">
                <span>OPERATIONAL RATIO:</span>
                <span className="text-white font-bold">100.0%</span>
              </div>
              <div className="flex justify-between">
                <span>AUTONOMOUS AGENTS:</span>
                <span className="text-cyan font-bold">ACTIVE</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Brain size={18} className="text-cyan mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Autonomous Agents</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 font-sans leading-normal">Multi-agent systems executing sandbox verification, file checks, and drift-alert actions 24/7.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Terminal size={18} className="text-amber mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Cron Pipelines</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 font-sans leading-normal">Distributed long-lived queues managing continuous database synchronizations and state audits.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/[0.04] pt-4 flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">RAIPUR_CORE_v1.0</span>
            <Activity size={12} className="text-emerald-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Info Grid Panel (Bottom Left Columns) */}
        <motion.div
          style={{ y: yL }}
          className="lg:col-span-2 flex flex-col p-6 rounded-2xl border border-white/[0.08] bg-[#07090e]/95 backdrop-blur-md 
            shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group hover:border-cyan/20 transition-colors duration-300"
        >
          <div className="absolute inset-[4px] rounded-[14px] border border-white/[0.03] pointer-events-none" />
          
          <div className="text-[10px] font-mono text-cyan uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
            system_metadata_nodes
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/[0.01] rounded-xl border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
              <GraduationCap size={16} className="text-amber mb-2" />
              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-0.5 font-mono">Education</span>
              <span className="text-zinc-200 text-xs font-bold font-sans">KPS · SSIPS (BCA)</span>
            </div>

            <div className="p-4 bg-white/[0.01] rounded-xl border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
              <Calendar size={16} className="text-cyan mb-2" />
              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-0.5 font-mono">Experience</span>
              <span className="text-zinc-200 text-xs font-bold font-sans flex flex-col"><span>AI Automation</span><span className="text-[10px] text-zinc-400">Since July 2025</span></span>
            </div>

            <div className="p-4 bg-white/[0.01] rounded-xl border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
              <MapPin size={16} className="text-rose-400 mb-2" />
              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-0.5 font-mono">Location</span>
              <span className="text-zinc-200 text-xs font-bold font-sans">Indore, MP, India</span>
            </div>

            <div className="p-4 bg-white/[0.01] rounded-xl border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
              <Languages size={16} className="text-emerald-400 mb-2" />
              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-0.5 font-mono">Languages</span>
              <span className="text-zinc-200 text-xs font-bold font-sans">Hindi · English · Sindhi</span>
            </div>
          </div>
        </motion.div>

        {/* Backstory/Creed Panel (Bottom Right Column) */}
        <motion.div
          style={{ y: yR }}
          className="flex flex-col p-6 rounded-2xl border border-white/[0.08] bg-[#07090e]/95 backdrop-blur-md 
            shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group hover:border-amber/20 transition-colors duration-300 justify-between"
        >
          <div className="absolute inset-[4px] rounded-[14px] border border-white/[0.03] pointer-events-none" />
          
          <div>
            <div className="text-[10px] font-mono text-amber uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
              operator_creed
            </div>
            
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed italic font-sans">
              &quot;Self-taught. No CS degree. No team. Everything here was built by directly doing — from central India, one working pipeline at a time.&quot;
            </p>
          </div>

          <div className="mt-8 border-t border-white/[0.04] pt-4 font-mono text-[9px] text-zinc-600 text-right">
            EXECUTION OVER THEORY // 2026
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};
