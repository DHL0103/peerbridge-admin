import { useState, useEffect } from 'react';
import { T } from '../tokens';

export function BrandMark({ size = 28, color = '#16140f' }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, display: 'block' }} aria-label="peerbridge">
      <rect x="14" y="32" width="20" height="60" rx="10" fill={color} />
      <rect x="66" y="32" width="20" height="60" rx="10" fill={color} />
      <rect x="8" y="20" width="84" height="10" rx="5" fill={color} />
      <circle cx="50" cy="60" r="4" fill={color} />
    </svg>
  );
}

export function BrandWordmark({ size = 28, color = '#16140f', wordSize = 18, gap = 8 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <BrandMark size={size} color={color} />
      <span style={{ fontSize: wordSize, fontWeight: 700, letterSpacing: -0.5, color, fontFamily: T.fDisp }}>peerbridge</span>
    </div>
  );
}

export function IntroAnimation({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 1700);
    const t3 = setTimeout(() => setPhase(3), 2300);
    const t4 = setTimeout(() => setPhase(4), 3100);
    const t5 = setTimeout(() => { onDone && onDone(); }, 3700);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onDone]);

  const ink = T.ink;
  const bg = T.bg;
  const lx = 140, rx = 260;
  const pw = 56, ph = 140;
  const pyTop = 60, pyBot = 200;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: bg, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: phase >= 4 ? 0 : 1,
      transition: 'opacity 600ms ease',
      pointerEvents: phase >= 4 ? 'none' : 'auto',
    }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 400 260" style={{ width: 480, height: 312, overflow: 'visible' }}>
          <text x={lx} y="180" textAnchor="middle"
            style={{
              fontFamily: '"Inter", sans-serif', fontSize: 180, fontWeight: 600,
              fill: ink, opacity: phase === 0 ? 1 : 0, transition: 'opacity 500ms ease',
            }}>P</text>
          <text x={rx} y="180" textAnchor="middle"
            style={{
              fontFamily: '"Inter", sans-serif', fontSize: 180, fontWeight: 600,
              fill: ink, opacity: phase === 0 ? 1 : 0, transition: 'opacity 500ms ease',
            }}>b</text>

          <rect x={lx - pw / 2} y={phase >= 1 ? pyTop : pyBot} width={pw} height={phase >= 1 ? ph : 0} rx={pw / 2} fill={ink}
            style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 350ms ease 200ms, y 700ms cubic-bezier(0.34,1.2,0.4,1) 200ms, height 700ms cubic-bezier(0.34,1.2,0.4,1) 200ms' }} />
          <rect x={rx - pw / 2} y={phase >= 1 ? pyTop : pyBot} width={pw} height={phase >= 1 ? ph : 0} rx={pw / 2} fill={ink}
            style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 350ms ease 280ms, y 700ms cubic-bezier(0.34,1.2,0.4,1) 280ms, height 700ms cubic-bezier(0.34,1.2,0.4,1) 280ms' }} />

          <rect x={phase >= 2 ? 80 : -260} y={36} width={240} height={24} rx={12} fill={ink}
            style={{ opacity: phase >= 2 ? 1 : 0, transition: 'x 700ms cubic-bezier(0.3,0,0.2,1), opacity 240ms ease' }} />

          <circle cx={(lx + rx) / 2} cy={120} r={phase >= 2 ? 10 : 0} fill={ink}
            style={{ transition: 'r 320ms cubic-bezier(0.34,1.56,0.64,1) 480ms' }} />
        </svg>

        <div style={{
          marginTop: 8, fontFamily: T.fDisp, fontSize: 32, fontWeight: 600, letterSpacing: -1.2, color: ink,
          opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 500ms ease, transform 500ms ease',
        }}>peerbridge</div>
      </div>
    </div>
  );
}
