'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js';

const MapOverlay = dynamic(
  () => import('./MapOverlay').then((m) => m.MapOverlay),
  { ssr: false }
);

const TOTAL_TEXTURES = 5;

export function ModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadedRef = useRef(0);
  const [showMap, setShowMap] = useState(false);

  const onTextureLoaded = useCallback(() => {
    loadedRef.current += 1;
    setLoadedCount(loadedRef.current);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    let mounted = true;
    let animId: number;
    let cleanupFn: (() => void) | null = null;

    Promise.all([
      import('three'),
      import('three/examples/jsm/controls/OrbitControls.js'),
    ]).then(([T, { OrbitControls }]: [typeof THREE, { OrbitControls: typeof OrbitControlsType }]) => {
      if (!mounted || !mount) return;

      const w = mount.clientWidth;
      const h = mount.clientHeight;

      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(45, w / h, 0.1, 1000);
      camera.position.set(0, 0, 5.5);

      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      mount.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = (3 * Math.PI) / 4;

      // Double-click (desktop) opens satellite map
      const handleDblClick = () => setShowMap(true);
      renderer.domElement.addEventListener('dblclick', handleDblClick);

      // Double-tap (mobile) — detect two taps within 350ms
      let lastTapTime = 0;
      const handleTouchEnd = (e: TouchEvent) => {
        if (e.touches.length > 0) return; // still touching
        const now = Date.now();
        if (now - lastTapTime < 350) {
          setShowMap(true);
          lastTapTime = 0;
        } else {
          lastTapTime = now;
        }
      };
      renderer.domElement.addEventListener('touchend', handleTouchEnd, { passive: true });

      scene.add(new T.AmbientLight(0xffffff, 0.35));
      const sun = new T.DirectionalLight(0xffffff, 2);
      sun.position.set(5, 3, 5);
      scene.add(sun);
      const nightFill = new T.PointLight(0x0a0a2e, 0.15);
      nightFill.position.set(-5, -3, -5);
      scene.add(nightFill);

      const starGeo = new T.BufferGeometry();
      const starCount = 1500;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 200;
      }
      starGeo.setAttribute('position', new T.BufferAttribute(starPos, 3));
      const starMat = new T.PointsMaterial({ color: 0xffffff, size: 0.15, sizeAttenuation: true });
      scene.add(new T.Points(starGeo, starMat));

      const loader = new T.TextureLoader();
      const disposables: { dispose(): void }[] = [starGeo, starMat];

      const earthGeo = new T.SphereGeometry(1.5, 64, 64);
      const earthMat = new T.MeshStandardMaterial({ roughness: 0.85, metalness: 0.1, emissive: new T.Color(0xffffff) });

      // Uniform holding the sun direction in view space, updated every frame
      const sunDirUniform = { value: new T.Vector3(0, 0, 1) };

      // Patch the standard shader for two effects:
      // 1. Invert roughnessMap: specular texture is bright=ocean, but roughnessMap
      //    treats bright=rough. We flip the G channel so oceans are smooth & shiny.
      // 2. Mask emissive (city lights) to the night hemisphere only.
      earthMat.onBeforeCompile = (shader) => {
        shader.uniforms.uSunDir = sunDirUniform;
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          '#include <common>\nuniform vec3 uSunDir;'
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <roughnessmap_fragment>',
          [
            'float roughnessFactor = roughness;',
            '#ifdef USE_ROUGHNESSMAP',
            '  vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );',
            '  roughnessFactor *= (1.0 - texelRoughness.g);',
            '#endif',
          ].join('\n')
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          'outgoingLight += totalEmissiveRadiance;',
          [
            'float _nightFactor = max(0.0, -dot(normal, uSunDir));',
            'float _smoothNight = smoothstep(0.0, 0.25, _nightFactor);',
            'outgoingLight += totalEmissiveRadiance * _smoothNight;',
          ].join('\n')
        );
      };

      const earthMesh = new T.Mesh(earthGeo, earthMat);
      scene.add(earthMesh);
      disposables.push(earthGeo, earthMat);

      loader.load('/textures/earth_color.jpg', (colorTex) => {
        if (!mounted) { colorTex.dispose(); return; }
        earthMat.map = colorTex;
        earthMat.needsUpdate = true;
        disposables.push(colorTex);
        onTextureLoaded();
      }, undefined, () => { onTextureLoaded(); });
      loader.load('/textures/earth_normal.jpg', (normalTex) => {
        if (!mounted) { normalTex.dispose(); return; }
        earthMat.normalMap = normalTex;
        earthMat.normalScale = new T.Vector2(0.6, 0.6);
        earthMat.needsUpdate = true;
        disposables.push(normalTex);
        onTextureLoaded();
      }, undefined, () => { onTextureLoaded(); });
      loader.load('/textures/earth_lights.jpg', (lightsTex) => {
        if (!mounted) { lightsTex.dispose(); return; }
        earthMat.emissiveMap = lightsTex;
        earthMat.needsUpdate = true;
        disposables.push(lightsTex);
        onTextureLoaded();
      }, undefined, () => { onTextureLoaded(); });
      loader.load('/textures/earth_specular.jpg', (specTex) => {
        if (!mounted) { specTex.dispose(); return; }
        earthMat.roughnessMap = specTex;
        earthMat.needsUpdate = true;
        disposables.push(specTex);
        onTextureLoaded();
      }, undefined, () => { onTextureLoaded(); });

      const cloudGeo = new T.SphereGeometry(1.525, 64, 64);
      const cloudMat = new T.MeshStandardMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const cloudMesh = new T.Mesh(cloudGeo, cloudMat);
      scene.add(cloudMesh);
      disposables.push(cloudGeo, cloudMat);

      loader.load('/textures/earth_clouds.png', (cloudTex) => {
        if (!mounted) { cloudTex.dispose(); return; }
        cloudMat.map = cloudTex;
        cloudMat.opacity = 0.35;
        cloudMat.needsUpdate = true;
        disposables.push(cloudTex);
        onTextureLoaded();
      }, undefined, () => { onTextureLoaded(); });

      const atmGeo = new T.SphereGeometry(1.62, 64, 64);
      const atmMat = new T.MeshStandardMaterial({ color: 0x3399ff, transparent: true, opacity: 0.06, side: T.BackSide });
      scene.add(new T.Mesh(atmGeo, atmMat));
      disposables.push(atmGeo, atmMat);

      const amberGeo = new T.TorusGeometry(2.5, 0.018, 16, 120);
      const amberMat = new T.MeshStandardMaterial({ color: 0xf5a623, emissive: new T.Color(0xf5a623), emissiveIntensity: 2.5 });
      const amberRing = new T.Mesh(amberGeo, amberMat);
      amberRing.rotation.x = Math.PI / 2;
      scene.add(amberRing);
      disposables.push(amberGeo, amberMat);

      const cyanGeo = new T.TorusGeometry(2.9, 0.018, 16, 120);
      const cyanMat = new T.MeshStandardMaterial({ color: 0x00f0ff, emissive: new T.Color(0x00f0ff), emissiveIntensity: 1.5 });
      const cyanRing = new T.Mesh(cyanGeo, cyanMat);
      cyanRing.rotation.set(0.4, Math.PI / 4, 0.2);
      scene.add(cyanRing);
      disposables.push(cyanGeo, cyanMat);

      const clock = new T.Clock();
      let elapsed = 0;
      let isVisible = true;
      let animating = false;

      const animate = () => {
        if (!isVisible) {
          animating = false;
          return;
        }
        animating = true;
        animId = requestAnimationFrame(animate);
        const delta = Math.min(clock.getDelta(), 0.1);
        elapsed += delta;
        cloudMesh.rotation.y += delta * 0.04;
        const orbitAngle = (elapsed / 60) * Math.PI * 2;
        const radius = 8;
        sun.position.set(Math.sin(orbitAngle) * radius, 3, Math.cos(orbitAngle) * radius);
        nightFill.position.set(-Math.sin(orbitAngle) * radius, -3, -Math.cos(orbitAngle) * radius);
        // Keep sun direction uniform in sync with the orbiting light (view space)
        sunDirUniform.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
        controls.update(delta);
        renderer.render(scene, camera);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries[0].isIntersecting;
          isVisible = visible;
          if (visible && !animating) {
            clock.getDelta();
            animate();
          }
        },
        { threshold: 0 }
      );
      observer.observe(mount);

      animate();

      const onResize = () => {
        const nw = mount.clientWidth;
        const nh = mount.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', onResize);

      cleanupFn = () => {
        observer.disconnect();
        window.removeEventListener('resize', onResize);
        renderer.domElement.removeEventListener('dblclick', handleDblClick);
        renderer.domElement.removeEventListener('touchend', handleTouchEnd);
        cancelAnimationFrame(animId);
        controls.dispose();
        for (const d of disposables) d.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      mounted = false;
      cleanupFn?.();
    };
  }, [onTextureLoaded]);

  const isLoading = loadedCount < TOTAL_TEXTURES;

  return (
    <>
      {showMap && <MapOverlay onClose={() => setShowMap(false)} />}

      <div className="w-full h-[400px] border border-cyan/20 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,240,255,0.1)] bg-bg">
        {/* Loading overlay — fades out once all textures are ready */}
        <div
          role="status"
          aria-live="polite"
          aria-label={isLoading ? 'Loading globe textures' : undefined}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-bg/80 backdrop-blur-sm transition-opacity duration-700 pointer-events-none"
          style={{ opacity: isLoading ? 1 : 0 }}
          aria-hidden={!isLoading}
        >
          <div className="w-8 h-8 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
          <span className="font-mono text-xs text-cyan tracking-widest">LOADING…</span>
        </div>
        <div className="absolute top-4 left-4 z-10 font-mono text-xs text-cyan tracking-widest bg-black/60 px-3 py-1 rounded border border-cyan/20 backdrop-blur-md">
          n8n_CORE_ORCHESTRATOR.obj
        </div>
        <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-text-muted tracking-widest bg-black/40 px-2 py-1 rounded hidden sm:block">
          drag · double-tap to explore
        </div>
        <div className="absolute bottom-4 right-4 z-10 flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-amber animate-pulse"></span>
          <span className="w-2 h-2 rounded-full bg-cyan animate-[pulse_2s_infinite]"></span>
        </div>
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      </div>
    </>
  );
}
