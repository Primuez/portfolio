'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
import { Link as IconLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  url?: string;
  desc: string;
  tags: string[];
  logoUrl?: string;
  bannerUrl?: string;
  videoUrl?: string;
  status?: string;
  techDetails?: string;
  children?: React.ReactNode;
  wireframe?: boolean;
}

export function ProjectCard({ name, url, desc, tags, logoUrl, bannerUrl, videoUrl, status, techDetails, children, wireframe }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const [showTech, setShowTech] = useState(false);
  const glowBackground = useMotionTemplate`radial-gradient(300px circle at ${mouseX}% ${mouseY}%, rgba(0,240,255,0.06), transparent 60%)`;
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  if (wireframe) {
    return (
      <div className="border border-dashed border-white/10 bg-transparent rounded-xl p-6 relative flex flex-col min-h-[260px] select-none pointer-events-none">
        <div className="absolute top-3 right-3 font-mono text-[8px] text-zinc-700 tracking-wider">
          PROJ-{name.substring(0, 4).toUpperCase()}
        </div>
        {bannerUrl && (
          <div className="w-full h-48 mb-6 rounded-lg border border-dashed border-white/10 relative bg-transparent flex items-center justify-center">
            <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">[ WIREFRAME_ASSET ]</span>
          </div>
        )}
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <div className="w-11 h-11 rounded-lg border border-dashed border-white/10 flex items-center justify-center shrink-0">
                <span className="font-mono text-[8px] text-zinc-700">WF</span>
              </div>
            )}
            <div>
              <h4 className="text-lg font-bold text-zinc-600 flex items-center gap-2 flex-wrap">
                {name}
                {status && (
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border border-white/5 text-zinc-700">
                    {status}
                  </span>
                )}
              </h4>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-zinc-700 text-sm leading-relaxed">
            {desc}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, i) => (
            <span key={i} className="font-mono text-[10px] uppercase text-zinc-700 bg-transparent px-2 py-1 rounded border border-dashed border-white/10">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      onMouseMove={handleMouseMove}
      className="bg-panel/60 backdrop-blur-md border border-white/[0.06] rounded-xl p-6 transition-all duration-300 group overflow-hidden relative flex flex-col hover:border-cyan/30 hover:shadow-[0_8px_40px_rgba(0,240,255,0.08)] liquid-glass-card"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl z-0 will-change-transform"
        style={{ background: glowBackground }}
      />
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
      <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none z-10"></div>
      
      {videoUrl && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 cursor-pointer" />
      )}
      
      {bannerUrl && (
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden border border-white/[0.06] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent z-10"></div>
          <img
            src={bannerUrl}
            alt={`${name} schematic`}
            width={1200}
            height={192}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-4 gap-4 relative z-[1]">
        <div className="flex items-center gap-4">
          {logoUrl && (
            <div className="w-11 h-11 rounded-lg border border-white/[0.08] overflow-hidden shrink-0 group-hover:border-cyan/30 transition-all duration-300">
              <img
                src={logoUrl}
                alt={`${name} logo`}
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div>
            <h4 className="text-lg font-bold group-hover:text-white transition-colors duration-300 flex items-center gap-2 flex-wrap">
              {name}
              {status && (
                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                  status.toLowerCase().includes('live') || status.toLowerCase().includes('running')
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : status.toLowerCase().includes('blueprint')
                    ? 'bg-amber/10 text-amber border-amber/30'
                    : 'bg-cyan/10 text-cyan border-cyan/30'
                }`}>
                  {status}
                </span>
              )}
            </h4>
          </div>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase px-3 py-2 md:px-2 md:py-1 bg-white/5 text-text-muted border border-white/10 rounded hover:bg-cyan/10 hover:text-cyan hover:border-cyan/30 transition-colors relative z-20">
            <IconLink size={12} /> Live
          </a>
        )}
      </div>
      
      <div className="mb-4 relative z-[1]">
        <p className="text-text-muted text-sm leading-relaxed">
          {desc}
        </p>
      </div>

      {techDetails && (
        <div className="mb-4 relative z-20">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTech(v => !v); }}
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-cyan/70 hover:text-cyan transition-colors"
            aria-label={showTech ? 'Hide details' : 'Show details'}
          >
            {showTech ? <><ChevronUp size={12} /> ▼ Hide details</> : <><ChevronDown size={12} /> ▶ Show details</>}
          </button>
          {showTech && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-2 text-xs text-text-muted/80 leading-relaxed font-mono border-l-2 border-cyan/30 pl-3 py-0.5 bg-white/[0.01]"
            >
              {techDetails}
            </motion.div>
          )}
        </div>
      )}
      
      {children && <div className="mb-6 relative z-10">{children}</div>}

      <div className="flex flex-wrap gap-2 mt-auto relative z-[1]">
        {tags.map((tag, i) => (
          <span key={i} className="font-mono text-[10px] uppercase text-text-muted/70 bg-white/[0.03] px-2 py-1 rounded border border-white/[0.06] group-hover:border-white/10 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

