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
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      className={`mb-10 ${center ? 'text-center' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        className="font-mono text-[11px] tracking-[0.25em] text-text-muted/60 mb-3"
      >
        <span className="text-cyan/50">{number}</span> &nbsp; <span className="text-text-muted/40">{command}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight"
      >
        <ShaderText preset="aurora">{title}</ShaderText>
      </motion.h2>
      <ShaderGlowLine className="mt-3 max-w-[200px]" />
    </motion.div>
  );
}
