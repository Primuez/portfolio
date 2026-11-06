'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Server
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  tag: string;
  color: string;
  message: string;
  latency: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '12:04:19',
    tag: 'INKTWIN',
    color: 'text-cyan',
    message: 'Invoice batch #8104 OCR parsed & validated',
    latency: '342ms',
  },
  {
    id: '2',
    timestamp: '12:04:22',
    tag: 'N8N-CORE',
    color: 'text-amber',
    message: 'ERP webhook -> Inventory state reconciled',
    latency: '189ms',
  },
  {
    id: '3',
    timestamp: '12:04:27',
    tag: 'AI-AGENT',
    color: 'text-emerald-400',
    message: 'Legal/Tax query routed via Gemini reasoning engine',
    latency: '512ms',
  },
  {
    id: '4',
    timestamp: '12:04:31',
    tag: 'ZEPTO-MAIL',
    color: 'text-cyan',
    message: '3-touch B2B lead cadence dispatched',
    latency: '240ms',
  },
  {
    id: '5',
    timestamp: '12:04:36',
    tag: 'SECURITY',
    color: 'text-purple-400',
    message: 'HMAC signature verified on incoming payload',
    latency: '45ms',
  },
];

const nodes = [
  { name: 'Trigger', label: 'Inbound Webhook', icon: Zap, color: 'text-amber', border: 'border-amber/40', bg: 'bg-amber/10' },
  { name: 'AI Reasoner', label: 'Gemini / Claude', icon: Cpu, color: 'text-cyan', border: 'border-cyan/40', bg: 'bg-cyan/10' },
  { name: 'Action Node', label: 'ERP / Database', icon: Server, color: 'text-emerald-400', border: 'border-emerald-400/40', bg: 'bg-emerald-400/10' },
];

export const HeroSystemVisualizer: React.FC = () => {
  const [activeNode, setActiveNode] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<LogEntry[]>(mockLogs.slice(0, 3));
  const [, setLogIndex] = useState(3);
  const [uptimeSeconds, setUptimeSeconds] = useState(86420);

  // Cycle pipeline active step
  useEffect(() => {
    const nodeInterval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 2200);
    return () => clearInterval(nodeInterval);
  }, []);

  // Cycle real-time event logs
  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogIndex((prevIdx) => {
        const nextItem = mockLogs[prevIdx % mockLogs.length];
        const updatedItem = {
          ...nextItem,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date().toTimeString().slice(0, 8),
        };
        setCurrentLogs((prev) => [updatedItem, ...prev.slice(0, 2)]);
        return prevIdx + 1;
      });
    }, 3200);
    return () => clearInterval(logInterval);
  }, []);

  // Uptime ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="w-full relative select-none">
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan/20 via-purple-500/10 to-amber/20 blur-xl opacity-60 pointer-events-none" />

      {/* Main Terminal Frame */}
      <div className="relative rounded-2xl border border-cyan/30 bg-[#0d1117]/85 backdrop-blur-xl shadow-[0_0_35px_rgba(0,240,255,0.08)] overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <span className="font-mono text-[11px] text-zinc-400 pl-2 flex items-center gap-1.5">
              <Terminal size={12} className="text-cyan" />
              primuez-mesh // cluster-01
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-emerald-400 font-bold">
              LIVE 24/7
            </span>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06] bg-white/[0.02]">
          <div className="px-3.5 py-2.5">
            <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Mesh Status</div>
            <div className="font-mono text-xs text-white font-bold flex items-center gap-1.5 mt-0.5">
              <ShieldCheck size={13} className="text-cyan" /> NOMINAL
            </div>
          </div>
          <div className="px-3.5 py-2.5">
            <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Avg Execution</div>
            <div className="font-mono text-xs text-cyan font-bold flex items-center gap-1 mt-0.5">
              <Activity size={13} className="text-amber" /> 312ms
            </div>
          </div>
          <div className="px-3.5 py-2.5">
            <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Continuous Uptime</div>
            <div className="font-mono text-xs text-zinc-200 font-bold mt-0.5">
              {formatUptime(uptimeSeconds)}
            </div>
          </div>
        </div>

        {/* Live Pipeline Flow Visualizer */}
        <div className="p-5 border-b border-white/[0.06] bg-black/25">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400 flex items-center gap-1.5">
              <Layers size={12} className="text-cyan" /> Active Pipeline Execution
            </span>
            <span className="font-mono text-[10px] text-zinc-400">10+ Flows Online</span>
          </div>

          <div className="grid grid-cols-3 gap-2 relative">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              const isActive = activeNode === index;
              return (
                <div
                  key={node.name}
                  className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                    isActive 
                      ? `${node.border} ${node.bg} shadow-[0_0_15px_rgba(0,240,255,0.2)] scale-[1.02]` 
                      : 'border-white/10 bg-white/[0.02] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                      0{index + 1}
                    </span>
                    <Icon size={14} className={node.color} />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-white leading-tight">
                      {node.name}
                    </div>
                    <div className="font-mono text-[9px] text-zinc-400 truncate mt-0.5">
                      {node.label}
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="active-node-indicator"
                      className="absolute -bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan via-amber to-cyan rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Event Stream Terminal */}
        <div className="p-4 bg-black/40">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
              <RefreshCw size={11} className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              Live Telemetry Stream
            </span>
            <span className="font-mono text-[9px] text-emerald-400/90 font-bold bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              AUTO-RUN
            </span>
          </div>

          <div className="space-y-2 min-h-[96px]">
            <AnimatePresence initial={false}>
              {currentLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start justify-between gap-2 font-mono text-[11px] leading-relaxed py-1 px-2 rounded bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-zinc-400 text-[10px] shrink-0">{log.timestamp}</span>
                    <span className={`text-[10px] font-bold shrink-0 ${log.color}`}>
                      [{log.tag}]
                    </span>
                    <span className="text-zinc-300 truncate text-[11px]">{log.message}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0 font-mono">
                    {log.latency}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Proof Bar */}
        <div className="px-4 py-2.5 bg-cyan/5 border-t border-cyan/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-cyan" />
            InkTwin & PrimuezSure Engine
          </span>
          <span className="text-cyan font-bold tracking-wider">
            ZERO MANUAL ENTRY
          </span>
        </div>
      </div>
    </div>
  );
};
