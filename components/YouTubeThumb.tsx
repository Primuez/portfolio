'use client';
import { Play } from 'lucide-react';

export function YouTubeThumb({
  videoId,
  url,
  label = 'Watch demo',
}: {
  videoId: string;
  url: string;
  label?: string;
}) {
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="block w-full mt-4 relative rounded-lg overflow-hidden border border-cyan/20 group/yt shadow-[0_0_20px_rgba(0,240,255,0.05)] hover:border-cyan/60 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all"
    >
      <div className="aspect-video w-full bg-black relative">
        <img
          src={thumb}
          alt={label}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-80 group-hover/yt:opacity-100 group-hover/yt:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.6)] group-hover/yt:scale-110 group-hover/yt:bg-red-500 transition-all">
            <Play size={24} className="text-white fill-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase">
          <span className="text-cyan/90 tracking-widest">▶ {label}</span>
          <span className="text-text-muted">YouTube</span>
        </div>
      </div>
    </a>
  );
}
