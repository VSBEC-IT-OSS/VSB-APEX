import { useState } from 'react';
import { useData } from '../hooks/useData.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { AlertTriangle, Info, Zap, Users, BookOpen, CheckCircle } from 'lucide-react';

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };
const CAT_ICON = { Attendance: Users, Results: BookOpen };

export default function Insights() {
  const { data, loading } = useData('getInsights');
  const [filter, setFilter] = useState('All');

  if (loading) return <LoadingSpinner />;

  const counts = {
    critical: data.filter(i => i.severity === 'critical').length,
    warning:  data.filter(i => i.severity === 'warning').length,
    info:     data.filter(i => i.severity === 'info').length,
  };

  const filtered = filter === 'All' ? data
    : data.filter(i => i.severity === filter || i.category === filter);
  const sorted = [...filtered].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  const SEVERITY_STYLE = {
    critical: { bg: 'var(--red-bg)',    text: 'var(--red)',    bar: '#dc2626', icon: AlertTriangle },
    warning:  { bg: 'var(--yellow-bg)', text: 'var(--yellow)', bar: '#b45309', icon: Zap           },
    info:     { bg: 'var(--accent-bg)', text: 'var(--accent)', bar: '#1e3a5f', icon: Info          },
  };

  return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader title="Auto Insights" sub="Rule-based observations generated from attendance & results data" />

      {/* Summary cards */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { key: 'critical', label: 'Critical Issues',  value: counts.critical, desc: 'Require immediate action'    },
          { key: 'warning',  label: 'Warnings',         value: counts.warning,  desc: 'Need close monitoring'       },
          { key: 'info',     label: 'Positive Notes',   value: counts.info,     desc: 'Good standing sections'      },
        ].map(s => {
          const st = SEVERITY_STYLE[s.key];
          const Icon = st.icon;
          return (
            <div key={s.key}
              onClick={() => setFilter(filter === s.key ? 'All' : s.key)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderLeft: `4px solid ${st.bar}`,
                borderRadius: 10, padding: '16px 20px',
                boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
                outline: filter === s.key ? `2px solid ${st.bar}` : 'none',
                transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {s.label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: st.text, lineHeight: 1, marginTop: 4 }}>
                    {s.value}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{s.desc}</p>
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 9, background: st.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={st.text} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="fade-up-2" style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
        {['All','critical','warning','info','Attendance','Results'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            border: '1px solid',
            background: filter === f ? 'var(--accent)' : 'var(--surface)',
            color:      filter === f ? '#fff' : 'var(--text2)',
            borderColor:filter === f ? 'var(--accent)' : 'var(--border)',
            textTransform: 'capitalize', transition: 'all 0.15s',
          }}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)' }}>
          {sorted.length} insight{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Insight list */}
      <div className="fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 40 }}>
            <CheckCircle size={28} color="var(--green)" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: 'var(--text2)', fontWeight: 500 }}>No insights match this filter.</p>
          </Card>
        )}
        {sorted.map(ins => {
          const st  = SEVERITY_STYLE[ins.severity];
          const CatIcon = CAT_ICON[ins.category] ?? Info;
          return (
            <Card key={ins.id} style={{
              borderLeft: `4px solid ${st.bar}`,
              padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 9, background: st.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CatIcon size={16} color={st.text} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{ins.title}</span>
                    <Badge type={ins.severity}>{ins.severity}</Badge>
                    <Badge type="info">{ins.category}</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{ins.detail}</p>
                  <div style={{
                    display: 'flex', gap: 20, marginTop: 10, paddingTop: 10,
                    borderTop: '1px solid var(--border)', flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                      <strong style={{ color: 'var(--text2)' }}>Section:</strong> {ins.section}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                      <strong style={{ color: 'var(--text2)' }}>Metric:</strong> {ins.metric}
                    </span>
                    {ins.affected > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: st.text }}>
                        ⚠ {ins.affected} students affected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
