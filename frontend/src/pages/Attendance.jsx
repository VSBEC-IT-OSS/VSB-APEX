// frontend/src/pages/Attendance.jsx
import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from "recharts";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { dataService } from "../data/dataService.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import ErrorCard from "../components/ui/ErrorCard.jsx";

// ── Constants ──────────────────────────────────────────────────────────────────
const DEPARTMENTS = ["IT","CSE","ECE","EEE","MECH","CIVIL","CHEMICAL",
  "BIOTECH","BME","AIML [CSE]","AI & DS","CCE","CSBS"];
const YEARS       = ["I Year","II Year","III Year","IV Year"];
const SECTIONS    = ["All","A","B","C","D","E","F"];
const DATE_RANGES = ["Today","This Week","This Month","Last 3 Months","Custom"];

function useDashboardData(dept, year, section, dateRange, customFrom, customTo) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('vsb_token')}` };
    
    const p = new URLSearchParams();
    if (dept    !== "All") p.append("department", dept);
    if (year    !== "All") p.append("year", year);
    if (section !== "All") p.append("section", section);
    const rangeMap = {
      "Today":"today", "This Week":"week",
      "This Month":"month", "Last 3 Months":"3months"
    };
    if (rangeMap[dateRange]) p.append("range", rangeMap[dateRange]);
    if (dateRange === "Custom" && customFrom && customTo) {
      p.append("from", customFrom); p.append("to", customTo);
    }

    Promise.all([
      fetch(`${apiBase}/attendance/section?${p}`, { headers }).then(r => {
        if (!r.ok) throw new Error(`Section API Error: ${r.status}`);
        return r.json();
      }),
      fetch(`${apiBase}/attendance/overview?${p}`, { headers }).then(r => {
        if (!r.ok) throw new Error(`Overview API Error: ${r.status}`);
        return r.json();
      }),
    ]).then(([sections, overview]) => {
      setData({
        rows: (sections || []).map(s => ({
          label: s.section, section: s.section,
          dept: s.department, year: s.year,
          avg: s.avg, students: s.students, excessLeave: s.excessLeave,
        })),
        totalStudents: overview?.totalStudents || 0,
        overall:       overview?.overall || 0,
        totalExcess:   overview?.excessLeave || 0,
      });
      setLoading(false);
    }).catch(e => {
      console.error("Fetch failure:", e);
      setError(e.message);
      setLoading(false);
    });
  };

  useEffect(fetchData, [dept, year, section, dateRange, customFrom, customTo]);

  return { data, loading, error, refetch: fetchData };
}

// ── UI Components ───────────────────────────────────────────────────────────
const barColor = avg => avg >= 90 ? "#1e3a5f" : avg >= 85 ? "var(--accent-lt)" : "var(--red)";

const BarLabel = ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 5}
    fill={value < 85 ? "var(--red)" : "var(--accent)"}
    textAnchor="middle" fontSize={10} fontWeight={600}
    fontFamily="var(--font-mono)">
    {value}
  </text>
);

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background:"var(--accent)", borderRadius:10, padding:"12px 16px",
      boxShadow:"var(--shadow-md)", minWidth:160 }}>
      <div style={{ color:"white", opacity: 0.7, fontSize:11,
        fontFamily:"var(--font-mono)", marginBottom:4 }}>
        {d.section} · {d.year}
      </div>
      <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{d.avg}%</div>
      <div style={{ color:"white", opacity: 0.8, fontSize:11, marginTop:4 }}>
        {d.students} students · {d.excessLeave} excess leave
      </div>
    </div>
  );
}

function Scorecard({ label, value, sub, accent }) {
  return (
    <div style={{ background:"#fff", border:`2px solid ${accent}22`,
      borderTop:`4px solid ${accent}`, borderRadius:12,
      padding:"20px 24px", flex:1, minWidth: 200 }}>
      <div style={{ fontSize:11, color:"var(--text3)", letterSpacing:"0.08em",
        textTransform:"uppercase", fontFamily:"var(--font-mono)", marginBottom:8 }}>
        {label}
      </div>
      <div style={{ fontSize:32, fontWeight:800, color:"var(--text)", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"var(--text3)", marginTop:6 }}>{sub}</div>}
    </div>
  );
}

function PillGroup({ options, value, onChange, label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <span style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase",
        letterSpacing:"0.08em", fontFamily:"var(--font-mono)" }}>{label}</span>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            padding:"5px 12px", borderRadius:20,
            border: value===o ? "none" : "1px solid var(--border)",
            background: value===o ? "var(--accent)" : "var(--surface2)",
            color: value===o ? "#fff" : "var(--text2)",
            fontSize:12, fontWeight: value===o ? 700 : 400,
            cursor:"pointer", transition:"all 0.15s",
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function Dropdown({ options, value, onChange, label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <span style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase",
        letterSpacing:"0.08em", fontFamily:"var(--font-mono)" }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        padding:"7px 32px 7px 12px", borderRadius:8,
        border:"1px solid var(--border)", background:"var(--surface2)",
        color:"var(--text)", fontSize:13, fontWeight:600,
        cursor:"pointer", appearance:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", minWidth:140,
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function AttendanceDashboard() {
  const [dept,       setDept]       = useState("IT");
  const [year,       setYear]       = useState("III Year");
  const [section,    setSection]    = useState("All");
  const [dateRange,  setDateRange]  = useState("This Month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");

  const [showCal, setShowCal]       = useState(false);
  const [availDates, setAvailDates] = useState([]);
  const [calDate, setCalDate]       = useState(new Date());

  useEffect(() => {
    if (showCal) {
      dataService.getAvailableAttendanceDates()
        .then(setAvailDates)
        .catch(console.error);
    }
  }, [showCal]);

  useEffect(() => setSection("All"), [dept, year]);

  const { data, loading, error, refetch } = useDashboardData(
    dept, year, section, dateRange, customFrom, customTo
  );

  const manyBars    = data?.rows?.length > 10;
  const chartHeight = data?.rows ? Math.max(300, data.rows.length * 24 + 100) : 300;
  const headingDept = dept === "All" ? "All Departments" : `${dept} Dept`;
  const headingYear = year === "All" ? "All Years"       : year;

  return (
    <div style={{ padding: "24px 28px" }}>
      <PageHeader 
        title={`${headingDept} — ${headingYear}`} 
        sub={`Daily Attendance Analysis · ${dateRange}`}
        action={
          <button 
            onClick={() => setShowCal(true)}
            style={{
              padding: "10px 18px", borderRadius: 10, background: "var(--accent)", color: "white",
              fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <CalendarIcon size={16} /> <span className="mobile-hide">Availability Calendar</span>
          </button>
        }
      />

      {/* Controls */}
      <div className="fade-up" style={{ 
        background:"var(--surface)", borderRadius:14, padding:"18px 20px",
        marginBottom:24, boxShadow:"var(--shadow-sm)", border: "1px solid var(--border)",
        display:"flex", gap:20, flexWrap:"wrap", alignItems:"flex-end" 
      }}>
        <Dropdown label="Department" options={["All",...DEPARTMENTS]} value={dept}
          onChange={v => { setDept(v); setSection("All"); }} />
        <Dropdown label="Year" options={["All",...YEARS]} value={year}
          onChange={v => { setYear(v); setSection("All"); }} />
        <Dropdown label="Section" options={SECTIONS} value={section} onChange={setSection} />
        <PillGroup label="Date Range" options={DATE_RANGES}
          value={dateRange} onChange={setDateRange} />
        {dateRange === "Custom" && (
          <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
            {[["From",customFrom,setCustomFrom],["To",customTo,setCustomTo]].map(([lbl,val,set]) => (
              <div key={lbl} style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <span style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase",
                  letterSpacing:"0.08em", fontFamily:"var(--font-mono)" }}>{lbl}</span>
                <input type="date" value={val} onChange={e => set(e.target.value)}
                  style={{ padding:"5px 10px", borderRadius:8,
                    border:"1px solid var(--border)", fontSize:12,
                    color:"var(--text)" }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <ErrorCard message={error} onRetry={refetch} />
      ) : (
        <>
          {/* Scorecards */}
          <div className="fade-up-1 stat-grid" style={{ marginBottom: 24 }}>
            <Scorecard label="Total Students"
              value={loading ? "—" : (data?.totalStudents ?? "0")}
              sub={section!=="All" ? `Sec ${section}` : 'Overall'}
              accent="var(--accent)" />
            <Scorecard label="Overall Attendance"
              value={loading ? "—" : `${data?.overall ?? 0}%`}
              sub={dateRange} accent="var(--accent-lt)" />
            <Scorecard label="4+ Days Leave"
              value={loading ? "—" : (data?.totalExcess ?? "0")}
              sub="Excess absence" accent="var(--red)" />
          </div>

          {/* Bar Chart */}
          <div className="fade-up-2" style={{ background:"#fff", borderRadius:14, padding:"24px",
            boxShadow:"var(--shadow-sm)", border: "1px solid var(--border)", marginBottom:24 }}>
            <div className="mobile-stack" style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"var(--text)" }}>Class-wise Attendance</div>
                <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)", marginTop:2 }}>
                  {dateRange} Trend {data ? `· ${data.rows?.length || 0} classes` : ""}
                </div>
              </div>
              <div style={{ display:"flex", gap:14 }}>
                {[[ "var(--accent)","≥90%"],["var(--accent-lt)","85–89%"],["var(--red)","<85%"]].map(([c,l]) => (
                  <span key={l} style={{ fontSize:11, color:"var(--text3)",
                    display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:10, height:10, borderRadius:2, background:c, display:"inline-block" }} />{l}
                  </span>
                ))}
              </div>
            </div>

            {loading ? <div style={{ height:chartHeight, background: 'var(--surface2)', borderRadius: 10, animation: 'shimmer 1.4s infinite' }} /> 
            : (!data || !data.rows || data.rows.length === 0) ? <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text3)" }}>No classes match.</div> 
            : (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={data.rows} margin={{ top:28, right:20, left:-10, bottom: manyBars ? 90 : 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" angle={manyBars ? -45 : 0} textAnchor={manyBars ? "end" : "middle"} interval={0} tick={{ fontSize: 11, fill:"var(--text2)", fontFamily:"var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[75,100]} tick={{ fontSize:11, fill:"var(--text3)", fontFamily:"var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={85} stroke="var(--gold)" strokeDasharray="4 4" label={{ value:"85%", position:"insideRight", fontSize:10, fill:"var(--gold)" }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill:"var(--surface2)" }} />
                  <Bar dataKey="avg" radius={[5,5,0,0]} label={data.rows.length <= 18 ? <BarLabel /> : false} maxBarSize={52}>
                    {data.rows.map((r,i) => <Cell key={i} fill={barColor(r.avg)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="fade-up-3" style={{ background:"#fff", borderRadius:14, overflow:"hidden", border: "1px solid var(--border)", boxShadow:"var(--shadow-sm)" }}>
            <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--border)" }}>
              <span style={{ fontSize:14, fontWeight:700, color:"var(--text)" }}>Class Summary</span>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"var(--surface2)" }}>
                    {["Class","Dept","Year","Students","Avg","Status"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, color:"var(--text3)", fontWeight:600, textTransform:"uppercase", fontFamily:"var(--font-mono)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.rows?.map((r,i) => (
                    <tr key={i} style={{ borderTop:"1px solid var(--border)", background: i%2===0 ? "#fff" : "var(--surface2)" }}>
                      <td style={{ padding:"11px 16px", fontWeight:700, color:"var(--text)", fontFamily:"var(--font-mono)", fontSize:13 }}>{r.label}</td>
                      <td style={{ padding:"11px 16px", color:"var(--text2)", fontSize:12 }}>{r.dept}</td>
                      <td style={{ padding:"11px 16px", color:"var(--text2)", fontSize:12 }}>{r.year}</td>
                      <td style={{ padding:"11px 16px", color:"var(--text2)", fontSize:13 }}>{r.students}</td>
                      <td style={{ padding:"11px 16px", fontWeight:700, color: r.avg>=85 ? "var(--green)" : "var(--red)" }}>{r.avg}%</td>
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ background: r.avg>=85?"var(--green-bg)":"var(--red-bg)", color: r.avg>=85?"var(--green)":"var(--red)", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>
                          {r.avg>=85?"Good":"Low"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showCal && <AvailabilityModal onClose={() => setShowCal(false)} dates={availDates} currentDate={calDate} setCurrentDate={setCalDate} />}
    </div>
  );
}

function AvailabilityModal({ onClose, dates, currentDate, setCurrentDate }) {
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const isAvailable = (day) => {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dates.includes(iso);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface2)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>Attendance Data Availability</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><ChevronLeft size={18} /></button>
            <span style={{ fontWeight: 700 }}>{monthNames[month]} {year}</span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><ChevronRight size={18} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", marginBottom: 8 }}>
            {["S","M","T","W","T","F","S"].map((d, i) => <span key={i} style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)" }}>{d}</span>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array(startDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
            {Array(daysInMonth(year, month)).fill(null).map((_, i) => {
              const day = i + 1;
              const hasData = isAvailable(day);
              return (
                <div key={day} style={{ aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, position: "relative" }}>
                  <span style={{ zIndex: 2, fontWeight: hasData ? 700 : 400, color: hasData ? "var(--green)" : "var(--text3)" }}>{day}</span>
                  {hasData && <div style={{ position: "absolute", width: 28, height: 28, background: "var(--green-bg)", borderRadius: "50%", zIndex: 1, border: "1px solid var(--green)" }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
