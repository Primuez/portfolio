'use client';

import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
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

float cursor_radius = 3.0;
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

    vec3 finalColor = bg_color + (chromeHighlight * glow * 1.2) * 1.5 + noise;
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export function HowWeWorkBackground() {
  const isMobile = useIsMobile();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) return;
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    let mounted = true;
    let animId: number;
    let renderer: import('three').WebGLRenderer;
    let handleMouseMove: (e: MouseEvent) => void;
    let handleTouchMove: (e: TouchEvent) => void;
    let handleResize: () => void;

    import('three').then((THREE) => {
      if (!mounted || !container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const uniforms = {
        u_time: { value: 0.0 },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_intensity: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const mouse = new THREE.Vector2(0.5, 0.5);
      const targetMouse = new THREE.Vector2(0.5, 0.5);
      const lastMousePos = new THREE.Vector2(0.5, 0.5);
      let velocity = 0;

      handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        targetMouse.x = (e.clientX - rect.left) / rect.width;
        targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      };

      handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const rect = container.getBoundingClientRect();
          targetMouse.x = (e.touches[0].clientX - rect.left) / rect.width;
          targetMouse.y = 1.0 - (e.touches[0].clientY - rect.top) / rect.height;
        }
      };

      handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        uniforms.u_resolution.value.set(w, h);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('resize', handleResize);

      const animate = (time: number) => {
        if (!mounted) return;
        animId = requestAnimationFrame(animate);

        const dx = targetMouse.x - lastMousePos.x;
        const dy = targetMouse.y - lastMousePos.y;
        const currentVelocity = Math.sqrt(dx * dx + dy * dy);

        velocity += (currentVelocity - velocity) * 0.15;
        mouse.x += (targetMouse.x - mouse.x) * 0.1;
        mouse.y += (targetMouse.y - mouse.y) * 0.1;

        lastMousePos.copy(targetMouse);

        uniforms.u_intensity.value += (velocity * 25.0 - uniforms.u_intensity.value) * 0.1;
        uniforms.u_intensity.value = Math.max(0.0, uniforms.u_intensity.value);

        uniforms.u_time.value = time * 0.001;
        uniforms.u_mouse.value.copy(mouse);
        renderer.render(scene, camera);
      };

      animId = requestAnimationFrame(animate);

      // Store for cleanup
      (container as any).__shaderCleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', handleResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      mounted = false;
      const cleanup = (container as any)?.__shaderCleanup;
      if (cleanup) {
        cleanup();
        delete (container as any).__shaderCleanup;
      }
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={canvasContainerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      aria-hidden
    />
  );
}
