import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from "recharts";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { dataService } from "../data/dataService.js";

// ── Constants ──────────────────────────────────────────────────────────────────
const DEPARTMENTS = ["IT","CSE","ECE","EEE","MECH","CIVIL","CHEMICAL",
  "BIOTECH","BME","AIML [CSE]","AI & DS","CCE","CSBS"];
const YEARS       = ["I Year","II Year","III Year","IV Year"];
const SECTIONS    = ["All","A","B","C","D","E","F"];
const DATE_RANGES = ["Today","This Week","This Month","Last 3 Months","Custom"];

// ── Master class list — every class in the college ────────────────────────────
// Source: VSB APEX PowerPoint slides 3-6 (IT Dept Meeting 10.03.2026)
const ALL_CLASSES = [
  // I Year (from slide 3 — all sections visible)
  {dept:"CIVIL",      year:"I Year",   section:"A", label:"CIVIL"},
  {dept:"ECE",        year:"I Year",   section:"F", label:"ECE F"},
  {dept:"IT",         year:"I Year",   section:"C", label:"IT C"},
  {dept:"CSBS",       year:"I Year",   section:"A", label:"CSBS"},
  {dept:"AIML [CSE]", year:"I Year",   section:"B", label:"AIML[CSE]-B"},
  {dept:"CCE",        year:"I Year",   section:"A", label:"CCE"},
  {dept:"CHEMICAL",   year:"I Year",   section:"A", label:"CHEMICAL"},
  {dept:"AI & DS",    year:"I Year",   section:"A", label:"AI & DS-A"},
  {dept:"ECE",        year:"I Year",   section:"C", label:"ECE C"},
  {dept:"IT",         year:"I Year",   section:"A", label:"IT A"},
  {dept:"CSE",        year:"I Year",   section:"B", label:"CSE B"},
  {dept:"ECE",        year:"I Year",   section:"E", label:"ECE E"},
  {dept:"EEE",        year:"I Year",   section:"A", label:"EEE"},
  {dept:"MECH",       year:"I Year",   section:"A", label:"MECH"},
  {dept:"BIOTECH",    year:"I Year",   section:"A", label:"BIOTECH"},
  {dept:"ECE",        year:"I Year",   section:"D", label:"ECE D"},
  {dept:"ECE",        year:"I Year",   section:"B", label:"ECE B"},
  {dept:"AI & DS",    year:"I Year",   section:"C", label:"AI & DS-C"},
  {dept:"AI & DS",    year:"I Year",   section:"B", label:"AI & DS-B"},
  {dept:"IT",         year:"I Year",   section:"B", label:"IT B"},
  {dept:"CSE",        year:"I Year",   section:"A", label:"CSE A"},
  {dept:"AI & DS",    year:"I Year",   section:"D", label:"AI & DS-D"},
  {dept:"AIML [CSE]", year:"I Year",   section:"A", label:"AIML[CSE]-A"},
  {dept:"ECE",        year:"I Year",   section:"A", label:"ECE A"},
  {dept:"BME",        year:"I Year",   section:"A", label:"BME"},
  {dept:"CSE",        year:"I Year",   section:"C", label:"CSE C"},
  // II Year
  {dept:"IT",         year:"II Year",  section:"A", label:"IT A"},
  {dept:"IT",         year:"II Year",  section:"B", label:"IT B"},
  {dept:"CSE",        year:"II Year",  section:"A", label:"CSE A"},
  {dept:"CSE",        year:"II Year",  section:"B", label:"CSE B"},
  {dept:"ECE",        year:"II Year",  section:"A", label:"ECE A"},
  {dept:"ECE",        year:"II Year",  section:"B", label:"ECE B"},
  {dept:"ECE",        year:"II Year",  section:"C", label:"ECE C"},
  {dept:"EEE",        year:"II Year",  section:"A", label:"EEE"},
  {dept:"MECH",       year:"II Year",  section:"A", label:"MECH"},
  {dept:"CIVIL",      year:"II Year",  section:"A", label:"CIVIL"},
  {dept:"AI & DS",    year:"II Year",  section:"A", label:"AI & DS-A"},
  {dept:"AI & DS",    year:"II Year",  section:"B", label:"AI & DS-B"},
  {dept:"AIML [CSE]", year:"II Year",  section:"A", label:"AIML[CSE]-A"},
  {dept:"CSBS",       year:"II Year",  section:"A", label:"CSBS"},
  {dept:"CCE",        year:"II Year",  section:"A", label:"CCE"},
  {dept:"BIOTECH",    year:"II Year",  section:"A", label:"BIOTECH"},
  {dept:"CHEMICAL",   year:"II Year",  section:"A", label:"CHEMICAL"},
  // III Year
  {dept:"IT",         year:"III Year", section:"A", label:"IT A"},
  {dept:"IT",         year:"III Year", section:"B", label:"IT B"},
  {dept:"CSE",        year:"III Year", section:"A", label:"CSE A"},
  {dept:"CSE",        year:"III Year", section:"B", label:"CSE B"},
  {dept:"ECE",        year:"III Year", section:"A", label:"ECE A"},
  {dept:"ECE",        year:"III Year", section:"B", label:"ECE B"},
  {dept:"EEE",        year:"III Year", section:"A", label:"EEE"},
  {dept:"MECH",       year:"III Year", section:"A", label:"MECH"},
  {dept:"CIVIL",      year:"III Year", section:"A", label:"CIVIL"},
  {dept:"AI & DS",    year:"III Year", section:"A", label:"AI & DS-A"},
  {dept:"AIML [CSE]", year:"III Year", section:"A", label:"AIML[CSE]-A"},
  {dept:"BIOTECH",    year:"III Year", section:"A", label:"BIOTECH"},
  {dept:"CHEMICAL",   year:"III Year", section:"A", label:"CHEMICAL"},
  // IV Year
  {dept:"IT",         year:"IV Year",  section:"A", label:"IT A"},
  {dept:"IT",         year:"IV Year",  section:"B", label:"IT B"},
  {dept:"CSE",        year:"IV Year",  section:"A", label:"CSE A"},
  {dept:"CSE",        year:"IV Year",  section:"B", label:"CSE B"},
  {dept:"ECE",        year:"IV Year",  section:"A", label:"ECE A"},
  {dept:"EEE",        year:"IV Year",  section:"A", label:"EEE"},
  {dept:"MECH",       year:"IV Year",  section:"A", label:"MECH"},
  {dept:"CIVIL",      year:"IV Year",  section:"A", label:"CIVIL"},
  {dept:"AI & DS",    year:"IV Year",  section:"A", label:"AI & DS-A"},
  {dept:"BIOTECH",    year:"IV Year",  section:"A", label:"BIOTECH"},
];

