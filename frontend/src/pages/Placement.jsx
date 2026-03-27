// frontend/src/pages/Placement.jsx
import{useState,useRef}from'react';
import{useData}from'../hooks/useData.js';
import Card from'../components/ui/Card.jsx';
import LoadingSpinner from'../components/ui/LoadingSpinner.jsx';
import PageHeader from'../components/ui/PageHeader.jsx';
import{Table,Tr,Td}from'../components/ui/Table.jsx';
import{dataService}from'../data/dataService.js';
import{TrendingUp,Building2,IndianRupee,Award,Users,Upload,FileSpreadsheet,CheckCircle,AlertCircle,X,Plus}from'lucide-react';
import{PieChart,Pie,Cell,Tooltip,ResponsiveContainer,BarChart,Bar,XAxis,YAxis,CartesianGrid}from'recharts';

const TS={contentStyle:{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontSize:12,boxShadow:'var(--shadow-md)'}};

const INIT_COMPANIES=[
  {company:'Zoho Corporation',  package:18.0,students:3, type:'Product', batch:'2024–25',color:'#16a34a'},
  {company:'TCS Digital',       package:7.0, students:18,type:'IT',      batch:'2024–25',color:'#1e3a5f'},
  {company:'Infosys Systems',   package:6.5, students:12,type:'IT',      batch:'2024–25',color:'#2a5298'},
  {company:'Wipro Elite',       package:6.0, students:14,type:'IT',      batch:'2024–25',color:'#6d28d9'},
  {company:'Cognizant',         package:5.5, students:20,type:'IT',      batch:'2024–25',color:'#b45309'},
  {company:'HCL Technologies',  package:4.5, students:22,type:'IT',      batch:'2024–25',color:'#4a5568'},
  {company:'Infosys',           package:4.0, students:5, type:'IT',      batch:'2024–25',color:'#4a5568'},
];
const PKG_DIST=[{range:'>10 LPA',count:3},{range:'6–10',count:30},{range:'4–6',count:47},{range:'<4',count:14}];

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
          <p style={{fontSize:11,color:'var(--text3)',marginTop:2}}>Required columns: Student_ID, Company, Package_LPA, Offer_Type, Batch</p>
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
  const[form,setForm]=useState({company:'',package:'',students:'',type:'IT',batch:'2024–25',color:'#1e3a5f'});
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
          {[['Company Name','company','text','e.g. Zoho Corporation'],['Package (LPA)','package','number','e.g. 7.5'],['Students Placed','students','number','e.g. 12'],['Batch','batch','text','e.g. 2024–25']].map(([l,k,t,ph])=>(
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
  const{data,loading}=useData('getPlacementStats');
  const[showUpload,setShowUpload]=useState(false);
  const[showAdd,setShowAdd]=useState(false);
  const[companies,setCompanies]=useState(INIT_COMPANIES);
  if(loading||!data)return<LoadingSpinner/>;

  const placed=companies.reduce((a,c)=>a+c.students,0);
  const pkgDistData=PKG_DIST;
  const pieData=[
    {name:'Placed',   value:placed,        fill:'#16a34a'},
    {name:'Not Placed',value:data.eligible-placed,fill:'#e2e6ed'},
  ];

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

      {/* KPIs */}
      <div className="fade-up-1" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'Placement Rate',   value:`${Math.round(placed/data.eligible*100)}%`,color:'green', icon:TrendingUp},
          {label:'Students Placed',  value:`${placed}`,     color:'blue',  icon:Users},
          {label:'Eligible',         value:`${data.eligible}`,color:'blue',icon:Award},
          {label:'Avg Package',      value:`₹${data.avgPackage}L`,color:'gold',icon:IndianRupee},
          {label:'Highest Package',  value:`₹${Math.max(...companies.map(c=>c.package))}L`,color:'purple',icon:Building2},
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
          <Table headers={['Company','Type','Batch','Package','Students','Share']}>
            {[...companies].sort((a,b)=>b.package-a.package).map((c,i)=>(
              <Tr key={i}>
                <Td><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:'50%',background:c.color,flexShrink:0}}/><span style={{fontWeight:600,color:'var(--text)',fontSize:13}}>{c.company}</span></div></Td>
                <Td><span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:20,background:'var(--accent-bg)',color:'var(--accent)'}}>{c.type}</span></Td>
                <Td style={{fontSize:12}}>{c.batch}</Td>
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
