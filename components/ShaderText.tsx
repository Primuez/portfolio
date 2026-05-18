'use client';

import React, { useRef, useEffect } from 'react';

/**
 * Animated chromatic gradient text effect inspired by shaders.com Chroma Chrome preset.
 * Applies an animated gradient that shifts hue over time — pure CSS, no WebGL needed.
 */
export function ShaderText({
  children,
  className = '',
  preset = 'chrome',
}: {
  children: React.ReactNode;
  className?: string;
  preset?: 'chrome' | 'aurora' | 'ember' | 'frost';
}) {
  const presetStyles: Record<string, string> = {
    chrome: 'shader-text-chrome',
    aurora: 'shader-text-aurora',
    ember: 'shader-text-ember',
    frost: 'shader-text-frost',
  };

  return (
    <span className={`${presetStyles[preset]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Interactive shimmer logo effect. On hover/touch, the shimmer intensifies.
 * Inspired by shaders.com Stainless Steel preset.
 */
export function ShaderLogo({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`shader-logo-shimmer ${className}`}>
      {children}
    </span>
  );
}

/**
 * Section title with a subtle animated underline glow effect.
 * Inspired by shaders.com Edge Glow preset.
 */
export function ShaderGlowLine({ className = '' }: { className?: string }) {
  return (
    <div className={`shader-glow-line ${className}`} aria-hidden="true" />
  );
}

/**
 * Interactive card shader overlay - adds a subtle refraction/glass distortion on hover.
 * Uses CSS backdrop-filter animations for performance.
 */
export function ShaderCardOverlay() {
  return (
    <div className="shader-card-overlay" aria-hidden="true" />
  );
}
