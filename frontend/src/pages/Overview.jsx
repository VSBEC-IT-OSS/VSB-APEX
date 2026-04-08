// frontend/src/pages/Overview.jsx
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, TrendingUp, GraduationCap,
  AlertTriangle, Award, Trophy, X,
} from 'lucide-react';
import { useData } from '../hooks/useData.js';
import { dataService } from '../data/dataService.js';
import StatCard from '../components/ui/StatCard.jsx';
import Card from '../components/ui/Card.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import ErrorCard from '../components/ui/ErrorCard.jsx';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';

/* ── Tooltip popup component ── */
function HoverPopup({ title, content, x, y, onClose }) {
  const safeLeft = Math.min(x + 10, window.innerWidth - 300);
  const safeTop  = Math.min(y + 10, window.innerHeight - 250);
  return (
    <div style={{
      position: 'fixed', top: safeTop, left: safeLeft, zIndex: 1000,
      width: 280, background: 'var(--surface)',
      border: '1px solid var(--border)', borderTop: '3px solid var(--accent)',
      borderRadius: 12, padding: '14px 16px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
      animation: 'fadeIn 0.15s ease-out',
      pointerEvents: 'none',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text)', margin:0 }}>{title}</h3>
      </div>
      <div style={{ fontSize:11.5, color:'var(--text2)', lineHeight:1.5 }}>
        {content}
      </div>
    </div>
  );
}

const TS = {
  contentStyle: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 8, fontSize: 12, boxShadow: 'var(--shadow-md)', color: 'var(--text)',
  },
  labelStyle: { color: 'var(--text2)', fontWeight: 600 },
  itemStyle:  { color: 'var(--text)' },
};

function Skeleton({ h = 14, w = '60%' }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 4,
      background: 'linear-gradient(90deg, var(--border) 25%, var(--surface2) 50%, var(--border) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

function Avatar({ name, size = 36 }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const hue = name ? (name.charCodeAt(0) * 37) % 360 : 200;
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 4,
      background: `hsl(${hue},55%,45%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.35,
      flexShrink: 0, letterSpacing: '-0.5px',
    }}>{initials}</div>
  );
}

function TopperRow({ student, rank }) {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 0',
      borderBottom: rank < 2 ? '1px solid var(--border)' : 'none',
    }}>
      <Avatar name={student.name} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{medals[rank] ?? `#${rank + 1}`} {student.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{student.year} · Sec {student.section}</div>
      </div>
      <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:14, color:'var(--accent)' }}>
        {student.percentage ?? student.cgpa ?? student.avgMarks}
        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 2 }}>
          {student.percentage !== undefined ? '%' : student.cgpa !== undefined ? 'GPA' : 'avg'}
        </span>
      </div>
    </div>
  );
}

