// frontend/src/pages/Results.jsx
import { useState, useMemo, useRef } from 'react';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Table, Tr, Td } from '../components/ui/Table.jsx';
import SectionFilter from '../components/ui/SectionFilter.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';

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

  // Fetch results from database
  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/results/by-semester', {
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

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus({ type: 'loading', message: 'Uploading...' });
      const response = await fetch('/api/upload/results', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: `✓ ${data.rows_inserted} records uploaded successfully`
        });
        fetchResults();
        setTimeout(() => {
          setUploadStatus(null);
          setShowUploadModal(false);
        }, 2000);
      } else {
        setUploadStatus({ type: 'error', message: `✗ ${data.message || 'Upload failed'}` });
      }
    } catch (err) {
      setUploadStatus({ type: 'error', message: '✗ Network error during upload' });
    }
  };

  // Filter results by semester and section
  const filteredResults = useMemo(() => {
    return results.filter(r => r.semester === semester && r.section === section);
  }, [results, semester, section]);

  // Group by subject for analysis
  const subjectAnalysis = useMemo(() => {
    const grouped = {};
    filteredResults.forEach(r => {
      if (!grouped[r.subject_code]) {
        grouped[r.subject_code] = {
          code: r.subject_code,
          name: r.subject_name,
          students: 0,
          passCount: 0,
          totalMarks: 0,
          arrears: 0
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

  // Get all sections for comparison
  const allSections = useMemo(() => {
    const sections = new Set(results.map(r => r.section));
    return Array.from(sections);
  }, [results]);

  // Section comparison data
  const sectionComparison = useMemo(() => {
    return allSections.map(sec => {
      const sectionResults = results.filter(r => r.semester === semester && r.section === sec);
      const passCount = sectionResults.filter(r => r.is_pass).length;
      const totalMarks = sectionResults.reduce((sum, r) => sum + r.total_marks, 0);
      const arrears = sectionResults.filter(r => r.has_arrear).length;

      return {
        section: sec,
        passP: sectionResults.length > 0 ? Math.round((passCount / sectionResults.length) * 100) : 0,
        avgMarks: sectionResults.length > 0 ? Math.round((totalMarks / sectionResults.length) * 10) / 10 : 0,
        arrears
      };
    });
  }, [results, semester, allSections]);

  // Trend data across semesters for selected section
  const trendData = useMemo(() => {
    const semesters = [...new Set(results.map(r => r.semester))].sort((a, b) => a - b);
    return semesters.map(sem => {
      const semResults = results.filter(r => r.semester === sem && r.section === section);
      const passCount = semResults.filter(r => r.is_pass).length;
      const passP = semResults.length > 0 ? Math.round((passCount / semResults.length) * 100) : 0;
      return { sem: `Sem ${sem}`, pass: passP };
    });
  }, [results, section]);

  const overallPass = subjectAnalysis.length > 0
    ? Math.round(subjectAnalysis.reduce((a, s) => a + s.passP, 0) / subjectAnalysis.length)
    : 0;

  const totalArrears = subjectAnalysis.reduce((a, s) => a + s.arrears, 0);

  return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader title="Semester Results" sub="Examination Results Analysis & Upload" />

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <Card style={{ width: 400, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Upload Semester Results</h3>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
              Upload an Excel file with columns: Student_ID, Year, Section, Semester, Subject_Code, Subject_Name, Internal_Marks, External_Marks, Total_Marks, Is_Pass, Grade
            </p>

            <div style={{
              border: '2px dashed var(--border)', borderRadius: 8, padding: 16,
              textAlign: 'center', marginBottom: 16, cursor: 'pointer',
              background: 'var(--surface2)', transition: 'all .2s'
            }}
              onClick={() => fileInputRef.current?.click()}>
              <Upload size={32} style={{ margin: '0 auto 8px', color: 'var(--accent)' }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Click to select file</p>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>or drag and drop .xlsx file</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            {uploadStatus && (
              <div style={{
                padding: 12, borderRadius: 6, marginBottom: 16,
                background: uploadStatus.type === 'success' ? 'rgba(34,197,94,0.1)' : uploadStatus.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
                border: `1px solid ${uploadStatus.type === 'success' ? 'var(--green)' : uploadStatus.type === 'error' ? 'var(--red)' : 'var(--accent)'}`,
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                {uploadStatus.type === 'success' && <CheckCircle size={16} color="var(--green)" />}
                {uploadStatus.type === 'error' && <AlertCircle size={16} color="var(--red)" />}
                <p style={{ fontSize: 12, color: 'var(--text)', flex: 1 }}>{uploadStatus.message}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowUploadModal(false)}
                style={{
                  flex: 1, padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)',
                  background: 'var(--surface2)', color: 'var(--text)', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer'
                }}>
                Cancel
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: 1, padding: '8px 16px', borderRadius: 6, border: 'none',
                  background: 'var(--accent)', color: 'white', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer'
                }}>
                Select File
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card style={{ marginBottom: 16, padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <p style={{
              fontSize: 11, color: 'var(--text3)', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5
            }}>Semester</p>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <button key={s} onClick={() => setSemester(s)}
                  style={{
                    padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: '1px solid',
                    background: semester === s ? 'var(--accent)' : 'var(--surface2)',
                    color: semester === s ? 'white' : 'var(--text2)',
                    borderColor: semester === s ? 'var(--accent)' : 'var(--border)',
                    cursor: 'pointer', transition: 'all .12s'
                  }}>
                  Sem {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{
              fontSize: 11, color: 'var(--text3)', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5
            }}>Section</p>
            <SectionFilter years={allSections.length > 0 ? allSections : ['A']} selectedYear={section} onYearChange={setSection} />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={() => setShowUploadModal(true)}
              style={{
                padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
              <Upload size={14} /> Upload Excel
            </button>
            <button onClick={fetchResults}
              style={{
                padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}>
              <Download size={14} /> Refresh
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['subjects', 'trend', 'sections'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{
                    padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: '1px solid',
                    background: tab === t ? 'var(--accent)' : 'var(--surface2)',
                    color: tab === t ? 'white' : 'var(--text2)',
                    borderColor: tab === t ? 'var(--accent)' : 'var(--border)',
                    cursor: 'pointer', textTransform: 'capitalize', transition: 'all .12s'
                  }}>
                  {t === 'subjects' ? 'Subjects' : t === 'trend' ? 'Trend' : 'All Sections'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Sem Pass %', value: `${overallPass}%`, color: sc(overallPass), border: sc(overallPass) },
          { label: 'Subjects', value: subjectAnalysis.length, color: 'var(--accent)', border: 'var(--accent)' },
          { label: 'Total Arrears', value: totalArrears, color: totalArrears > 10 ? 'var(--red)' : 'var(--green)', border: totalArrears > 10 ? 'var(--red)' : 'var(--green)' },
          { label: 'Total Records', value: filteredResults.length, color: 'var(--text)', border: 'var(--border2)' }
        ].map(s => (
          <Card key={s.label} style={{ borderTop: `3px solid ${s.border}` }}>
            <p style={{
              fontSize: 11, color: 'var(--text3)', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>{s.label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: s.color, marginTop: 6 }}>
              {s.value}
            </p>
          </Card>
        ))}
      </div>

      {loading ? (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ color: 'var(--text3)' }}>Loading results...</p>
        </Card>
      ) : filteredResults.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ color: 'var(--text3)', marginBottom: 16 }}>No results found for Sem {semester} - Section {section}</p>
          <button onClick={() => setShowUploadModal(true)}
            style={{
              padding: '8px 16px', borderRadius: 6, background: 'var(--accent)', color: 'white',
              fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer'
            }}>
            Upload Data
          </button>
        </Card>
      ) : (
        <>
          {/* TAB: Subject View */}
          {tab === 'subjects' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 14 }}>
              <Card>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                  Pass % by Subject
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>Sem {semester} · Sec {section}</p>
                <ResponsiveContainer width="100%" height={Math.max(subjectAnalysis.length * 36 + 20, 200)}>
                  <BarChart data={[...subjectAnalysis].sort((a, b) => a.passP - b.passP)} layout="vertical" barSize={16} margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                    <YAxis type="category" dataKey="code" tick={{ fill: 'var(--text2)', fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip {...TS} formatter={v => [`${v}%`, 'Pass %']} />
                    <Bar dataKey="passP" radius={[0, 4, 4, 0]}>
                      {[...subjectAnalysis].sort((a, b) => a.passP - b.passP).map((s, i) => <Cell key={i} fill={sc(s.passP)} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card style={{ padding: 0 }}>
                <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
                    Subject Details — Sem {semester}
                  </h3>
                  <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>Section {section}</p>
                </div>
                <Table headers={['Subject', 'Code', 'Pass %', 'Avg Marks', 'Arrears', 'Status']}>
                  {[...subjectAnalysis].sort((a, b) => a.passP - b.passP).map(s => (
                    <Tr key={s.code} highlight={s.passP < 65}>
                      <Td style={{ fontWeight: 600, color: 'var(--text)', maxWidth: 160 }}>
                        <div style={{ fontSize: 12 }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)' }}>{s.code}</div>
                      </Td>
                      <Td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{s.code}</Td>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 60, height: 5, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${s.passP}%`, height: '100%', background: sc(s.passP), borderRadius: 3 }} />
                          </div>
                          <span style={{ fontWeight: 700, color: sc(s.passP), fontSize: 12 }}>{s.passP}%</span>
                        </div>
                      </Td>
                      <Td style={{ fontSize: 12 }}>{s.avgMarks}/100</Td>
                      <Td style={{ color: s.arrears > 5 ? 'var(--red)' : 'var(--text2)', fontWeight: s.arrears > 5 ? 700 : 400 }}>
                        {s.arrears}
                      </Td>
                      <Td><Badge type={st(s.passP)}>{st(s.passP)}</Badge></Td>
                    </Tr>
                  ))}
                </Table>
              </Card>
            </div>
          )}

          {/* TAB: Trend */}
          {tab === 'trend' && trendData.length > 0 && (
            <Card>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                Pass % Trend — Section {section}
              </h3>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 16 }}>Average pass % across all semesters</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="sem" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip {...TS} />
                  <Line type="monotone" dataKey="pass" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 5 }} activeDot={{ r: 7 }} name="Pass %" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* TAB: All Sections */}
          {tab === 'sections' && sectionComparison.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Card>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                  Section Comparison — Sem {semester}
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>Pass % across all sections</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sectionComparison} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="section" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip {...TS} />
                    <Bar dataKey="passP" radius={[5, 5, 0, 0]} name="Pass %">
                      {sectionComparison.map((r, i) => <Cell key={i} fill={sc(r.passP)} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card style={{ padding: 0 }}>
                <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Section Details</h3>
                </div>
                <Table headers={['Section', 'Pass %', 'Avg Marks', 'Arrears']}>
                  {sectionComparison.map((r, i) => (
                    <Tr key={i}>
                      <Td style={{ fontWeight: 700, color: 'var(--text)' }}>Section {r.section}</Td>
                      <Td style={{ color: sc(r.passP), fontWeight: 700 }}>{r.passP}%</Td>
                      <Td style={{ fontSize: 12 }}>{r.avgMarks}/100</Td>
                      <Td style={{ color: r.arrears > 5 ? 'var(--red)' : 'var(--text2)', fontWeight: r.arrears > 5 ? 700 : 400 }}>
                        {r.arrears}
                      </Td>
                    </Tr>
                  ))}
                </Table>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}