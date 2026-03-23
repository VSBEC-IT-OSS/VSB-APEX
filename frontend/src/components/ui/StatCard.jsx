const COLORS = {
  blue:   { bg: 'var(--accent-bg)',  text: 'var(--accent)',  bar: 'var(--accent)'  },
  green:  { bg: 'var(--green-bg)',   text: 'var(--green)',   bar: 'var(--green)'   },
  yellow: { bg: 'var(--yellow-bg)',  text: 'var(--yellow)',  bar: 'var(--yellow)'  },
  red:    { bg: 'var(--red-bg)',     text: 'var(--red)',     bar: 'var(--red)'     },
  purple: { bg: 'var(--purple-bg)',  text: 'var(--purple)',  bar: 'var(--purple)'  },
  gold:   { bg: 'var(--gold-bg)',    text: 'var(--gold)',    bar: 'var(--gold)'    },
};

export default function StatCard({ label, value, sub, color = 'blue', icon: Icon, trend }) {
  const c = COLORS[color];
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
      borderTop: `3px solid ${c.bar}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 11, color: 'var(--text3)', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8,
          }}>{label}</p>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
            color: c.text, lineHeight: 1,
          }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5 }}>{sub}</p>}
        </div>
        {Icon && (
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: c.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={18} color={c.text} />
          </div>
        )}
      </div>
    </div>
  );
}
