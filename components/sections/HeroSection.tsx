'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Download, Code2, Terminal, Activity } from 'lucide-react';
import { HexShaderBackground } from '@/components/HexShaderBackground';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { LiquidGlassTitle } from '@/components/ui/liquid-glass-logo';
import { ShaderIridescentText } from '@/components/ShaderText';
import { useUI } from '@/lib/contexts/UIContext';

const phrases = [
  "Workflow Automation.",
  "Zero Manual Entry.",
  "Systems That Scale.",
  "Built for Indian SMEs."
];

export const HeroSection: React.FC = () => {
  const { isMobile, setModalType } = useUI();
  const [phraseIndex, setPhraseIndex] = React.useState(0);

  // Phrase cycling (fade-morph) - moved local to Hero to keep state encapsulated
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((p) => (p + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="min-h-[100dvh] flex flex-col justify-center pt-20 md:pt-12 pb-8 md:pb-0 relative overflow-hidden -mx-4 sm:-mx-6 md:-mx-12 px-4 sm:px-6 md:px-12">
      {/* Interactive Hex Path shader — glows on cursor hover (desktop only) — full-bleed center aligned */}
      {!isMobile && (
        <div className="absolute inset-y-0 w-screen left-1/2 -translate-x-1/2 scale-[1.02] origin-center overflow-hidden pointer-events-none z-0">
          <HexShaderBackground />
        </div>
      )}
      <div className="max-w-3xl relative z-10">
        <motion.a
          href="#process"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-amber/80 text-xs md:text-sm mb-4 flex items-center gap-2 hover:text-amber transition-colors duration-200 py-2 md:py-0"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="opacity-80">See how a manufacturer eliminated 3 hours of daily manual entry &rarr;</span>
        </motion.a>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="h-8 md:h-10 mb-3 md:mb-4 font-mono text-xl md:text-2xl text-cyan flex items-center overflow-hidden"
        >
          <span className="opacity-70 mr-2 text-text-muted select-none">&gt;</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={phraseIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {phrases[phraseIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.25rem] md:text-5xl lg:text-6xl font-bold leading-[1.08] md:leading-[1.1] mb-5 md:mb-6 tracking-tight"
        >
          <LiquidGlassTitle>
            I Believe Business Owners <br/>
            <ShaderIridescentText as="span" className="text-4xl md:text-5xl lg:text-6xl font-bold">Shouldn't Be Slaves to Repetitive Tasks.</ShaderIridescentText>
          </LiquidGlassTitle>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-text-muted text-base md:text-lg lg:text-xl max-w-2xl mb-6 md:mb-8 leading-relaxed font-sans text-balance"
        >
          That’s why I architect autonomous systems that work while you sleep. From routing IndiaMART leads directly into Odoo to reconciling GST without sacrificing your weekend, I build the engines that give you your freedom back.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-10"
        >
          <a href="#projects" className="px-8 py-4 bg-transparent border border-white/20 text-white font-mono text-sm uppercase tracking-widest hover:border-cyan/60 hover:text-cyan transition-all duration-300 text-center flex items-center justify-center gap-2">
            <ChevronRight size={16} /> View My Work
          </a>
          <GlassButton 
            size="lg" 
            onClick={() => setModalType('form')} 
            glowColor="rgba(0, 240, 255, 0.25)"
            className="glass-btn-glow text-cyan hover:text-white"
          >
            Let&apos;s Talk
          </GlassButton>
          <a href="/documents/resume.pdf" download="Rahul_Kasturiya_Resume.pdf" className="px-8 py-4 bg-transparent border border-amber/40 text-amber font-mono text-sm uppercase tracking-widest hover:bg-amber/10 hover:border-amber/60 transition-all duration-300 text-center flex items-center justify-center gap-2">
            <Download size={16} /> Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 font-mono text-xs"
        >
          <span className="bg-panel/80 border border-white/10 text-text-muted px-3 py-1.5 rounded-md flex items-center gap-2">
            <Code2 size={14} className="text-amber" /> 10+ Businesses Automated
          </span>
          <span className="bg-panel/80 border border-white/10 text-text-muted px-3 py-1.5 rounded-md flex items-center gap-2">
            <Terminal size={14} className="text-cyan/70" /> 10+ Systems Running 24/7
          </span>
        </motion.div>
      </div>
    </section>
  );
};
