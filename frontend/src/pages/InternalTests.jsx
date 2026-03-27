// frontend/src/pages/InternalTests.jsx
import{useState,useMemo}from'react';
import Card from'../components/ui/Card.jsx';
import Badge from'../components/ui/Badge.jsx';
import PageHeader from'../components/ui/PageHeader.jsx';
import{Table,Tr,Td}from'../components/ui/Table.jsx';
import SectionFilter from'../components/ui/SectionFilter.jsx';
import{AU_SUBJECTS,BATCHES,SECTIONS_BY_YEAR,getMockInternalResults}from'../data/auSubjects.js';
import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend,LineChart,Line,Cell}from'recharts';
const TS={contentStyle:{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontSize:12,boxShadow:'var(--shadow-md)'},labelStyle:{color:'var(--text2)',fontWeight:600}};
const sc=(s)=>s>=70?'var(--green)':s>=55?'var(--accent)':s>=40?'var(--yellow)':'var(--red)';
const st=(s)=>s>=70?'good':s>=55?'info':s>=40?'warning':'critical';
const ti=(t)=>t==='up'?'↑':t==='down'?'↓':'→';
const tc=(t)=>t==='up'?'var(--green)':t==='down'?'var(--red)':'var(--text3)';

export default function InternalTests(){
  const[batch,setBatch]=useState(BATCHES[0]);
  const[sem,setSem]=useState(1);
  const[section,setSection]=useState('A');
  const[tab,setTab]=useState('subjects');

  const sections=SECTIONS_BY_YEAR[batch.currentYear]||['A','B'];
  const subjects=useMemo(()=>getMockInternalResults(sem,section,batch.passOut),[sem,section,batch.passOut]);

  const avgT1=subjects.length?Math.round(subjects.reduce((a,s)=>a+s.avgT1,0)/subjects.length):0;
  const avgT3=subjects.length?Math.round(subjects.reduce((a,s)=>a+s.avgT3,0)/subjects.length):0;

  const trendData=subjects.map(s=>({
    name:s.code,'Test 1':s.avgT1,'Test 2':s.avgT2,'Test 3':s.avgT3,
  }));

  const secData=useMemo(()=>sections.map(sec=>{
    const subs=getMockInternalResults(sem,sec,batch.passOut);
    return{
      section:sec,
      avgT1:Math.round(subs.reduce((a,s)=>a+s.avgT1,0)/(subs.length||1)),
      avgT2:Math.round(subs.reduce((a,s)=>a+s.avgT2,0)/(subs.length||1)),
      avgT3:Math.round(subs.reduce((a,s)=>a+s.avgT3,0)/(subs.length||1)),
    };
  }),[sem,sections,batch.passOut]);

  const subjectsWithTrend=subjects.map(s=>({
    ...s,
    trend:s.avgT3>s.avgT1+3?'up':s.avgT3<s.avgT1-3?'down':'flat',
  }));

  return(
    <div style={{padding:'24px 28px'}}>
      <PageHeader title="Internal Test Analysis" sub="Anna University R2021 · B.Tech IT — Test 1, 2 & 3"/>

      {/* Controls */}
      <Card style={{marginBottom:16,padding:'14px 18px'}}>
        <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'flex-end'}}>
          <div>
            <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Batch</p>
            <select value={batch.passOut} onChange={e=>setBatch(BATCHES.find(b=>b.passOut===+e.target.value))}
              style={{padding:'7px 12px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:13,color:'var(--text)',outline:'none',cursor:'pointer'}}>
              {BATCHES.map(b=><option key={b.passOut} value={b.passOut}>{b.label}</option>)}
            </select>
          </div>
          <div>
            <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Semester</p>
            <div style={{display:'flex',gap:4}}>
              {batch.sems.map(s=>(
                <button key={s} onClick={()=>setSem(s)} style={{padding:'6px 11px',borderRadius:6,fontSize:12,fontWeight:500,border:'1px solid',background:sem===s?'var(--accent)':'var(--surface2)',color:sem===s?'#fff':'var(--text2)',borderColor:sem===s?'var(--accent)':'var(--border)',cursor:'pointer',transition:'all .12s'}}>
                  Sem {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Section</p>
            <SectionFilter years={sections} selectedYear={section} onYearChange={setSection}/>
          </div>
          <div style={{marginLeft:'auto'}}>
            <div style={{display:'flex',gap:4}}>
              {['subjects','trend','sections'].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{padding:'6px 13px',borderRadius:6,fontSize:12,fontWeight:500,border:'1px solid',background:tab===t?'var(--accent)':'var(--surface2)',color:tab===t?'#fff':'var(--text2)',borderColor:tab===t?'var(--accent)':'var(--border)',cursor:'pointer',textTransform:'capitalize',transition:'all .12s'}}>
                  {t==='subjects'?'By Subject':t==='trend'?'Chart':t==='sections'?'All Sections':''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="fade-up-1" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'Test 1 Avg',value:`${avgT1}%`,color:sc(avgT1),border:sc(avgT1)},
          {label:'Test 3 Avg',value:`${avgT3}%`,color:sc(avgT3),border:sc(avgT3)},
          {label:'Improvement',value:`${avgT3>=avgT1?'+':''}${avgT3-avgT1}%`,color:avgT3>=avgT1?'var(--green)':'var(--red)',border:avgT3>=avgT1?'var(--green)':'var(--red)'},
          {label:'Subjects (Theory)',value:subjects.length,color:'var(--text)',border:'var(--border2)'},
        ].map(s=>(
          <Card key={s.label} style={{borderTop:`3px solid ${s.border}`}}>
            <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{s.label}</p>
            <p style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:800,color:s.color,marginTop:6}}>{s.value}</p>
          </Card>
        ))}
      </div>

      {tab==='subjects'&&(
        <div className="fade-up-2">
          <Card style={{padding:0}}>
            <div style={{padding:'14px 18px 12px',borderBottom:'1px solid var(--border)'}}>
              <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>Subject-wise Internal Scores — Sem {sem} · Sec {section}</h3>
              <p style={{fontSize:11,color:'var(--text3)',marginTop:1}}>{batch.label}</p>
            </div>
            <Table headers={['Subject','Code','Test 1','Test 2','Test 3','Trend','Status']}>
              {subjectsWithTrend.map(s=>(
                <Tr key={s.code}>
                  <Td style={{fontWeight:600,color:'var(--text)',fontSize:12}}>{s.name}</Td>
                  <Td style={{fontFamily:'var(--font-mono)',fontSize:10}}>{s.code}</Td>
                  <Td style={{color:sc(s.avgT1),fontWeight:600}}>{s.avgT1}/100</Td>
                  <Td style={{color:sc(s.avgT2),fontWeight:600}}>{s.avgT2}/100</Td>
                  <Td style={{color:sc(s.avgT3),fontWeight:600}}>{s.avgT3}/100</Td>
                  <Td><span style={{fontSize:18,color:tc(s.trend),fontWeight:700}}>{ti(s.trend)}</span></Td>
                  <Td><Badge type={st(s.avgT3)}>{st(s.avgT3)}</Badge></Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>
      )}

      {tab==='trend'&&(
        <div className="fade-up-2">
          <Card>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Score Progression — Sem {sem} · Sec {section}</h3>
            <p style={{fontSize:11,color:'var(--text3)',marginBottom:14}}>{batch.label}</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trendData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                <XAxis dataKey="name" tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} unit="%"/>
                <Tooltip {...TS}/>
                <Legend wrapperStyle={{fontSize:12}}/>
                <Bar dataKey="Test 1" fill="#1e3a5f" radius={[3,3,0,0]}/>
                <Bar dataKey="Test 2" fill="#b8860b" radius={[3,3,0,0]}/>
                <Bar dataKey="Test 3" fill="#16a34a" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab==='sections'&&(
        <div className="fade-up-2">
          <Card style={{padding:0}}>
            <div style={{padding:'14px 18px 12px',borderBottom:'1px solid var(--border)'}}>
              <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>All Sections — Sem {sem} · {batch.label}</h3>
            </div>
            <Table headers={['Section','Test 1 Avg','Test 2 Avg','Test 3 Avg','Improvement','Status']}>
              {secData.map((r,i)=>{
                const imp=r.avgT3-r.avgT1;
                return(
                  <Tr key={i}>
                    <Td style={{fontWeight:700,color:'var(--text)'}}>Section {r.section}</Td>
                    <Td style={{color:sc(r.avgT1),fontWeight:600}}>{r.avgT1}%</Td>
                    <Td style={{color:sc(r.avgT2),fontWeight:600}}>{r.avgT2}%</Td>
                    <Td style={{color:sc(r.avgT3),fontWeight:600}}>{r.avgT3}%</Td>
                    <Td style={{color:imp>=0?'var(--green)':'var(--red)',fontWeight:700}}>{imp>=0?'+':''}{imp}%</Td>
                    <Td><Badge type={st(r.avgT3)}>{st(r.avgT3)}</Badge></Td>
                  </Tr>
                );
              })}
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
