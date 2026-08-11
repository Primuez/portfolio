'use client';

import React from 'react';

export default function LightweightCyberOrb() {
  return (
    <div className="relative w-[320px] h-[320px] flex items-center justify-center select-none pointer-events-none">
      {/* Outer Spinning Ring */}
      <div className="absolute inset-0 rounded-full border border-[#00f0ff]/30 animate-[spin_14s_linear_infinite]" />
      
      {/* Counter-Spinning Accent Ring */}
      <div className="absolute inset-4 rounded-full border border-dashed border-[#f5a623]/25 animate-[spin_20s_linear_infinite_reverse]" />

      {/* Inner Glowing Core */}
      <div className="w-40 h-40 rounded-full bg-radial from-[#00f0ff]/30 via-[#f5a623]/10 to-transparent blur-md animate-pulse" />

      {/* Center Cyber Node */}
      <div className="w-16 h-16 rounded-full bg-[#0a0a0f] border border-[#00f0ff]/50 shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center relative">
        <span className="w-4 h-4 rounded-full bg-[#00f0ff] animate-ping opacity-75 absolute" />
        <span className="w-3 h-3 rounded-full bg-[#00f0ff] relative z-10" />
      </div>

      {/* Decorative Grid Lines */}
      <svg className="absolute w-full h-full opacity-40" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2,2" />
        <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
        <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
      </svg>
      
      {/* Status Label */}
      <div className="absolute bottom-2 font-mono text-[10px] tracking-widest text-[#00f0ff]/70 bg-[#0a0a0f]/80 px-2 py-0.5 rounded border border-[#00f0ff]/20">
        LIGHTWEIGHT_ORB_ACTIVE
      </div>
    </div>
  );
}
