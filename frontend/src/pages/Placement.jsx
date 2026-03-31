// frontend/src/pages/Placement.jsx
import{useState,useRef,useEffect}from'react';
import{useData}from'../hooks/useData.js';
import Card from'../components/ui/Card.jsx';
import LoadingSpinner from'../components/ui/LoadingSpinner.jsx';
import PageHeader from'../components/ui/PageHeader.jsx';
import{Table,Tr,Td}from'../components/ui/Table.jsx';
import{dataService}from'../data/dataService.js';
import{TrendingUp,Building2,IndianRupee,Award,Users,Upload,FileSpreadsheet,CheckCircle,AlertCircle,X,Plus}from'lucide-react';
import{PieChart,Pie,Cell,Tooltip,ResponsiveContainer,BarChart,Bar,XAxis,YAxis,CartesianGrid,Legend}from'recharts';

const TS={contentStyle:{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontSize:12,boxShadow:'var(--shadow-md)'}};

const COLOR_PALETTE=['#16a34a','#1e3a5f','#2a5298','#6d28d9','#b45309','#4a5568','#d97706','#0f766e','#831843','#1d4ed8'];

function getColor(index){return COLOR_PALETTE[index % COLOR_PALETTE.length];}

function groupPlacementRows(rows){
  const groups={};
  rows.forEach(row=>{
    const company=row.company||'Unknown';
    const batch=row.batch||'All';
    const section=row.section||'All';
    const type=row.offer_type||'Other';
    const key=[company,batch,section,type].join('||');
    if(!groups[key]){
      groups[key]={company,batch,section,type,students:0,totalPackage:0,color:getColor(Object.keys(groups).length)};
    }
    groups[key].students += 1;
    groups[key].totalPackage += Number(row.package ?? 0);
  });
  return Object.values(groups).map(group=>({
    ...group,
    package: group.students > 0 ? parseFloat((group.totalPackage / group.students).toFixed(2)) : 0,
  }));
}

function buildPackageDistribution(rows){
  const counts={'>10 LPA':0,'6–10':0,'4–6':0,'<4':0};
  rows.forEach(row=>{
    const pkg=Number(row.package ?? 0);
    if(pkg>10) counts['>10 LPA'] += 1;
    else if(pkg>=6) counts['6–10'] += 1;
    else if(pkg>=4) counts['4–6'] += 1;
    else counts['<4'] += 1;
  });
  return [
    {range:'>10 LPA',count:counts['>10 LPA']},
    {range:'6–10',count:counts['6–10']},
    {range:'4–6',count:counts['4–6']},
    {range:'<4',count:counts['<4']},
  ];
}

function buildBatchData(rows){
  const map={};
  rows.forEach(row=>{
    const name=row.batch||'All';
    if(!map[name]) map[name]={name,placed:0,totalPackage:0,count:0};
    map[name].placed += 1;
    map[name].totalPackage += Number(row.package ?? 0);
    map[name].count += 1;
  });
  return Object.values(map).map(item=>({
    name:item.name,
    placed:item.placed,
    avgPackage:item.count > 0 ? parseFloat((item.totalPackage / item.count).toFixed(2)) : 0,
  }));
}

function buildSectionData(rows){
  const map={};
  rows.forEach(row=>{
    const name=row.section||'All';
    if(!map[name]) map[name]={name,placed:0,totalPackage:0,count:0};
    map[name].placed += 1;
    map[name].totalPackage += Number(row.package ?? 0);
    map[name].count += 1;
  });
  return Object.values(map).map(item=>({
    name:item.name,
    placed:item.placed,
    avgPackage:item.count > 0 ? parseFloat((item.totalPackage / item.count).toFixed(2)) : 0,
  }));
}

