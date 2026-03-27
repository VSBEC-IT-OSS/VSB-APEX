// frontend/src/pages/Overview.jsx

import { Users, BookOpen, TrendingUp, AlertTriangle, Award, GraduationCap } from 'lucide-react';
import { useData } from '../hooks/useData.js';
import StatCard from '../components/ui/StatCard.jsx';
import Card from '../components/ui/Card.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from 'recharts';

const TS = {
  contentStyle: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 8, fontSize: 12, boxShadow: 'var(--shadow-md)',
    color: 'var(--text)',
  },
  labelStyle: { color: 'var(--text2)', fontWeight: 600 },
  itemStyle:  { color: 'var(--text)' },
};export default function Overview() {
  const att = useData('getAttendanceOverview');
  const res = useData('getResultsOverview');
  const pl  = useData('getPlacementStats');

  if (att.loading || res.loading) return <LoadingSpinner />;
  const a = att.data, r = res.data, p = pl.data;

  return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader
        title="Department Overview"
        sub="Academic Year 2024–25 · Department of Information Technology"
      />

      {/* Alert banner */}
      {a.belowThreshold > 50 && (
        <div className="fade-up" style={{
          background: 'var(--red-bg)', border: '1px solid #fca5a5',
          borderLeft: '4px solid var(--red)',
          borderRadius: 8, padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
        }}>
          <AlertTriangle size={15} color="var(--red)" />
          <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 500 }}>
            <strong>{a.belowThreshold} students</strong> are below the 75% attendance threshold and at risk of losing exam eligibility.
          </span>
        </div>
      )}

      {/* KPIs */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard label="Overall Attendance" value={`${a.overall}%`}  sub={`${a.belowThreshold} students below 75%`}   color="blue"   icon={Users}         />
        <StatCard label="Pass Percentage"    value={`${r.overallPassPct}%`} sub={`${r.failCount} arrear cases`}          color="green"  icon={BookOpen}      />
        <StatCard label="Average CGPA"       value={r.avgCGPA}         sub="Department average"                          color="purple" icon={GraduationCap} />
        <StatCard label="Placement Rate"     value={`${p?.placementPct ?? '—'}%`} sub={`${p?.placed ?? '—'} / ${p?.eligible ?? '—'} students placed`} color="gold" icon={Award} />
      </div>

      {/* Charts */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                Attendance Trend
              </h3>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Monthly average · AY 2024–25</p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
              background: 'var(--accent-bg)', color: 'var(--accent)',
            }}>75% threshold</span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={a.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 95]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...TS} />
              <ReferenceLine y={75} stroke="var(--red)" strokeDasharray="4 4" strokeWidth={1.5} />
              <Line type="monotone" dataKey="pct" stroke="var(--accent)" strokeWidth={2.5}
                dot={{ fill: 'var(--accent)', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
              Pass % by Semester
            </h3>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Semester-wise pass percentage</p>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={r.trend} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="sem" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...TS} />
              <Bar dataKey="pass" radius={[5, 5, 0, 0]}>
                {r.trend.map((e, i) => (
                  <Cell key={i} fill={e.pass >= 82 ? '#16a34a' : e.pass >= 76 ? '#1e3a5f' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary strip */}
      <div className="fade-up-3">
        <Card style={{ padding: 0 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          }}>
            {[
              { label: 'Total Students', value: a.totalStudents,      note: 'Across all years'         },
              { label: 'At-risk Students',value: a.belowThreshold,    note: 'Attendance < 75%',  danger: true },
              { label: 'Active Arrears',  value: r.failCount,         note: 'Pending clearance',  danger: r.failCount > 80 },
              { label: 'Companies Visited',value: p?.companies ?? 22, note: 'This placement season' },
            ].map((s, i, arr) => (
              <div key={s.label} style={{
                padding: '18px 22px',
                borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
                  color: s.danger ? 'var(--red)' : 'var(--accent)', marginTop: 4,
                }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
