'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { MapPin, GraduationCap, Calendar, Languages, Terminal, Activity, Brain } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { ShaderIridescentText } from '@/components/ShaderText';
import { useIsMobile } from '@/hooks/use-mobile';

/* ── Shared card entrance variants ── */
const cardVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const cardTransition = (delay: number) => ({
  duration: 0.75,
  delay,
  ease: [0.16, 1, 0.3, 1] as const,
});

/* ── Double-bezel card wrapper for consistent premium feel ── */
function BezelCard({
  children,
  hoverAccent = 'cyan',
  className = '',
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  hoverAccent?: 'cyan' | 'amber' | 'purple';
  className?: string;
  delay?: number;
  style?: React.CSSProperties & Record<string, any>;
}) {
  const hoverBorder =
    hoverAccent === 'cyan'
      ? 'hover:border-cyan/35'
      : hoverAccent === 'amber'
      ? 'hover:border-amber/35'
      : 'hover:border-purple-500/35';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={cardTransition(delay)}
      style={style}
      className={`group relative rounded-[2rem] bg-white/[0.02] border border-white/[0.06] p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] ${hoverBorder} transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${className}`}
    >
      <div className="rounded-[calc(2rem-0.375rem)] bg-[#05060a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-5 md:p-7 h-full">
        {children}
      </div>
    </motion.div>
  );
}

