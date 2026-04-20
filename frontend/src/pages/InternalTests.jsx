import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Table, Tr, Td } from '../components/ui/Table.jsx';
import { dataService } from '../data/dataService.js';

// ─── Constants ───────────────────────────────────────────────────────────────────
const DEPARTMENTS = ["IT", "CSE", "ECE", "EEE", "MECH", "CIVIL", "CHEMICAL", "BIOTECH", "BME", "AIML [CSE]", "AI & DS", "CCE", "CSBS"];
const YEARS = ["I Year", "II Year", "III Year", "IV Year"];
const SECTIONS = ["All", "A", "B", "C", "D", "E", "F"];

// Semester mapping based on year
const SEMESTERS_BY_YEAR = {
  "I Year": [1, 2],
  "II Year": [1, 2, 3, 4],
  "III Year": [1, 2, 3, 4, 5, 6],
  "IV Year": [1, 2, 3, 4, 5, 6, 7, 8],
};

// ─── Utility Functions ───────────────────────────────────────────────────────
const sc = (p) => p >= 70 ? 'var(--green)' : p >= 55 ? 'var(--accent)' : p >= 40 ? 'var(--yellow)' : 'var(--red)';
const st = (p) => p >= 70 ? 'good' : p >= 55 ? 'info' : p >= 40 ? 'warning' : 'critical';
const COLORS = ['#16a34a', '#0084d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const TS = {
  contentStyle: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: 'var(--shadow-md)' },
  labelStyle: { color: 'var(--text2)', fontWeight: 600 },
};

