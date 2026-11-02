'use client';

import React, { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 vUv;
void main() {
  vUv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform vec2 u_resolution;
varying vec2 vUv;

vec3 bg_color = vec3(0.039, 0.039, 0.059);
vec3 c_base = vec3(0.094, 0.094, 0.102);
vec3 c_up = vec3(0.961, 1.0, 0.941);
vec3 c_down = vec3(0.710, 0.710, 0.710);
vec3 c_left = vec3(0.310, 0.310, 0.310);
vec3 c_right = vec3(0.922, 0.922, 0.922);

float cursor_radius = 1.2;
float flutes_angle = 120.0 * 3.14159265 / 180.0;
float flutes_frequency = 8.0;
float flutes_refraction = 4.0;
float grain_strength = 0.04;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float metallicSlope(float b) {
  return smoothstep(0.0, 0.05, b) * (1.0 - smoothstep(0.05, 0.7, b));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = -1.0 + 2.0 * uv;
  p.x *= u_resolution.x / u_resolution.y;
  vec2 mouse = -1.0 + 2.0 * u_mouse;
  mouse.x *= u_resolution.x / u_resolution.y;

  float dist = length(p - mouse);
  vec2 dir = normalize(p - mouse + 0.0001);

  float localDistortion = exp(-dist * 4.0) * (flutes_refraction * 0.05);
  vec2 distortedP = p - (dir * localDistortion * u_intensity);

  float scaled_freq = flutes_frequency * 0.35;
  float slant = (distortedP.x * cos(flutes_angle) - distortedP.y * sin(flutes_angle));
  float raw_bands = slant * scaled_freq + u_time * 0.05;

  float glow = smoothstep(cursor_radius, 0.0, dist) * u_intensity;

  float wUp = smoothstep(0.0, 1.0, dir.y);
  float wDown = smoothstep(0.0, 1.0, -dir.y);
  float wRight = smoothstep(0.0, 1.0, dir.x);
  float wLeft = smoothstep(0.0, 1.0, -dir.x);

  vec3 dynamicLight = c_base + (c_up * wUp + c_down * wDown + c_left * wLeft + c_right * wRight) * 1.5;

  float shift = 0.015 * flutes_refraction * glow;
  vec3 ca = vec3(
    metallicSlope(fract(raw_bands + shift)),
    metallicSlope(fract(raw_bands)),
    metallicSlope(fract(raw_bands - shift))
  );

  float gBand = fract(raw_bands);
  float coreSpecular = smoothstep(0.0, 0.02, gBand) * (1.0 - smoothstep(0.02, 0.1, gBand));

  vec3 chromeHighlight = (dynamicLight * ca) + (coreSpecular * 0.8);

  float noise = random(uv + u_time * 0.05) * grain_strength;
  vec3 finalColor = bg_color + (chromeHighlight * glow * 0.5) * 0.7 + noise;
  gl_FragColor = vec4(finalColor, 0.45);
}
`;

export function HowWeWorkBackground() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none opacity-40 transition-opacity duration-700';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, powerPreference: 'low-power' });
    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const frag = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const intensityLoc = gl.getUniformLocation(program, 'u_intensity');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');

    let mounted = true;
    let animId = 0;
    const startTime = performance.now();

    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };
    let prevMouse = { x: 0.5, y: 0.5 };
    let currentIntensity = 0.15;

    const handlePointerMove = (x: number, y: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouse.x = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        targetMouse.y = Math.max(0, Math.min(1, 1.0 - (y - rect.top) / rect.height));
      }
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const resize = () => {
      if (!canvas || !container) return;
      const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(container.clientWidth * dpr);
      const h = Math.floor(container.clientHeight * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let isVisible = true;
    let isAnimating = false;

    const render = () => {
      if (!mounted || !isVisible) {
        isAnimating = false;
        return;
      }
      isAnimating = true;

      const elapsed = (performance.now() - startTime) * 0.001;

      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

      const dx = currentMouse.x - prevMouse.x;
      const dy = currentMouse.y - prevMouse.y;
      const vel = Math.sqrt(dx * dx + dy * dy);
      const idleWave = 0.08 + Math.sin(elapsed * 1.5) * 0.04;
      const targetIntensity = vel > 0.0001 ? Math.min(vel * 12, 1.5) : idleWave;
      currentIntensity += (targetIntensity - currentIntensity) * 0.08;

      prevMouse.x = currentMouse.x;
      prevMouse.y = currentMouse.y;

      gl.useProgram(program);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(mouseLoc, currentMouse.x, currentMouse.y);
      gl.uniform1f(intensityLoc, currentIntensity);
      gl.uniform2f(resLoc, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isAnimating) {
          render();
        }
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    render();

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 240, 255, 0.06), transparent 70%)',
        }}
      />
    </div>
  );
}
