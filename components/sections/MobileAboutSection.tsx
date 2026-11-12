'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Languages, 
  Terminal, 
  Activity, 
  Brain, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Server
} from 'lucide-react';
import { ShaderIridescentText } from '@/components/ShaderText';

export const MobileAboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  const [activeCard, setActiveCard] = useState<number>(1);

  // Smooth scroll to card on quick pill tap
  const scrollToCard = (ref: React.RefObject<HTMLDivElement | null>, num: number) => {
    setActiveCard(num);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Hardware-accelerated entrance animation for cards
  const cardMotion = {
    initial: { opacity: 0, y: 22, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-6 select-none relative pb-6">
      {/* ── STICKY QUICK-JUMP SCRUBBER ── */}
      <div className="sticky top-16 z-20 -mx-1 px-1 py-1.5 backdrop-blur-xl bg-[#05060a]/85 border-y border-white/[0.06] rounded-xl flex items-center justify-between gap-1 overflow-x-auto no-scrollbar shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
        {[
          { num: 1, label: 'Core', ref: card1Ref },
          { num: 2, label: 'Specs', ref: card2Ref },
          { num: 3, label: 'Telemetry', ref: card3Ref },
          { num: 4, label: 'Creed', ref: card4Ref },
        ].map((item) => (
          <button
            key={item.num}
            onClick={() => scrollToCard(item.ref, item.num)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5 whitespace-nowrap ${
              activeCard === item.num
                ? 'bg-cyan text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.04]'
            }`}
          >
            <span className={activeCard === item.num ? 'text-black/80' : 'text-cyan'}>0{item.num}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── CYBER RAIL CONTAINER ── */}
      <div className="relative pl-5 sm:pl-6 border-l border-cyan/20 ml-2 sm:ml-3 flex flex-col gap-5">
        
        {/* Glow bead on the rail */}
        <div className="absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_10px_#00f0ff] animate-pulse" />

        {/* ── CARD 1: Identity & Core Profile ── */}
        <motion.div
          ref={card1Ref}
          onViewportEnter={() => setActiveCard(1)}
          {...cardMotion}
          className="rounded-2xl bg-[#06080e]/95 border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan via-amber/80 to-transparent" />
          
          {/* Header Tag */}
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-b border-white/[0.06] pb-3 mb-4">
            <span className="text-cyan font-bold tracking-wider">[ 01 ] // AUTONOMIC_CORE</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RAIPUR CORE
            </span>
          </div>

          {/* Name & Title */}
          <h3 className="text-2xl font-bold tracking-tight text-white leading-tight font-sans mb-1.5">
            I am{' '}
            <ShaderIridescentText className="font-bold">
              Rahul Kasturiya
            </ShaderIridescentText>
            <span className="text-zinc-400 block text-sm font-medium mt-0.5">
              Known as Primuez.
            </span>
          </h3>

          {/* Bio Copy */}
          <p className="text-zinc-300 text-xs leading-relaxed font-sans mb-4">
            Self-taught automation engineer building multi-agent systems and production n8n workflows that eliminate manual work. Shipped live SaaS products (InkTwin &amp; PrimuezSure) — zero theoretical slides, pure deployed code.
          </p>

          {/* Proof of Work Badges */}
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
            <span className="bg-cyan/10 border border-cyan/30 text-cyan px-2.5 py-1 rounded-md flex items-center gap-1.5 font-bold">
              <Zap size={11} /> 10+ Systems 24/7
            </span>
            <span className="bg-amber/10 border border-amber/30 text-amber px-2.5 py-1 rounded-md flex items-center gap-1.5 font-bold">
              <Cpu size={11} /> Multi-Agent Architect
            </span>
            <span className="bg-white/[0.04] border border-white/10 text-zinc-300 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-emerald-400" /> BCA · Oracle AI
            </span>
          </div>
        </motion.div>

        {/* ── CARD 2: System Specs ── */}
        <motion.div
          ref={card2Ref}
          onViewportEnter={() => setActiveCard(2)}
          {...cardMotion}
          className="rounded-2xl bg-[#06080e]/95 border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber via-cyan/60 to-transparent" />

          {/* Header Tag */}
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-b border-white/[0.06] pb-3 mb-3.5">
            <span className="text-amber font-bold tracking-wider">[ 02 ] // SYSTEM_SPECS</span>
            <span className="flex items-center gap-1 text-zinc-400 text-[10px]">
              <Activity size={12} className="text-amber animate-pulse" /> OPERATIONAL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: <Calendar size={16} className="text-cyan" />, label: 'Experience', value: 'AI Automation', sub: 'Since July 2025' },
              { icon: <MapPin size={16} className="text-rose-400" />, label: 'Coordinates', value: 'Raipur, CG', sub: 'India (Central Hub)' },
              { icon: <GraduationCap size={16} className="text-purple-400" />, label: 'Education', value: 'KPS · SSIPS', sub: 'BCA Foundations' },
              { icon: <Languages size={16} className="text-emerald-400" />, label: 'Languages', value: 'Hindi · English', sub: 'Sindhi (Multi-channel)' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col justify-between"
              >
                <div className="mb-2">{item.icon}</div>
                <span className="text-cyan/70 font-mono text-[9px] uppercase tracking-widest block mb-0.5">{item.label}</span>
                <span className="text-white text-xs font-bold block leading-tight">{item.value}</span>
                <span className="text-zinc-400 text-[9px] block mt-1">{item.sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CARD 3: Live Telemetry ── */}
        <motion.div
          ref={card3Ref}
          onViewportEnter={() => setActiveCard(3)}
          {...cardMotion}
          className="rounded-2xl bg-[#06080e]/95 border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 via-cyan to-transparent" />

          {/* Header Tag */}
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-b border-white/[0.06] pb-3 mb-3.5">
            <span className="text-emerald-400 font-bold tracking-wider">[ 03 ] // LIVE_TELEMETRY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="p-3.5 bg-black/60 border border-white/[0.06] rounded-xl font-mono text-[10px] space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">STATUS:</span>
              <span className="text-cyan font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping" />
                ACTIVE ENGINE
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">COORDINATES:</span>
              <span className="text-white">RAIPUR CORE // INDIA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">INFRASTRUCTURE:</span>
              <span className="text-white font-bold">VPS // DOCKER // TRAEFIK</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">PIPELINES:</span>
              <span className="text-amber font-bold">NOMINAL &amp; RUNNING</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">AUTONOMOUS AGENTS:</span>
              <span className="text-emerald-400 font-bold">ONLINE &amp; AUDITING</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 font-mono text-cyan font-bold mb-1">
                <Brain size={12} /> Autonomous Agents
              </div>
              <p className="text-zinc-400 font-sans leading-tight text-[9px]">
                Sandbox checks, file audits &amp; drift recovery 24/7.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 font-mono text-amber font-bold mb-1">
                <Server size={12} /> Cron Pipelines
              </div>
              <p className="text-zinc-400 font-sans leading-tight text-[9px]">
                Distributed queues &amp; continuous state sync.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── CARD 4: Operator Creed ── */}
        <motion.div
          ref={card4Ref}
          onViewportEnter={() => setActiveCard(4)}
          {...cardMotion}
          className="rounded-2xl bg-[#06080e]/95 border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-400 via-cyan to-transparent" />

          {/* Header Tag */}
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-b border-white/[0.06] pb-3 mb-3.5">
            <span className="text-purple-400 font-bold tracking-wider">[ 04 ] // OPERATOR_CREED</span>
            <Terminal size={13} className="text-purple-400 animate-pulse" />
          </div>

          <blockquote className="text-white italic text-xs border-l-2 border-cyan/50 pl-3 py-1.5 leading-relaxed font-sans bg-white/[0.02] rounded-r-lg mb-3">
            &quot;Self-taught. No CS degree. No team. Everything here was built by directly doing — from central India, one working pipeline at a time.&quot;
          </blockquote>

          {/* ASCII Terminal Box */}
          <div className="bg-black/60 p-3 rounded-xl border border-white/[0.04] font-mono text-[9px] text-zinc-300 space-y-1">
            <div className="text-emerald-400 font-semibold">$&gt; primuez --execute-creed</div>
            <div>[SUCCESS] PRACTICALITY_OVER_HYPOTHESIS = TRUE</div>
            <div>[SUCCESS] BARE_METAL_AUTONOMY = ACTIVE</div>
            <div className="text-zinc-400">// Raipur Core Integration // रायपुर, छ.ग.</div>
            <div className="text-right text-[8px] text-zinc-500 border-t border-white/[0.04] pt-1 mt-1">
              EXECUTION OVER THEORY // 2026
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
