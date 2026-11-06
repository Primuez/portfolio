'use client';

import { useState, useEffect, useRef } from 'react';
import { useUI } from '@/lib/contexts/UIContext';
import { trackEvent } from '@/lib/analytics';

/**
 * Mobile-only sticky CTA bar.
 * - Visible only below 768px viewport width
 * - Appears after user scrolls past the Hero section (uses IntersectionObserver)
 * - Fixed to bottom of screen, full-width, flush edges
 * - Opens the interactive lead intake form modal and scrolls to contact
 */
export function MobileStickyCtA() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setModalType } = useUI();
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
    const contactEl = document.getElementById('contact');
    if (!heroEl) return;

    let heroPast = false;
    let contactInView = false;

    const updateVisibility = () => {
      setVisible(heroPast && !contactInView);
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroPast = !entry.isIntersecting;
        updateVisibility();
      },
      { threshold: 0, rootMargin: '0px' }
    );
    heroObserver.observe(heroEl);

    let contactObserver: IntersectionObserver | null = null;
    if (contactEl) {
      contactObserver = new IntersectionObserver(
        ([entry]) => {
          contactInView = entry.isIntersecting;
          updateVisibility();
        },
        { threshold: 0.1, rootMargin: '0px' }
      );
      contactObserver.observe(contactEl);
    }

    return () => {
      heroObserver.disconnect();
      contactObserver?.disconnect();
    };
  }, [isMobile]);

  const handleLetsTalk = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('click_mobile_sticky_letstalk');
    setModalType('form');
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <div className="bg-[#0a0e1a]/95 backdrop-blur-md border-t border-white/[0.06] px-4 py-2 pb-safe">
        <button
          type="button"
          onClick={handleLetsTalk}
          className="flex items-center justify-center w-full min-h-[56px] bg-cyan/90 hover:bg-cyan text-[#0a0a0f] font-mono text-sm font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer active:scale-[0.98] rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.25)]"
        >
          Let&apos;s Talk &rarr;
        </button>
      </div>
    </div>
  );
}