export const AboutSection: React.FC = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Parallax scroll hooks (always called, conditionally applied) ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 });

  const yColA = useTransform(smoothProgress, [0, 1], [-25, 25]);
  const yColB = useTransform(smoothProgress, [0, 1], [25, -25]);

  const springA = useSpring(yColA, { stiffness: 90, damping: 25 });
  const springB = useSpring(yColB, { stiffness: 90, damping: 25 });

  /* On mobile: no parallax shift, but keep scroll-in entrance animations */
  const yA = isMobile ? 0 : springA;
  const yB = isMobile ? 0 : springB;

  return (
    <motion.section
      id="whoami"
      ref={containerRef}
      className="relative py-20 md:py-36 overflow-hidden"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <SectionHeader number="01" command="> whoami --verbose" title="Architecting Autonomy" />

      {/* ════════════════════════════════════════════════════════════
          Balanced 2-column Bento Grid
          Column A (left):  Intro Card + System Specs
          Column B (right): Telemetry + Operator Creed
          ════════════════════════════════════════════════════════════ */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-12 z-10">

        {/* ╔═══ COLUMN A ═══╗ */}
        <motion.div style={{ y: yA }} className="flex flex-col gap-6 lg:gap-8">

          {/* Card A1: Core Identity */}
          <BezelCard hoverAccent="cyan" delay={0}>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 border-b border-white/[0.04] pb-4 mb-5">
              <span>[ 01 ]</span>
              <span className="text-zinc-300 font-semibold uppercase tracking-wider">autonomic_brain</span>
              <Brain size={14} strokeWidth={1.2} className="text-cyan animate-pulse ml-auto" />
            </div>

            <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-[1.1] font-sans mb-5">
              I am{' '}
              <ShaderIridescentText className="font-bold">
                Rahul Kasturiya
              </ShaderIridescentText>
              <span className="text-zinc-400 block mt-2 text-xl md:text-2xl font-medium">
                Known as Primuez.
              </span>
            </h3>

            <div className="space-y-3 text-zinc-300 text-sm md:text-base leading-relaxed font-sans">
              <p>
                I orchestrate high-availability pipelines that seamlessly tie external tools to central enterprise databases. Inbound streams from IndiaMART flow cleanly into Odoo, sales orders compile automatically, and active follow-up systems run with absolute zero maintenance.
              </p>
              <p className="text-zinc-400 text-xs md:text-sm">
                By nesting <strong className="text-white font-medium">n8n workflow networks</strong>,{' '}
                <strong className="text-white font-medium">autonomous AI sandboxes</strong>, and{' '}
                <strong className="text-white font-medium">Cloudflare Edge workers</strong>, I solve workflow bottlenecks at the architectural level.
              </p>
            </div>
          </BezelCard>

          {/* Card A2: System Specs (4 compartments) */}
          <BezelCard hoverAccent="amber" delay={0.12}>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 border-b border-white/[0.04] pb-4 mb-5">
              <span>[ 02 ]</span>
              <span className="text-zinc-300 font-semibold uppercase tracking-wider">system_specs</span>
              <Activity size={14} strokeWidth={1.2} className="text-amber animate-pulse ml-auto" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Calendar size={16} strokeWidth={1.2} className="text-cyan" />, label: 'Experience', value: 'AI Automation', sub: 'Since July 2025' },
                { icon: <MapPin size={16} strokeWidth={1.2} className="text-rose-400" />, label: 'Coordinates', value: 'Indore, MP, India', sub: 'Raipur Core Center' },
                { icon: <GraduationCap size={16} strokeWidth={1.2} className="text-purple-400" />, label: 'Education', value: 'KPS · SSIPS (BCA)', sub: 'Systems Foundations' },
                { icon: <Languages size={16} strokeWidth={1.2} className="text-emerald-400" />, label: 'Dialect Compilers', value: 'Hindi · English · Sindhi', sub: 'Multi-channel' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl hover:bg-white/[0.03] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  <div className="mb-2">{item.icon}</div>
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-0.5">{item.label}</span>
                  <span className="text-white text-[11px] md:text-xs font-bold block leading-tight">{item.value}</span>
                  <span className="text-zinc-600 text-[9px] block mt-1">{item.sub}</span>
                </div>
              ))}
            </div>
          </BezelCard>
        </motion.div>

        {/* ╔═══ COLUMN B ═══╗ */}
        <motion.div style={{ y: yB }} className="flex flex-col gap-6 lg:gap-8">

          {/* Card B1: Live Telemetry Status */}
          <BezelCard hoverAccent="cyan" delay={0.06}>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 border-b border-white/[0.04] pb-4 mb-5">
              <span>[ 03 ]</span>
              <span className="text-zinc-300 font-semibold uppercase tracking-wider">live_telemetry</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-auto" />
            </div>

            <div className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans mb-5">
              I build self-governing networks of automation, replacing expensive human latency loops with highly robust agent architectures. My systems think, execute, and self-correct 24/7.
            </div>

            {/* Telemetry Status Lines */}
            <div className="flex flex-col gap-2 p-4 bg-black/40 border border-white/[0.04] rounded-xl font-mono text-[10px] text-zinc-500">
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
              <div className="flex justify-between items-center">
                <span>AUTONOMOUS AGENTS:</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3">
                <Brain size={16} className="text-cyan mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Autonomous Agents</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-sans leading-normal">Multi-agent systems executing sandbox verification, file checks, and drift-alert actions 24/7.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Terminal size={16} className="text-amber mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Cron Pipelines</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-sans leading-normal">Distributed long-lived queues managing continuous database synchronizations and state audits.</p>
                </div>
              </div>
            </div>
          </BezelCard>

          {/* Card B2: Operator Creed */}
          <BezelCard hoverAccent="purple" delay={0.18}>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 border-b border-white/[0.04] pb-4 mb-5">
              <span>[ 04 ]</span>
              <span className="text-zinc-300 font-semibold uppercase tracking-wider">operator_creed</span>
              <Terminal size={14} strokeWidth={1.2} className="text-purple-400 animate-pulse ml-auto" />
            </div>

            <blockquote className="text-zinc-300 italic text-sm md:text-base border-l-2 border-cyan/40 pl-4 py-1 leading-relaxed font-sans mb-4">
              &quot;Self-taught. No CS degree. No team. Everything here was built by directly doing — from central India, one working pipeline at a time.&quot;
            </blockquote>
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-sans">
              I believe in engineering working blueprints over theoretical ideals. Production deployments should be resilient, scalable, and completely autonomic.
            </p>

            {/* ASCII terminal creed */}
            <div className="mt-5 bg-black/50 p-4 rounded-xl border border-white/[0.03] font-mono text-[10px] text-zinc-400 space-y-1.5">
              <div className="text-emerald-400 font-semibold">$&gt; primuez --execute-creed</div>
              <div>[SUCCESS] PRACTICALITY_OVER_HYPOTHESIS = TRUE</div>
              <div>[SUCCESS] BARE_METAL_AUTONOMY = ACTIVE</div>
              <div className="text-zinc-600">// Raipur Core Integration // रायपुर, छ.ग.</div>
            </div>

            <div className="mt-5 border-t border-white/[0.04] pt-3 font-mono text-[9px] text-zinc-600 text-right">
              EXECUTION OVER THEORY // 2026
            </div>
          </BezelCard>
        </motion.div>
      </div>
    </motion.section>
  );
};
