import { ImageResponse } from 'next/og';

export const alt = 'Primuez – AI Systems Builder & Automation Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#070b12',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Courier New', monospace",
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(0,240,255,0.06)',
          }} />
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(0,240,255,0.06)',
          }} />
        </div>

        {/* Hex icon SVG */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: '32px' }}
        >
          <rect width="64" height="64" rx="12" fill="#070b12" />
          <polygon
            points="32,5 52,16 52,38 32,49 12,38 12,16"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
          />
          <polygon
            points="32,10 48,19 48,37 32,46 16,37 16,19"
            fill="rgba(0,240,255,0.05)"
            stroke="rgba(0,240,255,0.2)"
            strokeWidth="0.5"
          />
          <circle cx="32" cy="27" r="4" fill="#00f0ff" />
          <line x1="32" y1="27" x2="32" y2="10" stroke="#00f0ff" strokeWidth="1.2" opacity="0.7" />
          <line x1="32" y1="27" x2="48" y2="19" stroke="#00f0ff" strokeWidth="1.2" opacity="0.7" />
          <line x1="32" y1="27" x2="16" y2="37" stroke="#f5a623" strokeWidth="1.2" opacity="0.9" />
          <circle cx="32" cy="10" r="2.2" fill="#00f0ff" opacity="0.9" />
          <circle cx="48" cy="19" r="2.2" fill="#00f0ff" opacity="0.9" />
          <circle cx="16" cy="37" r="3" fill="#f5a623" />
        </svg>

        {/* PRIMUEZ wordmark */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: '700',
            color: '#00f0ff',
            letterSpacing: '16px',
            lineHeight: 1,
            marginBottom: '20px',
            textShadow: '0 0 40px rgba(0,240,255,0.5)',
          }}
        >
          PRIMUEZ
        </div>

        {/* Separator */}
        <div
          style={{
            width: '320px',
            height: '1px',
            background: 'rgba(0,240,255,0.3)',
            marginBottom: '20px',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(0,240,255,0.75)',
            letterSpacing: '6px',
            fontWeight: '400',
          }}
        >
          AI SYSTEMS BUILDER &amp; AUTOMATION ENGINEER
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            right: '48px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2px',
          }}
        >
          primuez.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
