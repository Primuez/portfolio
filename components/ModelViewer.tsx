'use client';
import { useRef, useEffect } from 'react';
import type * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js';

export function ModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null);

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

      scene.add(new T.AmbientLight(0xffffff, 0.6));
      const sun = new T.DirectionalLight(0xffffff, 2);
      sun.position.set(5, 3, 5);
      scene.add(sun);
      const fill = new T.PointLight(0x2244ff, 0.4);
      fill.position.set(-8, -4, -8);
      scene.add(fill);

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
      const earthMat = new T.MeshStandardMaterial({ roughness: 0.75, metalness: 0.1 });
      const earthMesh = new T.Mesh(earthGeo, earthMat);
      scene.add(earthMesh);
      disposables.push(earthGeo, earthMat);

      loader.load('/textures/earth_color.jpg', (colorTex) => {
        if (!mounted) { colorTex.dispose(); return; }
        earthMat.map = colorTex;
        earthMat.needsUpdate = true;
        disposables.push(colorTex);
      });
      loader.load('/textures/earth_normal.jpg', (normalTex) => {
        if (!mounted) { normalTex.dispose(); return; }
        earthMat.normalMap = normalTex;
        earthMat.normalScale = new T.Vector2(0.6, 0.6);
        earthMat.needsUpdate = true;
        disposables.push(normalTex);
      });

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
      });

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
      const animate = () => {
        animId = requestAnimationFrame(animate);
        cloudMesh.rotation.y += clock.getDelta() * 0.04;
        controls.update();
        renderer.render(scene, camera);
      };
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
        window.removeEventListener('resize', onResize);
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
  }, []);

  return (
    <div className="w-full h-[400px] border border-cyan/20 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,240,255,0.1)] bg-bg">
      <div className="absolute top-4 left-4 z-10 font-mono text-xs text-cyan tracking-widest bg-black/60 px-3 py-1 rounded border border-cyan/20 backdrop-blur-md">
        n8n_CORE_ORCHESTRATOR.obj
      </div>
      <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-text-muted tracking-widest bg-black/40 px-2 py-1 rounded hidden sm:block">
        drag to rotate
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
  );
}
