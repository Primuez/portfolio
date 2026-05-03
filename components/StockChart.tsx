'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ExternalLink } from 'lucide-react';

const VIDEO_URL = 'https://youtu.be/C3uOr_HnEYA?si=Dv5uVE-_UNcBhAIv';

function generateStockData(length: number): { time: number; value: number }[] {
  const out: { time: number; value: number }[] = [];
  let price = 150;
  let trend = 0;
  for (let i = 0; i < length; i++) {
    // Frequently flip trend direction for sharp zigzag movement
    if (Math.random() < 0.35) trend = (Math.random() - 0.5) * 14;
    // Aggressive random walk with frequent spikes (real stock chart feel)
    const spike = Math.random() < 0.22 ? (Math.random() - 0.5) * 28 : 0;
    price += trend + (Math.random() - 0.5) * 9 + spike;
    price = Math.max(80, Math.min(230, price));
    out.push({ time: i, value: price });
  }
  return out;
}

export function StockChart() {
  const [data, setData] = useState<{ time: number; value: number }[]>([]);

  useEffect(() => {
    setData(generateStockData(40));

    const interval = setInterval(() => {
      setData((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1].value;
        // Sharp, volatile tick-by-tick movement
        const drift = (Math.random() - 0.5) * 16;
        const spike = Math.random() < 0.28 ? (Math.random() - 0.5) * 30 : 0;
        let next = last + drift + spike;
        next = Math.max(80, Math.min(230, next));
        return [...prev.slice(1), { time: prev[prev.length - 1].time + 1, value: next }];
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return null;

  const first = data[0].value;
  const last = data[data.length - 1].value;
  const isUp = last >= first;
  const pct = (((last - first) / first) * 100).toFixed(2);

  return (
    <a
      href={VIDEO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch demo video on YouTube"
      className="block w-full mt-4 bg-bg/50 border border-amber/20 rounded-lg p-2 overflow-hidden shadow-[inset_0_0_20px_rgba(245,166,35,0.05)] hover:border-amber/50 hover:shadow-[inset_0_0_25px_rgba(245,166,35,0.08),0_0_15px_rgba(245,166,35,0.15)] transition-all cursor-pointer group"
      style={{ minHeight: 128 }}
    >
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="text-[10px] uppercase font-mono text-amber/70">
          Live AI Analysis: <span className="animate-pulse">Active</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-mono text-[10px] tabular-nums ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{pct}%
          </span>
          <span className="font-mono text-[10px] text-amber/60 group-hover:text-amber transition-colors flex items-center gap-1">
            <ExternalLink size={10} />
            <span className="hidden sm:inline">Watch demo</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" aspect={5}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="amberFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5a623" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f5a623" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="linear"
            dataKey="value"
            stroke="#f5a623"
            strokeWidth={1.6}
            fill="url(#amberFill)"
            dot={false}
            isAnimationActive={true}
            animationDuration={250}
            animationEasing="linear"
          />
        </AreaChart>
      </ResponsiveContainer>
    </a>
  );
}
