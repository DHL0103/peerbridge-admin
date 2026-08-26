export const T = {
  bg: '#f5f1ea',
  bgSoft: '#efebe2',
  card: '#ffffff',
  cardSoft: '#faf7f0',
  ink: '#16140f',
  ink2: '#5e5a51',
  ink3: '#9b958a',
  line: 'rgba(22,20,15,0.08)',
  lineStrong: 'rgba(22,20,15,0.16)',
  green: '#1f5132',
  greenSoft: '#e8efe7',
  black: '#16140f',
  fSans: `'Pretendard', -apple-system, "Inter", "Noto Sans KR", sans-serif`,
  fDisp: `'Inter', 'Pretendard', sans-serif`,
  rSm: 12,
  rMd: 16,
  rLg: 24,
  rXl: 32,
  rPill: 999,
  pageX: 56,
  gap: 16,
  gapLg: 24,
  gapXl: 40,
};

export function Btn({ children, variant = 'primary', size = 'md', style, ...rest }) {
  const sizes = {
    sm: { padding: '10px 18px', fontSize: 13 },
    md: { padding: '14px 24px', fontSize: 14 },
    lg: { padding: '18px 30px', fontSize: 15 },
  };
  const variants = {
    primary: { background: T.ink, color: T.card, border: 'none' },
    secondary: { background: T.card, color: T.ink, border: `1px solid ${T.line}` },
    ghost: { background: 'transparent', color: T.ink, border: `1px solid ${T.lineStrong}` },
  };
  return (
    <button style={{
      ...sizes[size], ...variants[variant],
      borderRadius: T.rPill, fontWeight: 500, cursor: 'pointer',
      fontFamily: T.fSans, letterSpacing: -0.2,
      ...style,
    }} {...rest}>{children}</button>
  );
}

export function Tag({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: T.bgSoft, fg: T.ink2 },
    green:   { bg: T.greenSoft, fg: T.green },
    dark:    { bg: T.ink, fg: T.card },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', background: t.bg, color: t.fg,
      borderRadius: T.rPill, fontSize: 11, fontWeight: 500, letterSpacing: -0.1,
    }}>{children}</span>
  );
}

export function SectionHeader({ kicker, title, sub, right, align = 'left' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      marginBottom: 32, gap: 32,
      flexDirection: align === 'center' ? 'column' : 'row',
      textAlign: align === 'center' ? 'center' : 'left',
    }}>
      <div>
        {kicker && <div style={{ fontSize: 12, color: T.ink2, marginBottom: 12, fontWeight: 500 }}>{kicker}</div>}
        <div style={{
          fontFamily: T.fDisp, fontSize: 44, fontWeight: 600,
          letterSpacing: -1.5, lineHeight: 1.1, color: T.ink,
        }}>{title}</div>
        {sub && <div style={{ fontSize: 15, color: T.ink2, marginTop: 12, lineHeight: 1.6, maxWidth: 600 }}>{sub}</div>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function DashStat({ k, v, unit, sub, accent }) {
  return (
    <div style={{ background: T.card, borderRadius: T.rLg, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 12, color: T.ink2 }}>{k}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: T.fDisp, fontSize: 32, fontWeight: 600, letterSpacing: -1.2, color: accent ? T.green : T.ink, lineHeight: 1 }}>{v}</span>
        <span style={{ fontSize: 14, color: accent ? T.green : T.ink2 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11, color: T.ink3 }}>{sub}</div>
    </div>
  );
}
