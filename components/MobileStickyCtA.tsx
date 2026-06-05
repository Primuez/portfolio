'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Mobile-only sticky CTA bar.
 * - Visible only below 768px viewport width
 * - Appears after user scrolls past the Hero section (uses IntersectionObserver)
 * - Fixed to bottom of screen, full-width, flush edges
 * - Links to the contact section
 */
export function MobileStickyCtA() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setVisible(false);
      return;
    }

    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    // Show CTA once user scrolls past the hero section
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // When hero is NOT intersecting (scrolled past), show CTA
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );

    observerRef.current.observe(heroEl);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isMobile]);

  // Don't render anything on desktop
  if (!isMobile) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Subtle top edge gradient for depth */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
      <div className="bg-[#0a0e1a]/95 backdrop-blur-md border-t border-white/[0.06] px-4 py-2">
        <a
          href="#contact"
          className="flex items-center justify-center w-full min-h-[56px] bg-cyan/90 hover:bg-cyan text-[#0a0a0f] font-mono text-sm font-bold uppercase tracking-widest transition-colors duration-200"
        >
          Let&apos;s Talk &rarr;
        </a>
      </div>
    </div>
  );
}
