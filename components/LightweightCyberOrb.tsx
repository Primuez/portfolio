export default function LightweightCyberOrb() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center border border-cyan/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)] bg-bg">
      <div className="absolute top-4 left-4 z-10 font-mono text-xs text-cyan tracking-widest bg-black/60 px-3 py-1 rounded border border-cyan/20 backdrop-blur-md">
        n8n_CORE_ORCHESTRATOR.obj (Lightweight Mode)
      </div>
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#00f0ff]/30 animate-[spin_14s_linear_infinite]" />
        <div className="w-40 h-40 rounded-full bg-radial from-[#00f0ff]/30 via-[#f5a623]/10 to-transparent blur-md animate-pulse" />
        <svg className="absolute w-full h-full opacity-40 pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2,2" />
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-text-muted tracking-widest bg-black/40 px-2 py-1 rounded hidden sm:block">
        adaptive render · low-spec fallback
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex gap-2 items-center">
        <span className="w-2 h-2 rounded-full bg-amber animate-pulse"></span>
        <span className="w-2 h-2 rounded-full bg-cyan animate-[pulse_2s_infinite]"></span>
      </div>
    </div>
  );
}
