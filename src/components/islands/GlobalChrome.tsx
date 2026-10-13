import React, { useEffect, useState, useRef } from 'react';

export default function GlobalChrome() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch desktop devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsDesktop(!isTouch && window.innerWidth >= 768);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = window.scrollY / totalScroll;
        setScrollProgress(Math.min(Math.max(currentProgress, 0), 1));
      }
      setScrolled(window.scrollY > 300);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest('a, button, input, textarea, [role="button"], .cursor-pointer');
        setCursorHovered(isInteractive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Scroll Progress Bar (Top fixed 1px gradient) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none bg-gradient-to-r from-cyan via-cyan/60 to-amber-400 origin-left transition-transform duration-75"
        style={{
          transform: `scaleX(${scrollProgress})`,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* 2. Custom Cursor (Desktop only) */}
      {isDesktop && (
        <div
          className="fixed pointer-events-none z-[10000] mix-blend-screen transition-transform duration-100 ease-out hidden md:block"
          style={{
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`,
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <div
            className={`rounded-full border border-cyan/60 transition-all duration-200 ${
              cursorHovered
                ? 'w-10 h-10 bg-cyan/15 shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-125'
                : 'w-4 h-4 bg-cyan/25 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
            }`}
          />
        </div>
      )}

      {/* 3. Scroll to Top Floating Button */}
      {scrolled && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#0a0a0f]/90 border border-cyan/40 backdrop-blur-md flex items-center justify-center text-cyan hover:bg-cyan/15 hover:border-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all duration-300 group cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="group-hover:-translate-y-0.5 transition-transform"
          >
            <path
              d="M8 13V3M3 7l5-5 5 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </>
  );
}
