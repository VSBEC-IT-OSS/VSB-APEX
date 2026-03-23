export function Table({ headers, children }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: 'var(--surface2)', borderBottom: '2px solid var(--border)' }}>
          {headers.map(h => (
            <th key={h} style={{
              padding: '10px 16px', textAlign: 'left',
              fontSize: 11, color: 'var(--text3)', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Tr({ children, highlight }) {
  return (
    <tr style={{
      borderBottom: '1px solid var(--border)',
      background: highlight ? 'rgba(220,38,38,0.03)' : 'transparent',
      transition: 'background 0.1s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => e.currentTarget.style.background = highlight ? 'rgba(220,38,38,0.03)' : 'transparent'}
    >{children}</tr>
  );
}

export function Td({ children, style = {} }) {
  return (
    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--text2)', ...style }}>
      {children}
    </td>
  );
}
