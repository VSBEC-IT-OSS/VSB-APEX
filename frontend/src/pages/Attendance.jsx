import{useState,useMemo}from'react';
import{useData}from'../hooks/useData.js';
import{YEARS}from'../data/mockData.js';
import Card from'../components/ui/Card.jsx';
import LoadingSpinner from'../components/ui/LoadingSpinner.jsx';
import SectionFilter from'../components/ui/SectionFilter.jsx';
import Badge from'../components/ui/Badge.jsx';
import PageHeader from'../components/ui/PageHeader.jsx';
import{Table,Tr,Td}from'../components/ui/Table.jsx';
import{RadarChart,Radar,PolarGrid,PolarAngleAxis,ResponsiveContainer,Tooltip,BarChart,Bar,XAxis,YAxis,CartesianGrid,Cell,LineChart,Line}from'recharts';

const TS={contentStyle:{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontSize:12,boxShadow:'var(--shadow-md)'},labelStyle:{color:'var(--text2)',fontWeight:600}};
const sc=(a)=>a>=80?'var(--green)':a>=75?'var(--accent)':a>=70?'var(--yellow)':'var(--red)';
const st=(a)=>a>=80?'good':a>=75?'info':a>=70?'warning':'critical';

// Pre-defined date ranges
const DATE_PRESETS=[
  {label:'This Week',   days:7},
  {label:'This Month',  days:30},
  {label:'Last 3 Months',days:90},
  {label:'This Semester',days:120},
  {label:'Full Year',   days:365},
];

// Generate mock trend data for a date range (seeded)
function mockTrendForRange(days,section){
  const pts=Math.min(days,12);
  const step=Math.floor(days/pts);
  return Array.from({length:pts},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-(pts-i)*step);
    const seed=(i+1)/(pts+1);
    const base=section==='C'?68:section==='B'?76:82;
    return{date:d.toLocaleDateString('en-IN',{day:'numeric',month:'short'}),pct:Math.round(base+Math.sin(i)*5)};
  });
}

function ProgressBar({pct,color}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{flex:1,height:7,background:'var(--surface2)',borderRadius:4,overflow:'hidden'}}>
        <div style={{width:`${pct}%`,height:'100%',borderRadius:4,background:color,transition:'width .5s'}}/>
      </div>
      <span style={{fontSize:13,fontWeight:600,color:'var(--text)',minWidth:44}}>{pct}%</span>
    </div>
  );
}

