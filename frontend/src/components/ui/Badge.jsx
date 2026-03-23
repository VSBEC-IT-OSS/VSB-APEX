const STYLES = {
  critical: { bg: 'var(--red-bg)',    color: 'var(--red)',    border: '#fca5a5' },
  warning:  { bg: 'var(--yellow-bg)', color: 'var(--yellow)', border: '#fcd34d' },
  info:     { bg: 'var(--accent-bg)', color: 'var(--accent)', border: '#93c5fd' },
  good:     { bg: 'var(--green-bg)',  color: 'var(--green)',  border: '#86efac' },
};

export default function Badge({ type = 'info', children }) {
  const s = STYLES[type] ?? STYLES.info;
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 600, padding: '2px 9px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: '0.05em', textTransform: 'uppercase',
    }}>
      {children}
    </span>
  );
}
