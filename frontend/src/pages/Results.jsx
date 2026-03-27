// frontend/src/pages/Results.jsx
import{useState,useMemo}from'react';
import Card from'../components/ui/Card.jsx';
import Badge from'../components/ui/Badge.jsx';
import PageHeader from'../components/ui/PageHeader.jsx';
import{Table,Tr,Td}from'../components/ui/Table.jsx';
import SectionFilter from'../components/ui/SectionFilter.jsx';
import{AU_SUBJECTS,BATCHES,SECTIONS_BY_YEAR,getMockResults}from'../data/auSubjects.js';
import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Cell,LineChart,Line}from'recharts';
const TS={contentStyle:{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontSize:12,boxShadow:'var(--shadow-md)'},labelStyle:{color:'var(--text2)',fontWeight:600}};
const sc=(p)=>p>=85?'var(--green)':p>=75?'var(--accent-lt)':p>=65?'var(--yellow)':'var(--red)';
const st=(p)=>p>=85?'good':p>=75?'info':p>=65?'warning':'critical';

export default function Results(){
  const[batch,setBatch]=useState(BATCHES[0]);
  const[sem,setSem]=useState(1);
  const[section,setSection]=useState('A');
  const[tab,setTab]=useState('subjects'); // subjects | trend | sections

  const sections=SECTIONS_BY_YEAR[batch.currentYear]||['A','B'];
  const maxSem=batch.sems[batch.sems.length-1];
  if(sem>maxSem&&sem!==1)setSem(maxSem);

  const subjects=useMemo(()=>getMockResults(sem,section,batch.passOut),[sem,section,batch.passOut]);
  const theorySubjects=subjects.filter(s=>s.type==='theory');
  const labSubjects=subjects.filter(s=>s.type!=='theory');

  // Trend: avg pass% across sems for selected section
  const trendData=useMemo(()=>batch.sems.map(s=>{
    const subs=getMockResults(s,section,batch.passOut).filter(x=>x.type==='theory');
    const avg=Math.round(subs.reduce((a,x)=>a+x.passP,0)/subs.length);
    return{sem:`Sem ${s}`,pass:avg};
  }),[batch,section]);

  // All sections comparison for current sem
  const secData=useMemo(()=>sections.map(sec=>{
    const subs=getMockResults(sem,sec,batch.passOut).filter(x=>x.type==='theory');
    const avg=Math.round(subs.reduce((a,x)=>a+x.passP,0)/subs.length);
    const arrears=subs.reduce((a,x)=>a+x.arrears,0);
    return{section:sec,passP:avg,arrears};
  }),[sem,sections,batch.passOut]);

  const overallPass=Math.round(theorySubjects.reduce((a,s)=>a+s.passP,0)/(theorySubjects.length||1));
  const totalArrears=theorySubjects.reduce((a,s)=>a+s.arrears,0);

  return(
    <div style={{padding:'24px 28px'}}>
      <PageHeader title="Academic Results" sub="Anna University R2021 · B.Tech Information Technology"/>

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
                <button key={s} onClick={()=>setSem(s)} style={{padding:'6px 12px',borderRadius:6,fontSize:12,fontWeight:500,border:'1px solid',background:sem===s?'var(--accent)':'var(--surface2)',color:sem===s?'#fff':'var(--text2)',borderColor:sem===s?'var(--accent)':'var(--border)',cursor:'pointer',transition:'all .12s'}}>
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
                <button key={t} onClick={()=>setTab(t)} style={{padding:'6px 14px',borderRadius:6,fontSize:12,fontWeight:500,border:'1px solid',background:tab===t?'var(--accent)':'var(--surface2)',color:tab===t?'#fff':'var(--text2)',borderColor:tab===t?'var(--accent)':'var(--border)',cursor:'pointer',textTransform:'capitalize',transition:'all .12s'}}>
                  {t==='subjects'?'Subject View':t==='trend'?'Trend':t==='sections'?'All Sections':''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="fade-up-1" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'Sem Pass %',value:`${overallPass}%`,color:sc(overallPass),border:sc(overallPass)},
          {label:'Theory Subjects',value:theorySubjects.length,color:'var(--accent)',border:'var(--accent)'},
          {label:'Total Arrears',value:totalArrears,color:totalArrears>30?'var(--red)':'var(--green)',border:totalArrears>30?'var(--red)':'var(--green)'},
          {label:'Labs / Practicals',value:labSubjects.length,color:'var(--text)',border:'var(--border2)'},
        ].map(s=>(
          <Card key={s.label} style={{borderTop:`3px solid ${s.border}`}}>
            <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{s.label}</p>
            <p style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:800,color:s.color,marginTop:6}}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* TAB: Subject View */}
      {tab==='subjects'&&(
        <div className="fade-up-2">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:14}}>
            <Card>
              <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Pass % by Subject</h3>
              <p style={{fontSize:11,color:'var(--text3)',marginBottom:12}}>{batch.label} · Sem {sem} · Sec {section}</p>
              <ResponsiveContainer width="100%" height={theorySubjects.length*36+20}>
                <BarChart data={[...theorySubjects].sort((a,b)=>a.passP-b.passP)} layout="vertical" barSize={16} margin={{left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false}/>
                  <XAxis type="number" domain={[0,100]} tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false} unit="%"/>
                  <YAxis type="category" dataKey="code" tick={{fill:'var(--text2)',fontSize:10}} axisLine={false} tickLine={false} width={60}/>
                  <Tooltip {...TS} formatter={v=>[`${v}%`,'Pass %']}/>
                  <Bar dataKey="passP" radius={[0,4,4,0]}>{theorySubjects.sort((a,b)=>a.passP-b.passP).map((s,i)=><Cell key={i} fill={sc(s.passP)}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card style={{padding:0}}>
              <div style={{padding:'14px 18px 12px',borderBottom:'1px solid var(--border)'}}>
                <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>Subject Analysis — Sem {sem}</h3>
                <p style={{fontSize:11,color:'var(--text3)',marginTop:1}}>{batch.label} · Section {section}</p>
              </div>
              <Table headers={['Subject','Code','Pass %','Avg Marks','Arrears','Status']}>
                {[...subjects].sort((a,b)=>a.passP-b.passP).map(s=>(
                  <Tr key={s.code} highlight={s.passP<65}>
                    <Td style={{fontWeight:600,color:'var(--text)',maxWidth:160}}>
                      <div style={{fontSize:12}}>{s.name}</div>
                      <div style={{fontSize:10,color:s.type==='lab'?'var(--purple)':'var(--text3)'}}>{s.type==='lab'?'Lab':'Theory'}</div>
                    </Td>
                    <Td style={{fontFamily:'var(--font-mono)',fontSize:11}}>{s.code}</Td>
                    <Td>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:60,height:5,background:'var(--surface2)',borderRadius:3,overflow:'hidden'}}>
                          <div style={{width:`${s.passP}%`,height:'100%',background:sc(s.passP),borderRadius:3}}/>
                        </div>
                        <span style={{fontWeight:700,color:sc(s.passP),fontSize:12}}>{s.passP}%</span>
                      </div>
                    </Td>
                    <Td style={{fontSize:12}}>{s.avgMarks}/100</Td>
                    <Td style={{color:s.arrears>20?'var(--red)':'var(--text2)',fontWeight:s.arrears>20?700:400}}>{s.arrears}</Td>
                    <Td><Badge type={st(s.passP)}>{st(s.passP)}</Badge></Td>
                  </Tr>
                ))}
              </Table>
            </Card>
          </div>
        </div>
      )}

      {/* TAB: Trend */}
      {tab==='trend'&&(
        <div className="fade-up-2">
          <Card>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Pass % Trend — {batch.label} · Section {section}</h3>
            <p style={{fontSize:11,color:'var(--text3)',marginBottom:16}}>Theory subject average pass % across all completed semesters</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                <XAxis dataKey="sem" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis domain={[50,100]} tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} unit="%"/>
                <Tooltip {...TS}/>
                <Line type="monotone" dataKey="pass" stroke="var(--accent)" strokeWidth={2.5} dot={{fill:'var(--accent)',r:5}} activeDot={{r:7}} name="Pass %"/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* TAB: All Sections */}
      {tab==='sections'&&(
        <div className="fade-up-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <Card>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Section Comparison — Sem {sem}</h3>
            <p style={{fontSize:11,color:'var(--text3)',marginBottom:14}}>{batch.label}</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={secData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                <XAxis dataKey="section" tick={{fill:'var(--text3)',fontSize:12}} axisLine={false} tickLine={false}/>
                <YAxis domain={[50,100]} tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} unit="%"/>
                <Tooltip {...TS}/>
                <Bar dataKey="passP" radius={[5,5,0,0]} name="Pass %">{secData.map((r,i)=><Cell key={i} fill={sc(r.passP)}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card style={{padding:0}}>
            <div style={{padding:'14px 18px 12px',borderBottom:'1px solid var(--border)'}}>
              <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>Section Details</h3>
            </div>
            <Table headers={['Section','Avg Pass %','Arrears','Status']}>
              {secData.map((r,i)=>(
                <Tr key={i}>
                  <Td style={{fontWeight:700,color:'var(--text)'}}>Section {r.section}</Td>
                  <Td style={{color:sc(r.passP),fontWeight:700}}>{r.passP}%</Td>
                  <Td style={{color:r.arrears>30?'var(--red)':'var(--text2)',fontWeight:r.arrears>30?700:400}}>{r.arrears}</Td>
                  <Td><Badge type={st(r.passP)}>{st(r.passP)}</Badge></Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
