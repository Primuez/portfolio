'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { Link as IconLink, MonitorPlay } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';

interface DropCardProps {
  children: React.ReactNode;
  delay: number;
  initialRotate: number;
  color: 'cyan' | 'red';
}

function DropCard({ children, delay, initialRotate, color }: DropCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 22 });
  
  // Custom tilt transformations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  // Spotlight coordinates
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // 3D tilt coordinates
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);

    // Spotlight coordinates
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rgbColor = color === 'cyan' ? '0, 240, 255' : '239, 68, 68';
  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${spotlightX}px ${spotlightY}px, rgba(${rgbColor}, 0.12), transparent 80%)`;

  const glowBorder = color === 'cyan' ? 'group-hover:border-cyan/30' : 'group-hover:border-red-500/30';

  return (
    <div 
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        initial={{ y: -420, rotate: initialRotate * 4, opacity: 0 }}
        whileInView={{ y: 0, rotate: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 70, damping: 9, mass: 1.1, delay }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="w-full relative group transition-all duration-300"
      >
        {/* Cursor Spotlight Background */}
        <motion.div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{ background: spotlightBg }}
        />

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className={`bg-panel/60 border border-white/[0.06] p-8 rounded-2xl backdrop-blur-lg flex flex-col justify-center items-center text-center font-mono relative overflow-hidden transition-all duration-500 liquid-glass-card ${glowBorder}`}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
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
      aria-labelledby="videos-heading"
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader number="04" command="> ./content --media" title="Video Presentations" />
      <h2 id="videos-heading" className="sr-only">What YouTube videos and playlists has Primuez published on AI automation?</h2>
      <div className="relative mt-12">
        <PhysicsChipsLayer />
        <div className="grid lg:grid-cols-2 gap-8 relative z-0">

          <DropCard delay={0.08} initialRotate={-3} color="cyan">
            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent pointer-events-none"></div>
            <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mb-6 border border-cyan/20">
              <IconLink className="text-cyan animate-pulse" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 font-sans text-white">Automating Your Business & Playlists</h3>
            <p className="text-text-muted mb-8 max-w-sm text-sm">
              Access my curated playlists for complete run-throughs of the autonomous enterprise model, n8n orchestration setups, and advanced system architecture.
            </p>
            <a href="https://www.youtube.com/@Primuez/playlists" target="_blank" rel="noopener noreferrer" className="z-20 flex items-center gap-2 font-mono text-sm tracking-widest uppercase border border-cyan bg-cyan/5 text-cyan px-8 py-4 rounded-xl hover:bg-cyan/15 hover:border-cyan/80 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] backdrop-blur-sm active:scale-95">
              View Playlists
            </a>
          </DropCard>

          <DropCard delay={0.24} initialRotate={2.5} color="red">
            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none"></div>
            <div className="w-16 h-16 bg-cyan/5 rounded-full flex items-center justify-center mb-6 border border-cyan/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <img src="/primuez-icon.svg" alt="Primuez" width={40} height={40} className="rounded-full" />
            </div>
            <h3 className="text-xl font-bold mb-4 font-sans text-white">Subscribe to Primuez</h3>
            <p className="text-text-muted mb-8 max-w-sm text-sm">
              Subscribe for detailed walkthroughs of n8n automation deployments, multi-agent AI setups, and live build sessions from scratch.
            </p>
            <a href="https://youtube.com/@Primuez" target="_blank" rel="noopener noreferrer" className="z-20 flex items-center gap-2 font-mono text-sm tracking-widest uppercase border border-red-500/50 hover:border-red-500 text-red-500 px-8 py-4 rounded-xl hover:bg-red-500/10 transition-colors active:scale-95">
              <MonitorPlay size={16} /> Watch Channel
            </a>
          </DropCard>

        </div>
      </div>
    </motion.section>
  );
}
