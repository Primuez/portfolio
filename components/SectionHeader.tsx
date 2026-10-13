'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShaderText, ShaderGlowLine } from '@/components/ShaderText';
import { useIsMobile } from '@/hooks/use-mobile';

interface SectionHeaderProps {
  number: string;
  command: string;
  title: string;
  center?: boolean;
}

export function SectionHeader({ number, command, title, center = false }: SectionHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={isMobile ? false : { opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: isMobile ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: isMobile ? "80px" : "0px" }}
      className={`mb-8 md:mb-10 ${center ? 'text-center' : ''}`}
    >
      <motion.div
        initial={isMobile ? false : { opacity: 0, y: -4 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: isMobile ? 0 : 0.05, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: isMobile ? "80px" : "0px" }}
        className="font-mono text-[11px] tracking-[0.25em] text-text-muted/60 mb-2 md:mb-3"
      >
        <span className="text-cyan/50">{number}</span> &nbsp; <span className="text-text-muted/40">{command}</span>
      </motion.div>
      <motion.h2
        initial={isMobile ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: isMobile ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: isMobile ? "80px" : "0px" }}
        className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight"
      >
        <ShaderText preset="aurora">{title}</ShaderText>
      </motion.h2>
      <ShaderGlowLine className="mt-3 max-w-[200px]" />
    </motion.div>
  );
}
