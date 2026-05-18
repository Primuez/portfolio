'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Interactive WebGL shader background inspired by shaders.com presets.
 * Creates a flowing gradient mesh that responds to mouse/touch position.
 * Optimized for performance with requestAnimationFrame.
 */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());

  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment shader: flowing chromatic gradient with mouse interaction
  const fragmentShaderSource = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

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
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      float t = u_time * 0.15;
      
      // Mouse influence - creates a gentle pull toward cursor
      vec2 mouse = u_mouse;
      float mouseDist = length(uv - mouse);
      float mouseInfluence = smoothstep(0.8, 0.0, mouseDist) * 0.3;
      
      // Flowing noise layers
      float n1 = fbm(uv * 3.0 + vec2(t * 0.4, t * 0.2) + mouse * 0.5);
      float n2 = fbm(uv * 2.0 - vec2(t * 0.3, t * 0.5) + mouse * 0.3);
      float n3 = fbm(uv * 4.0 + vec2(t * 0.2, -t * 0.3));
      
      // Color palette: deep blues, cyans, and subtle amber
      vec3 col1 = vec3(0.0, 0.06, 0.12); // Deep navy
      vec3 col2 = vec3(0.0, 0.35, 0.45); // Teal
      vec3 col3 = vec3(0.0, 0.94, 1.0);  // Cyan
      vec3 col4 = vec3(0.96, 0.65, 0.14); // Amber
      
      // Mix colors based on noise
      vec3 color = mix(col1, col2, n1 * 0.6);
      color = mix(color, col3, n2 * 0.15 + mouseInfluence);
      color = mix(color, col4, n3 * 0.05);
      
      // Vignette
      float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.4);
      color *= vignette;
      
      // Keep it subtle - this is a background
      color *= 0.12;
      
      // Add a subtle scanline effect
      float scanline = sin(gl_FragCoord.y * 1.5) * 0.003;
      color += scanline;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vertexShaderSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragmentShaderSource);
    gl.compileShader(fs);

    // Create program
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
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
  }, []);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    // Resize if needed
    const dpr = Math.min(window.devicePixelRatio, 1.5); // Cap for performance
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
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
    initGL();
    rafRef.current = requestAnimationFrame(render);

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

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [initGL, render]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
}