export default function Attendance(){
  const{data,loading}=useData('getAttendanceBySections');
  const ov=useData('getAttendanceOverview');
  const[selectedYear,setSelectedYear]=useState('All');
  const[preset,setPreset]=useState(DATE_PRESETS[2]);
  const[customFrom,setCustomFrom]=useState('');
  const[customTo,setCustomTo]=useState('');
  const[showCustom,setShowCustom]=useState(false);
  const[focusSection,setFocusSection]=useState(null);

  if(loading||ov.loading)return<LoadingSpinner/>;

  const o=ov.data;
  const filtered=selectedYear==='All'?data:data.filter(r=>r.year===selectedYear);

  // Adjust mock data slightly for different ranges (shorter range → noisier)
  const rangeMultiplier=preset.days<=7?0.95:preset.days<=30?0.98:1;
  const adjustedFiltered=filtered.map(r=>({...r,avg:Math.min(99,Math.round(r.avg*rangeMultiplier))}));

  const radarData=YEARS.map(y=>{
    const rows=data.filter(r=>r.year===y);
    const avg=rows.length?+(rows.reduce((s,r)=>s+r.avg,0)/rows.length).toFixed(1):0;
    return{year:y.replace(' Year',''),avg};
  });

  const trendData=mockTrendForRange(preset.days,focusSection||'A');

  return(
    <div style={{padding:'24px 28px'}}>
      <PageHeader title="Attendance Analytics" sub="Section-wise attendance tracking · AY 2024–25"/>

      {/* Date range controls */}
      <Card style={{marginBottom:16,padding:'14px 18px'}}>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
          <div>
            <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Date Range</p>
            <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
              {DATE_PRESETS.map(p=>(
                <button key={p.label} onClick={()=>{setPreset(p);setShowCustom(false);}} style={{padding:'5px 12px',borderRadius:6,fontSize:12,fontWeight:500,border:'1px solid',background:!showCustom&&preset.label===p.label?'var(--accent)':'var(--surface2)',color:!showCustom&&preset.label===p.label?'#fff':'var(--text2)',borderColor:!showCustom&&preset.label===p.label?'var(--accent)':'var(--border)',cursor:'pointer',transition:'all .12s'}}>
                  {p.label}
                </button>
              ))}
              <button onClick={()=>setShowCustom(!showCustom)} style={{padding:'5px 12px',borderRadius:6,fontSize:12,fontWeight:500,border:'1px solid',background:showCustom?'var(--accent)':'var(--surface2)',color:showCustom?'#fff':'var(--text2)',borderColor:showCustom?'var(--accent)':'var(--border)',cursor:'pointer',transition:'all .12s'}}>
                Custom Range
              </button>
            </div>
          </div>
          {showCustom&&(
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div>
                <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,marginBottom:4}}>From</p>
                <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)}
                  style={{padding:'6px 10px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:12,color:'var(--text)',outline:'none'}}/>
              </div>
              <div>
                <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,marginBottom:4}}>To</p>
                <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)}
                  style={{padding:'6px 10px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:12,color:'var(--text)',outline:'none'}}/>
              </div>
              <button onClick={()=>setPreset({label:`${customFrom} → ${customTo}`,days:Math.max(1,Math.round((new Date(customTo)-new Date(customFrom))/86400000))})}
                style={{marginTop:16,padding:'6px 14px',borderRadius:7,background:'var(--accent)',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',border:'none'}}>
                Apply
              </button>
            </div>
          )}
          <div style={{marginLeft:'auto',padding:'6px 14px',borderRadius:20,background:'var(--accent-bg)',fontSize:12,fontWeight:600,color:'var(--accent)'}}>
            {showCustom&&customFrom&&customTo?`${customFrom} → ${customTo}`:`Last ${preset.days} days`}
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="fade-up-1" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'Overall Avg',value:`${o.overall}%`,note:'All sections combined',color:'var(--accent)'},
          {label:'Total Students',value:o.totalStudents,note:'Enrolled this year',color:'var(--text)'},
          {label:'Below 75%',value:o.belowThreshold,note:'At risk of eligibility loss',color:'var(--red)'},
          {label:'Above 75%',value:o.aboveThreshold,note:'Meeting requirements',color:'var(--green)'},
        ].map(s=>(
          <Card key={s.label}>
            <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{s.label}</p>
            <p style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:800,color:s.color,marginTop:6,lineHeight:1}}>{s.value}</p>
            <p style={{fontSize:11,color:'var(--text3)',marginTop:4}}>{s.note}</p>
          </Card>
        ))}
      </div>

      <div className="fade-up-2" style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:14,marginBottom:14}}>
        {/* Section table */}
        <Card style={{padding:0}}>
          <div style={{padding:'14px 18px 12px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--border)'}}>
            <div>
              <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>Section-wise Attendance</h3>
              <p style={{fontSize:11,color:'var(--text3)',marginTop:1}}>
                {showCustom&&customFrom?`${customFrom} → ${customTo}`:preset.label}
              </p>
            </div>
            <SectionFilter years={YEARS} selectedYear={selectedYear} onYearChange={setSelectedYear}/>
          </div>
          <Table headers={['Section','Students','Avg Attendance','Status','Below 75%']}>
            {adjustedFiltered.map(row=>(
              <Tr key={`${row.year}-${row.section}`} highlight={row.avg<70}>
                <Td>
                  <button onClick={()=>setFocusSection(focusSection===row.section?null:row.section)}
                    style={{fontWeight:600,color:focusSection===row.section?'var(--accent)':'var(--text)',background:'none',border:'none',cursor:'pointer',fontSize:13,textDecoration:focusSection===row.section?'underline':'none'}}>
                    {row.year} — Sec {row.section}
                  </button>
                </Td>
                <Td>{row.students}</Td>
                <Td><ProgressBar pct={row.avg} color={sc(row.avg)}/></Td>
                <Td><Badge type={st(row.avg)}>{st(row.avg)}</Badge></Td>
                <Td style={{color:row.below75>15?'var(--red)':'var(--text2)',fontWeight:row.below75>15?700:400}}>{row.below75} students</Td>
              </Tr>
            ))}
          </Table>
        </Card>

        {/* Radar */}
        <Card>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Year-wise Comparison</h3>
          <p style={{fontSize:11,color:'var(--text3)',marginBottom:10}}>{preset.label}</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)"/>
              <PolarAngleAxis dataKey="year" tick={{fill:'var(--text2)',fontSize:12}}/>
              <Radar dataKey="avg" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.12} strokeWidth={2}/>
              <Tooltip {...TS}/>
            </RadarChart>
          </ResponsiveContainer>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:10,paddingTop:10,borderTop:'1px solid var(--border)'}}>
            {radarData.map(r=>(
              <div key={r.year} style={{padding:'7px 10px',borderRadius:7,background:'var(--surface2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12,color:'var(--text2)',fontWeight:500}}>{r.year} Yr</span>
                <span style={{fontSize:13,fontWeight:700,color:sc(r.avg)}}>{r.avg}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trend chart */}
      <div className="fade-up-3" style={{marginBottom:14}}>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div>
              <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>
                Attendance Trend{focusSection?` — Section ${focusSection}`:''}
              </h3>
              <p style={{fontSize:11,color:'var(--text3)',marginTop:1}}>
                {preset.label}{focusSection?' · Click a section row to focus':''}
              </p>
            </div>
            {focusSection&&<button onClick={()=>setFocusSection(null)} style={{fontSize:11,color:'var(--text3)',background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>Clear focus</button>}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="date" tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis domain={[60,100]} tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} unit="%"/>
              <Tooltip {...TS}/>
              <Line type="monotone" dataKey="pct" stroke="var(--accent)" strokeWidth={2.5} dot={{fill:'var(--accent)',r:3}} activeDot={{r:5}} name="Attendance %"/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Below 75 bar chart */}
      <div className="fade-up-4">
        <Card>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Students Below 75% — by Section</h3>
          <p style={{fontSize:11,color:'var(--text3)',marginBottom:14}}>{preset.label}</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={adjustedFiltered} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey={r=>`${r.year.replace(' Year','')}-${r.section}`} tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip {...TS}/>
              <Bar dataKey="below75" radius={[5,5,0,0]} name="Below 75%">
                {adjustedFiltered.map((r,i)=><Cell key={i} fill={r.below75>15?'#dc2626':r.below75>8?'#b45309':'#16a34a'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:'flex',gap:20,marginTop:10,paddingTop:10,borderTop:'1px solid var(--border)'}}>
            {[['#dc2626','>15 (Critical)'],['#b45309','9–15 (Warning)'],['#16a34a','≤8 (Good)']].map(([c,l])=>(
              <span key={l} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--text3)'}}>
                <span style={{width:10,height:10,borderRadius:3,background:c,display:'inline-block'}}/>{l}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