function UploadPanel({onClose,onSuccess}){
  const[file,setFile]=useState(null);
  const[status,setStatus]=useState(null);
  const[result,setResult]=useState(null);
  const[err,setErr]=useState('');
  const ref=useRef();
  async function doUpload(){
    if(!file)return;
    setStatus('uploading');setErr('');
    try{const r=await dataService.uploadFile('placement',file);setResult(r);setStatus('success');setTimeout(()=>{ onSuccess&&onSuccess(); }, 2000);}
    catch(e){setErr(e.message);setStatus('error');}
  }
  return(
    <Card style={{marginBottom:16,borderLeft:'4px solid var(--accent)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>Upload Placement Data</h3>
          <p style={{fontSize:11,color:'var(--text3)',marginTop:2}}>Required columns: Student_ID, Company, Package_LPA, Offer_Type, Batch, Section</p>
        </div>
        <button onClick={onClose} style={{color:'var(--text3)',display:'flex',padding:4,cursor:'pointer'}}><X size={16}/></button>
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
        <div onClick={()=>ref.current.click()} style={{flex:1,minWidth:220,padding:'14px 16px',border:`2px dashed ${file?'var(--green)':'var(--border2)'}`,borderRadius:8,cursor:'pointer',background:file?'var(--green-bg)':'var(--surface2)',display:'flex',alignItems:'center',gap:8,transition:'all .15s'}}>
          <input ref={ref} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={e=>{setFile(e.target.files[0]);setStatus(null);}}/>
          {file?<><FileSpreadsheet size={16} color="var(--green)"/><span style={{fontSize:13,fontWeight:600,color:'var(--green)'}}>{file.name}</span></>
          :<><Upload size={16} color="var(--text3)"/><span style={{fontSize:13,color:'var(--text2)'}}>Click to select .xlsx file</span></>}
        </div>
        <button onClick={doUpload} disabled={!file||status==='uploading'} style={{padding:'10px 20px',borderRadius:8,fontSize:13,fontWeight:600,background:(!file||status==='uploading')?'var(--border2)':'var(--accent)',color:'#fff',border:'none',cursor:(!file||status==='uploading')?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
          <Upload size={13}/>{status==='uploading'?'Uploading…':'Upload'}
        </button>
      </div>
      {status==='success'&&result&&(
        <div style={{display:'flex',gap:7,padding:'8px 12px',background:'var(--green-bg)',border:'1px solid #86efac',borderRadius:7,marginTop:10}}>
          <CheckCircle size={14} color="var(--green)" style={{flexShrink:0,marginTop:1}}/>
          <p style={{fontSize:12,color:'var(--green)',fontWeight:500}}>{result.rows_inserted} placement records added. {result.rows_skipped} skipped.</p>
        </div>
      )}
      {status==='error'&&(
        <div style={{display:'flex',gap:7,padding:'8px 12px',background:'var(--red-bg)',border:'1px solid #fca5a5',borderRadius:7,marginTop:10}}>
          <AlertCircle size={14} color="var(--red)" style={{flexShrink:0,marginTop:1}}/>
          <p style={{fontSize:12,color:'var(--red)'}}>{err||'Upload failed. Check column names.'}</p>
        </div>
      )}
    </Card>
  );
}

// Modal to add a company manually
function AddCompanyModal({onSave,onClose}){
  const[form,setForm]=useState({company:'',package:'',students:'',type:'IT',batch:'2024–25',section:'A',color:'#1e3a5f'});
  function upd(k,v){setForm(p=>({...p,[k]:v}));}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <Card style={{width:420}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:15}}>Add Company</h3>
          <button onClick={onClose} style={{color:'var(--text3)',display:'flex',cursor:'pointer'}}><X size={16}/></button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[['Company Name','company','text','e.g. Zoho Corporation'],['Package (LPA)','package','number','e.g. 7.5'],['Students Placed','students','number','e.g. 12'],['Batch','batch','text','e.g. 2024–25'],['Section','section','text','e.g. A']].map(([l,k,t,ph])=>(
            <div key={k}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:4}}>{l}</label>
              <input type={t} value={form[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph}
                style={{width:'100%',padding:'8px 12px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:13,color:'var(--text)',outline:'none',boxSizing:'border-box'}}/>
            </div>
          ))}
          <div>
            <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:4}}>Type</label>
            <select value={form.type} onChange={e=>upd('type',e.target.value)}
              style={{width:'100%',padding:'8px 12px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:13,color:'var(--text)',outline:'none'}}>
              {['IT','Product','Core','Finance','Research','Other'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:18}}>
          <button onClick={onClose} style={{padding:'8px 18px',borderRadius:8,fontSize:13,fontWeight:500,background:'var(--surface2)',color:'var(--text2)',border:'1px solid var(--border)',cursor:'pointer'}}>Cancel</button>
          <button onClick={()=>{onSave({...form,package:+form.package,students:+form.students});onClose();}}
            style={{padding:'8px 18px',borderRadius:8,fontSize:13,fontWeight:600,background:'var(--accent)',color:'#fff',border:'none',cursor:'pointer'}}>Add</button>
        </div>
      </Card>
    </div>
  );
}

export default function Placement(){
  const{data:stats,loading:statsLoading}=useData('getPlacementStats');
  const{data:rows,loading:rowsLoading}=useData('getPlacementRows');
  const[showUpload,setShowUpload]=useState(false);
  const[showAdd,setShowAdd]=useState(false);
  const[companies,setCompanies]=useState([]);
  const[selectedBatch,setSelectedBatch]=useState('All');
  const[selectedSection,setSelectedSection]=useState('All');

  useEffect(()=>{
    if(rows){
      setCompanies(groupPlacementRows(rows));
    }
  },[rows]);
  
  if(statsLoading||rowsLoading||!stats)return<LoadingSpinner/>;

  // Filter companies by batch and section
  const filteredCompanies=companies.filter(c=>{
    const batchMatch=selectedBatch==='All'||c.batch===selectedBatch;
    const sectionMatch=selectedSection==='All'||c.section===selectedSection;
    return batchMatch&&sectionMatch;
  });

  const placed=filteredCompanies.reduce((a,c)=>a+c.students,0);
  const pkgDistData=buildPackageDistribution(rows || []);
  const pieData=[
    {name:'Placed',   value:placed,        fill:'#16a34a'},
    {name:'Not Placed',value:stats.eligible-placed,fill:'#e2e6ed'},
  ];

  // Comparison data: batch vs section placement stats
  const batchData=buildBatchData(rows || []);
  const sectionData=buildSectionData(rows || []);
  const allBatches=batchData.map(item=>item.name);
  const allSections=sectionData.map(item=>item.name);

  return(
    <div style={{padding:'24px 28px'}}>
      <PageHeader title="Placement Statistics" sub={`Campus recruitment · AY 2024–25 · ${companies.length} companies`}
        action={
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setShowAdd(true)} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',borderRadius:7,fontSize:12.5,fontWeight:500,background:'var(--surface)',color:'var(--text2)',border:'1px solid var(--border)',cursor:'pointer'}}>
              <Plus size={13}/> Add Company
            </button>
            <button onClick={()=>setShowUpload(!showUpload)} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',borderRadius:7,fontSize:12.5,fontWeight:600,background:'var(--accent)',color:'#fff',border:'none',cursor:'pointer'}}>
              <Upload size={13}/> Upload Data
            </button>
          </div>
        }
      />

      {showUpload&&<UploadPanel onClose={()=>setShowUpload(false)} onSuccess={()=>setShowUpload(false)}/>}

      {/* Filter Controls */}
      <Card style={{marginBottom:16,padding:'12px 16px',display:'flex',gap:16,alignItems:'center'}}>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:4}}>Batch</label>
          <select value={selectedBatch} onChange={e=>setSelectedBatch(e.target.value)}
            style={{padding:'6px 10px',borderRadius:6,border:'1px solid var(--border)',background:'var(--surface)',fontSize:12,color:'var(--text)',outline:'none',cursor:'pointer'}}>
            <option>All</option>
            {allBatches.map(b=><option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:4}}>Section</label>
          <select value={selectedSection} onChange={e=>setSelectedSection(e.target.value)}
            style={{padding:'6px 10px',borderRadius:6,border:'1px solid var(--border)',background:'var(--surface)',fontSize:12,color:'var(--text)',outline:'none',cursor:'pointer'}}>
            <option>All</option>
            {allSections.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </Card>

      {/* KPIs */}
      <div className="fade-up-1" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'Placement Rate',   value:`${stats.eligible?Math.round(placed/stats.eligible*100):0}%`,color:'green', icon:TrendingUp},
          {label:'Students Placed',  value:`${placed}`,     color:'blue',  icon:Users},
          {label:'Eligible',         value:`${stats.eligible}`,color:'blue',icon:Award},
          {label:'Avg Package',      value:`₹${filteredCompanies.length>0?(filteredCompanies.reduce((a,c)=>a+c.package,0)/filteredCompanies.length).toFixed(2):'0'}L`,color:'gold',icon:IndianRupee},
          {label:'Highest Package',  value:`₹${filteredCompanies.length>0?Math.max(...filteredCompanies.map(c=>c.package)):'0'}L`,color:'purple',icon:Building2},
        ].map(s=>{
          const Icon=s.icon;
          const COLS={green:{bg:'var(--green-bg)',text:'var(--green)',bar:'var(--green)'},blue:{bg:'var(--accent-bg)',text:'var(--accent)',bar:'var(--accent)'},gold:{bg:'var(--gold-bg)',text:'var(--gold)',bar:'var(--gold)'},purple:{bg:'var(--purple-bg)',text:'var(--purple)',bar:'var(--purple)'}};
          const c=COLS[s.color];
          return(
            <div key={s.label} style={{background:'var(--surface)',border:'1px solid var(--border)',borderTop:`3px solid ${c.bar}`,borderRadius:10,padding:'15px 16px',boxShadow:'var(--shadow-sm)'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div>
                  <p style={{fontSize:10,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{s.label}</p>
                  <p style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:800,color:c.text,marginTop:5,lineHeight:1}}>{s.value}</p>
                </div>
                <div style={{width:34,height:34,borderRadius:8,background:c.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon size={15} color={c.text}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fade-up-2" style={{display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:14,marginBottom:14}}>
        <Card>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Placement Overview</h3>
          <p style={{fontSize:11,color:'var(--text3)',marginBottom:10}}>Placed vs not yet placed</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
              {pieData.map((d,i)=><Cell key={i} fill={d.fill}/>)}
            </Pie><Tooltip contentStyle={TS.contentStyle}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',justifyContent:'center',gap:20,marginTop:8}}>
            {pieData.map(d=>(
              <span key={d.name} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text2)'}}>
                <span style={{width:9,height:9,borderRadius:'50%',background:d.fill,display:'inline-block'}}/>
                {d.name} <strong style={{color:'var(--text)'}}>({d.value})</strong>
              </span>
            ))}
          </div>
        </Card>
        <Card>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Package Distribution</h3>
          <p style={{fontSize:11,color:'var(--text3)',marginBottom:10}}>Students by salary range</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pkgDistData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="range" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TS.contentStyle}/>
              <Bar dataKey="count" radius={[5,5,0,0]} fill="var(--accent)" name="Students"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Comparison Graphs */}
      <div className="fade-up-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <Card>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Batch Comparison</h3>
          <p style={{fontSize:11,color:'var(--text3)',marginBottom:10}}>Placement & avg package by batch</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={batchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="name" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis yAxisId="left" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis yAxisId="right" orientation="right" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TS.contentStyle}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Bar yAxisId="left" dataKey="placed" fill="var(--accent)" name="Placed" radius={[5,5,0,0]}/>
              <Bar yAxisId="right" dataKey="avgPackage" fill="var(--gold)" name="Avg Package" radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:4}}>Section Comparison</h3>
          <p style={{fontSize:11,color:'var(--text3)',marginBottom:10}}>Placement & avg package by section</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="name" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis yAxisId="left" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis yAxisId="right" orientation="right" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TS.contentStyle}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Bar yAxisId="left" dataKey="placed" fill="var(--accent)" name="Placed" radius={[5,5,0,0]}/>
              <Bar yAxisId="right" dataKey="avgPackage" fill="var(--gold)" name="Avg Package" radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Company table */}
      <div className="fade-up-3">
        <Card style={{padding:0}}>
          <div style={{padding:'14px 18px 12px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>Company-wise Breakdown</h3>
              <p style={{fontSize:11,color:'var(--text3)',marginTop:1}}>Offers by company this season</p>
            </div>
            <span style={{fontSize:12,color:'var(--text3)'}}>{placed} total placed</span>
          </div>
          <Table headers={['Company','Type','Batch','Section','Package','Students','Share']}>
            {[...filteredCompanies].sort((a,b)=>b.package-a.package).map((c,i)=>(
              <Tr key={i}>
                <Td><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:'50%',background:c.color,flexShrink:0}}/><span style={{fontWeight:600,color:'var(--text)',fontSize:13}}>{c.company}</span></div></Td>
                <Td><span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:20,background:'var(--accent-bg)',color:'var(--accent)'}}>{c.type}</span></Td>
                <Td style={{fontSize:12}}>{c.batch}</Td>
                <Td style={{fontSize:12,fontWeight:600}}>{c.section}</Td>
                <Td style={{fontFamily:'var(--font-mono)',fontWeight:700,color:'var(--green)',fontSize:12}}>₹{c.package}L</Td>
                <Td>{c.students}</Td>
                <Td>
                  <div style={{display:'flex',alignItems:'center',gap:7}}>
                    <div style={{width:65,height:5,background:'var(--surface2)',borderRadius:3,overflow:'hidden'}}>
                      <div style={{width:`${Math.round(c.students/placed*100)}%`,height:'100%',background:c.color,borderRadius:3}}/>
                    </div>
                    <span style={{fontSize:11,color:'var(--text3)'}}>{Math.round(c.students/placed*100)}%</span>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        </Card>
      </div>

      {showAdd&&<AddCompanyModal onSave={c=>setCompanies(p=>[...p,{...c,color:'#1e3a5f'}])} onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}