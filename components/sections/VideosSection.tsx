'use client';

import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '@/components/SectionHeader';
import { YouTubeThumb } from '@/components/YouTubeThumb';

function DropCard({ children, delay, initialRotate }: { children: React.ReactNode; delay: number; initialRotate: number }) {
  return (
    <motion.div
      initial={{ y: -420, rotate: initialRotate * 4, opacity: 0 }}
      whileInView={{ y: 0, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 8, mass: 1.2, delay }}
      whileHover={{ scale: 1.015, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      {children}
    </motion.div>
  );
}

const PHYSICS_CHIPS: { label: string; color: 'cyan' | 'amber' | 'red'; x: string; y: string; delay: number; desktopOnly?: boolean }[] = [
  // ── Top row: always visible ──────────────────────────────────────
  { label: 'n8n',        color: 'cyan',  x: '2%',  y: '-5%',  delay: 0.10 },
  { label: 'Mistral',    color: 'red',   x: '33%', y: '-5%',  delay: 0.16 },
  { label: 'Supabase',   color: 'amber', x: '62%', y: '-5%',  delay: 0.22 },
  { label: 'Python',     color: 'cyan',  x: '83%', y: '-5%',  delay: 0.28 },
  // ── Top row: desktop-only extras ────────────────────────────────
  { label: 'LangChain',  color: 'cyan',  x: '17%', y: '-2%',  delay: 0.13, desktopOnly: true },
  { label: 'Pinecone',   color: 'amber', x: '47%', y: '-2%',  delay: 0.19, desktopOnly: true },
  { label: 'Ollama',     color: 'cyan',  x: '72%', y: '-2%',  delay: 0.25, desktopOnly: true },
  // ── Side edges: desktop-only ────────────────────────────────────
  { label: 'Redis',      color: 'red',   x: '-1%', y: '32%',  delay: 0.34, desktopOnly: true },
  { label: 'Whisper',    color: 'cyan',  x: '89%', y: '32%',  delay: 0.40, desktopOnly: true },
  { label: 'GPT-4',      color: 'red',   x: '89%', y: '62%',  delay: 0.46, desktopOnly: true },
  // ── Bottom row: always visible ───────────────────────────────────
  { label: 'Docker',     color: 'amber', x: '2%',  y: '103%', delay: 0.52 },
  { label: 'Cloudflare', color: 'amber', x: '33%', y: '103%', delay: 0.56 },
  { label: 'Vercel',     color: 'cyan',  x: '62%', y: '103%', delay: 0.60 },
  { label: 'FastAPI',    color: 'amber', x: '83%', y: '103%', delay: 0.64 },
];

function PhysicsChipsLayer() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none z-10 overflow-visible">
      {PHYSICS_CHIPS.map((c) => (
        <PhysicsChip key={c.label} {...c} />
      ))}
    </div>
  );
}

function PhysicsChip({ label, color, x, y, delay, desktopOnly }: { label: string; color: 'cyan' | 'amber' | 'red'; x: string; y: string; delay: number; desktopOnly?: boolean }) {
  const colorMap = {
    cyan:  'border-cyan/50 text-cyan bg-cyan/10 shadow-[0_0_18px_rgba(0,240,255,0.30)]',
    amber: 'border-amber/50 text-amber bg-amber/10 shadow-[0_0_18px_rgba(255,176,0,0.30)]',
    red:   'border-red-500/50 text-red-400 bg-red-500/10 shadow-[0_0_18px_rgba(239,68,68,0.30)]',
  };
  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: 280, bounceDamping: 14 }}
      whileDrag={{ scale: 1.18, zIndex: 50, rotate: 8 }}
      whileHover={{ scale: 1.1 }}
      initial={{ y: -500, rotate: -30, opacity: 0 }}
      whileInView={{ y: 0, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 9, mass: 1, delay }}
      style={{ left: x, top: y, position: 'absolute', touchAction: 'none' }}
      className={`${desktopOnly ? 'hidden md:flex' : 'flex'} pointer-events-auto select-none cursor-grab active:cursor-grabbing font-mono text-[9px] md:text-[11px] uppercase tracking-widest px-2 md:px-3 py-1 md:py-1.5 rounded-full border backdrop-blur-md whitespace-nowrap items-center ${colorMap[color]}`}
    >
      {label}
    </motion.div>
  );
}

export default function VideosSection() {
  return (
    <motion.section
      id="videos"
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader number="04" command="> ./content --media" title="Video Presentations" />
      <div className="relative mt-12">
        <PhysicsChipsLayer />
        <div className="grid lg:grid-cols-2 gap-8 relative z-0">

          <DropCard delay={0.08} initialRotate={-3}>
            <div className="bg-panel/60 border border-white/[0.06] p-6 rounded-2xl backdrop-blur-lg flex flex-col font-mono relative overflow-hidden group hover:border-cyan/30 transition-all duration-500 liquid-glass-card">
              <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent pointer-events-none"></div>
              
              <YouTubeThumb
                videoId="RzB_7PqR8G0"
                url="https://youtu.be/RzB_7PqR8G0"
                label="Watch n8n Demo"
              />
              
              <h3 className="text-lg font-bold mt-5 mb-2 font-sans text-white text-left">
                n8n Odoo Manufacturing Automation
              </h3>
              <p className="text-text-muted text-xs leading-relaxed text-left font-sans">
                Full demonstration of mapping IndiaMART webhooks to Odoo ERP via custom n8n pipelines, complete with automatic GST checks and WhatsApp invoice routing.
              </p>
            </div>
          </DropCard>

          <DropCard delay={0.24} initialRotate={2.5}>
            <div className="bg-panel/60 border border-white/[0.06] p-6 rounded-2xl backdrop-blur-lg flex flex-col font-mono relative overflow-hidden group hover:border-cyan/30 transition-all duration-500 liquid-glass-card">
              <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none"></div>
              
              <YouTubeThumb
                videoId="hOaV_C8h1Zg"
                url="https://youtu.be/hOaV_C8h1Zg"
                label="Watch Voice Agent Demo"
              />
              
              <h3 className="text-lg font-bold mt-5 mb-2 font-sans text-white text-left">
                InkTwin: Custom AI Voice Agents
              </h3>
              <p className="text-text-muted text-xs leading-relaxed text-left font-sans">
                A walkthrough of building human-sounding, low-latency voice agents that can book calls, query inventory, and trigger background automations while speaking.
              </p>
            </div>
          </DropCard>

        </div>
      </div>
    </motion.section>
  );
}
