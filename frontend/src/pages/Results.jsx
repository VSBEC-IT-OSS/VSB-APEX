// frontend/src/pages/Results.jsx
import { useState, useMemo, useRef, useEffect } from 'react';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Table, Tr, Td } from '../components/ui/Table.jsx';
import SectionFilter from '../components/ui/SectionFilter.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { dataService } from '../data/dataService.js';

const TS = {
  contentStyle: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: 'var(--shadow-md)' },
  labelStyle: { color: 'var(--text2)', fontWeight: 600 }
};

const sc = (p) => p >= 85 ? 'var(--green)' : p >= 75 ? 'var(--accent-lt)' : p >= 65 ? 'var(--yellow)' : 'var(--red)';
const st = (p) => p >= 85 ? 'good' : p >= 75 ? 'info' : p >= 65 ? 'warning' : 'critical';

export default function Results() {
  const [semester, setSemester] = useState(1);
  const [section, setSection] = useState('A');
  const [tab, setTab] = useState('subjects');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResults();
  }, [semester, section]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/results/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    return results.filter(r => r.semester === semester && (section === 'All' || r.section === section));
  }, [results, semester, section]);

  const subjectAnalysis = useMemo(() => {
    const grouped = {};
    filteredResults.forEach(r => {
      if (!grouped[r.subject_code]) {
        grouped[r.subject_code] = {
          code: r.subject_code, name: r.subject_name,
          students: 0, passCount: 0, totalMarks: 0, arrears: 0
        };
      }
      grouped[r.subject_code].students++;
      grouped[r.subject_code].totalMarks += r.total_marks;
      if (r.is_pass) grouped[r.subject_code].passCount++;
      if (r.has_arrear) grouped[r.subject_code].arrears++;
    });

    return Object.values(grouped).map(s => ({
      ...s,
      passP: s.students > 0 ? Math.round((s.passCount / s.students) * 100) : 0,
      avgMarks: s.students > 0 ? Math.round((s.totalMarks / s.students) * 10) / 10 : 0
    }));
  }, [filteredResults]);

  const trendData = useMemo(() => {
    const semesters = [...new Set(results.map(r => r.semester))].sort((a, b) => a - b);
    return semesters.map(sem => {
      const semResults = results.filter(r => r.semester === sem && (section === 'All' || r.section === section));
      const passCount = semResults.filter(r => r.is_pass).length;
      return { sem: `Sem ${sem}`, pass: semResults.length > 0 ? Math.round((passCount / semResults.length) * 100) : 0 };
    });
  }, [results, section]);

  const overallPass = subjectAnalysis.length > 0
    ? Math.round(subjectAnalysis.reduce((a, s) => a + s.passP, 0) / subjectAnalysis.length)
    : 0;

  return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader 
        title="Semester Results" 
        sub="Examination Results Analysis" 
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={fetchResults} style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' }}><Download size={15} /> <span className="mobile-hide">Refresh</span></button>
          </div>
        }
      />

      {/* Constraints & Filters */}
      <Card style={{ marginBottom: 16 }}>
        <div className="mobile-stack" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Semester</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <button key={s} onClick={() => setSemester(s)} style={{
                  padding: '5px 11px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid',
                  background: semester === s ? 'var(--accent)' : 'var(--surface2)',
                  color: semester === s ? 'white' : 'var(--text2)',
                  borderColor: semester === s ? 'var(--accent)' : 'var(--border)'
                }}>S{s}</button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Analysis Tab</p>
            <div style={{ display: 'flex', gap: 4 }}>
              {['subjects', 'trend'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid',
                  background: tab === t ? 'var(--accent)' : 'var(--surface2)',
                  color: tab === t ? 'white' : 'var(--text2)',
                  borderColor: tab === t ? 'var(--accent)' : 'var(--border)',
                  textTransform: 'capitalize'
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Stats */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <Card style={{ borderTop: `3px solid ${sc(overallPass)}` }}>
          <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Semester Pass %</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: sc(overallPass), marginTop: 6 }}>{overallPass}%</p>
        </Card>
        <Card style={{ borderTop: `3px solid var(--accent)` }}>
          <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Subjects</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--text)', marginTop: 6 }}>{subjectAnalysis.length}</p>
        </Card>
        <Card style={{ borderTop: `3px solid var(--red)` }}>
          <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Total Arrears</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--red)', marginTop: 6 }}>{subjectAnalysis.reduce((a,s)=>a+s.arrears,0)}</p>
        </Card>
        <Card style={{ borderTop: `3px solid var(--border2)` }}>
          <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Records</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--text)', marginTop: 6 }}>{filteredResults.length}</p>
        </Card>
      </div>

      {loading ? <Card style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>Analyzing Results...</Card> : filteredResults.length === 0 ? <Card style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>No data for Sem {semester}.</Card> : (
        <>
          {tab === 'subjects' && (
            <div className="content-grid">
              <Card>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Subject-wise Pass %</h3>
                <ResponsiveContainer width="100%" height={Math.max(subjectAnalysis.length * 36, 200)}>
                  <BarChart data={[...subjectAnalysis].sort((a,b)=>a.passP-b.passP)} layout="vertical" barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text3)' }} unit="%" />
                    <YAxis dataKey="code" type="category" tick={{ fontSize: 10, fill: 'var(--text2)' }} width={55} />
                    <Tooltip {...TS} />
                    <Bar dataKey="passP" radius={[0, 4, 4, 0]}>
                      {[...subjectAnalysis].sort((a,b)=>a.passP-b.passP).map((s,i)=><Cell key={i} fill={sc(s.passP)} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card style={{ padding: 0 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}><h3 style={{ fontSize: 14, fontWeight: 700 }}>Subject Details</h3></div>
                <div style={{ overflowX: 'auto' }}>
                  <Table headers={['Subject', 'Pass %', 'Arrears']}>
                    {subjectAnalysis.map(s => (
                      <Tr key={s.code}>
                        <Td style={{ fontSize: 12, fontWeight: 600 }}>{s.name}<br/><small style={{ color: 'var(--text3)' }}>{s.code}</small></Td>
                        <Td style={{ color: sc(s.passP), fontWeight: 700 }}>{s.passP}%</Td>
                        <Td>{s.arrears}</Td>
                      </Tr>
                    ))}
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {tab === 'trend' && (
            <Card>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Pass % Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="sem" tick={{ fontSize: 11, fill: 'var(--text3)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text3)' }} unit="%" />
                  <Tooltip {...TS} />
                  <Line type="monotone" dataKey="pass" stroke="var(--accent)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent)' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
    </div>
  );
}