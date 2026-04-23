'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial 
          color="#00f0ff" 
          envMapIntensity={1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.8} 
          roughness={0.2} 
          distort={0.4} 
          speed={2} 
          emissive="#00f0ff"
          emissiveIntensity={0.5}
        />
      </Sphere>
      {/* Outer shell ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshStandardMaterial color="#f5a623" emissive="#f5a623" emissiveIntensity={2} />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
      </mesh>
    </Float>
  );
}

export function ModelViewer() {
  return (
    <div className="w-full h-[400px] border border-cyan/20 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,240,255,0.1)] bg-bg">
      <div className="absolute top-4 left-4 z-10 font-mono text-xs text-cyan tracking-widest bg-black/60 px-3 py-1 rounded border border-cyan/20 backdrop-blur-md">
        n8n_CORE_ORCHESTRATOR.obj
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
         <span className="w-2 h-2 rounded-full bg-amber animate-pulse"></span>
         <span className="w-2 h-2 rounded-full bg-cyan animate-[pulse_2s_infinite]"></span>
      </div>
      <Canvas camera={{ position: [0, 0, 6] }} className="cursor-move">
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        <AnimatedCore />
      </Canvas>
    </div>
  );
}
