"use client";

export function TrustBar() {
  return (
    <div className="w-full border-y border-white/5 bg-[#050505] py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 opacity-70">
        <span className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
          Trusted by innovative businesses across India
        </span>
        <div className="flex gap-6 items-center grayscale">
          <div className="font-bold text-xl tracking-tighter text-white/60">RAIPUR MFG</div>
          <div className="font-bold text-xl tracking-tighter text-white/60">ODOO INDIA</div>
        </div>
      </div>
    </div>
  );
}
