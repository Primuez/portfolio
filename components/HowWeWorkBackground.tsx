'use client';

import { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform vec2 u_resolution;
varying vec2 vUv;

vec3 bg_color = vec3(0.0, 0.0, 0.0);
vec3 c_base = vec3(0.094, 0.094, 0.102);
vec3 c_up = vec3(0.961, 1.0, 0.941);
vec3 c_down = vec3(0.710, 0.710, 0.710);
vec3 c_left = vec3(0.310, 0.310, 0.310);
vec3 c_right = vec3(0.922, 0.922, 0.922);

float cursor_radius = 1.2;
float flutes_angle = 120.0 * 3.14159265 / 180.0;
float flutes_frequency = 8.0;
float flutes_refraction = 4.0;
float grain_strength = 0.05;

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
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export function HowWeWorkBackground() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let mounted = true;
    let animId: number;

    import('three').then((T) => {
      if (!mounted || !container) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      const scene = new T.Scene();
      const camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const renderer = new T.WebGLRenderer({ antialias: false, alpha: false });
      const isMobileDevice = window.innerWidth < 768;
      renderer.setPixelRatio(isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio, 1.5)); // Capped at 1.0 for mobile, 1.5 for desktop
      renderer.setSize(w, h);
      container.appendChild(renderer.domElement);
      canvasRef.current = renderer.domElement;

      const uniforms = {
        u_time: { value: 0 },
        u_mouse: { value: new T.Vector2(0.5, 0.5) },
        u_intensity: { value: 0 },
        u_resolution: { value: new T.Vector2(w, h) },
      };

      const geometry = new T.PlaneGeometry(2, 2);
      const material = new T.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
      });

      const mesh = new T.Mesh(geometry, material);
      scene.add(mesh);

      // Mouse & Touch tracking with window listeners
      let targetMouse = { x: 0.5, y: 0.5 };
      let currentMouse = { x: 0.5, y: 0.5 };
      let prevMouse = { x: 0.5, y: 0.5 };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        targetMouse.x = (e.clientX - rect.left) / rect.width;
        targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        targetMouse.x = (touch.clientX - rect.left) / rect.width;
        targetMouse.y = 1.0 - (touch.clientY - rect.top) / rect.height;
      };

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1.0 - (touch.clientY - rect.top) / rect.height;
        targetMouse.x = x;
        targetMouse.y = y;
        currentMouse.x = x;
        currentMouse.y = y;
        prevMouse.x = x;
        prevMouse.y = y;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchstart', handleTouchStart, { passive: true });

      // ResizeObserver for section resize
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            renderer.setSize(width, height);
            uniforms.u_resolution.value.set(width, height);
          }
        }
      });
      resizeObserver.observe(container);

      const clock = new T.Clock();

      let isVisible = true;
      let animating = false;

      const animate = () => {
        if (!mounted || !isVisible) {
          animating = false;
          return;
        }
        animating = true;
        animId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        uniforms.u_time.value = elapsedTime;

        // Smooth lerp mouse
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;
        uniforms.u_mouse.value.set(currentMouse.x, currentMouse.y);

        // Velocity-driven intensity with base idle wave shimmer
        const dx = currentMouse.x - prevMouse.x;
        const dy = currentMouse.y - prevMouse.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        
        // Dynamic shimmer wave for organic movement when static or on mobile
        const idleShimmer = 0.05 + Math.sin(elapsedTime * 1.5) * 0.02;
        const targetIntensity = velocity > 0.0001 ? (velocity * 8) : idleShimmer;
        
        uniforms.u_intensity.value += (targetIntensity - uniforms.u_intensity.value) * 0.1;
        
        prevMouse.x = currentMouse.x;
        prevMouse.y = currentMouse.y;

        renderer.render(scene, camera);
      };

      const intersectionObserver = new IntersectionObserver((entries) => {
        const visible = entries[0].isIntersecting;
        isVisible = visible;
        if (visible && !animating) {
          clock.getDelta(); // reset clock delta to prevent jump
          animate();
        }
      }, { threshold: 0.01 });
      intersectionObserver.observe(container);

      animate();

      // Cleanup stored for unmount
      const cleanup = () => {
        mounted = false;
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchStart);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };

      // Store cleanup on the container as a data attribute workaround
      (container as any).__cleanup = cleanup;
    });

    return () => {
      mounted = false;
      if ((container as any).__cleanup) {
        (container as any).__cleanup();
        delete (container as any).__cleanup;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
