'use client';

import React, { useRef, useCallback, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * LiquidGlassContainer — Apple Tahoe-inspired glassmorphism wrapper.
 * Responds to scroll position with parallax + subtle scale/opacity animations.
 * On hover, a refraction-like glow follows the cursor.
 */
export function LiquidGlassContainer({
  children,
  className,
  glowColor = 'rgba(0, 240, 255, 0.06)',
  borderColor = 'border-white/[0.06]',
  intensity = 'medium',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderColor?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const isMobile = useIsMobile();

  const blurMap = { subtle: 'backdrop-blur-sm', medium: 'backdrop-blur-md', strong: 'backdrop-blur-lg' };
  const bgMap = { subtle: 'bg-bg/20', medium: 'bg-bg/30', strong: 'bg-bg/40' };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative rounded-2xl overflow-hidden border transition-all duration-500',
        blurMap[intensity],
        bgMap[intensity],
        borderColor,
        'hover:border-white/[0.12] hover:shadow-[0_8px_40px_rgba(0,240,255,0.06)]',
        className
      )}
    >
      {/* Cursor-following refraction glow */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 rounded-[inherit]"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, ${glowColor}, transparent 60%)`,
          }}
        />
      )}
      {/* Top edge highlight — simulates glass refraction */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none z-10" />
      {/* Content */}
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  );
}

/**
 * LiquidGlassParallaxSection — Wraps a section with Apple-style 
 * scroll-driven parallax, scale-in, and opacity fade animations.
 * Optimized for 60fps with spring physics.
 */
export function LiquidGlassParallaxSection({
  children,
  className,
  parallaxDistance = 60,
  scaleRange = [0.95, 1],
}: {
  children: React.ReactNode;
  className?: string;
  parallaxDistance?: number;
  scaleRange?: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Spring-smoothed progress for buttery 60fps feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    restDelta: 0.001,
  });

  // Transforms — reduced on mobile for performance
  const mobileMultiplier = isMobile ? 0.4 : 1;
  const actualDistance = parallaxDistance * mobileMultiplier;

  const y = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [actualDistance, 0, 0, -actualDistance]);
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [scaleRange[0], scaleRange[1], scaleRange[1], scaleRange[0]]
  );
  // On mobile: rely on opacity, disable expensive blur filters to prevent black blinks
  const blur = useTransform(
    smoothProgress,
    [0, 0.12, 0.88, 1],
    isMobile ? [0, 0, 0, 0] : [2, 0, 0, 2]
  );
  const filterStr = useTransform(blur, (v) => isMobile ? 'none' : `blur(${v}px)`);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale, filter: filterStr }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * InteractiveGlassBackground — A full-section interactive glass shader effect.
 * Responds to mouse movement with shifting gradients simulating light refraction.
 * On mobile, uses a subtle animated gradient loop instead.
 */
export function InteractiveGlassBackground({
  className,
  primaryColor = 'rgba(0, 240, 255, 0.04)',
  secondaryColor = 'rgba(167, 139, 250, 0.03)',
}: {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
}) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const isMobile = useIsMobile();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, [isMobile]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0',
        className
      )}
      aria-hidden="true"
    >
      {/* Primary radial glow — follows cursor on desktop, animated on mobile */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-700',
          isMobile && 'liquid-glass-shimmer'
        )}
        style={
          !isMobile
            ? {
                background: `
                  radial-gradient(600px ellipse at ${mousePos.x}% ${mousePos.y}%, ${primaryColor}, transparent 60%),
                  radial-gradient(400px circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, ${secondaryColor}, transparent 50%)
                `,
              }
            : undefined
        }
      />
      {/* Edge light refraction lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}
