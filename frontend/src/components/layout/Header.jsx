// frontend/src/components/layout/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, Bell, ChevronRight, LogOut, Menu, Search, User } from 'lucide-react';
import UploadModal from '../ui/UploadModal.jsx';
import { dataService } from '../../data/dataService.js';

const CRUMBS = {
  '/':            'Overview',
  '/attendance':  'Attendance',
  '/results':     'Results',
  '/placement':   'Placement',
  '/internal':    'Internal Tests',
  '/settings':    'User Settings',
  '/profile':     'Profile Settings',
  '/hod':         'HOD Management Panel',
};

const now = new Date().toLocaleDateString('en-IN', {
  day: 'numeric', month: 'long', year: 'numeric',
});

export default function Header({ user, onLogout, onMenuToggle }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  
  // Spotlight search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Debounced search logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await dataService.searchStudents(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside search listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStudentClick = (regNumber) => {
    navigate(`/students/${regNumber}/profile`);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const isFaculty = user?.role === 'admin' || user?.role === 'hod';

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

        {/* Global Student Search (Faculty only) */}
        {isFaculty && (
          <div ref={searchRef} style={{ position: 'relative', flex: '0 1 320px', margin: '0 16px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text3)' }} />
              <input
                type="text"
                placeholder="Spotlight search student: name / reg no..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                style={{
                  width: '100%', padding: '7px 12px 7px 32px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--surface2)',
                  color: 'var(--text)', fontSize: 13, outline: 'none'
                }}
              />
            </div>
            {showSearchDropdown && searchQuery.trim().length >= 2 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                maxHeight: 250, overflowY: 'auto', zIndex: 1000
              }}>
                {searching ? (
                  <div style={{ padding: 12, fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>Searching student database...</div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: 12, fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>No student found.</div>
                ) : (
                  searchResults.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleStudentClick(s.reg_number)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                        cursor: 'pointer', borderBottom: '1px solid var(--border)',
                        transition: 'background 0.2s', fontSize: 12.5
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={14} color="var(--accent)" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Reg: {s.reg_number} · Batch: {s.batch}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Right actions */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span className="mobile-hide" style={{ fontSize:12, color:'var(--text3)', marginRight:4 }}>{now}</span>

          {(user?.role === 'admin' || user?.role === 'staff') && (
            <button onClick={() => setShowUpload(true)} style={{
              display:'flex', alignItems:'center', gap:5,
              padding:'6px 10px', borderRadius:7, fontSize:12.5, fontWeight:600,
              background:'var(--accent)', color:'#fff', border:'none', cursor:'pointer',
              boxShadow:'0 1px 3px rgba(30,58,95,0.25)',
            }}>
              <Upload size={13} /> <span className="mobile-hide">Upload Data</span>
            </button>
          )}

          <button className="mobile-hide" style={{
            width:34, height:34, borderRadius:7,
            background:'var(--surface2)', color:'var(--text2)',
            border:'1px solid var(--border)',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
          }}>
            <Bell size={14} />
          </button>

          {/* User avatar + settings redirect */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div 
              onClick={() => navigate('/profile')}
              title="Go to Profile"
              style={{
                width:32, height:32, borderRadius:'50%',
                background:'var(--accent)', color:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:700, flexShrink:0, cursor: 'pointer'
              }}
            >
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
