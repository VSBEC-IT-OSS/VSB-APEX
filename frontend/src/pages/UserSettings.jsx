// frontend/src/pages/UserSettings.jsx
/**
 * UserSettings.jsx — Super-admin User Management page
 * frontend/src/pages/UserSettings.jsx
 *
 * Features
 *  • View all users in a sortable table
 *  • Create new user with name / email / password / role
 *  • Edit role, activate/deactivate, reset password inline
 *  • Delete user (with confirmation)
 *  • Login/logout activity log tab with timestamp + IP
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Shield, Activity, Search,
  CheckCircle, XCircle, Trash2, Edit2, X,
  Eye, EyeOff, RefreshCw, ChevronDown, LogIn, LogOut,
  Clock, Monitor,
} from 'lucide-react';
import PageHeader  from '../components/ui/PageHeader.jsx';
import { getAuthToken } from '../data/dataService.js';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

// ── tiny helpers ──────────────────────────────────────────────────────────────

function apiFetch(path, opts = {}) {
  const token = getAuthToken();
  return fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers ?? {}),
    },
  });
}

const ROLE_COLORS = {
  admin: { bg: 'rgba(109,40,217,0.09)', color: '#6d28d9', label: 'Admin' },
  hod:   { bg: 'rgba(30,58,95,0.09)',   color: '#1e3a5f', label: 'HoD'   },
  staff: { bg: 'rgba(16,163,74,0.09)',  color: '#15803d', label: 'Staff' },
};

function RolePill({ role }) {
  const c = ROLE_COLORS[role] ?? ROLE_COLORS.staff;
  return (
    <span style={{
      display:'inline-block', padding:'2px 9px', borderRadius:20,
      fontSize:11, fontWeight:600, letterSpacing:'0.03em',
      background:c.bg, color:c.color,
    }}>{c.label}</span>
  );
}

function StatusPill({ active }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:'2px 9px', borderRadius:20, fontSize:11, fontWeight:600,
      background: active ? 'rgba(22,163,74,0.09)' : 'rgba(220,38,38,0.09)',
      color: active ? '#16a34a' : '#dc2626',
    }}>
      {active ? <CheckCircle size={11}/> : <XCircle size={11}/>}
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function fmt(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleString('en-IN', {
    day:'2-digit', month:'short', year:'numeric',
    hour:'2-digit', minute:'2-digit', hour12:true,
  });
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(10,20,40,0.45)', backdropFilter:'blur(2px)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }} onClick={onClose}>
      <div style={{
        background:'var(--surface)', borderRadius:14,
        boxShadow:'0 20px 60px rgba(0,0,0,0.18)',
        width:480, maxWidth:'94vw', maxHeight:'92vh', overflowY:'auto',
        padding:28,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--text)' }}>
            {title}
          </h3>
          <button onClick={onClose} style={{
            width:30, height:30, borderRadius:8, display:'flex',
            alignItems:'center', justifyContent:'center',
            color:'var(--text3)', background:'var(--surface2)',
          }}><X size={15}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────

const fieldStyle = {
  width:'100%', padding:'9px 12px', borderRadius:8,
  border:'1.5px solid var(--border)', background:'var(--surface)',
  color:'var(--text)', fontSize:13, outline:'none',
  fontFamily:'var(--font-body)',
};

// ── Create User Form ──────────────────────────────────────────────────────────

function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm]     = useState({ name:'', email:'', password:'', role:'staff' });
  const [showPwd, setShow]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await apiFetch('/users', {
        method:'POST',
        body: JSON.stringify(form),
      });
      if (!r.ok) { const d = await r.json(); throw new Error(d.detail ?? 'Failed'); }
      const user = await r.json();
      onCreated(user);
      onClose();
    } catch (ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Create New User" onClose={onClose}>
      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {error && (
          <div style={{ padding:'9px 12px', borderRadius:8, background:'var(--red-bg)', color:'var(--red)', fontSize:13 }}>
            {error}
          </div>
        )}

        <div>
          <label style={labelStyle}>Full Name</label>
          <input style={fieldStyle} required placeholder="e.g. Dr. S. Ramesh"
            value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))} />
        </div>

        <div>
          <label style={labelStyle}>Email</label>
          <input style={fieldStyle} type="email" required placeholder="staff@vsbec.edu.in"
            value={form.email} onChange={e => setForm(f=>({...f, email:e.target.value}))} />
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position:'relative' }}>
            <input style={{...fieldStyle, paddingRight:38}}
              type={showPwd ? 'text' : 'password'} required minLength={8}
              placeholder="Min. 8 characters"
              value={form.password} onChange={e => setForm(f=>({...f, password:e.target.value}))} />
            <button type="button"
              style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                color:'var(--text3)', lineHeight:0 }}
              onClick={() => setShow(s=>!s)}>
              {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Role</label>
          <div style={{ position:'relative' }}>
            <select style={{...fieldStyle, appearance:'none', paddingRight:30}}
              value={form.role} onChange={e => setForm(f=>({...f, role:e.target.value}))}>
              <option value="staff">Staff</option>
              <option value="hod">Head of Department (HoD)</option>
              <option value="admin">Admin (Super)</option>
            </select>
            <ChevronDown size={13} style={{ position:'absolute', right:10, top:'50%',
              transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }}/>
          </div>
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
          <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
          <button type="submit" disabled={loading} style={btnPrimary}>
            {loading ? 'Creating…' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Edit User Modal ───────────────────────────────────────────────────────────

function EditUserModal({ user, onClose, onUpdated }) {
  const [form, setForm]       = useState({ name:user.name, role:user.role, is_active:user.is_active, password:'' });
  const [showPwd, setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const payload = { name:form.name, role:form.role, is_active:form.is_active };
    if (form.password) payload.password = form.password;
    try {
      const r = await apiFetch(`/users/${user.id}`, {
        method:'PATCH',
        body:JSON.stringify(payload),
      });
      if (!r.ok) { const d = await r.json(); throw new Error(d.detail ?? 'Failed'); }
      const updated = await r.json();
      onUpdated(updated);
      onClose();
    } catch(ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={`Edit User — ${user.name}`} onClose={onClose}>
      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {error && (
          <div style={{ padding:'9px 12px', borderRadius:8, background:'var(--red-bg)', color:'var(--red)', fontSize:13 }}>
            {error}
          </div>
        )}

        <div>
          <label style={labelStyle}>Full Name</label>
          <input style={fieldStyle} required value={form.name}
            onChange={e => setForm(f=>({...f,name:e.target.value}))}/>
        </div>

        <div>
          <label style={labelStyle}>Role</label>
          <div style={{ position:'relative' }}>
            <select style={{...fieldStyle, appearance:'none', paddingRight:30}}
              value={form.role} onChange={e => setForm(f=>({...f,role:e.target.value}))}>
              <option value="staff">Staff</option>
              <option value="hod">Head of Department (HoD)</option>
              <option value="admin">Admin (Super)</option>
            </select>
            <ChevronDown size={13} style={{ position:'absolute', right:10, top:'50%',
              transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }}/>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <div style={{ display:'flex', gap:10, marginTop:6 }}>
            {[true, false].map(val => (
              <label key={String(val)} style={{
                display:'flex', alignItems:'center', gap:6, cursor:'pointer',
                padding:'7px 14px', borderRadius:8,
                border:`1.5px solid ${form.is_active===val ? 'var(--accent)' : 'var(--border)'}`,
                background: form.is_active===val ? 'var(--accent-bg)' : 'transparent',
                fontSize:13, color: form.is_active===val ? 'var(--accent)' : 'var(--text2)',
              }}>
                <input type="radio" style={{ display:'none' }}
                  checked={form.is_active===val}
                  onChange={() => setForm(f=>({...f,is_active:val}))}/>
                {val ? <CheckCircle size={13}/> : <XCircle size={13}/>}
                {val ? 'Active' : 'Deactivated'}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Reset Password <span style={{ color:'var(--text3)', fontWeight:400 }}>(leave blank to keep)</span></label>
          <div style={{ position:'relative' }}>
            <input style={{...fieldStyle, paddingRight:38}}
              type={showPwd ? 'text' : 'password'} minLength={8}
              placeholder="New password (optional)"
              value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))}/>
            <button type="button"
              style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                color:'var(--text3)', lineHeight:0 }}
              onClick={() => setShow(s=>!s)}>
              {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
          <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
          <button type="submit" disabled={loading} style={btnPrimary}>
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Confirm Delete ────────────────────────────────────────────────────────────

function ConfirmDeleteModal({ user, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    const r = await apiFetch(`/users/${user.id}`, { method:'DELETE' });
    if (r.ok || r.status === 204) { onDeleted(user.id); onClose(); }
    setLoading(false);
  }

  return (
    <Modal title="Delete User" onClose={onClose}>
      <p style={{ color:'var(--text2)', fontSize:14, lineHeight:1.6 }}>
        Are you sure you want to permanently delete <strong>{user.name}</strong>?
        All their activity logs will also be removed. This action cannot be undone.
      </p>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:22 }}>
        <button onClick={onClose} style={btnSecondary}>Cancel</button>
        <button onClick={confirm} disabled={loading} style={{
          ...btnPrimary, background:'var(--red)', boxShadow:'none',
        }}>
          {loading ? 'Deleting…' : 'Delete User'}
        </button>
      </div>
    </Modal>
  );
}

// ── Shared button styles ──────────────────────────────────────────────────────

const btnPrimary = {
  padding:'9px 20px', borderRadius:8, fontSize:13, fontWeight:600,
  background:'var(--accent)', color:'#fff',
  boxShadow:'0 2px 8px rgba(30,58,95,0.18)', cursor:'pointer',
};
const btnSecondary = {
  padding:'9px 20px', borderRadius:8, fontSize:13, fontWeight:500,
  background:'var(--surface2)', color:'var(--text2)',
  border:'1.5px solid var(--border)', cursor:'pointer',
};
const labelStyle = {
  display:'block', fontSize:12, fontWeight:600,
  color:'var(--text2)', marginBottom:6,
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function UserSettings() {
  const [tab,      setTab]      = useState('users');   // 'users' | 'activity'
  const [users,    setUsers]    = useState([]);
  const [logs,     setLogs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null);      // null | 'create' | {edit:user} | {del:user}
  const [logUser,  setLogUser]  = useState('');        // filter logs by user id

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch('/users');
      if (r.ok) setUsers(await r.json());
    } finally { setLoading(false); }
  }, []);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const qs = logUser ? `?user_id=${logUser}` : '';
    try {
      const r = await apiFetch(`/users/activity-log${qs}`);
      if (r.ok) setLogs(await r.json());
    } finally { setLoading(false); }
  }, [logUser]);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { if (tab === 'activity') loadLogs(); }, [tab, loadLogs]);

  // ── derived ────────────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.role.includes(q)
  );

  const stats = {
    total:    users.length,
    active:   users.filter(u => u.is_active).length,
    admins:   users.filter(u => u.role === 'admin').length,
    inactive: users.filter(u => !u.is_active).length,
  };

  // ── handlers ───────────────────────────────────────────────────────────────
  function handleCreated(u)   { setUsers(prev => [u, ...prev]); }
  function handleUpdated(u)   { setUsers(prev => prev.map(x => x.id===u.id ? u : x)); }
  function handleDeleted(id)  { setUsers(prev => prev.filter(x => x.id !== id)); }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding:28, maxWidth:1200, margin:'0 auto' }} className="fade-up">
      <PageHeader
        icon={<Shield size={20} color="#fff" />}
        title="User Settings"
        subtitle="Manage staff accounts, roles, and monitor login activity"
      />

      {/* Stats Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Users',  value:stats.total,    icon:<Users size={16}/>,       color:'var(--accent)' },
          { label:'Active',       value:stats.active,   icon:<CheckCircle size={16}/>, color:'var(--green)' },
          { label:'Admin Roles',  value:stats.admins,   icon:<Shield size={16}/>,      color:'#6d28d9' },
          { label:'Deactivated',  value:stats.inactive, icon:<XCircle size={16}/>,     color:'var(--red)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{
            background:'var(--surface)', borderRadius:12,
            border:'1.5px solid var(--border)', padding:'16px 18px',
            boxShadow:'var(--shadow-sm)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <span style={{ color }}>{icon}</span>
              <span style={{ fontSize:12, color:'var(--text3)', fontWeight:500 }}>{label}</span>
            </div>
            <div style={{ fontSize:26, fontWeight:700, fontFamily:'var(--font-display)', color:'var(--text)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{
        background:'var(--surface)', borderRadius:12,
        border:'1.5px solid var(--border)', boxShadow:'var(--shadow-sm)',
        overflow:'hidden',
      }}>
        {/* Tab header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'14px 18px', borderBottom:'1.5px solid var(--border)',
          gap:12, flexWrap:'wrap',
        }}>
          <div style={{ display:'flex', gap:4 }}>
            {[
              { key:'users',    icon:<Users size={14}/>,    label:'All Users'    },
              { key:'activity', icon:<Activity size={14}/>, label:'Activity Log' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:600,
                background: tab===t.key ? 'var(--accent-bg)' : 'transparent',
                color: tab===t.key ? 'var(--accent)' : 'var(--text3)',
                border: tab===t.key ? '1.5px solid rgba(30,58,95,0.18)' : '1.5px solid transparent',
                cursor:'pointer',
              }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', gap:10, alignItems:'center', flex:1, justifyContent:'flex-end', flexWrap:'wrap' }}>
            {tab === 'users' && (
              <>
                <div style={{ position:'relative', flex:'0 1 240px', minWidth:180 }}>
                  <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }}/>
                  <input
                    style={{ ...fieldStyle, paddingLeft:30, height:34 }}
                    placeholder="Search users…"
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <button onClick={() => setModal('create')} style={{ ...btnPrimary, display:'flex', alignItems:'center', gap:6, padding:'7px 16px', whiteSpace:'nowrap' }}>
                  <UserPlus size={14}/> New User
                </button>
              </>
            )}
            {tab === 'activity' && (
              <>
                <div style={{ position:'relative', flex:'0 1 200px', minWidth:140 }}>
                  <select style={{ ...fieldStyle, height:34, appearance:'none', paddingRight:28 }}
                    value={logUser} onChange={e => setLogUser(e.target.value)}>
                    <option value="">All users</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }}/>
                </div>
                <button onClick={loadLogs} style={{ ...btnSecondary, display:'flex', alignItems:'center', gap:6, padding:'6px 14px', fontSize:12 }}>
                  <RefreshCw size={13}/> Refresh
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--text3)', fontSize:13 }}>
            Loading…
          </div>
        ) : tab === 'users' ? (
          <UsersTable
            users={filteredUsers}
            onEdit={u => setModal({ edit:u })}
            onDelete={u => setModal({ del:u })}
          />
        ) : (
          <ActivityTable logs={logs} />
        )}
      </div>

      {/* Modals */}
      {modal === 'create' && (
        <CreateUserModal onClose={() => setModal(null)} onCreated={handleCreated} />
      )}
      {modal?.edit && (
        <EditUserModal user={modal.edit} onClose={() => setModal(null)} onUpdated={handleUpdated} />
      )}
      {modal?.del && (
        <ConfirmDeleteModal user={modal.del} onClose={() => setModal(null)} onDeleted={handleDeleted} />
      )}
    </div>
  );
}

