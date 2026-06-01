'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { MapPin, GraduationCap, Calendar, Languages, Terminal, Activity, Brain } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { ShaderIridescentText } from '@/components/ShaderText';
import { useIsMobile } from '@/hooks/use-mobile';

/* ── Spectacular 3D vault-door swing entrance variants ── */
const cardA1Variants = {
  hidden: { opacity: 0, x: -100, rotateY: 18, scale: 0.9, transformOrigin: 'left center' },
  visible: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
};

const cardA2Variants = {
  hidden: { opacity: 0, y: 100, rotateX: 18, scale: 0.9, transformOrigin: 'bottom center' },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
};

const cardB1Variants = {
  hidden: { opacity: 0, x: 100, rotateY: -18, scale: 0.9, transformOrigin: 'right center' },
  visible: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
};

const cardB2Variants = {
  hidden: { opacity: 0, y: 100, rotateX: 18, scale: 0.9, transformOrigin: 'bottom center' },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
};

const cardTransition = (delay: number) => ({
  duration: 1.1,
  delay,
  ease: [0.16, 1, 0.3, 1] as const,
});

export const AboutSection: React.FC = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Parallax scroll hooks (always called unconditionally) ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 24, restDelta: 0.001 });

  // Dramatic parallax range on desktop
  const yColA = useTransform(smoothProgress, [0, 1], [-160, 160]);
  const yColB = useTransform(smoothProgress, [0, 1], [160, -160]);

  const springA = useSpring(yColA, { stiffness: 50, damping: 24 });
  const springB = useSpring(yColB, { stiffness: 50, damping: 24 });

  const yA = isMobile ? 0 : springA;
  const yB = isMobile ? 0 : springB;

  // Individual Card Differential Parallax on Mobile to prevent card overlaps and create floating depth
  const yCardA1Val = useTransform(smoothProgress, [0, 1], [-45, 45]);
  const yCardA2Val = useTransform(smoothProgress, [0, 1], [-15, 15]);
  const yCardB1Val = useTransform(smoothProgress, [0, 1], [-35, 35]);
  const yCardB2Val = useTransform(smoothProgress, [0, 1], [-5, 5]);

  const yCardA1 = isMobile ? useSpring(yCardA1Val, { stiffness: 70, damping: 20 }) : 0;
  const yCardA2 = isMobile ? useSpring(yCardA2Val, { stiffness: 70, damping: 20 }) : 0;
  const yCardB1 = isMobile ? useSpring(yCardB1Val, { stiffness: 70, damping: 20 }) : 0;
  const yCardB2 = isMobile ? useSpring(yCardB2Val, { stiffness: 70, damping: 20 }) : 0;

  return (
    <section
      id="whoami"
      ref={containerRef}
      className="relative py-20 md:py-36 overflow-hidden"
    >
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <SectionHeader number="01" command="> whoami --verbose" title="Architecting Autonomy" />

      {/* ════════════════════════════════════════════════════
          Balanced 2-column Bento Grid
          Column A: Core Identity + System Specs
          Column B: Live Telemetry + Operator Creed
          ════════════════════════════════════════════════════ */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 mt-10 md:mt-12 z-10" style={{ perspective: '1200px' }}>

        {/* ╔═══ COLUMN A ═══╗ */}
        <motion.div style={{ y: yA }} className="flex flex-col gap-5 md:gap-8">

          {/* Card A1: Core Identity — slides in from left */}
          <motion.div
            variants={cardA1Variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={cardTransition(0)}
            style={{ y: yCardA1 }}
            className="group relative rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.02] border border-white/[0.06] p-[1px] sm:p-1 md:p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-cyan/35 transition-colors duration-700"
          >
            <div className="rounded-[calc(1.5rem-0.375rem)] md:rounded-[calc(2rem-0.375rem)] bg-[#05060a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-4 sm:p-6 md:p-7">
              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400/80 border-b border-white/[0.04] pb-3 md:pb-4 mb-4 md:mb-5">
                <span>[ 01 ]</span>
                <span className="text-zinc-200 font-semibold uppercase tracking-wider">autonomic_brain</span>
                <Brain size={14} strokeWidth={1.2} className="text-cyan animate-pulse ml-auto" />
              </div>

              <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-[1.1] font-sans mb-4 md:mb-5">
                I am{' '}
                <ShaderIridescentText className="font-bold">
                  Rahul Kasturiya
                </ShaderIridescentText>
                <span className="text-zinc-300 block mt-2 text-lg md:text-2xl font-medium">
                  Known as Primuez.
                </span>
              </h3>

              <div className="space-y-3 text-zinc-200 text-sm md:text-base leading-relaxed font-sans">
                <p>
                  I orchestrate high-availability pipelines that seamlessly tie external tools to central enterprise databases. Inbound streams from IndiaMART flow cleanly into Odoo, sales orders compile automatically, and follow-up systems run with absolute zero maintenance.
                </p>
                <p className="text-zinc-300/90 text-xs md:text-sm">
                  By nesting <strong className="text-white font-medium">n8n workflow networks</strong>,{' '}
                  <strong className="text-white font-medium">autonomous AI sandboxes</strong>, and{' '}
                  <strong className="text-white font-medium">Cloudflare Edge workers</strong>, I solve workflow bottlenecks at the architectural level.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card A2: System Specs — rises up */}
          <motion.div
            variants={cardA2Variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={cardTransition(0.15)}
            style={{ y: yCardA2 }}
            className="group relative rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.02] border border-white/[0.06] p-[1px] sm:p-1 md:p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-amber/35 transition-colors duration-700"
          >
            <div className="rounded-[calc(1.5rem-0.375rem)] md:rounded-[calc(2rem-0.375rem)] bg-[#05060a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-4 sm:p-6 md:p-7">
              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400/80 border-b border-white/[0.04] pb-3 md:pb-4 mb-4 md:mb-5">
                <span>[ 02 ]</span>
                <span className="text-zinc-200 font-semibold uppercase tracking-wider">system_specs</span>
                <Activity size={14} strokeWidth={1.2} className="text-amber animate-pulse ml-auto" />
              </div>

              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-4">
                {[
                  { icon: <Calendar size={18} strokeWidth={1.2} className="text-cyan" />, label: 'Experience', value: 'AI Automation', sub: 'Since July 2025' },
                  { icon: <MapPin size={18} strokeWidth={1.2} className="text-rose-400" />, label: 'Coordinates', value: 'Indore, MP, India', sub: 'Raipur Core Center' },
                  { icon: <GraduationCap size={18} strokeWidth={1.2} className="text-purple-400" />, label: 'Education', value: 'KPS · SSIPS (BCA)', sub: 'Systems Foundations' },
                  { icon: <Languages size={18} strokeWidth={1.2} className="text-emerald-400" />, label: 'Dialect Compilers', value: 'Hindi · English · Sindhi', sub: 'Multi-channel' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 md:p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl md:rounded-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-cyan/20"
                  >
                    <div className="mb-2">{item.icon}</div>
                    <span className="text-cyan/70 font-mono text-[9px] md:text-[10px] uppercase tracking-widest block mb-0.5">{item.label}</span>
                    <span className="text-white text-xs md:text-sm font-bold block leading-tight">{item.value}</span>
                    <span className="text-zinc-400 text-[9px] md:text-[10px] block mt-1">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ╔═══ COLUMN B ═══╗ */}
        <motion.div style={{ y: yB }} className="flex flex-col gap-5 md:gap-8">

          {/* Card B1: Live Telemetry — slides in from right */}
          <motion.div
            variants={cardB1Variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={cardTransition(0.08)}
            style={{ y: yCardB1 }}
            className="group relative rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.02] border border-white/[0.06] p-[1px] sm:p-1 md:p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-cyan/35 transition-colors duration-700"
          >
            <div className="rounded-[calc(1.5rem-0.375rem)] md:rounded-[calc(2rem-0.375rem)] bg-[#05060a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-4 sm:p-6 md:p-7">
              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400/80 border-b border-white/[0.04] pb-3 md:pb-4 mb-4 md:mb-5">
                <span>[ 03 ]</span>
                <span className="text-zinc-200 font-semibold uppercase tracking-wider">live_telemetry</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-auto" />
              </div>

              <div className="text-zinc-200 text-sm md:text-base leading-relaxed font-sans mb-4 md:mb-5">
                I build self-governing networks of automation, replacing expensive human latency loops with highly robust agent architectures. My systems think, execute, and self-correct 24/7.
              </div>

              {/* Telemetry Status Lines */}
              <div className="flex flex-col gap-2 p-3 md:p-4 bg-black/40 border border-white/[0.04] rounded-xl font-mono text-[10px] md:text-[11px] text-zinc-300">
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
                  <span>INFRASTRUCTURE:</span>
                  <span className="text-white font-bold text-cyan/90">VPS // DOCKER // TRAEFIK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>ACTIVE PIPELINES:</span>
                  <span className="text-amber">NOMINAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AUTONOMOUS AGENTS:</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
              </div>

              <div className="mt-4 md:mt-5 space-y-3">
                <div className="flex items-start gap-3">
                  <Brain size={16} className="text-cyan mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Autonomous Agents</h4>
                    <p className="text-[10px] text-zinc-300 mt-0.5 font-sans leading-normal">Multi-agent systems executing sandbox verification, file checks, and drift-alert actions 24/7.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Terminal size={16} className="text-amber mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Cron Pipelines</h4>
                    <p className="text-[10px] text-zinc-300 mt-0.5 font-sans leading-normal">Distributed long-lived queues managing continuous database synchronizations and state audits.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card B2: Operator Creed — slides in from right */}
          <motion.div
            variants={cardB2Variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={cardTransition(0.22)}
            style={{ y: yCardB2 }}
            className="group relative rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.02] border border-white/[0.06] p-[1px] sm:p-1 md:p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-purple-500/35 transition-colors duration-700"
          >
            <div className="rounded-[calc(1.5rem-0.375rem)] md:rounded-[calc(2rem-0.375rem)] bg-[#05060a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-4 sm:p-6 md:p-7">
              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400/80 border-b border-white/[0.04] pb-3 md:pb-4 mb-4 md:mb-5">
                <span>[ 04 ]</span>
                <span className="text-zinc-200 font-semibold uppercase tracking-wider">operator_creed</span>
                <Terminal size={14} strokeWidth={1.2} className="text-purple-400 animate-pulse ml-auto" />
              </div>

              <blockquote className="text-white italic text-sm md:text-base border-l-2 border-cyan/40 pl-4 py-1 leading-relaxed font-sans mb-4">
                &quot;Self-taught. No CS degree. No team. Everything here was built by directly doing — from central India, one working pipeline at a time.&quot;
              </blockquote>
              <p className="text-zinc-200 text-xs md:text-sm leading-relaxed font-sans">
                I believe in engineering working blueprints over theoretical ideals. Production deployments should be resilient, scalable, and completely autonomic.
              </p>

              {/* ASCII terminal creed */}
              <div className="mt-4 md:mt-5 bg-black/50 p-3 md:p-4 rounded-xl border border-white/[0.03] font-mono text-[10px] text-zinc-300 space-y-1.5">
                <div className="text-emerald-400 font-semibold">$&gt; primuez --execute-creed</div>
                <div>[SUCCESS] PRACTICALITY_OVER_HYPOTHESIS = TRUE</div>
                <div>[SUCCESS] BARE_METAL_AUTONOMY = ACTIVE</div>
                <div className="text-zinc-400">// Raipur Core Integration // रायपुर, छ.ग.</div>
              </div>

              <div className="mt-4 md:mt-5 border-t border-white/[0.04] pt-3 font-mono text-[9px] text-zinc-500 text-right">
                EXECUTION OVER THEORY // 2026
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
