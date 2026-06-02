'use client';

import React from 'react';
import { motion } from 'motion/react';

interface WorkflowCardProps {
  name: string;
  desc: string;
  image: string;
  delay?: number;
  videoUrl?: string;
}

export function WorkflowCard({ name, desc, image, delay = 0, videoUrl }: WorkflowCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100, scale: 0.88, rotateX: 18, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.05, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      whileTap={{ scale: 0.97 }}
      className="group w-full block h-full md:[perspective:1000px]"
      style={{ transformPerspective: 1200 }}
    >
      <div className="w-full h-full bg-panel/60 backdrop-blur-md border border-cyan/20 rounded-xl overflow-hidden shadow-lg transition-all duration-500 transform-gpu md:group-hover:rotate-x-12 md:group-hover:-rotate-y-12 group-hover:-translate-y-2 md:group-hover:-translate-y-4 group-hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] md:group-hover:shadow-[20px_20px_60px_rgba(0,240,255,0.2)] flex flex-col relative md:[transform-style:preserve-3d] liquid-glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/[0.03] via-transparent to-white/[0.02] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none z-20"></div>
        
        {videoUrl && (
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 cursor-pointer" />
        )}
        
        <div className="w-full h-40 sm:h-48 relative overflow-hidden border-b border-cyan/20 bg-black/50 p-2">
           <div className="w-full h-full relative rounded-lg overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-bg/50">
             <img src={image} alt={name} width={1200} height={192} loading="lazy" decoding="async" className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
           </div>
        </div>
        
        <div className="p-4 sm:p-6 relative z-10 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-2 h-2 rounded-full bg-amber group-hover:shadow-[0_0_10px_#f5a623] transition-shadow shrink-0"></div>
             <h4 className="text-base sm:text-xl font-bold group-hover:text-white transition-colors">{name}</h4>
          </div>
          <p className="text-sm text-text-muted leading-relaxed flex-grow">{desc}</p>
          
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 text-[10px] font-mono uppercase">
            <span className="bg-amber/10 text-amber border border-amber/20 px-2 py-1 rounded">n8n core</span>
            <span className="bg-cyan/10 text-cyan border border-cyan/20 px-2 py-1 rounded group-hover:bg-cyan group-hover:text-bg transition-colors">SAM Controlled</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
