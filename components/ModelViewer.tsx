'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const [colorMap, normalMap, cloudsMap] = useTexture([
    '/textures/earth_color.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_clouds.png',
  ]);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.04;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.525, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.62, 64, 64]} />
        <meshStandardMaterial
          color="#3399ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Amber orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.018, 16, 120]} />
        <meshStandardMaterial color="#f5a623" emissive="#f5a623" emissiveIntensity={2.5} />
      </mesh>

      {/* Cyan orbit ring */}
      <mesh rotation={[0.4, Math.PI / 4, 0.2]}>
        <torusGeometry args={[2.9, 0.018, 16, 120]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function LoadingFallback() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 16, 16]} />
      <meshStandardMaterial color="#00f0ff" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

export function ModelViewer() {
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
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} className="cursor-grab active:cursor-grabbing">
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-8, -4, -8]} intensity={0.4} color="#2244ff" />
        <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={0.8} />
        <Suspense fallback={<LoadingFallback />}>
          <Earth />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>
    </div>
  );
}
