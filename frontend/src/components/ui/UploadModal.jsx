import { useState, useRef } from 'react';
import { dataService } from '../../data/dataService.js';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

const TYPES = [
  { key:'attendance', label:'Attendance Data',     desc:'Daily attendance records', cols:'Student_ID, Department, Year, Section, Date' },
  { key:'results',    label:'Exam Results',        desc:'Semester result sheet',    cols:'Student_ID, Department, Year, Section, Semester, Subject_Code, Total_Marks' },
  { key:'internal',   label:'Internal Test Marks', desc:'Test 1, 2 & 3 marks',     cols:'Student_ID, Department, Year, Section, Subject_Code, Test_Number, Marks_Scored' },
  { key:'placement',  label:'Placement Data',      desc:'Company placement records', cols:'Student_ID, Department, Year, Section, Company, Package_LPA' },
];

export default function UploadModal({ onClose }) {
  const [type,     setType]     = useState('attendance');
  const [file,     setFile]     = useState(null);
  const [status,   setStatus]   = useState(null); // null | 'uploading' | 'success' | 'error'
  const [result,   setResult]   = useState(null);
  const [errMsg,   setErrMsg]   = useState('');
  const fileRef = useRef();

  const selected = TYPES.find(t => t.key === type);

  async function handleUpload() {
    if (!file) return;
    setStatus('uploading'); setErrMsg('');
    try {
      const res = await dataService.uploadFile(type, file);
      setResult(res); setStatus('success');
    } catch(e) {
      setErrMsg(e.message); setStatus('error');
    }
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.35)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:1000, padding:20,
    }} onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{
        background:'var(--surface)', borderRadius:12, width:500,
        border:'1px solid var(--border)', boxShadow:'var(--shadow-md)',
      }}>
        {/* Header */}
        <div style={{ padding:'18px 22px 14px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--text)' }}>Upload Data</h2>
            <p style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>Upload Excel (.xlsx) files to populate the dashboard</p>
          </div>
          <button onClick={onClose} style={{ color:'var(--text3)', padding:4, borderRadius:6, display:'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding:'18px 22px' }}>
          {/* Type selector */}
          <p style={{ fontSize:11, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Data Type</p>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:18 }}>
            {TYPES.map(t => (
              <label key={t.key} style={{
                display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px',
                borderRadius:8, border:'1px solid',
                borderColor: type===t.key ? 'var(--accent)' : 'var(--border)',
                background:  type===t.key ? 'var(--accent-bg)' : 'var(--surface2)',
                cursor:'pointer', transition:'all 0.12s',
              }}>
                <input type="radio" name="type" value={t.key} checked={type===t.key}
                  onChange={() => { setType(t.key); setFile(null); setStatus(null); }}
                  style={{ marginTop:2, accentColor:'var(--accent)' }} />
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{t.label}</p>
                  <p style={{ fontSize:11, color:'var(--text3)' }}>{t.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Required columns */}
          <div style={{ padding:'8px 12px', background:'var(--surface2)', borderRadius:7, marginBottom:16 }}>
            <p style={{ fontSize:11, color:'var(--text3)', marginBottom:3 }}>
              <strong style={{ color:'var(--text2)' }}>Required columns:</strong>
            </p>
            <p style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--accent)' }}>{selected.cols}</p>
          </div>

          {/* File drop zone */}
          <div
            onClick={() => fileRef.current.click()}
            style={{
              border:`2px dashed ${file ? 'var(--green)' : 'var(--border2)'}`,
              borderRadius:8, padding:'20px 16px',
              textAlign:'center', cursor:'pointer',
              background: file ? 'var(--green-bg)' : 'var(--surface2)',
              transition:'all 0.15s', marginBottom:16,
            }}>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display:'none' }}
              onChange={e => { setFile(e.target.files[0]); setStatus(null); }} />
            {file ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <FileSpreadsheet size={18} color="var(--green)" />
                <span style={{ fontSize:13, fontWeight:600, color:'var(--green)' }}>{file.name}</span>
              </div>
            ) : (
              <>
                <Upload size={20} color="var(--text3)" style={{ margin:'0 auto 6px' }} />
                <p style={{ fontSize:13, color:'var(--text2)', fontWeight:500 }}>Click to select .xlsx file</p>
                <p style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>or drag and drop</p>
              </>
            )}
          </div>

          {/* Status */}
          {status === 'success' && result && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px', background:'var(--green-bg)', border:'1px solid #86efac', borderRadius:8, marginBottom:14 }}>
              <CheckCircle size={15} color="var(--green)" style={{ flexShrink:0, marginTop:1 }} />
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:'var(--green)' }}>Upload successful</p>
                <p style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>
                  {result.rows_inserted} rows added · {result.rows_skipped} skipped (duplicates)
                </p>
              </div>
            </div>
          )}
          {status === 'error' && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px', background:'var(--red-bg)', border:'1px solid #fca5a5', borderRadius:8, marginBottom:14 }}>
              <AlertCircle size={15} color="var(--red)" style={{ flexShrink:0, marginTop:1 }} />
              <p style={{ fontSize:13, color:'var(--red)' }}>{errMsg || 'Upload failed. Check file format.'}</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button onClick={onClose} style={{
              padding:'9px 18px', borderRadius:8, fontSize:13, fontWeight:500,
              background:'var(--surface2)', color:'var(--text2)', border:'1px solid var(--border)',
            }}>Cancel</button>
            <button onClick={handleUpload} disabled={!file || status==='uploading'} style={{
              padding:'9px 18px', borderRadius:8, fontSize:13, fontWeight:600,
              background: (!file||status==='uploading') ? 'var(--border2)' : 'var(--accent)',
              color:'#fff', cursor: (!file||status==='uploading') ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', gap:6,
            }}>
              {status==='uploading' ? 'Uploading…' : <><Upload size={13} /> Upload</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
