'use client';
import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const SUN_DIR = new THREE.Vector3(5, 3, 5).normalize();

const VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAG = /* glsl */`
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunDir;
  uniform vec3 camPos;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 N = normalize(vWorldNormal);
    float cosA = dot(N, sunDir);

    /* day / night blend — soft terminator */
    float blend = smoothstep(-0.18, 0.22, cosA);

    vec3 day   = texture2D(dayMap,   vUv).rgb;
    /* night lights: boost & saturate slightly */
    vec3 night = texture2D(nightMap, vUv).rgb;
    night = night * 2.2;

    /* terminator: warm orange aurora at dawn/dusk */
    float rim   = smoothstep(0.0, 0.35, cosA) * smoothstep(0.55, 0.15, cosA);
    vec3 aurora = vec3(1.0, 0.45, 0.1) * rim * 0.45;

    vec3 color = mix(night, day, blend) + aurora;

    /* specular glint on ocean (sun reflection) */
    vec3 V    = normalize(camPos - vWorldPos);
    vec3 H    = normalize(sunDir + V);
    float sp  = pow(max(dot(N, H), 0.0), 80.0) * blend * 0.55;
    color += vec3(sp * 0.9, sp, sp);

    /* atmospheric fresnel rim */
    float fr = pow(1.0 - max(dot(N, V), 0.0), 3.5);
    color += vec3(0.07, 0.22, 0.55) * fr * 0.75;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function Earth() {
  const earthRef  = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const matRef    = useRef<THREE.ShaderMaterial>(null);

  const [dayMap, nightMap, cloudsMap] = useTexture([
    '/textures/earth_color.jpg',
    '/textures/earth_lights.png',
    '/textures/earth_clouds.png',
  ]);

  /* set initial texture uniforms after Suspense resolves */
  useEffect(() => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.dayMap.value   = dayMap;
    m.uniforms.nightMap.value = nightMap;
  }, [dayMap, nightMap]);

  useFrame((state, delta) => {
    /* self-rotate earth so day/night cycle is visible */
    if (earthRef.current)  earthRef.current.rotation.y  += delta * 0.06;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.065;
    /* keep camera position uniform in sync */
    if (matRef.current) {
      matRef.current.uniforms.camPos.value.copy(state.camera.position);
    }
  });

  const uniforms = {
    dayMap:   { value: null as THREE.Texture | null },
    nightMap: { value: null as THREE.Texture | null },
    sunDir:   { value: SUN_DIR.clone() },
    camPos:   { value: new THREE.Vector3() },
  };

  return (
    <group>
      {/* Earth — custom day/night shader */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
        />
      </mesh>

      {/* Clouds — standard lit so they match the sun */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.525, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric outer glow */}
      <mesh>
        <sphereGeometry args={[1.63, 64, 64]} />
        <meshStandardMaterial
          color="#2255cc"
          transparent
          opacity={0.055}
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
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.4;
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
        {/* Sun — position matches SUN_DIR for cloud lighting */}
        <ambientLight intensity={0.08} />
        <directionalLight position={[5, 3, 5]} intensity={2.5} color="#fff8ee" />
        <pointLight position={[-8, -4, -8]} intensity={0.3} color="#1133aa" />
        <Stars radius={100} depth={50} count={1800} factor={4} saturation={0} fade speed={0.6} />
        <Suspense fallback={<LoadingFallback />}>
          <Earth />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>
    </div>
  );
}
