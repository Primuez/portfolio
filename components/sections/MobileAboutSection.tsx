'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

type TabType = 'specs' | 'mesh' | 'creed';

const tabs: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'specs', label: 'Specs', icon: Cpu },
  { id: 'mesh', label: 'Live Mesh', icon: Activity },
  { id: 'creed', label: 'Creed', icon: Terminal },
];

export const MobileAboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('specs');

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* ── CARD 1: Identity & Core Profile ── */}
      <div className="rounded-2xl bg-[#06080e]/95 border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
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
          <span className="bg-cyan/10 border border-cyan/30 text-cyan px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Zap size={11} /> 10+ Systems 24/7
          </span>
          <span className="bg-amber/10 border border-amber/30 text-amber px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Cpu size={11} /> Multi-Agent Architect
          </span>
          <span className="bg-white/[0.04] border border-white/10 text-zinc-300 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-emerald-400" /> BCA · Oracle AI
          </span>
        </div>
      </div>

      {/* ── CARD 2: Interactive Cyber Console ── */}
      <div className="rounded-2xl bg-[#06080e]/95 border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {/* Segmented Tab Switcher */}
        <div 
          role="tablist" 
          aria-label="About details" 
          className="grid grid-cols-3 p-1 rounded-xl bg-black/50 border border-white/[0.08] mb-4"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.96] min-h-[40px] ${
                  isActive ? 'text-[#06080e] font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute inset-0 bg-cyan rounded-lg shadow-[0_0_12px_rgba(0,240,255,0.35)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={13} className={isActive ? 'text-[#06080e]' : 'text-cyan'} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-2 gap-2.5"
              >
                {[
                  { icon: <Calendar size={16} className="text-cyan" />, label: 'Experience', value: 'AI Automation', sub: 'Since July 2025' },
                  { icon: <MapPin size={16} className="text-rose-400" />, label: 'Coordinates', value: 'Raipur, CG', sub: 'India' },
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
              </motion.div>
            )}

            {activeTab === 'mesh' && (
              <motion.div
                key="mesh"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {/* Telemetry rows */}
                <div className="p-3.5 bg-black/50 border border-white/[0.06] rounded-xl font-mono text-[10px] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">STATUS:</span>
                    <span className="text-cyan font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping" />
                      ACTIVE ENGINE
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">INFRASTRUCTURE:</span>
                    <span className="text-white font-bold">VPS // DOCKER // TRAEFIK</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">ACTIVE FLOWS:</span>
                    <span className="text-amber font-bold">10+ SYSTEMS RUNNING</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">AUTONOMOUS AGENTS:</span>
                    <span className="text-emerald-400 font-bold">ONLINE &amp; AUDITING</span>
                  </div>
                </div>

                {/* Sub Features */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-1.5 font-mono text-cyan font-bold mb-1">
                      <Brain size={12} /> Autonomous Agents
                    </div>
                    <p className="text-zinc-400 font-sans leading-tight text-[9px]">
                      Sandbox verification &amp; self-correcting routines.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-1.5 font-mono text-amber font-bold mb-1">
                      <Server size={12} /> Cron Pipelines
                    </div>
                    <p className="text-zinc-400 font-sans leading-tight text-[9px]">
                      Distributed queues &amp; 24/7 database syncing.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'creed' && (
              <motion.div
                key="creed"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <blockquote className="text-white italic text-xs border-l-2 border-cyan/50 pl-3 py-1 leading-relaxed font-sans bg-white/[0.02] rounded-r-lg">
                  &quot;Self-taught. No CS degree. No team. Everything here was built by directly doing — from central India, one working pipeline at a time.&quot;
                </blockquote>

                {/* ASCII Terminal Box */}
                <div className="bg-black/60 p-3 rounded-xl border border-white/[0.04] font-mono text-[9px] text-zinc-300 space-y-1">
                  <div className="text-emerald-400 font-semibold">$&gt; primuez --execute-creed</div>
                  <div>[SUCCESS] PRACTICALITY_OVER_HYPOTHESIS = TRUE</div>
                  <div>[SUCCESS] BARE_METAL_AUTONOMY = ACTIVE</div>
                  <div className="text-zinc-400">// Raipur Core Integration // रायपुर, छ.ग.</div>
                  <div className="text-right text-[8px] text-zinc-400 border-t border-white/[0.04] pt-1 mt-1">
                    EXECUTION OVER THEORY // 2026
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