// ── Users Table ───────────────────────────────────────────────────────────────

function UsersTable({ users, onEdit, onDelete }) {
  if (!users.length) {
    return (
      <div style={{ padding:40, textAlign:'center', color:'var(--text3)', fontSize:13 }}>
        No users found.
      </div>
    );
  }

  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
        <thead>
          <tr style={{ background:'var(--surface2)', borderBottom:'1.5px solid var(--border)' }}>
            {['#', 'Name / Email', 'Role', 'Status', 'Last Login', 'Created', 'Actions'].map(h => (
              <th key={h} style={{
                padding:'10px 14px', textAlign:'left',
                fontSize:11, fontWeight:700, color:'var(--text3)',
                letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} style={{
              borderBottom:'1px solid var(--border)',
              background: i % 2 === 0 ? 'var(--surface)' : 'rgba(244,246,249,0.5)',
              transition:'background 0.12s',
            }}>
              <td style={{ padding:'11px 14px', color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:12 }}>
                {u.id}
              </td>
              <td style={{ padding:'11px 14px' }}>
                <div style={{ fontWeight:600, color:'var(--text)' }}>{u.name}</div>
                <div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{u.email}</div>
              </td>
              <td style={{ padding:'11px 14px' }}><RolePill role={u.role} /></td>
              <td style={{ padding:'11px 14px' }}><StatusPill active={u.is_active} /></td>
              <td style={{ padding:'11px 14px', color:'var(--text2)', fontSize:12 }}>
                {u.last_login ? fmt(u.last_login) : <span style={{ color:'var(--text3)' }}>Never</span>}
              </td>
              <td style={{ padding:'11px 14px', color:'var(--text2)', fontSize:12, whiteSpace:'nowrap' }}>
                {fmt(u.created_at)}
              </td>
              <td style={{ padding:'11px 14px' }}>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => onEdit(u)} title="Edit" style={{
                    width:30, height:30, borderRadius:7, display:'flex',
                    alignItems:'center', justifyContent:'center',
                    background:'var(--accent-bg)', color:'var(--accent)', cursor:'pointer',
                  }}><Edit2 size={13}/></button>
                  <button onClick={() => onDelete(u)} title="Delete" style={{
                    width:30, height:30, borderRadius:7, display:'flex',
                    alignItems:'center', justifyContent:'center',
                    background:'var(--red-bg)', color:'var(--red)', cursor:'pointer',
                  }}><Trash2 size={13}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Activity Table ────────────────────────────────────────────────────────────

function ActivityTable({ logs }) {
  if (!logs.length) {
    return (
      <div style={{ padding:40, textAlign:'center', color:'var(--text3)', fontSize:13 }}>
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
        <thead>
          <tr style={{ background:'var(--surface2)', borderBottom:'1.5px solid var(--border)' }}>
            {['Action', 'User', 'IP Address', 'Browser / Client', 'Timestamp'].map(h => (
              <th key={h} style={{
                padding:'10px 14px', textAlign:'left',
                fontSize:11, fontWeight:700, color:'var(--text3)',
                letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={log.id} style={{
              borderBottom:'1px solid var(--border)',
              background: i % 2 === 0 ? 'var(--surface)' : 'rgba(244,246,249,0.5)',
            }}>
              <td style={{ padding:'10px 14px' }}>
                <span style={{
                  display:'inline-flex', alignItems:'center', gap:5,
                  padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600,
                  background: log.action === 'login' ? 'rgba(22,163,74,0.09)' : 'rgba(220,38,38,0.09)',
                  color: log.action === 'login' ? '#16a34a' : '#dc2626',
                }}>
                  {log.action === 'login' ? <LogIn size={11}/> : <LogOut size={11}/>}
                  {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                </span>
              </td>
              <td style={{ padding:'10px 14px' }}>
                <div style={{ fontWeight:600, color:'var(--text)' }}>{log.user_name ?? `User #${log.user_id}`}</div>
                {log.user_email && <div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{log.user_email}</div>}
              </td>
              <td style={{ padding:'10px 14px', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text2)' }}>
                {log.ip_address ?? <span style={{ color:'var(--text3)' }}>—</span>}
              </td>
              <td style={{ padding:'10px 14px', color:'var(--text2)', maxWidth:260 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:5 }}>
                  <Monitor size={12} style={{ flexShrink:0, marginTop:2, color:'var(--text3)' }}/>
                  <span style={{ fontSize:11, lineHeight:1.4,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:220 }}>
                    {log.user_agent ?? '—'}
                  </span>
                </div>
              </td>
              <td style={{ padding:'10px 14px', whiteSpace:'nowrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, color:'var(--text2)', fontSize:12 }}>
                  <Clock size={11} style={{ color:'var(--text3)' }}/>
                  {fmt(log.created_at)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
