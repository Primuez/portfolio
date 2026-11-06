'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { isMobileDevice } from '@/lib/utils/hardwareDetect';

/**
 * Interactive Hex Path shader background inspired by shaders.com/collection/hex-path.
 * Creates a hexagonal grid that glows when the cursor hovers over it.
 * Uses WebGL for GPU-accelerated rendering.
 */
export function HexShaderBackground() {
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

  // Hex path fragment shader - interactive glowing hexagonal grid
  const fragmentShaderSource = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    const float SQRT3 = 1.7320508;
    const float PI = 3.14159265;

    // Hex distance function
    float hexDist(vec2 p) {
      p = abs(p);
      return max(dot(p, normalize(vec2(1.0, SQRT3))), p.x);
    }

    // Hex grid coordinate
    vec4 hexCoords(vec2 uv) {
      vec2 r = vec2(1.0, SQRT3);
      vec2 h = r * 0.5;
      vec2 a = mod(uv, r) - h;
      vec2 b = mod(uv - h, r) - h;
      
      vec2 gv;
      if (length(a) < length(b)) {
        gv = a;
      } else {
        gv = b;
      }
      
      float dist = hexDist(gv);
      vec2 id = uv - gv;
      return vec4(gv.x, gv.y, dist, 0.0);
    }

    // Smooth noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;
      vec2 mouse = (u_mouse - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
      float t = u_time * 0.3;
      
      // Scale the hex grid
      float scale = 8.0;
      vec2 hexUV = uv * scale;
      
      vec4 hc = hexCoords(hexUV);
      float hexD = hc.z;
      vec2 hexId = hexUV - hc.xy;
      
      // Edge detection for hex borders
      float edge = smoothstep(0.45, 0.48, hexD);
      float innerEdge = smoothstep(0.42, 0.45, hexD);
      float border = edge - innerEdge * 0.3;
      
      // Mouse proximity glow
      float mouseDist = length(uv - mouse);
      float mouseGlow = smoothstep(0.5, 0.0, mouseDist);
      
      // Per-hex animation based on distance from mouse
      vec2 hexCenter = hexId / scale;
      float hexMouseDist = length(hexCenter - mouse);
      float hexActivation = smoothstep(0.35, 0.0, hexMouseDist);
      
      // Pulsing wave that radiates from mouse
      float wave = sin(hexMouseDist * 12.0 - t * 4.0) * 0.5 + 0.5;
      float waveActivation = hexActivation * wave;
      
      // Random per-hex sparkle
      float sparkle = hash(hexId) * 0.5 + 0.5;
      float sparkleAnim = sin(t * 2.0 + sparkle * PI * 2.0) * 0.5 + 0.5;
      
      // Color composition
      vec3 bgColor = vec3(0.0);
      
      // Base hex grid - visible cyber honeycomb structure
      vec3 gridColor = vec3(0.0, 0.94, 1.0); // Cyan
      vec3 amberColor = vec3(0.98, 0.75, 0.14); // Amber accent
      float gridOpacity = 0.10 + sparkleAnim * 0.05;
      
      // Activated hex fill (near mouse)
      float fillOpacity = hexActivation * 0.18 * (1.0 - edge);
      vec3 fillColor = mix(
        vec3(0.0, 0.6, 0.8),
        vec3(0.0, 0.94, 1.0),
        waveActivation
      );
      
      // Ambient travelling energy pulses along paths (alive even without mouse)
      float pathEnergy1 = sin(hexId.x * 0.35 + hexId.y * 0.25 + t * 1.6) * 0.5 + 0.5;
      float pathEnergy2 = cos(hexId.x * 0.2 - hexId.y * 0.4 - t * 1.2) * 0.5 + 0.5;
      float pathGlow = border * (pathEnergy1 * 0.10 + pathEnergy2 * 0.06);

      // Radial ambient cyber pulse across right and center
      float ambientWave = sin(length(uv - vec2(0.25, 0.0)) * 5.0 - t * 1.4) * 0.5 + 0.5;
      float ambientHexPulse = (1.0 - edge) * ambientWave * 0.025;
      
      // Hex border glow near mouse + ambient travelling energy
      float borderGlow = border * (gridOpacity + hexActivation * 0.45 + waveActivation * 0.25);
      
      // Compose final color
      vec3 color = bgColor;
      color += gridColor * borderGlow;
      color += fillColor * fillOpacity;
      color += mix(gridColor, amberColor, sparkleAnim * 0.3) * pathGlow;
      color += gridColor * ambientHexPulse;
      
      // Add a subtle center glow around mouse
      color += vec3(0.0, 0.94, 1.0) * mouseGlow * 0.06;
      
      // Vignette
      float vignette = 1.0 - smoothstep(0.45, 1.1, length(uv) * 0.85);
      color *= vignette;
      
      // Overall intensity
      color *= 0.95;
      
      // Calculate alpha based on color luminance and active hex elements
      // Empty hex areas are completely transparent, allowing the underlying
      // flowing iridescent liquid glass ShaderBackground to shine through cleanly!
      float maxBrightness = max(color.r, max(color.g, color.b));
      float alpha = clamp(maxBrightness * 1.8, 0.0, 0.85);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl || gl.isContextLost()) return;
    glRef.current = gl;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, vertexShaderSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, fragmentShaderSource);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(fs);
      if (info) console.warn('Hex shader compile warning:', info);
      return;
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
  }, []);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
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
    gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), mouseRef.current.x, 1.0 - mouseRef.current.y);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    if (isMobileDevice()) return;
    initGL();
    rafRef.current = requestAnimationFrame(render);

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (x !== undefined && y !== undefined) {
        mouseRef.current = {
          x: (x - rect.left) / rect.width,
          y: (y - rect.top) / rect.height,
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

  if (typeof window !== 'undefined' && isMobileDevice()) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}
