export default function PageHeader({ title, sub, action }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-end', marginBottom: 24,
    }}>
      <div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
          color: 'var(--text)', letterSpacing: '-0.3px',
        }}>{title}</h2>
        {sub && <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
