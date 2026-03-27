// frontend/src/pages/Goals.jsx
import{useState}from'react';
import{useData}from'../hooks/useData.js';
import Card from'../components/ui/Card.jsx';
import LoadingSpinner from'../components/ui/LoadingSpinner.jsx';
import PageHeader from'../components/ui/PageHeader.jsx';
import{dataService}from'../data/dataService.js';
import{Target,CheckCircle,AlertTriangle,Clock,Plus,Pencil,Trash2,X,Info}from'lucide-react';

const STATUS={
  achieved:   {label:'Achieved',   color:'var(--green)', bg:'var(--green-bg)', icon:CheckCircle},
  'in-progress':{label:'In Progress',color:'var(--accent)',bg:'var(--accent-bg)',icon:Clock},
  'at-risk':  {label:'At Risk',    color:'var(--red)',   bg:'var(--red-bg)',   icon:AlertTriangle},
};

const METRICS=[
  {key:'attendance_overall',    label:'Overall Attendance %',     unit:'%',  rule:'Auto: computed from attendance_summary avg'},
  {key:'pass_pct',              label:'Overall Pass %',           unit:'%',  rule:'Auto: computed from results table'},
  {key:'avg_cgpa',              label:'Average CGPA',             unit:'',   rule:'Auto: avg total_marks/10 from results'},
  {key:'placement_rate',        label:'Placement Rate %',         unit:'%',  rule:'Auto: placed/eligible*100 from placement'},
  {key:'arrear_sections',       label:'Zero-Arrear Sections',     unit:'',   rule:'Auto: count sections where arrears=0'},
  {key:'avg_internal',          label:'Avg Internal Test Score %',unit:'%',  rule:'Auto: avg from internal_tests table'},
  {key:'sections_above_80att',  label:'Sections Above 80% Attendance',unit:'',rule:'Auto: count sections where avg_attendance>80'},
  {key:'highest_package',       label:'Highest Package (LPA)',    unit:'LPA',rule:'Manual: updated from placement upload'},
  {key:'custom',                label:'Custom Metric',            unit:'',   rule:'Manual: HoD updates current value manually'},
];

const EMPTY={metric:'attendance_overall',label:'',target:'',current:'',unit:'%',deadline:'',status:'in-progress',rule:'',autoTracked:true};

function RuleInfo({rule}){
  return(
    <div style={{display:'flex',gap:6,padding:'7px 10px',borderRadius:7,background:'var(--accent-bg)',marginTop:6}}>
      <Info size={12} color="var(--accent)" style={{flexShrink:0,marginTop:1}}/>
      <p style={{fontSize:11,color:'var(--accent)'}}>{rule}</p>
    </div>
  );
}

