'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';

/**
 * ShaderLogoGlow — Interactive iridescent glow effect for the Primuez navbar logo.
 * Renders a small WebGL canvas behind the logo that responds to hover/touch.
 * 
 * On hover: The glow intensifies with iridescent color shift.
 * On touch (mobile): The glow pulses on tap.
 * DPR capped at 1.5 for mobile performance.
 * 
 * PR #16: Interactive Logo Shader
 */
export function ShaderLogoGlow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const hoverRef = useRef(0); // 0 = idle, 1 = hovered
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());
  const [webglSupported, setWebglSupported] = useState(true);

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
    uniform float u_hover;

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

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      float t = u_time * 0.4;
      
      // Center-based distance
      float dist = length(uv - 0.5);
      
      // Noise for organic movement
      float n = noise(uv * 4.0 + vec2(t, t * 0.7));
      
      // Iridescent angle
      float angle = n * 6.28 + t + dist * 4.0;
      
      // Color
      vec3 color;
      color.r = sin(angle) * 0.5 + 0.5;
      color.g = sin(angle + 2.094) * 0.5 + 0.5;
      color.b = sin(angle + 4.188) * 0.5 + 0.5;
      
      // Mix with brand cyan
      vec3 cyan = vec3(0.0, 0.94, 1.0);
      color = mix(color, cyan, 0.5);
      
      // Radial falloff — glow emanates from center
      float glow = smoothstep(0.7, 0.1, dist);
      
      // Hover intensity
      float intensity = mix(0.0, 0.6, u_hover);
      
      // Idle subtle pulse
      float pulse = sin(t * 2.0) * 0.05 + 0.05;
      intensity = max(intensity, pulse);
      
      // Mouse proximity boost
      float mouseDist = length(uv - u_mouse);
      float mouseBoost = smoothstep(0.5, 0.0, mouseDist) * u_hover * 0.3;
      intensity += mouseBoost;
      
      color *= glow * intensity;
      
      gl_FragColor = vec4(color, glow * intensity);
    }
  `;

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl) {
      setWebglSupported(false);
      return false;
    }
    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      setWebglSupported(false);
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
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), w, h);
    gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), mouseRef.current.x, mouseRef.current.y);
    gl.uniform1f(gl.getUniformLocation(program, 'u_hover'), hoverRef.current);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const success = initGL();
    if (!success) return;
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      const gl = glRef.current;
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        glRef.current = null;
      }
    };
  }, [initGL, render]);

  const handleMouseEnter = () => {
    hoverRef.current = 1;
  };

  const handleMouseLeave = () => {
    hoverRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height,
    };
  };

  const handleTouchStart = () => {
    hoverRef.current = 1;
    // Pulse on touch — reset after 600ms
    setTimeout(() => {
      hoverRef.current = 0;
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
    >
      {/* WebGL glow canvas behind logo */}
      {webglSupported && (
        <canvas
          ref={canvasRef}
          className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-0"
          style={{ filter: 'blur(8px)' }}
          aria-hidden="true"
        />
      )}
      {/* Logo content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
