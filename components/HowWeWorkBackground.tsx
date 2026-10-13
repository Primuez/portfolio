'use client';

export function HowWeWorkBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 240, 255, 0.05), transparent 70%)',
      }}
      aria-hidden="true"
    />
  );
}
