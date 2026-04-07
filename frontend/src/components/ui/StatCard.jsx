// frontend/src/components/ui/StatCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  blue:   { bg: 'var(--accent-bg)',  text: 'var(--accent)',  bar: 'var(--accent)'  },
  green:  { bg: 'var(--green-bg)',   text: 'var(--green)',   bar: 'var(--green)'   },
  yellow: { bg: 'var(--yellow-bg)',  text: 'var(--yellow)',  bar: 'var(--yellow)'  },
  red:    { bg: 'var(--red-bg)',     text: 'var(--red)',     bar: 'var(--red)'     },
  purple: { bg: 'var(--purple-bg)',  text: 'var(--purple)',  bar: 'var(--purple)'  },
  gold:   { bg: 'var(--gold-bg)',    text: 'var(--gold)',    bar: 'var(--gold)'    },
};

/**
 * StatCard — interactive KPI card.
 */
export default function StatCard({
  label, value, sub, color = 'blue', icon: Icon,
  linkTo, linkState, hoverContent,
}) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const c = COLORS[color];
  const isClickable = !!linkTo;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (linkTo) {
          e.stopPropagation();
          navigate(linkTo, { state: linkState });
        }
      }}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '18px 20px',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        borderTop: `3px solid ${c.bar}`,
        cursor: isClickable ? 'pointer' : 'default',
        transform: hovered && isClickable ? 'translateY(-2px)' : 'none',
        transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 11, color: 'var(--text3)', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8,
          }}>{label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
              color: c.text, lineHeight: 1,
            }}>{value ?? '—'}</p>
            {hoverContent && (
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: 'var(--surface2)', color: 'var(--text3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, cursor: 'help',
                border: '1px solid var(--border)',
              }}>i</div>
            )}
          </div>
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

      {isClickable && (
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontSize: 10, color: c.text, opacity: 0.6,
          fontWeight: 600, letterSpacing: '0.04em',
        }}>
          View Details →
        </div>
      )}
    </div>
  );
}
