'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { ContainerScroll } from '@/components/ui/container-scroll';
import { ShaderIridescentText } from '@/components/ShaderText';
import { useUI } from '@/lib/contexts/UIContext';

export const AboutSection: React.FC = () => {
  const { isMobile } = useUI();

  return (
    <motion.section 
      id="whoami" 
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader number="01" command="> whoami" title="About" />
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <h2 className="text-[2.5rem] leading-[1.1] md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <ShaderIridescentText as="span" className="text-[2.5rem] leading-[1.1] md:text-6xl lg:text-7xl font-bold">Architecting Autonomy</ShaderIridescentText>
            </h2>
            <p className="text-text-muted text-sm md:text-lg max-w-2xl leading-relaxed">
              Turning repetitive business operations into systems that run themselves.
            </p>
          </div>
        }
      >
        {/* Card content: Bio + Info Grid */}
        <div className="flex flex-col h-full justify-between gap-6 text-left">
          <div className="space-y-4 max-w-3xl">
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              I&apos;m <strong className="text-cyan font-mono">Rahul Kasturiya (Primuez)</strong> — I design systems that use tools, adapt, and execute workflows autonomously. Your leads, invoices, follow-ups, and reports flow without anyone touching a keyboard.
            </p>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              My work sits at the intersection of <strong className="text-white">n8n orchestration</strong>, <strong className="text-white">LLM agent design</strong>, and <strong className="text-white">Cloudflare-based deployment</strong>. I&apos;ve built SaaS products, enterprise automation architectures, and client-facing AI systems that run 24/7 without manual intervention.
            </p>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              I think in systems before I write a single line of logic. I build for modularity, fallback reliability, and zero manual intervention.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4 border-t border-zinc-700/60">
            <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">Education</span>
              <span className="text-zinc-200 text-xs font-medium">KPS, Dunda · SSIPS (BCA)</span>
            </div>
            <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">Experience</span>
              <span className="text-zinc-200 text-xs font-medium">AI Automation · Since July 2025</span>
            </div>
            <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">Location</span>
              <span className="text-zinc-200 text-xs font-medium flex items-center gap-1"><MapPin size={10} /> Indore, MP, India</span>
            </div>
            <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">Languages</span>
              <span className="text-zinc-200 text-xs font-medium">Hindi · English C2 · Sindhi C2</span>
            </div>
          </div>
          {/* Personal backstory — relocated from hero/above-fold */}
          <div className="pt-4 border-t border-zinc-700/40">
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed italic">
              Self-taught. No CS degree. No team. Everything here was built by doing — from central India, one system at a time.
            </p>
          </div>
        </div>
      </ContainerScroll>
    </motion.section>
  );
};