// ─── UI Components ───────────────────────────────────────────────────────
function Dropdown({ options, value, onChange, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        padding: "7px 32px 7px 12px", borderRadius: 8,
        border: "1px solid var(--border)", background: "var(--surface2)",
        color: "var(--text)", fontSize: 13, fontWeight: 600,
        cursor: "pointer", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", minWidth: 140,
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function InternalTests() {
  const [dept, setDept] = useState("IT");
  const [year, setYear] = useState("I Year");
  const [section, setSection] = useState("All");
  const [semester, setSemester] = useState(1);
  const [tab, setTab] = useState("overview");

  const [yearOverviewData, setYearOverviewData] = useState([]);
  const [sectionComparisonData, setSectionComparisonData] = useState([]);
  const [subjectPerformanceData, setSubjectPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get available semesters for selected year
  const availableSemesters = SEMESTERS_BY_YEAR[year] || [1, 2];

  // Reset semester if it's not available for selected year
  useEffect(() => {
    if (!availableSemesters.includes(semester)) {
      setSemester(availableSemesters[0]);
    }
  }, [year, availableSemesters, semester]);

  // Reset section when year changes
  useEffect(() => {
    setSection("All");
  }, [dept, year]);

  // Fetch data whenever filters change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const params = { year, semester };
        if (section !== "All") params.section = section;
        if (dept !== "All") params.department = dept;

        const [yearOverview, sectionComp, subjectPerf] = await Promise.all([
          dataService.getInternalYearOverview(params),
          dataService.getInternalSectionComparison(params),
          dataService.getInternalSubjectPerformance(params),
        ]);
        setYearOverviewData(yearOverview || []);
        setSectionComparisonData(sectionComp || []);
        setSubjectPerformanceData(subjectPerf || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dept, year, semester, section]);

  // Derived data
  const sections = useMemo(() => {
    const sectionSet = new Set(yearOverviewData.map(d => d.section));
    return ["All", ...Array.from(sectionSet).sort()];
  }, [yearOverviewData]);

  // Donut chart data
  const donutData = useMemo(() => {
    return yearOverviewData.map(d => ({
      name: `Sec ${d.section}`,
      value: d.pass_percentage,
      students: d.total_students,
      passed: d.students_passed,
    }));
  }, [yearOverviewData]);

  // Bar chart data
  const barChartData = useMemo(() => {
    return yearOverviewData.map(d => ({
      name: `Sec ${d.section}`,
      pass_pct: d.pass_percentage,
      total: d.total_students,
      passed: d.students_passed,
    }));
  }, [yearOverviewData]);

  // Subject performance with flags
  const subjectsWithFlags = useMemo(() => {
    return subjectPerformanceData.map(s => ({
      ...s,
      flag: s.is_below_50 ? 'critical' : s.pass_percentage >= 70 ? 'good' : s.pass_percentage >= 55 ? 'info' : 'warning',
    }));
  }, [subjectPerformanceData]);

  // ─── Render ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader title="Internal Test Analysis" sub="Anna University R2021 · B.Tech IT" />
      <Card><p style={{ color: 'var(--text3)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>Loading data…</p></Card>
    </div>
  );

  if (error) return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader title="Internal Test Analysis" sub="Anna University R2021 · B.Tech IT" />
      <Card><p style={{ color: 'var(--red)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>⚠ Error: {error}</p></Card>
    </div>
  );

  if (yearOverviewData.length === 0) return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader title="Internal Test Analysis" sub="Anna University R2021 · B.Tech IT" />
      <Card><p style={{ color: 'var(--text3)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>No data available for selected filters.</p></Card>
    </div>
  );

  return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader title="Internal Test Analysis" sub={`${dept} · ${year} · Sem ${semester}`} />

      {/* Filters */}
      <div style={{
        background: "var(--surface)", borderRadius: 14, padding: "18px 20px",
        marginBottom: 24, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
        display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end"
      }}>
        <Dropdown label="Department" options={["All", ...DEPARTMENTS]} value={dept}
          onChange={v => setDept(v)} />
        <Dropdown label="Year" options={YEARS} value={year}
          onChange={v => setYear(v)} />
        <Dropdown label="Semester" options={availableSemesters.map(s => `Sem ${s}`)} value={`Sem ${semester}`}
          onChange={v => setSemester(parseInt(v.split(' ')[1]))} />
        <Dropdown label="Section" options={sections} value={section}
          onChange={v => setSection(v)} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, whiteSpace: 'nowrap' }}>
          {['overview', 'comparison', 'subjects'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '6px 13px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: '1px solid', background: tab === t ? 'var(--accent)' : 'var(--surface2)', color: tab === t ? '#fff' : 'var(--text2)', borderColor: tab === t ? 'var(--accent)' : 'var(--border)', cursor: 'pointer', transition: 'all .12s' }}>
              {t === 'overview' ? 'Overview' : t === 'comparison' ? 'Comparison' : 'Subjects'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <>
          {/* Year Overview Table */}
          <Card style={{ padding: 0, marginBottom: 16 }}>
            <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Overview — {year} · Sem {semester}</h3>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>Section-wise performance summary</p>
            </div>
            <Table headers={['Section', 'Total', 'Passed', 'Failed', 'Pass %', 'Subjects <50%', 'Status']}>
              {yearOverviewData.map(d => (
                <Tr key={d.section}>
                  <Td style={{ fontWeight: 700, color: 'var(--text)' }}>Sec {d.section}</Td>
                  <Td style={{ fontWeight: 600 }}>{d.total_students}</Td>
                  <Td style={{ color: 'var(--green)', fontWeight: 600 }}>{d.students_passed}</Td>
                  <Td style={{ color: 'var(--red)', fontWeight: 600 }}>{d.total_students - d.students_passed}</Td>
                  <Td style={{ color: sc(d.pass_percentage), fontWeight: 700 }}>{d.pass_percentage}%</Td>
                  <Td style={{ fontSize: 10 }}>
                    {d.subjects_below_50.length > 0 ? (
                      d.subjects_below_50.map(s => <div key={s.code} style={{ color: 'var(--red)', fontWeight: 600 }}>{s.code}</div>)
                    ) : (
                      <span style={{ color: 'var(--green)', fontWeight: 600 }}>None</span>
                    )}
                  </Td>
                  <Td><Badge type={st(d.pass_percentage)}>{st(d.pass_percentage)}</Badge></Td>
                </Tr>
              ))}
            </Table>
          </Card>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Card style={{ padding: 0 }}>
              <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Pass % Distribution</h3>
              </div>
              <div style={{ padding: '20px 18px', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...TS} formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card style={{ padding: 0 }}>
              <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Pass % Comparison</h3>
              </div>
              <div style={{ padding: '20px 18px' }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barChartData} barSize={60} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip {...TS} formatter={(v) => `${v}%`} />
                    <Bar dataKey="pass_pct" fill="#0084d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Comparison Tab */}
      {tab === 'comparison' && (
        <Card style={{ padding: 0 }}>
          <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Section Performance Comparison</h3>
          </div>
          <div style={{ padding: '20px 18px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sectionComparisonData.map(d => ({
                name: `Sec ${d.section}`,
                test1: d.test1?.avg_pct || 0,
                test2: d.test2?.avg_pct || 0,
                test3: d.test3?.avg_pct || 0,
              }))} barSize={32} barGap={6} barCategoryGap="35%" margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...TS} formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="test1" fill="#1e3a5f" radius={[4, 4, 0, 0]} name="Test 1" />
                <Bar dataKey="test2" fill="#b8860b" radius={[4, 4, 0, 0]} name="Test 2" />
                <Bar dataKey="test3" fill="#16a34a" radius={[4, 4, 0, 0]} name="Test 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Subjects Tab */}
      {tab === 'subjects' && (
        <Card style={{ padding: 0 }}>
          <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Subject Performance</h3>
          </div>
          <Table headers={['Subject', 'Code', 'Avg %', 'Total', 'Passed', 'Failed', 'Pass %', 'Status']}>
            {subjectsWithFlags.map(s => (
              <Tr key={s.code}>
                <Td style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</Td>
                <Td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' }}>{s.code}</Td>
                <Td style={{ color: sc(s.avg_pct), fontWeight: 600 }}>{s.avg_pct}%</Td>
                <Td style={{ fontWeight: 600 }}>{s.total_students}</Td>
                <Td style={{ color: 'var(--green)', fontWeight: 600 }}>{s.passed}</Td>
                <Td style={{ color: 'var(--red)', fontWeight: 600 }}>{s.failed}</Td>
                <Td style={{ color: sc(s.pass_percentage), fontWeight: 700 }}>{s.pass_percentage}%</Td>
                <Td><Badge type={s.flag}>{s.is_below_50 ? 'Below 50%' : st(s.pass_percentage)}</Badge></Td>
              </Tr>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
}