export default function Overview() {
  const att  = useData('getAttendanceOverview');
  const res  = useData('getResultsOverview');
  const pl   = useData('getPlacementStats');

  const [today,     setToday]     = useState(null);
  const [arrears,   setArrears]   = useState(null);
  const [deptTots,  setDeptTots]  = useState(null);
  const [topPkg,    setTopPkg]    = useState(null);
  const [unplaced,  setUnplaced]  = useState(null);
  const [cgpaTop,   setCgpaTop]   = useState(null);
  const [itToppers, setItToppers] = useState(null);

  const [hover, setHover] = useState(null);

  useEffect(() => {
    dataService.getAttendanceToday().then(setToday).catch(() => {});
    dataService.getArrearSummary().then(setArrears).catch(() => {});
    dataService.getDepartmentTotals().then(setDeptTots).catch(() => {});
    dataService.getTopPackages(3).then(setTopPkg).catch(() => {});
    dataService.getUnplacedCount().then(setUnplaced).catch(() => {});
    dataService.getCGPAToppers(5).then(setCgpaTop).catch(() => {});
    dataService.getInternalToppers(3).then(setItToppers).catch(() => {});
  }, []);

  if (att.loading || res.loading) return <LoadingSpinner />;
  
  if (att.error || res.error) return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader title="Department Overview" sub="Connectivity Error" />
      <ErrorCard message={att.error || res.error} onRetry={() => window.location.reload()} />
    </div>
  );

  const a = att.data || {};
  const r = res.data || {};
  const p = pl.data  || {};

  /* ── Hover content builders ── */
  const attendanceContent = today?.hasData ? (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
      <thead>
        <tr>{['Yr','Sec','Abs','Ttl'].map(h => (<th key={h} style={{ textAlign: 'left', color: 'var(--text3)', paddingBottom: 4 }}>{h}</th>))}</tr>
      </thead>
      <tbody>
        {(today.absentees || []).filter(ab => ab.absent > 0).map((ab, i) => (
          <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
            <td style={{ padding: '3px 0' }}>{ab.year}</td>
            <td style={{ padding: '3px 0' }}>{ab.section}</td>
            <td style={{ padding: '3px 0', color: 'var(--red)', fontWeight: 700 }}>{ab.absent}</td>
            <td style={{ padding: '3px 0', color: 'var(--text3)' }}>{ab.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : <div style={{ fontStyle: 'italic' }}>No attendance data for today.</div>;

  const arrearContent = arrears?.length > 0 ? (
    arrears.map((row, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: i < arrears.length - 1 ? '1px solid var(--border)' : 'none' }}>
        <span>{row.year} · Sec {row.section}</span>
        <span><strong style={{ color: 'var(--red)' }}>{row.withArrears}</strong><span style={{ color: 'var(--text3)' }}>/{row.totalStudents}</span></span>
      </div>
    ))
  ) : <div style={{ fontStyle: 'italic' }}>No arrear data available.</div>;

  const placementContent = topPkg?.length > 0 ? (
    topPkg.map((s, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < topPkg.length - 1 ? '1px solid var(--border)' : 'none' }}>
        <div><div style={{ fontWeight: 600 }}>{['🥇','🥈','🥉'][i]} {s.name}</div><div style={{ fontSize: 10, color: 'var(--text3)' }}>{s.company}</div></div>
        <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: 15 }}>{s.package_lpa}L</div>
      </div>
    ))
  ) : null;

  const onMouseMove = (e) => {
    if (hover) {
      setHover(h => ({ ...h, x: e.clientX, y: e.clientY }));
    }
  };

  const trendData = (a.trend || []).map((t, i) => ({
    month: t.month, attendance: t.pct, pass: (r.trend || [])[i]?.pass ?? null,
  }));

  return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader title="Department Overview" sub="Academic Year 2024–25 · IT Dept" />

      {a.belowThreshold > 50 && (
        <div className="fade-up" style={{ background: 'var(--red-bg)', border: '1px solid #fca5a5', borderLeft: '4px solid var(--red)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <AlertTriangle size={15} color="var(--red)" />
          <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 500 }}><strong>{a.belowThreshold} students</strong> are below 75% attendance threshold.</span>
        </div>
      )}

      <div className="fade-up-1 stat-grid" style={{ marginBottom: 20 }}>
        <div
          onMouseEnter={(e) => setHover({ title: "Today's Absentees", content: attendanceContent, x: e.clientX, y: e.clientY })}
          onMouseMove={onMouseMove}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: 'help' }}
        >
          <StatCard label="Today's Attendance" value={today?.hasData ? `${today.overall}%` : '—'} sub={today?.hasData ? `${(today.totalStudents || 0) - (today.totalPresent || 0)} absent today` : 'No daily data'} color="blue" icon={Users} linkTo="/attendance" hoverContent={!!today} />
        </div>
        <div
          onMouseEnter={(e) => setHover({ title: "Arrear Breakdown", content: arrearContent, x: e.clientX, y: e.clientY })}
          onMouseMove={onMouseMove}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: 'help' }}
        >
          <StatCard label="Pass Percentage" value={deptTots ? `${deptTots.passPercentage}%` : '—'} sub={`${r.failCount ?? '—'} arrear cases`} color="green" icon={BookOpen} hoverContent={!!arrears} />
        </div>
        <StatCard label="Total Students" value={deptTots?.totalStudents ?? '—'} sub={deptTots ? `${deptTots.withArrears} arrears / ${deptTots.totalStudents} total` : 'Loading…'} color="purple" icon={GraduationCap} />
        <div
          onMouseEnter={(e) => setHover({ title: "🏆 Top Packages", content: placementContent, x: e.clientX, y: e.clientY })}
          onMouseMove={onMouseMove}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: 'help' }}
        >
          <StatCard label="Placement Rate" value={`${p.placementPct ?? '—'}%`} sub={`${p.placed ?? '—'} / ${p.eligible ?? '—'} placed`} color="gold" icon={Award} linkTo="/placement" hoverContent={!!topPkg} />
        </div>
      </div>

      <div className="fade-up-2" style={{ marginBottom: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div><h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Attendance & Pass % Trend</h3></div>
            <div className="mobile-hide" style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 11 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 3, background: 'var(--accent)', borderRadius: 2 }} /> Attendance</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 3, background: 'var(--green)', borderRadius: 2 }} /> Pass %</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} /><stop offset="95%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient>
                <linearGradient id="passGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--green)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--green)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 100]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...TS} />
              <ReferenceLine y={75} stroke="var(--red)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="attendance" stroke="var(--accent)" strokeWidth={2.5} fill="url(#attGrad)" dot={{ r:3 }} activeDot={{ r:5 }} />
              <Area type="monotone" dataKey="pass" stroke="var(--green)" strokeWidth={2} fill="url(#passGrad)" dot={{ r:3 }} activeDot={{ r:5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="fade-up-3 triple-grid">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={15} color="var(--red)" /></div><h4 style={{ fontSize: 12, fontWeight: 700 }}>Yet to be Placed</h4></div>
          {unplaced ? <><p style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 900, color: 'var(--red)', lineHeight: 1 }}>{unplaced.unplaced}</p><p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{unplaced.placed} placed out of {unplaced.eligible}</p></> : <Skeleton h={40} w={80} />}
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--purple-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={15} color="var(--purple)" /></div><h4 style={{ fontSize: 12, fontWeight: 700 }}>Toppers (CGPA)</h4></div>
          {cgpaTop ? (cgpaTop.length > 0 ? cgpaTop.slice(0, 3).map((s, i) => <TopperRow key={i} student={s} rank={i} />) : <p style={{ fontSize: 12, fontStyle: 'italic' }}>No rows.</p>) : <Skeleton h={80} w="100%" />}
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy size={15} color="var(--accent)" /></div><h4 style={{ fontSize: 12, fontWeight: 700 }}>Internal {itToppers?.testNumber ? `#${itToppers.testNumber}` : ''} Toppers</h4></div>
          {itToppers ? (itToppers.toppers?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
              {itToppers.toppers.map((group, idx) => (
                <div key={idx} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>{group.year} · Sec {group.section}</p>
                  {(group.students || []).map((s, rank) => (
                    <div key={rank} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Avatar name={s.name} size={28} />
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{['🥇','🥈','🥉'][rank]} {s.name}</div><div style={{ fontSize: 10.5, color: 'var(--accent)', fontWeight: 700 }}>{s.percentage}%</div></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : <p style={{ fontSize: 12, fontStyle: 'italic' }}>No data.</p>) : <Skeleton h={80} w="100%" />}
        </Card>
      </div>

      {hover && <HoverPopup {...hover} onClose={() => setHover(null)} />}
    </div>
  );
}
