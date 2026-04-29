'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function StockChart() {
  const [data, setData] = useState<{time: number, value: number}[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setData(Array.from({ length: 20 }, (_, i) => ({ time: i, value: 150 + Math.random() * 20 })));
    }, 0);
    
    const interval = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return prev;
        const nextValue = prev[prev.length - 1].value + (Math.random() - 0.5) * 5;
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, value: nextValue }];
        return newData;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return null;

  return (
    <div className="w-full mt-4 bg-bg/50 border border-amber/20 rounded-lg p-2 overflow-hidden shadow-[inset_0_0_20px_rgba(245,166,35,0.05)]" style={{ minHeight: 128 }}>
      <div className="text-[10px] uppercase font-mono text-amber/70 mb-2 pl-2">Live AI Analysis: <span className="animate-pulse">Active</span></div>
      <ResponsiveContainer width="100%" aspect={5}>
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#f5a623" 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={true}
            animationDuration={300}
            animationEasing="linear"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
