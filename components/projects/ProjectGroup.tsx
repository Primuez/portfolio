'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

interface ProjectGroupProps {
  title: string;
  children: React.ReactNode;
  color: 'cyan' | 'amber';
}

export function ProjectGroup({ title, children, color }: ProjectGroupProps) {
  const borderColor = color === 'cyan' ? 'border-cyan/30' : 'border-amber/30';
  const textColor = color === 'cyan' ? 'text-cyan' : 'text-amber';
  const glowColor = color === 'cyan' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(245, 166, 35, 0.08)';
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.0005 });
  const opacity = useTransform(smoothProgress, [0, 0.12, 0.3, 0.7, 0.88, 1], [0, 0.6, 1, 1, 0.6, 0]);
  const scale = useTransform(smoothProgress, [0, 0.15, 0.3, 0.7, 0.85, 1], [0.96, 0.98, 1, 1, 0.98, 0.96]);
  const rotateX = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [4, 1, 0, -1, -4]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [50, 12, 0, -12, -50]);
  const backdropBlur = useTransform(smoothProgress, [0, 0.15, 0.3, 0.7, 0.85, 1], [8, 3, 0, 0, 3, 8]);
  const glassOpacity = useTransform(smoothProgress, [0, 0.2, 0.35, 0.65, 0.8, 1], [0, 0.4, 0.8, 0.8, 0.4, 0]);
  const x = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [-8, -2, 0, 2, 8]);
  
  return (
    <motion.div 
      ref={ref}
      className="mt-16 relative liquid-glass-v2"
      style={{ opacity, scale, rotateX, y, x, perspective: '1400px', transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="absolute -inset-8 rounded-3xl pointer-events-none -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, ${glowColor}, transparent 65%)`,
          filter: useTransform(backdropBlur, (v) => `blur(${v * 4}px)`),
          opacity: glassOpacity,
        }}
      />
      <motion.div
        className="absolute -inset-4 rounded-2xl pointer-events-none -z-10 border border-white/[0.03]"
        style={{
          backdropFilter: useTransform(backdropBlur, (v) => `blur(${Math.max(v * 1.2, 0)}px) saturate(1.4)`),
          WebkitBackdropFilter: useTransform(backdropBlur, (v) => `blur(${Math.max(v * 1.2, 0)}px) saturate(1.4)`),
          opacity: glassOpacity,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 40%, rgba(0,240,255,0.015) 100%)',
        }}
      />
      <motion.div
        className="absolute -top-px left-[10%] right-[10%] h-px pointer-events-none -z-10 rounded-full"
        style={{
          background: color === 'cyan'
            ? 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), rgba(255,255,255,0.15), rgba(0,240,255,0.4), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(245,166,35,0.4), rgba(255,255,255,0.15), rgba(245,166,35,0.4), transparent)',
          opacity: glassOpacity,
        }}
      />
      <div className="relative z-10">
        <h3 className={`font-mono text-xs uppercase tracking-[0.2em] ${textColor} mb-6 pb-2 border-b ${borderColor} inline-block`}>
          ▸ {title}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
