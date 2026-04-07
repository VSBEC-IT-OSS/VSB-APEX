// frontend/src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen,
  TrendingUp, ClipboardList, Settings,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const NAV_ALWAYS = [
  { to:'/',          icon:LayoutDashboard, label:'Overview'       },
  { to:'/attendance',icon:Users,           label:'Attendance'     },
  { to:'/results',   icon:BookOpen,        label:'Results'        },
  { to:'/internal',  icon:ClipboardList,   label:'Internal Tests' },
  { to:'/placement', icon:TrendingUp,      label:'Placement'      },
];

const NAV_ADMIN = [
  { to:'/settings',  icon:Settings,        label:'User Settings'  },
];

const W_OPEN = 230;
const W_MINI = 64;

export default function Sidebar({ user, isOpen, onToggle }) {
  const isAdmin   = user?.role === 'admin';
  const navItems  = isAdmin ? [...NAV_ALWAYS, ...NAV_ADMIN] : NAV_ALWAYS;
  const sideWidth = isOpen ? W_OPEN : W_MINI;

  return (
    <aside style={{
      width: sideWidth, height:'100vh', flexShrink:0,
      position: 'sticky', top: 0,
      background:'var(--accent)', display:'flex', flexDirection:'column',
      transition:'width 0.22s cubic-bezier(0.4,0,0.2,1)',
      overflow:'hidden',
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ padding: isOpen ? '22px 18px 16px' : '22px 0 16px', borderBottom:'1px solid rgba(255,255,255,0.12)', transition:'padding 0.22s' }}>
        {isOpen ? (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:34, height:34, borderRadius:8,
              background:'rgba(255,255,255,0.15)', flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-display)', fontWeight:800, fontSize:13,
              color:'#fff', letterSpacing:0.5,
            }}>IT</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, color:'#fff', letterSpacing:'-0.3px' }}>
                VSB-APEX
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:1 }}>Academic Dashboard</div>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', justifyContent:'center' }}>
            <div style={{
              width:34, height:34, borderRadius:8,
              background:'rgba(255,255,255,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-display)', fontWeight:800, fontSize:13,
              color:'#fff',
            }}>IT</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding: isOpen ? '14px 10px' : '14px 8px', overflowY:'auto', transition:'padding 0.22s' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            title={!isOpen ? label : undefined}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center',
              gap: isOpen ? 10 : 0,
              justifyContent: isOpen ? 'flex-start' : 'center',
              padding: isOpen ? '9px 12px' : '11px 0',
              borderRadius:8, marginBottom:2,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              textDecoration:'none', fontSize:13.5,
              fontWeight: isActive ? 600 : 400,
              transition:'all 0.15s',
            })}
          >
            <Icon size={17} style={{ flexShrink:0 }} />
            {isOpen && <span style={{ whiteSpace:'nowrap', overflow:'hidden' }}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User / Toggle area */}
      <div style={{ padding: isOpen ? '16px' : '12px 0', borderTop:'1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center' }}>
          {isOpen && user && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{user.role?.toUpperCase()}</div>
            </div>
          )}

          <button
            onClick={onToggle}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            {isOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>

        {isOpen && (
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop: 12 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block' }} />
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>Live · v0.3.0</span>
          </div>
        )}
      </div>
    </aside>
  );
}