const filterClasses = (dept, year, section) =>
  ALL_CLASSES.filter(c =>
    (dept    === "All" || c.dept    === dept)    &&
    (year    === "All" || c.year    === year)    &&
    (section === "All" || c.section === section)
  );

// ─────────────────────────────────────────────────────────────────────────────
//  DATA HOOK  ·  Two modes — swap by commenting/uncommenting marked blocks
// ─────────────────────────────────────────────────────────────────────────────
function useDashboardData(dept, year, section, dateRange, customFrom, customTo) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);



    // ╔═══════════════════════════════════════════════════╗
    // ║  REAL API — uncomment this, comment out MOCK above║
    // ╚═══════════════════════════════════════════════════╝
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
      fetch(`${apiBase}/attendance/section?${p}`, { headers }).then(r => r.json()),
      fetch(`${apiBase}/attendance/overview?${p}`, { headers }).then(r => r.json()),
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
    }).catch(() => setLoading(false));
    // ╔═══════════════════════════════════════════════════╗
    // ║  END REAL API                                     ║
    // ╚═══════════════════════════════════════════════════╝

  }, [dept, year, section, dateRange, customFrom, customTo]);

  return { data, loading };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const barColor = avg => avg >= 90 ? "#1d4ed8" : avg >= 85 ? "#3b82f6" : "#ef4444";

const BarLabel = ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 5}
    fill={value < 85 ? "#ef4444" : "#1e3a5f"}
    textAnchor="middle" fontSize={10} fontWeight={600}
    fontFamily="'DM Mono',monospace">
    {value}
  </text>
);

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background:"#0f172a", borderRadius:10, padding:"12px 16px",
      boxShadow:"0 8px 32px #0004", minWidth:160 }}>
      <div style={{ color:"#94a3b8", fontSize:11,
        fontFamily:"'DM Mono',monospace", marginBottom:4 }}>
        {d.section} · {d.year}
      </div>
      <div style={{ color:"#fff", fontSize:20, fontWeight:800,
        fontFamily:"'Sora',sans-serif" }}>{d.avg}%</div>
      <div style={{ color:"#64748b", fontSize:11, marginTop:4 }}>
        {d.students} students · {d.excessLeave} excess leave
      </div>
    </div>
  );
}

