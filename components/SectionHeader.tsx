'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShaderText, ShaderGlowLine } from '@/components/ShaderText';

interface SectionHeaderProps {
  number: string;
  command: string;
  title: string;
  center?: boolean;
}

export function SectionHeader({ number, command, title, center = false }: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.05 }}
      style={{ willChange: 'transform, opacity' }}
      className={`mb-10 ${center ? 'text-center' : ''}`}
    >
      <div className="font-mono text-[11px] tracking-[0.25em] text-text-muted/60 mb-3">
        <span className="text-cyan/50">{number}</span> &nbsp; <span className="text-text-muted/40">{command}</span>
      </div>
      <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
        <ShaderText preset="aurora">{title}</ShaderText>
      </h2>
      <ShaderGlowLine className="mt-3 max-w-[200px]" />
    </motion.div>
  );
}
