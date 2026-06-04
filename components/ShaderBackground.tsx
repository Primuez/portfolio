'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Interactive WebGL shader background — "Undertones" iridescent liquid glass.
 * Creates a flowing kinetic gradient mesh that responds to mouse/touch VELOCITY.
 * 
 * Cross-Platform Optimized:
 * - Desktop: Full resolution, mouse tracking with velocity distortion
 * - Mobile: DPR capped at 1.5, touch velocity mapped to u_mouse uniform
 * - Fallback: If WebGL unavailable, renders nothing (parent shows CSS gradient)
 * 
 * PR #16: Premium Shader Integration
 */
export function ShaderBackground({
  className = '',
  opacity = 0.85,
  variant = 'hero',
}: {
  className?: string;
  opacity?: number;
  variant?: 'hero' | 'section';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const prevPosRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());
  const isVisibleRef = useRef(true);
  const animatingRef = useRef(false);

  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment shader: Iridescent liquid glass with velocity-reactive distortion
  const fragmentShaderSource = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform vec2 u_velocity;
    uniform float u_variant; // 0.0 = hero, 1.0 = section

    // Simplex-style noise for organic movement
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
      vec2 shift = vec2(100.0);
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    // Iridescent color function — shifts hue based on angle and velocity
    vec3 iridescence(float angle, float intensity) {
      vec3 col;
      col.r = sin(angle * 2.0) * 0.5 + 0.5;
      col.g = sin(angle * 2.0 + 2.094) * 0.5 + 0.5; // +120deg
      col.b = sin(angle * 2.0 + 4.188) * 0.5 + 0.5; // +240deg
      return col * intensity;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      float t = u_time * 0.12;
      
      // Velocity magnitude for reactive distortion
      float vel = length(u_velocity) * 8.0;
      vel = min(vel, 1.5); // Cap velocity influence
      
      // Mouse influence — liquid glass pull toward cursor/touch
      vec2 mouse = u_mouse;
      float mouseDist = length(uv - mouse);
      float mouseInfluence = smoothstep(0.9, 0.0, mouseDist) * (0.3 + vel * 0.4);
      
      // Velocity-warped UV for kinetic distortion
      vec2 warpedUV = uv + u_velocity * 0.15 * smoothstep(0.8, 0.0, mouseDist);
      
      // Multi-layer flowing noise (the "undertones")
      float n1 = fbm(warpedUV * 3.0 + vec2(t * 0.4, t * 0.2) + mouse * 0.6);
      float n2 = fbm(warpedUV * 2.5 - vec2(t * 0.3, t * 0.5) + mouse * 0.4);
      float n3 = fbm(warpedUV * 4.5 + vec2(t * 0.15, -t * 0.25));
      float n4 = fbm(warpedUV * 1.8 + vec2(-t * 0.2, t * 0.35) + u_velocity * 2.0);
      
      // Iridescent angle based on noise and position
      float iridAngle = n1 * 3.14159 + t * 0.5 + mouseDist * 2.0 + vel * 1.5;
      vec3 iridColor = iridescence(iridAngle, 0.15 + mouseInfluence * 0.3);
      
      // Base color palette: deep space with cyan/violet/amber undertones
      vec3 col1 = vec3(0.02, 0.04, 0.10); // Deep void
      vec3 col2 = vec3(0.0, 0.25, 0.40);  // Deep teal
      vec3 col3 = vec3(0.0, 0.94, 1.0);   // Cyan
      vec3 col4 = vec3(0.65, 0.55, 0.98);  // Violet
      vec3 col5 = vec3(0.96, 0.65, 0.14);  // Amber
      
      // Mix colors based on noise layers
      vec3 color = mix(col1, col2, n1 * 0.5 + n4 * 0.2);
      color = mix(color, col3, (n2 * 0.12 + mouseInfluence) * (1.0 + vel * 0.5));
      color = mix(color, col4, n3 * 0.08 + vel * 0.05);
      color = mix(color, col5, n4 * 0.04);
      
      // Add iridescence layer
      color += iridColor * (0.5 + vel * 0.5);
      
      // Glass refraction highlight near cursor
      float highlight = smoothstep(0.3, 0.0, mouseDist) * (0.08 + vel * 0.12);
      color += vec3(1.0) * highlight * n2;
      
      // Vignette — stronger for section variant
      float vignetteStrength = u_variant > 0.5 ? 1.6 : 1.3;
      float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * vignetteStrength);
      color *= vignette;
      
      // Overall intensity — keep as premium subtle background
      float intensity = u_variant > 0.5 ? 0.10 : 0.14;
      color *= intensity;
      
      // Subtle scanline for texture
      float scanline = sin(gl_FragCoord.y * 1.5) * 0.002;
      color += scanline;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;
    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vertexShaderSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vs));
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragmentShaderSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
      return;
    }

    // Create program
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    // Full-screen quad
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Set variant uniform
    const variantLoc = gl.getUniformLocation(program, 'u_variant');
    gl.uniform1f(variantLoc, variant === 'section' ? 1.0 : 0.0);
  }, [variant]);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    if (!isVisibleRef.current) {
      animatingRef.current = false;
      return;
    }
    animatingRef.current = true;

    // DPR capped at 1.0 on mobile and 1.5 on desktop to maintain 60fps
    // This is the critical mobile optimization
    const isMobileDevice = window.innerWidth < 768;
    const dpr = isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio, 1.5);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    const time = (Date.now() - startTimeRef.current) / 1000;

    // Compute velocity from position delta (smoothed)
    const dx = mouseRef.current.x - prevPosRef.current.x;
    const dy = mouseRef.current.y - prevPosRef.current.y;
    velocityRef.current.x += (dx - velocityRef.current.x) * 0.1;
    velocityRef.current.y += (dy - velocityRef.current.y) * 0.1;
    prevPosRef.current.x = mouseRef.current.x;
    prevPosRef.current.y = mouseRef.current.y;

    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), w, h);
    gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), mouseRef.current.x, mouseRef.current.y);
    gl.uniform2f(gl.getUniformLocation(program, 'u_velocity'), velocityRef.current.x, velocityRef.current.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    initGL();
    animatingRef.current = true;
    rafRef.current = requestAnimationFrame(render);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        isVisibleRef.current = visible;
        if (visible && !animatingRef.current) {
          render();
        }
      },
      { threshold: 0.01 }
    );
    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    // Mouse & Touch handler — binds both to u_mouse uniform
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (x !== undefined && y !== undefined) {
        mouseRef.current = {
          x: x / window.innerWidth,
          y: 1.0 - y / window.innerHeight, // Flip Y for GL coords
        };
      }
    };

    // Touch start — initialize position to prevent velocity spike
    const handleTouchStart = (e: TouchEvent) => {
      const x = e.touches[0]?.clientX;
      const y = e.touches[0]?.clientY;
      if (x !== undefined && y !== undefined) {
        const pos = {
          x: x / window.innerWidth,
          y: 1.0 - y / window.innerHeight,
        };
        mouseRef.current = pos;
        prevPosRef.current = pos;
        velocityRef.current = { x: 0, y: 0 };
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchstart', handleTouchStart);
      // Free GPU memory
      const gl = glRef.current;
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        glRef.current = null;
      }
    };
  }, [initGL, render]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

/**
 * ShaderBackgroundSection — A positioned wrapper for section-level shader use.
 * Renders the shader absolutely within a relative parent container.
 */
export function ShaderBackgroundSection({
  className = '',
  opacity = 0.7,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <ShaderBackground
      className={`absolute inset-0 w-full h-full z-0 ${className}`}
      opacity={opacity}
      variant="section"
    />
  );
}