function GoalModal({goal,onSave,onClose}){
  const[form,setForm]=useState(goal||{...EMPTY});
  const sel=METRICS.find(m=>m.key===form.metric)||METRICS[0];
  function upd(k,v){setForm(p=>({...p,[k]:v}));}
  function handleMetricChange(k){
    const m=METRICS.find(x=>x.key===k);
    setForm(p=>({...p,metric:k,unit:m?.unit||'',rule:m?.rule||'',autoTracked:m?.key!=='custom',label:m?.label||''}));
  }
  const pct=form.target&&form.current?Math.min(100,Math.round((+form.current/+form.target)*100)):0;

  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:'var(--surface)',borderRadius:12,width:520,border:'1px solid var(--border)',boxShadow:'var(--shadow-md)',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{padding:'16px 20px 14px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:'var(--surface)',zIndex:1}}>
          <h2 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:15,color:'var(--text)'}}>{goal?'Edit Goal':'Add New Goal'}</h2>
          <button onClick={onClose} style={{color:'var(--text3)',display:'flex',padding:4}}><X size={17}/></button>
        </div>
        <div style={{padding:'18px 20px'}}>
          {/* Metric */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:5}}>Metric</label>
            <select value={form.metric} onChange={e=>handleMetricChange(e.target.value)}
              style={{width:'100%',padding:'8px 12px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:13,color:'var(--text)',outline:'none'}}>
              {METRICS.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
            <RuleInfo rule={sel.rule}/>
          </div>
          {/* Custom label if custom */}
          {form.metric==='custom'&&(
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:5}}>Custom Label</label>
              <input value={form.label} onChange={e=>upd('label',e.target.value)} placeholder="e.g. Students in placement training"
                style={{width:'100%',padding:'8px 12px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:13,color:'var(--text)',outline:'none',boxSizing:'border-box'}}/>
            </div>
          )}
          {/* Target + Current + Unit */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 80px',gap:10,marginBottom:14}}>
            {[['Target',form.target,'target'],['Current',form.current,'current'],['Unit',form.unit,'unit']].map(([l,v,k])=>(
              <div key={k}>
                <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:5}}>{l}</label>
                <input type={k==='unit'?'text':'number'} value={v} onChange={e=>upd(k,e.target.value)} placeholder={k==='unit'?'%':'0'}
                  style={{width:'100%',padding:'8px 12px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:13,color:'var(--text)',outline:'none',boxSizing:'border-box'}}/>
              </div>
            ))}
          </div>
          {/* Progress preview */}
          {form.target&&form.current&&(
            <div style={{marginBottom:14,padding:'10px 14px',background:'var(--surface2)',borderRadius:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:12,color:'var(--text2)',fontWeight:500}}>Progress preview</span>
                <span style={{fontSize:12,fontWeight:700,color:'var(--accent)'}}>{pct}%</span>
              </div>
              <div style={{height:6,background:'var(--border)',borderRadius:3,overflow:'hidden'}}>
                <div style={{width:`${pct}%`,height:'100%',background:pct>=100?'var(--green)':pct>=70?'var(--accent)':'var(--yellow)',borderRadius:3}}/>
              </div>
            </div>
          )}
          {/* Deadline + Status */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:5}}>Deadline</label>
              <input type="month" value={form.deadline?.replace(' ','').length===8?form.deadline:''} onChange={e=>{const d=new Date(e.target.value+'-01');upd('deadline',d.toLocaleDateString('en-IN',{month:'short',year:'numeric'}));}}
                style={{width:'100%',padding:'8px 12px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:13,color:'var(--text)',outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:5}}>Status</label>
              <select value={form.status} onChange={e=>upd('status',e.target.value)}
                style={{width:'100%',padding:'8px 12px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:13,color:'var(--text)',outline:'none'}}>
                <option value="in-progress">In Progress</option>
                <option value="at-risk">At Risk</option>
                <option value="achieved">Achieved</option>
              </select>
            </div>
          </div>
          {/* Auto-track toggle */}
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:8,background:'var(--surface2)',marginBottom:18}}>
            <input type="checkbox" id="auto" checked={form.autoTracked} onChange={e=>upd('autoTracked',e.target.checked)}
              style={{accentColor:'var(--accent)',width:15,height:15,cursor:'pointer'}}/>
            <div>
              <label htmlFor="auto" style={{fontSize:13,fontWeight:600,color:'var(--text)',cursor:'pointer'}}>Auto-track this goal</label>
              <p style={{fontSize:11,color:'var(--text3)',marginTop:1}}>When enabled, current value is computed from DB automatically (backend Phase 3+)</p>
            </div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button onClick={onClose} style={{padding:'9px 18px',borderRadius:8,fontSize:13,fontWeight:500,background:'var(--surface2)',color:'var(--text2)',border:'1px solid var(--border)',cursor:'pointer'}}>Cancel</button>
            <button onClick={()=>onSave(form)} style={{padding:'9px 20px',borderRadius:8,fontSize:13,fontWeight:600,background:'var(--accent)',color:'#fff',border:'none',cursor:'pointer'}}>
              {goal?'Save Changes':'Add Goal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalCard({goal,onEdit,onDelete}){
  const s=STATUS[goal.status]||STATUS['in-progress'];
  const Icon=s.icon;
  const pct=Math.min(100,Math.round((+goal.current/+goal.target)*100));
  const gap=(+goal.target-+goal.current).toFixed(1);
  return(
    <Card style={{borderLeft:`4px solid ${s.color}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontWeight:700,fontSize:13.5,color:'var(--text)',marginBottom:2}}>{goal.label||goal.metric}</p>
          <p style={{fontSize:11,color:'var(--text3)'}}>Deadline: {goal.deadline}</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0,marginLeft:8}}>
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:20,background:s.bg}}>
            <Icon size={11} color={s.color}/>
            <span style={{fontSize:10,fontWeight:600,color:s.color}}>{s.label}</span>
          </div>
          <button onClick={()=>onEdit(goal)} style={{color:'var(--text3)',display:'flex',padding:4,borderRadius:5,cursor:'pointer'}}><Pencil size={13}/></button>
          <button onClick={()=>onDelete(goal.id)} style={{color:'var(--red)',display:'flex',padding:4,borderRadius:5,cursor:'pointer'}}><Trash2 size={13}/></button>
        </div>
      </div>
      <div style={{marginBottom:8}}>
        <div style={{height:7,background:'var(--surface2)',borderRadius:4,overflow:'hidden'}}>
          <div style={{width:`${pct}%`,height:'100%',borderRadius:4,background:s.color,transition:'width .5s'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
          <span style={{fontSize:11,color:'var(--text3)'}}>{pct}% of target</span>
          <span style={{fontSize:11,color:'var(--text3)'}}>{goal.status==='achieved'?'Target met ✓':`${gap}${goal.unit} to go`}</span>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
        {[['Current',`${goal.current}${goal.unit}`,s.color],['Target',`${goal.target}${goal.unit}`,'var(--text)']].map(([l,v,c])=>(
          <div key={l} style={{padding:'7px 10px',background:'var(--surface2)',borderRadius:7,textAlign:'center'}}>
            <p style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.04em'}}>{l}</p>
            <p style={{fontFamily:'var(--font-display)',fontSize:18,fontWeight:800,color:c,marginTop:2}}>{v}</p>
          </div>
        ))}
      </div>
      {goal.autoTracked&&(
        <div style={{marginTop:8,display:'flex',gap:5,alignItems:'center'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',display:'inline-block',flexShrink:0}}/>
          <span style={{fontSize:10,color:'var(--text3)'}}>Auto-tracked from database</span>
        </div>
      )}
    </Card>
  );
}

export default function Goals(){
  const{data:initial,loading}=useData('getGoals');
  const[goals,setGoals]=useState(null);
  const[modal,setModal]=useState(null); // null | 'add' | goalObject
  const[deleteConfirm,setDeleteConfirm]=useState(null);

  if(loading)return<LoadingSpinner/>;
  const list=goals??initial;

  const counts={achieved:list.filter(g=>g.status==='achieved').length,'in-progress':list.filter(g=>g.status==='in-progress').length,'at-risk':list.filter(g=>g.status==='at-risk').length};

  function saveGoal(form){
    if(modal==='add'){
      const newGoal={...form,id:Date.now(),label:form.label||METRICS.find(m=>m.key===form.metric)?.label||form.metric};
      setGoals([...(goals??initial),newGoal]);
    }else{
      setGoals((goals??initial).map(g=>g.id===form.id?{...form,label:form.label||METRICS.find(m=>m.key===form.metric)?.label||form.metric}:g));
    }
    setModal(null);
  }

  function deleteGoal(id){
    setGoals((goals??initial).filter(g=>g.id!==id));
    setDeleteConfirm(null);
  }

  return(
    <div style={{padding:'24px 28px'}}>
      <PageHeader
        title="Goal Tracking"
        sub="Department targets · HoD managed · auto-tracked where possible"
        action={
          <button onClick={()=>setModal('add')} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:8,background:'var(--accent)',color:'#fff',fontSize:13,fontWeight:600,border:'none',cursor:'pointer',boxShadow:'0 1px 3px rgba(30,58,95,.25)'}}>
            <Plus size={14}/> Add Goal
          </button>
        }
      />

      {/* Summary */}
      <div className="fade-up-1" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
        {[
          {key:'achieved',    label:'Achieved',    icon:CheckCircle},
          {key:'in-progress', label:'In Progress', icon:Clock},
          {key:'at-risk',     label:'At Risk',     icon:AlertTriangle},
        ].map(s=>{
          const st=STATUS[s.key];const Icon=s.icon;
          return(
            <Card key={s.key} style={{borderTop:`3px solid ${st.color}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <p style={{fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{s.label}</p>
                  <p style={{fontFamily:'var(--font-display)',fontSize:32,fontWeight:800,color:st.color,marginTop:6,lineHeight:1}}>{counts[s.key]}</p>
                  <p style={{fontSize:11,color:'var(--text3)',marginTop:4}}>of {list.length} goals</p>
                </div>
                <div style={{width:38,height:38,borderRadius:9,background:st.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon size={16} color={st.color}/>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="fade-up-2" style={{marginBottom:16}}>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>Overall Goal Progress</h3>
            <span style={{fontSize:13,fontWeight:600,color:'var(--accent)'}}>{Math.round((counts.achieved/list.length)*100)}% complete</span>
          </div>
          <div style={{height:10,background:'var(--surface2)',borderRadius:5,overflow:'hidden',display:'flex',gap:2}}>
            <div style={{width:`${(counts.achieved/list.length)*100}%`,background:'var(--green)',borderRadius:5,transition:'width .5s'}}/>
            <div style={{width:`${(counts['in-progress']/list.length)*100}%`,background:'var(--accent)',transition:'width .5s'}}/>
            <div style={{width:`${(counts['at-risk']/list.length)*100}%`,background:'var(--red)',borderRadius:5,transition:'width .5s'}}/>
          </div>
          <div style={{display:'flex',gap:20,marginTop:8}}>
            {[['var(--green)','Achieved'],['var(--accent)','In Progress'],['var(--red)','At Risk']].map(([c,l])=>(
              <span key={l} style={{fontSize:11,color:'var(--text3)',display:'flex',alignItems:'center',gap:5}}>
                <span style={{width:9,height:9,borderRadius:2,background:c,display:'inline-block'}}/>{l}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Goal cards */}
      <div className="fade-up-3" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[...list].sort((a,b)=>{const o={'at-risk':0,'in-progress':1,'achieved':2};return o[a.status]-o[b.status];})
          .map(g=><GoalCard key={g.id} goal={g} onEdit={g=>setModal(g)} onDelete={id=>setDeleteConfirm(id)}/>)}
      </div>

      {/* Add/Edit modal */}
      {modal&&<GoalModal goal={modal==='add'?null:modal} onSave={saveGoal} onClose={()=>setModal(null)}/>}

      {/* Delete confirm */}
      {deleteConfirm&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <Card style={{width:360,textAlign:'center',padding:'28px 24px'}}>
            <Trash2 size={28} color="var(--red)" style={{margin:'0 auto 12px'}}/>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:15,marginBottom:6}}>Delete this goal?</h3>
            <p style={{fontSize:13,color:'var(--text3)',marginBottom:20}}>This action cannot be undone.</p>
            <div style={{display:'flex',gap:8,justifyContent:'center'}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{padding:'8px 20px',borderRadius:8,fontSize:13,fontWeight:500,background:'var(--surface2)',color:'var(--text2)',border:'1px solid var(--border)',cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>deleteGoal(deleteConfirm)} style={{padding:'8px 20px',borderRadius:8,fontSize:13,fontWeight:600,background:'var(--red)',color:'#fff',border:'none',cursor:'pointer'}}>Delete</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
