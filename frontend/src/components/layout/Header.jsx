// frontend/src/components/layout/Header.jsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload, Bell, ChevronRight, LogOut, Menu } from 'lucide-react';
import UploadModal from '../ui/UploadModal.jsx';

const CRUMBS = {
  '/':            'Overview',
  '/attendance':  'Attendance',
  '/results':     'Results',
  '/placement':   'Placement',
  '/internal':    'Internal Tests',
  '/settings':    'User Settings',
};

const now = new Date().toLocaleDateString('en-IN', {
  day: 'numeric', month: 'long', year: 'numeric',
});

export default function Header({ user, onLogout, onMenuToggle }) {
  const { pathname } = useLocation();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <header style={{
        height:58, background:'var(--surface)',
        borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px', position:'sticky', top:0, zIndex:10,
        boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {/* Left: menu toggle + breadcrumb */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button
            onClick={onMenuToggle}
            title="Toggle sidebar"
            style={{
              width:32, height:32, borderRadius:7,
              background:'var(--surface2)', color:'var(--text2)',
              border:'1px solid var(--border)',
              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              flexShrink:0,
            }}
          >
            <Menu size={15} />
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:6, overflow:'hidden' }}>
            <span className="mobile-hide" style={{ fontSize:12, color:'var(--text3)' }}>VSB-APEX</span>
            <ChevronRight size={13} color="var(--border2)" className="mobile-hide" />
            <span style={{ fontSize:13, fontWeight:600, color:'var(--accent)', whiteSpace:'nowrap' }}>
              {CRUMBS[pathname] ?? 'Overview'}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span className="mobile-hide" style={{ fontSize:12, color:'var(--text3)', marginRight:4 }}>{now}</span>

          <button onClick={() => setShowUpload(true)} style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'6px 10px', borderRadius:7, fontSize:12.5, fontWeight:600,
            background:'var(--accent)', color:'#fff', border:'none', cursor:'pointer',
            boxShadow:'0 1px 3px rgba(30,58,95,0.25)',
          }}>
            <Upload size={13} /> <span className="mobile-hide">Upload Data</span>
          </button>

          <button className="mobile-hide" style={{
            width:34, height:34, borderRadius:7,
            background:'var(--surface2)', color:'var(--text2)',
            border:'1px solid var(--border)',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
          }}>
            <Bell size={14} />
          </button>

          {/* User avatar + logout */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{
              width:32, height:32, borderRadius:'50%',
              background:'var(--accent)', color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:11, fontWeight:700, flexShrink:0
            }}>
              {user?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() ?? 'HoD'}
            </div>
            <button onClick={onLogout} title="Sign out" style={{
              color:'var(--text3)', display:'flex', alignItems:'center',
              padding:4, borderRadius:6, flexShrink:0
            }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  );
}
