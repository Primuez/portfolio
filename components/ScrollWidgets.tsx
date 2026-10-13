'use client';

import React from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { useUI } from '@/lib/contexts/UIContext';
import { trackEvent } from '@/lib/analytics';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[1px] z-[60] bg-gradient-to-r from-cyan via-cyan/60 to-amber/40 pointer-events-none gpu-accelerated"
    />
  );
}

export function ScrollToTopButton() {
  const { scrolled } = useUI();
  return (
    <AnimatePresence>
      {scrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            trackEvent('click_back_to_top');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-11 md:h-11 rounded-full bg-panel/90 border border-cyan/30 backdrop-blur-md flex items-center justify-center text-cyan hover:bg-cyan/10 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 group active:scale-90 cursor-pointer"
          aria-label="Scroll to top"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:-translate-y-0.5 transition-transform">
            <path d="M8 13V3M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
