import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Calendar, BookOpen, AlertTriangle, CheckCircle, ChevronLeft, 
  Award, TrendingUp, Trophy, ArrowRight, FileText
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorCard from '../components/ui/ErrorCard';
import { dataService } from '../data/dataService';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function StudentProfile() {
  const { regNumber } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('attendance');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const data = await dataService.getStudentProfile(regNumber);
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch student record dossier.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [regNumber]);

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div style={{ padding: 28 }}>
      <button onClick={() => navigate(-1)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px',
        borderRadius: 8, background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)',
        cursor: 'pointer', marginBottom: 18
      }}>
        <ChevronLeft size={15} /> Back to dashboard
      </button>
      <ErrorCard message={error} onRetry={() => window.location.reload()} />
    </div>
  );

  const { student, status_badge, attendance, results, internal_tests, placements } = profile;

  // Compute status colors
  const badgeColors = {
    SAFE: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' },
    AT_RISK: { bg: 'rgba(234,179,8,0.12)', text: '#eab308', border: '1px solid rgba(234,179,8,0.3)' },
    CRITICAL: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }
  };

  const currentBadge = badgeColors[status_badge] || badgeColors.SAFE;

  // Chart data preparing
  const cgpaData = results.semesters.map(s => ({
    name: `Sem ${s.semester}`,
    GPA: s.avg_marks ? parseFloat((s.avg_marks / 10).toFixed(2)) : 0.0 // mapping marks to scale of 10 for GPA simulation
  }));

  return (
    <div style={{ padding: 28, maxWidth: 1200, margin: '0 auto' }} className="fade-up">
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px',
          borderRadius: 8, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)',
          cursor: 'pointer', fontSize: 13
        }}>
          <ChevronLeft size={15} /> Back
        </button>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>Dossier ID: VSB-IT-{student.reg_number}</span>
      </div>

      {/* Hero Dossier Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
        borderRadius: 14, padding: 28, color: '#fff', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 24,
        boxShadow: '0 10px 30px rgba(30,58,95,0.2)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
            <Award size={12} /> {student.department} Department
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{student.name}</h2>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}>
            <span>Reg No: <strong style={{ color: '#fff' }}>{student.reg_number}</strong></span>
            <span>Batch: <strong style={{ color: '#fff' }}>{student.batch}</strong></span>
            <span>Current Year: <strong style={{ color: '#fff' }}>{student.current_year || '—'} Year</strong></span>
            {student.section && <span>Section: <strong style={{ color: '#fff' }}>{student.section}</strong></span>}
          </div>
        </div>

        <div style={{
          padding: '12px 24px', borderRadius: 12, textAlign: 'center',
          background: currentBadge.bg, color: currentBadge.text, border: currentBadge.border,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>Dossier Status</div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{status_badge}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
        {[
          { id: 'attendance', label: 'Attendance Profile', icon: Calendar },
          { id: 'results', label: 'Semester Results', icon: BookOpen },
          { id: 'internals', label: 'Internal Marks Analysis', icon: Trophy },
          { id: 'placements', label: 'Placement Records', icon: Award },
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#fff' : 'var(--text2)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Attendance Metric</h3>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                fontSize: 48, fontWeight: 900, 
                color: attendance.attendance_pct >= 75 ? 'var(--green)' : 'var(--red)'
              }}>
                {attendance.attendance_pct}%
              </div>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8 }}>
                Attended {attendance.classes_attended} / {attendance.total_classes} total lectures
              </p>
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Safety Threshold Check</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>Required Attendance:</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>75.0%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>Attained Percent:</span>
                <span style={{
                  fontSize: 13, fontWeight: 700, 
                  color: attendance.attendance_pct >= 75 ? 'var(--green)' : 'var(--red)'
                }}>{attendance.attendance_pct}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>Excess Leave Cases:</span>
                <span style={{
                  fontSize: 13, fontWeight: 700, 
                  color: attendance.is_excess_leave ? 'var(--red)' : 'var(--green)'
                }}>{attendance.is_excess_leave ? 'YES' : 'NO'}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'results' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>GPA Trend by Semester</h3>
            {cgpaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={cgpaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="GPA" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No semester results data to display GPA progress.</p>
            )}
          </Card>

          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Active / Unresolved Arrears ({results.active_arrears.length})</h3>
            {results.active_arrears.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: 'rgba(34,197,94,0.1)', color: '#22c55e', borderRadius: 8, fontSize: 13 }}>
                <CheckCircle size={16} /> Student currently has clear credentials! No arrears.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.active_arrears.map((arr, i) => (
                  <div key={i} style={{
                    padding: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 8, fontSize: 12.5, display: 'flex', justify: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <strong style={{ color: 'var(--text)' }}>{arr.subject_code}</strong> - {arr.subject_name}
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Encountered in Semester {arr.semester}</div>
                    </div>
                    <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: 11 }}>PENDING</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Subject Performance Registry</h3>
            {results.semesters.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No marks listed to format registry.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {results.semesters.map((sem, sIdx) => (
                  <div key={sIdx} style={{ background: 'var(--surface2)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                      <strong style={{ fontSize: 13, color: 'var(--accent)' }}>Semester {sem.semester}</strong>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Avg Mark: {sem.avg_marks}%</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                      {sem.subjects.map((sub, key) => (
                        <div key={key} style={{ padding: 8, background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12 }}>
                          <span style={{ fontWeight: 600 }}>{sub.code}</span> · {sub.name}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text3)' }}>
                            <span>Marks: <strong style={{ color: 'var(--text)' }}>{sub.total}</strong></span>
                            <span>Grade: <strong style={{ color: sub.is_pass ? 'var(--green)' : 'var(--red)' }}>{sub.grade}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'internals' && (
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Internal Marks Comparison (Student vs Class Average)</h3>
          {internal_tests.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No Internal exams recorded.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: 12, textAlign: 'left' }}>Subject</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Test No.</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Scored Marks</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Max Marks</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Class Average</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {internal_tests.map((t, idx) => {
                    const aboveAvg = t.marks_scored >= t.class_avg;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 12 }}>
                          <div style={{ fontWeight: 700 }}>{t.subject_code}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t.subject_name}</div>
                        </td>
                        <td style={{ padding: 12, fontWeight: 600 }}>Test {t.test_number}</td>
                        <td style={{ padding: 12, textAlign: 'center', fontWeight: 700, color: aboveAvg ? 'var(--green)' : 'var(--red)' }}>
                          {t.marks_scored}
                        </td>
                        <td style={{ padding: 12, textAlign: 'center' }}>{t.max_marks}</td>
                        <td style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: 'var(--text2)' }}>{t.class_avg}</td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700,
                            background: aboveAvg ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: aboveAvg ? '#22c55e' : '#ef4444'
                          }}>
                            {aboveAvg ? 'ABOVE AVG' : 'BELOW AVG'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'placements' && (
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Campus Recruitment & Placements History</h3>
          {placements.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', borderRadius: 8, fontSize: 13 }}>
              <AlertTriangle size={16} /> No recruitment placement offer registered yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: 12, textAlign: 'left' }}>Company</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Offer Package (LPA)</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Offer Category</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Recruitment Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontWeight: 700 }}>{p.company}</td>
                      <td style={{ padding: 12, fontWeight: 700, color: 'var(--accent)' }}>{p.package_lpa} LPA</td>
                      <td style={{ padding: 12, textTransform: 'capitalize' }}>{p.offer_type || 'regular'}</td>
                      <td style={{ padding: 12, color: 'var(--text3)' }}>{p.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
