'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * LiquidGlassLogo — Interactive logo component with Apple Tahoe-style
 * liquid glass refraction. On hover/touch, the glass distorts with
 * a chromatic shift and depth effect. Includes subtle idle animation.
 */
export function LiquidGlassLogo({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Mouse tracking for desktop 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, 80]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, 80]), springConfig);

  const glareBg = useTransform(
    [glareX, glareY] as any,
    ([x, y]: number[]) =>
      `radial-gradient(120px circle at ${x}% ${y}%, rgba(255,255,255,0.12), transparent 60%)`
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [isMobile, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={!isMobile ? { rotateX, rotateY, transformPerspective: 600 } : undefined}
      className={cn(
        'relative inline-flex items-center cursor-pointer group',
        className
      )}
    >
      {/* Glass refraction overlay — responds to mouse position */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: glareBg,
          }}
        />
      )}
      
      {/* Liquid glass depth border — subtle bottom shadow for floating effect */}
      <div className="absolute inset-0 rounded-xl pointer-events-none z-0 border border-white/[0.04] group-hover:border-white/[0.08] transition-all duration-500" />
      
      {/* Content */}
      <div className="relative z-[5]">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * LiquidGlassTitle — Section title with interactive glass depth effect.
 * Applies a subtle parallax + glow on scroll intersection.
 */
export function LiquidGlassTitle({
  children,
  className,
  glowColor = 'rgba(0, 240, 255, 0.3)',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn('relative inline-block', className)}
      whileHover={!isMobile ? { scale: 1.02, transition: { duration: 0.3 } } : undefined}
    >
      {/* Glow backdrop on hover */}
      <motion.div
        className="absolute -inset-4 rounded-2xl pointer-events-none z-0"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1 : 0.95,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${glowColor}, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}

/**
 * GlassRefractionOverlay — A full-viewport interactive glass refraction effect
 * for backgrounds. Responds to cursor movement with shifting chromatic gradients.
 * On mobile, runs an ambient animation loop.
 */
export function GlassRefractionOverlay({
  className,
  interactive = true,
}: {
  className?: string;
  interactive?: boolean;
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const isMobile = useIsMobile();
  const rafRef = useRef<number>(0);

  // Mobile: ambient animation
  useEffect(() => {
    if (!isMobile) return;
    let t = 0;
    function animate() {
      t += 0.005;
      setPos({
        x: 50 + Math.sin(t) * 20,
        y: 50 + Math.cos(t * 0.7) * 15,
      });
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isMobile]);

  // Desktop: cursor tracking
  useEffect(() => {
    if (isMobile || !interactive) return;
    function handleMove(e: MouseEvent) {
      setPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    }
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isMobile, interactive]);

  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none z-[2] opacity-40',
        className
      )}
      aria-hidden="true"
    >
      <div
        className="w-full h-full transition-none"
        style={{
          background: `
            radial-gradient(800px ellipse at ${pos.x}% ${pos.y}%, rgba(0, 240, 255, 0.015), transparent 50%),
            radial-gradient(600px circle at ${100 - pos.x}% ${pos.y}%, rgba(167, 139, 250, 0.01), transparent 45%),
            radial-gradient(500px circle at ${pos.x}% ${100 - pos.y}%, rgba(245, 166, 35, 0.008), transparent 40%)
          `,
        }}
      />
    </div>
  );
}
