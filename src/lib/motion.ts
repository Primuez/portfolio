/**
 * Motion Tokens and GSAP ScrollTrigger Configurations
 * Single source of truth for all animation timing, easings, and device safeguards.
 */

export const MOTION = {
  duration: {
    instant: 0.1,
    micro: 0.25,
    base: 0.6,
    expressive: 0.9,
    cinematic: 1.4,
  },
  ease: {
    power2Out: 'power2.out',
    power3Out: 'power3.out',
    expoOut: 'expo.out',
    smooth: 'power1.inOut',
    backOut: 'back.out(1.5)',
    customHaptic: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  stagger: {
    fast: 0.05,
    base: 0.1,
    relaxed: 0.18,
  },
};

/**
 * Check whether animations should be disabled or softened
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check whether device is mobile (< 768px)
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth < 768;
}
