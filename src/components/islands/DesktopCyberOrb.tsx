import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * DesktopCyberOrb
 * Hardware-accelerated 3D wireframe cyber orb rendered exclusively on desktop screens (>=768px).
 * Strictly disabled on mobile/touch devices to guarantee 100/100 Core Web Vitals and zero main-thread jank.
 */
export default function DesktopCyberOrb() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Strict mobile and touch safeguard
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = window.innerWidth < 768 || isTouch;
    if (isMobile) return;

    const container = mountRef.current;
    if (!container) return;

    // 2. Setup Three.js scene
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL not supported or throttled:', e);
      return;
    }

    // 3. Create Cybernetic Icosahedron Wireframe
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const sphere = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(sphere);

    // Inner glowing ring
    const innerGeometry = new THREE.TorusGeometry(1.6, 0.02, 8, 48);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(innerGeometry, innerMaterial);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // 4. Subtle mouse parallax & auto-rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0008;
      mouseY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      sphere.rotation.y += 0.004;
      sphere.rotation.x += 0.002;
      sphere.rotation.y += targetX;
      sphere.rotation.x += targetY;

      ring.rotation.z += 0.006;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };
    animate();

    // 5. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      geometry.dispose();
      wireframeMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 w-[420px] h-[420px] lg:w-[500px] lg:h-[500px] items-center justify-center pointer-events-none select-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
}
