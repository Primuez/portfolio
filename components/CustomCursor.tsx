'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * Custom cursor with glow trail + touch ripple response.
 * Desktop: Custom animated cursor replaces default pointer with a glowing dot + trailing ring.
 * Mobile: Touch interactions produce expanding ripple animations.
 */
export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  // Mouse position (raw)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring follow for outer ring
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  // Even smoother trail for the glow aura
  const auraConfig = { stiffness: 80, damping: 25, mass: 0.8 };
  const auraX = useSpring(mouseX, auraConfig);
  const auraY = useSpring(mouseY, auraConfig);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Mouse events for desktop
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detect hovering over interactive elements
    const handleHoverCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, [data-cursor-hover]');
      setIsHovering(!!isInteractive);
    };

    // Touch ripple for mobile
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      const id = rippleId.current++;
      setRipples(prev => [...prev, { id, x: touch.clientX, y: touch.clientY }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 800);
    };

    if (!isMobile) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);
      document.addEventListener('mouseover', handleHoverCheck, { passive: true });
      // Hide default cursor
      document.documentElement.style.cursor = 'none';
      // Propagate to all elements
      const style = document.createElement('style');
      style.id = 'custom-cursor-style';
      style.textContent = '*, *::before, *::after { cursor: none !important; }';
      document.head.appendChild(style);
    } else {
      document.addEventListener('touchstart', handleTouch, { passive: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleHoverCheck);
      document.removeEventListener('touchstart', handleTouch);
      document.documentElement.style.cursor = '';
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) existingStyle.remove();
    };
  }, [isMobile, mouseX, mouseY]);

  // Mobile: only show ripples
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden="true">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute w-12 h-12 rounded-full border border-cyan/60 pointer-events-none"
              style={{
                left: ripple.x - 24,
                top: ripple.y - 24,
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 10px rgba(0, 240, 255, 0.1)',
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop: animated cursor system
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden="true">
      {/* Glow aura — large, softest follow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: auraX,
          top: auraY,
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.3s, height 0.3s, opacity 0.3s',
        }}
      />

      {/* Outer ring — follows with spring delay */}
      <motion.div
        className="absolute rounded-full border pointer-events-none"
        style={{
          left: ringX,
          top: ringY,
          width: isHovering ? 44 : 32,
          height: isHovering ? 44 : 32,
          x: '-50%',
          y: '-50%',
          borderColor: isHovering ? 'rgba(0,240,255,0.7)' : 'rgba(0,240,255,0.3)',
          boxShadow: isHovering
            ? '0 0 20px rgba(0,240,255,0.4), inset 0 0 8px rgba(0,240,255,0.1)'
            : '0 0 8px rgba(0,240,255,0.15)',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s, box-shadow 0.3s, opacity 0.3s',
        }}
      />

      {/* Inner dot — follows instantly */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: mouseX,
          top: mouseY,
          width: isHovering ? 8 : 5,
          height: isHovering ? 8 : 5,
          x: '-50%',
          y: '-50%',
          backgroundColor: '#00f0ff',
          boxShadow: '0 0 12px rgba(0,240,255,0.8), 0 0 4px rgba(0,240,255,1)',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
      />
    </div>
  );
}
