export default function SectionFilter({ years, selectedYear, onYearChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {['All', ...years].map(y => (
        <button key={y} onClick={() => onYearChange(y)} style={{
          padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
          cursor: 'pointer', border: '1px solid',
          background: selectedYear === y ? 'var(--accent)' : 'var(--surface2)',
          color: selectedYear === y ? '#fff' : 'var(--text2)',
          borderColor: selectedYear === y ? 'var(--accent)' : 'var(--border)',
          transition: 'all 0.15s',
        }}>
          {y}
        </button>
      ))}
    </div>
  );
}
