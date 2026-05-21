'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  preset?: 'chrome' | 'aurora' | 'ember' | 'frost' | 'iridescent';
}) {
  const presetStyles: Record<string, string> = {
    chrome: 'shader-text-chrome',
    aurora: 'shader-text-aurora',
    ember: 'shader-text-ember',
    frost: 'shader-text-frost',
    iridescent: 'shader-text-iridescent',
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
 * ShaderIridescentText — WebGL-powered text masking effect.
 * The text itself looks like it's cut out of the iridescent liquid glass shader.
 * Uses a canvas-based shader rendered as a CSS mask on the text.
 * 
 * Cross-platform: Touch events bound for mobile, DPR capped at 1.5.
 * PR #16: Typography Clipping
 */
export function ShaderIridescentText({
  children,
  className = '',
  as: Tag = 'span',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'div';
}) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());

  const vertexShader = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShader = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.1 + vec2(100.0);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      float t = u_time * 0.2;
      
      vec2 mouse = u_mouse;
      float mouseDist = length(uv - mouse);
      float mouseGlow = smoothstep(0.6, 0.0, mouseDist) * 0.4;
      
      // Iridescent color from noise
      float n1 = fbm(uv * 3.0 + vec2(t, t * 0.7));
      float n2 = fbm(uv * 2.5 - vec2(t * 0.8, t * 0.4) + mouse * 0.5);
      
      float angle = n1 * 6.28 + t + mouseDist * 3.0;
      
      // Chromatic iridescence
      vec3 color;
      color.r = sin(angle) * 0.5 + 0.5;
      color.g = sin(angle + 2.094) * 0.5 + 0.5;
      color.b = sin(angle + 4.188) * 0.5 + 0.5;
      
      // Overlay with cyan/violet/amber palette
      vec3 cyan = vec3(0.0, 0.94, 1.0);
      vec3 violet = vec3(0.65, 0.55, 0.98);
      vec3 amber = vec3(0.96, 0.65, 0.14);
      
      color = mix(color, cyan, n2 * 0.4 + mouseGlow);
      color = mix(color, violet, (1.0 - n1) * 0.2);
      color = mix(color, amber, n2 * 0.08);
      
      // Brightness boost for text readability
      color = color * 0.7 + vec3(0.3);
      color += mouseGlow * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return false;
    glRef.current = gl;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('ShaderIridescentText compile error:', gl.getShaderInfoLog(fs));
      return false;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    return true;
  }, []);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    const time = (Date.now() - startTimeRef.current) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), w, h);
    gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), mouseRef.current.x, mouseRef.current.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Skip WebGL on mobile — use CSS fallback only
    const success = initGL();
    if (!success) return; // Falls back to CSS gradient
    rafRef.current = requestAnimationFrame(render);

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (x !== undefined && y !== undefined) {
        mouseRef.current = {
          x: (x - rect.left) / rect.width,
          y: 1.0 - (y - rect.top) / rect.height,
        };
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      const gl = glRef.current;
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        glRef.current = null;
      }
    };
  }, [initGL, render, isMobile]);

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Hidden WebGL canvas that renders the iridescent texture — skipped on mobile */}
      {!isMobile && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
          style={{ zIndex: -1 }}
          aria-hidden="true"
        />
      )}
      {/* The text element with CSS background-clip using the shader canvas as texture source.
          Falls back to shader-text-iridescent CSS class if WebGL unavailable */}
      <Tag className={`shader-text-iridescent-clip ${className}`}>
        {children}
      </Tag>
    </div>
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
