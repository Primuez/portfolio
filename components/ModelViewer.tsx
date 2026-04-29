'use client';
import { useMemo } from 'react';

const STAR_SEED = [
  [1.8, 1.8, 12.3, 77.4, 0.55],
  [2.1, 2.1, 34.7, 5.2, 0.72],
  [1.2, 1.2, 56.1, 42.8, 0.31],
  [2.8, 2.8, 8.9, 91.5, 0.64],
  [1.5, 1.5, 23.4, 18.7, 0.48],
  [2.4, 2.4, 67.3, 33.9, 0.77],
  [1.1, 1.1, 45.6, 62.1, 0.22],
  [2.9, 2.9, 89.2, 7.4, 0.83],
  [1.7, 1.7, 71.5, 55.3, 0.41],
  [2.3, 2.3, 3.8, 84.6, 0.68],
  [1.4, 1.4, 38.9, 29.2, 0.35],
  [2.6, 2.6, 15.7, 48.9, 0.79],
  [1.9, 1.9, 52.4, 73.1, 0.57],
  [2.0, 2.0, 94.1, 22.5, 0.44],
  [1.3, 1.3, 27.6, 67.8, 0.62],
  [2.7, 2.7, 61.3, 11.4, 0.28],
  [1.6, 1.6, 83.7, 38.2, 0.71],
  [2.2, 2.2, 19.5, 95.6, 0.39],
  [1.0, 1.0, 74.8, 14.3, 0.85],
  [2.5, 2.5, 42.1, 51.7, 0.53],
  [1.8, 1.8, 6.4, 79.9, 0.46],
  [2.1, 2.1, 58.7, 26.4, 0.67],
  [1.2, 1.2, 31.2, 44.8, 0.33],
  [2.8, 2.8, 77.9, 3.1, 0.74],
  [1.5, 1.5, 13.6, 88.7, 0.59],
  [2.4, 2.4, 96.3, 59.2, 0.82],
  [1.1, 1.1, 48.5, 17.6, 0.27],
  [2.9, 2.9, 22.8, 72.3, 0.91],
  [1.7, 1.7, 65.4, 34.9, 0.43],
  [2.3, 2.3, 87.1, 8.5, 0.66],
  [1.4, 1.4, 4.7, 53.1, 0.37],
  [2.6, 2.6, 39.3, 97.4, 0.78],
  [1.9, 1.9, 57.8, 41.6, 0.51],
  [2.0, 2.0, 18.2, 15.9, 0.69],
  [1.3, 1.3, 72.6, 86.3, 0.24],
  [2.7, 2.7, 93.4, 30.7, 0.88],
  [1.6, 1.6, 26.9, 64.5, 0.47],
  [2.2, 2.2, 44.3, 9.8, 0.73],
  [1.0, 1.0, 81.7, 47.2, 0.56],
  [2.5, 2.5, 11.1, 93.6, 0.34],
  [1.8, 1.8, 69.5, 21.4, 0.81],
  [2.1, 2.1, 35.8, 76.8, 0.45],
  [1.2, 1.2, 50.2, 40.3, 0.62],
  [2.8, 2.8, 7.6, 58.7, 0.29],
  [1.5, 1.5, 88.4, 13.2, 0.76],
  [2.4, 2.4, 24.7, 82.5, 0.53],
  [1.1, 1.1, 63.1, 28.9, 0.87],
  [2.9, 2.9, 46.5, 67.4, 0.41],
  [1.7, 1.7, 79.8, 4.6, 0.64],
  [2.3, 2.3, 17.3, 90.1, 0.38],
  [1.4, 1.4, 54.6, 36.7, 0.75],
  [2.6, 2.6, 91.2, 61.3, 0.49],
  [1.9, 1.9, 32.4, 24.8, 0.83],
  [2.0, 2.0, 73.9, 50.2, 0.22],
  [1.3, 1.3, 9.3, 75.6, 0.71],
  [2.7, 2.7, 41.7, 19.3, 0.57],
  [1.6, 1.6, 86.1, 85.7, 0.36],
  [2.2, 2.2, 28.5, 45.9, 0.69],
  [1.0, 1.0, 60.9, 11.8, 0.44],
  [2.5, 2.5, 5.2, 69.4, 0.92],
];

export function ModelViewer() {
  const stars = useMemo(() => STAR_SEED, []);

  return (
    <div className="w-full h-[400px] border border-cyan/20 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,240,255,0.1)] bg-bg flex items-center justify-center">
      <div className="absolute top-4 left-4 z-10 font-mono text-xs text-cyan tracking-widest bg-black/60 px-3 py-1 rounded border border-cyan/20 backdrop-blur-md">
        n8n_CORE_ORCHESTRATOR.obj
      </div>
      <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-text-muted tracking-widest bg-black/40 px-2 py-1 rounded hidden sm:block">
        orbital view
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex gap-2 items-center">
        <span className="w-2 h-2 rounded-full bg-amber animate-pulse"></span>
        <span className="w-2 h-2 rounded-full bg-cyan animate-[pulse_2s_infinite]"></span>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {stars.map(([w, h, top, left, opacity], i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: w + 'px',
              height: h + 'px',
              top: top + '%',
              left: left + '%',
              opacity,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
        <div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 240,
            background: 'radial-gradient(circle at 35% 35%, #4a9eff 0%, #1a5cbf 35%, #0a2a6e 65%, #040d1e 100%)',
            boxShadow: '0 0 60px rgba(0,150,255,0.25), inset -20px -10px 40px rgba(0,0,0,0.6)',
            animation: 'spin 18s linear infinite',
          }}
        />

        <div
          className="absolute rounded-full"
          style={{
            width: 248,
            height: 248,
            background: 'radial-gradient(ellipse at 30% 30%, rgba(51,153,255,0.18) 0%, transparent 70%)',
            animation: 'spin 25s linear infinite reverse',
          }}
        />

        <div
          className="absolute rounded-full border border-amber/50"
          style={{
            width: 310,
            height: 310,
            borderRadius: '50%',
            transform: 'rotateX(75deg)',
            boxShadow: '0 0 12px rgba(245,166,35,0.4)',
            animation: 'spin 8s linear infinite',
          }}
        />

        <div
          className="absolute rounded-full border border-cyan/40"
          style={{
            width: 360,
            height: 360,
            borderRadius: '50%',
            transform: 'rotateX(65deg) rotateZ(35deg)',
            boxShadow: '0 0 10px rgba(0,240,255,0.3)',
            animation: 'spin 12s linear infinite reverse',
          }}
        />

        <div
          className="absolute rounded-full bg-amber"
          style={{
            width: 8,
            height: 8,
            top: '50%',
            left: '50%',
            marginTop: -155,
            marginLeft: -4,
            boxShadow: '0 0 8px #f5a623',
            animation: 'orbit-amber 8s linear infinite',
            transformOrigin: '4px 155px',
          }}
        />

        <div
          className="absolute rounded-full bg-cyan"
          style={{
            width: 6,
            height: 6,
            top: '50%',
            left: '50%',
            marginTop: -180,
            marginLeft: -3,
            boxShadow: '0 0 8px #00f0ff',
            animation: 'orbit-cyan 12s linear infinite reverse',
            transformOrigin: '3px 180px',
          }}
        />
      </div>

      <style>{`
        @keyframes orbit-amber {
          from { transform: rotate(0deg) translateY(0); }
          to   { transform: rotate(360deg) translateY(0); }
        }
        @keyframes orbit-cyan {
          from { transform: rotate(0deg) translateY(0); }
          to   { transform: rotate(360deg) translateY(0); }
        }
      `}</style>
    </div>
  );
}
