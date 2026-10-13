'use client';

import { useState, useCallback, useRef } from 'react';
import { useScroll } from 'motion/react';

type UseScrollOptions = Parameters<typeof useScroll>[0];

/**
 * Custom hook to safely use Motion's `useScroll` with a target element ref.
 * Prevents "Target ref is defined but not hydrated" invariant errors during
 * SSR, React 19 hydration, and conditional element rendering.
 */
export function useScrollTarget<T extends HTMLElement = HTMLDivElement>(
  options?: Omit<UseScrollOptions, 'target'>
) {
  const [element, setElement] = useState<T | null>(null);
  const elementRef = useRef<T | null>(null);

  const ref = useCallback((node: T | null) => {
    if (node) {
      elementRef.current = node;
      setElement(node);
    } else {
      elementRef.current = null;
      setElement(null);
    }
  }, []);

  const scrollResult = useScroll({
    ...options,
    target: element ? elementRef : undefined,
  });

  return {
    ref,
    element,
    ...scrollResult,
  };
}