function Scorecard({ label, value, sub, accent }) {
  return (
    <div style={{ background:"#fff", border:`2px solid ${accent}22`,
      borderTop:`4px solid ${accent}`, borderRadius:12,
      padding:"20px 24px", flex:1, minWidth:0 }}>
      <div style={{ fontSize:11, color:"#64748b", letterSpacing:"0.08em",
        textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
        {label}
      </div>
      <div style={{ fontSize:32, fontWeight:800, color:"#0f172a",
        fontFamily:"'Sora',sans-serif", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"#94a3b8", marginTop:6 }}>{sub}</div>}
    </div>
  );
}

function PillGroup({ options, value, onChange, label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <span style={{ fontSize:11, color:"#94a3b8", textTransform:"uppercase",
        letterSpacing:"0.08em", fontFamily:"'DM Mono',monospace" }}>{label}</span>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            padding:"5px 12px", borderRadius:20,
            border: value===o ? "none" : "1px solid #e2e8f0",
            background: value===o ? "#1e3a8a" : "#f8fafc",
            color: value===o ? "#fff" : "#475569",
            fontSize:12, fontWeight: value===o ? 700 : 400,
            cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.15s",
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function Dropdown({ options, value, onChange, label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <span style={{ fontSize:11, color:"#94a3b8", textTransform:"uppercase",
        letterSpacing:"0.08em", fontFamily:"'DM Mono',monospace" }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        padding:"7px 32px 7px 12px", borderRadius:8,
        border:"1px solid #e2e8f0", background:"#f8fafc",
        color:"#0f172a", fontSize:13, fontWeight:600,
        fontFamily:"'Sora',sans-serif", cursor:"pointer", appearance:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", minWidth:140,
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AttendanceDashboard() {
  const [dept,       setDept]       = useState("IT");
  const [year,       setYear]       = useState("I Year");
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

  const { data, loading } = useDashboardData(
    dept, year, section, dateRange, customFrom, customTo
  );

  const manyBars    = data && data.rows.length > 10;
  const chartHeight = data ? Math.max(300, data.rows.length * 24 + 100) : 300;
  const headingDept = dept === "All" ? "All Departments" : `${dept} Dept`;
  const headingYear = year === "All" ? "All Years"       : year;

  return (
    <div style={{ minHeight:"100vh",
      background:"linear-gradient(135deg,#f0f4ff 0%,#e8edf8 100%)",
      fontFamily:"'Sora',sans-serif", padding:"24px" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; }
        button:hover { opacity:.88; }
        select:focus { outline:2px solid #1e3a8a; outline-offset:1px; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:"0.12em",
          textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}>
          VSB APEX · Attendance
        </div>
        <h1 style={{ margin:"4px 0 0", fontSize:26, fontWeight:800, color:"#0f172a" }}>
          {headingDept} — {headingYear}
        </h1>
      </div>

      {/* Controls */}
      <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px",
        marginBottom:24, boxShadow:"0 1px 4px #0001",
        display:"flex", gap:20, flexWrap:"wrap", alignItems:"flex-end" }}>
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
                <span style={{ fontSize:11, color:"#94a3b8", textTransform:"uppercase",
                  letterSpacing:"0.08em", fontFamily:"'DM Mono',monospace" }}>{lbl}</span>
                <input type="date" value={val} onChange={e => set(e.target.value)}
                  style={{ padding:"5px 10px", borderRadius:8,
                    border:"1px solid #e2e8f0", fontSize:12,
                    fontFamily:"'Sora',sans-serif", color:"#0f172a" }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scorecards */}
      <div style={{ display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" }}>
        <Scorecard label="Total Students"
          value={loading ? "—" : data.totalStudents}
          sub={`${headingDept} · ${headingYear}${section!=="All"?" · Sec "+section:""}`}
          accent="#1d4ed8" />
        <Scorecard label="Overall Attendance"
          value={loading ? "—" : `${data.overall}%`}
          sub={dateRange} accent="#0ea5e9" />
        <Scorecard label="4+ Days Leave"
          value={loading ? "—" : data.totalExcess}
          sub="Students with excess absence" accent="#ef4444" />
      </div>

      {/* Bar Chart */}
      <div style={{ background:"#fff", borderRadius:14, padding:"24px",
        boxShadow:"0 1px 4px #0001", marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>
              Class-wise Attendance
            </div>
            <div style={{ fontSize:11, color:"#94a3b8",
              fontFamily:"'DM Mono',monospace", marginTop:2 }}>
              {headingDept} · {headingYear} · {dateRange}
              {data ? `  ·  ${data.rows.length} classes` : ""}
            </div>
          </div>
          <div style={{ display:"flex", gap:14 }}>
            {[["#1d4ed8","≥90%"],["#3b82f6","85–89%"],["#ef4444","<85%"]].map(([c,l]) => (
              <span key={l} style={{ fontSize:11, color:"#64748b",
                display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:10, height:10, borderRadius:2,
                  background:c, display:"inline-block" }} />{l}
              </span>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height:280, display:"flex", alignItems:"center",
            justifyContent:"center", color:"#94a3b8", fontSize:13 }}>
            Loading…
          </div>
        ) : data.rows.length === 0 ? (
          <div style={{ height:200, display:"flex", alignItems:"center",
            justifyContent:"center", color:"#94a3b8", fontSize:13 }}>
            No classes match the selected filters.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data.rows}
              margin={{ top:28, right:20, left:-10,
                bottom: manyBars ? 90 : 10 }}
              barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                angle={manyBars ? -45 : 0}
                textAnchor={manyBars ? "end" : "middle"}
                interval={0}
                tick={{ fontSize: manyBars ? 10 : 12, fill:"#64748b",
                  fontFamily:"'DM Mono',monospace" }}
                axisLine={false} tickLine={false} />
              <YAxis domain={[75,100]}
                tick={{ fontSize:11, fill:"#94a3b8",
                  fontFamily:"'DM Mono',monospace" }}
                axisLine={false} tickLine={false} />
              <ReferenceLine y={85} stroke="#fbbf24" strokeDasharray="4 4"
                label={{ value:"85%", position:"insideRight",
                  fontSize:10, fill:"#fbbf24" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:"#f1f5f9" }} />
              <Bar dataKey="avg" radius={[5,5,0,0]}
                label={data.rows.length <= 18 ? <BarLabel /> : false}
                maxBarSize={52}>
                {data.rows.map((r,i) => <Cell key={i} fill={barColor(r.avg)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:14,
        overflow:"hidden", boxShadow:"0 1px 4px #0001" }}>
        <div style={{ padding:"16px 24px", borderBottom:"1px solid #f1f5f9" }}>
          <span style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>
            Class Summary
          </span>
          {data && (
            <span style={{ fontSize:12, color:"#94a3b8", marginLeft:10,
              fontFamily:"'DM Mono',monospace" }}>
              {data.rows.length} classes
            </span>
          )}
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Class","Dept","Year","Students","Avg Attendance",
                  "4+ Days Leave","Status"].map(h => (
                  <th key={h} style={{ padding:"10px 16px", textAlign:"left",
                    fontSize:11, color:"#64748b", fontWeight:600, whiteSpace:"nowrap",
                    textTransform:"uppercase", letterSpacing:"0.06em",
                    fontFamily:"'DM Mono',monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding:24, textAlign:"center",
                  color:"#94a3b8", fontSize:13 }}>Loading…</td></tr>
              ) : data.rows.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:24, textAlign:"center",
                  color:"#94a3b8", fontSize:13 }}>
                  No data for selected filters.
                </td></tr>
              ) : data.rows.map((r,i) => (
                <tr key={i} style={{ borderTop:"1px solid #f1f5f9",
                  background: i%2===0 ? "#fff" : "#fafbff" }}>
                  <td style={{ padding:"11px 16px", fontWeight:700, color:"#0f172a",
                    fontFamily:"'DM Mono',monospace", fontSize:13 }}>{r.label}</td>
                  <td style={{ padding:"11px 16px", color:"#475569", fontSize:12 }}>{r.dept}</td>
                  <td style={{ padding:"11px 16px", color:"#475569", fontSize:12,
                    whiteSpace:"nowrap" }}>{r.year}</td>
                  <td style={{ padding:"11px 16px", color:"#475569", fontSize:13 }}>{r.students}</td>
                  <td style={{ padding:"11px 16px" }}>
                    <span style={{ fontWeight:700, fontSize:13,
                      color: r.avg>=90?"#1d4ed8":r.avg>=85?"#0ea5e9":"#ef4444" }}>
                      {r.avg}%
                    </span>
                  </td>
                  <td style={{ padding:"11px 16px" }}>
                    <span style={{
                      background: r.excessLeave>5?"#fef2f2":"#f0fdf4",
                      color:      r.excessLeave>5?"#ef4444":"#16a34a",
                      padding:"3px 10px", borderRadius:20,
                      fontSize:12, fontWeight:600 }}>
                      {r.excessLeave}
                    </span>
                  </td>
                  <td style={{ padding:"11px 16px" }}>
                    <span style={{
                      background: r.avg>=85?"#eff6ff":"#fef2f2",
                      color:      r.avg>=85?"#1d4ed8":"#ef4444",
                      padding:"3px 10px", borderRadius:20,
                      fontSize:11, fontWeight:600 }}>
                      {r.avg>=85?"Good":"Needs Attention"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop:16, fontSize:11, color:"#94a3b8",
        textAlign:"center", fontFamily:"'DM Mono',monospace" }}>
        VSB APEX v2 · Local DB · Synced from Neon aggregator
      </div>

      {/* Availability Link */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button 
          onClick={() => setShowCal(true)}
          style={{
            background: "none", border: "none", color: "#6366f1",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, transition: "all 0.2s",
          }}
          onMouseOver={e => e.target.style.background = "#6366f111"}
          onMouseOut={e => e.target.style.background = "none"}
        >
          <CalendarIcon size={16} />
          View Data Availability Calendar
        </button>
      </div>

      {/* Availability Modal */}
      {showCal && (
        <AvailabilityModal 
          onClose={() => setShowCal(false)} 
          dates={availDates} 
          currentDate={calDate}
          setCurrentDate={setCalDate}
        />
      )}
    </div>
  );
}

function AvailabilityModal({ onClose, dates, currentDate, setCurrentDate }) {
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isAvailable = (day) => {
    const d = new Date(year, month, day);
    // Format to YYYY-MM-DD manually to avoid timezone issues
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dates.includes(iso);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000, padding: 20
    }} onClick={onClose}>
      <div 
        style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden"
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: "24px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>Data Availability</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button onClick={prevMonth} style={{ background: "#f1f5f9", border: "none", padding: 6, borderRadius: 8, cursor: "pointer" }}><ChevronLeft size={18} /></button>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{monthNames[month]} {year}</span>
            <button onClick={nextMonth} style={{ background: "#f1f5f9", border: "none", padding: 6, borderRadius: 8, cursor: "pointer" }}><ChevronRight size={18} /></button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", marginBottom: 8 }}>
            {["S","M","T","W","T","F","S"].map(d => (
              <span key={d} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>{d}</span>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array(startDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
            {Array(daysInMonth(year, month)).fill(null).map((_, i) => {
              const day = i + 1;
              const hasData = isAvailable(day);
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
              
              return (
                <div key={day} style={{ 
                  aspectRatio: "1/1", display: "flex", alignItems: "center", 
                  justifyContent: "center", fontSize: 13, position: "relative" 
                }}>
                  <span style={{ 
                    zIndex: 2, fontWeight: hasData || isToday ? 700 : 400,
                    color: hasData ? "#065f46" : isToday ? "#6366f1" : "#475569" 
                  }}>{day}</span>
                  {hasData && (
                    <div style={{ 
                      position: "absolute", width: 28, height: 28, 
                      background: "#dcfce7", borderRadius: "50%", zIndex: 1,
                      border: "1px solid #10b981"
                    }} />
                  )}
                  {isToday && !hasData && (
                    <div style={{ 
                      position: "absolute", width: 28, height: 28, 
                      border: "1px solid #6366f122", borderRadius: "50%", zIndex: 1
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748b" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#dcfce7", border: "1px solid #10b981" }} />
              <span>Attendance data available for this date</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748b" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1px solid #6366f122" }} />
              <span>Current date (no data yet)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
