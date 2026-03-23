/**
 * Sidebar.jsx — updated for Part 3
 * - Accepts optional `user` prop (passed from App)
 * - Shows "User Settings" nav item only when role === 'admin'
 * frontend/src/components/layout/Sidebar.jsx
 */

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Lightbulb,
  TrendingUp, ClipboardList, Target, Settings,
} from 'lucide-react';

const NAV_ALWAYS = [
  { to:'/',          icon:LayoutDashboard, label:'Overview'       },
  { to:'/attendance',icon:Users,           label:'Attendance'     },
  { to:'/results',   icon:BookOpen,        label:'Results'        },
  { to:'/internal',  icon:ClipboardList,   label:'Internal Tests' },
  { to:'/insights',  icon:Lightbulb,       label:'Insights'       },
  { to:'/goals',     icon:Target,          label:'Goal Tracking'  },
  { to:'/placement', icon:TrendingUp,      label:'Placement'      },
];

const NAV_ADMIN = [
  { to:'/settings',  icon:Settings,        label:'User Settings'  },
];

export default function Sidebar({ user }) {
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? [...NAV_ALWAYS, ...NAV_ADMIN] : NAV_ALWAYS;

  return (
    <aside style={{
      width:230, minHeight:'100vh', flexShrink:0,
      background:'var(--accent)', display:'flex', flexDirection:'column',
    }}>
      {/* Brand */}
      <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <div style={{
            width:34, height:34, borderRadius:8,
            background:'rgba(255,255,255,0.15)',
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
        <div style={{
          marginTop:10, padding:'6px 10px', borderRadius:6,
          background:'rgba(255,255,255,0.1)',
          fontSize:11, color:'rgba(255,255,255,0.7)', lineHeight:1.4,
        }}>
          Dept of Information Technology<br />
          <span style={{ color:'rgba(255,255,255,0.45)', fontSize:10 }}>VSB Engineering College</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'14px 12px', overflowY:'auto' }}>
        <p style={{
          fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:600,
          letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 8px 8px',
        }}>
          Navigation
        </p>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10,
              padding:'9px 12px', borderRadius:8, marginBottom:2,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              textDecoration:'none', fontSize:13.5,
              fontWeight: isActive ? 600 : 400,
              transition:'all 0.15s',
            })}
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}

        {/* Admin section divider */}
        {isAdmin && (
          <p style={{
            fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase',
            padding:'12px 8px 6px', marginTop:4,
            borderTop:'1px solid rgba(255,255,255,0.1)',
          }}>
            Administration
          </p>
        )}
      </nav>

      {/* Footer */}
      <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.12)' }}>
        {user && (
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{user.name}</div>
            <RoleBadge role={user.role} />
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', flexShrink:0 }} />
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>Live · v0.2.0</span>
        </div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:4 }}>AY 2024–25</div>
      </div>
    </aside>
  );
}

function RoleBadge({ role }) {
  const labels = { admin:'Super Admin', hod:'Head of Dept', staff:'Staff' };
  return (
    <span style={{
      display:'inline-block', marginTop:3,
      fontSize:10, fontWeight:600, letterSpacing:'0.04em',
      padding:'2px 7px', borderRadius:10,
      background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.65)',
    }}>
      {labels[role] ?? role}
    </span>
  );
}
