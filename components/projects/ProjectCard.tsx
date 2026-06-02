'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
import { Link as IconLink } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  url?: string;
  desc: string;
  tags: string[];
  logoUrl?: string;
  bannerUrl?: string;
  videoUrl?: string;
  children?: React.ReactNode;
}

export function ProjectCard({ name, url, desc, tags, logoUrl, bannerUrl, videoUrl, children }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const glowBackground = useMotionTemplate`radial-gradient(300px circle at ${mouseX}% ${mouseY}%, rgba(0,240,255,0.06), transparent 60%)`;
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

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
          <h4 className="text-lg font-bold group-hover:text-white transition-colors duration-300">{name}</h4>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase px-3 py-2 md:px-2 md:py-1 bg-white/5 text-text-muted border border-white/10 rounded hover:bg-cyan/10 hover:text-cyan hover:border-cyan/30 transition-colors relative z-20">
            <IconLink size={12} /> Live
          </a>
        )}
      </div>
      
      <p className="text-text-muted text-sm leading-relaxed mb-6 relative z-[1]">{desc}</p>
      
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
