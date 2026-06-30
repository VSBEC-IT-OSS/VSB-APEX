import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Shield, Activity, RefreshCw, Key, UserCheck, 
  Trash2, Edit, ChevronDown, CheckCircle, XCircle, Ban, BookOpen, AlertCircle
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { dataService } from '../data/dataService';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [showModal, setShowModal] = useState(null); // 'create' | 'edit' | 'delete'
  const [modalUser, setModalUser] = useState(null);
  
  // Create / Edit Form states
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', department: '', username: '' });

  const loadUsers = useCallback(async () => {
    try {
      const u = await dataService.listUsers();
      setUsers(u);
    } catch (e) {}
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      const r = await dataService.getDeptChangeRequests();
      setRequests(r);
    } catch (e) {}
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      const l = await dataService.getActivityLog();
      setLogs(l);
    } catch (e) {}
  }, []);

  const loadAssignments = useCallback(async () => {
    try {
      const a = await dataService.getStaffAssignments();
      setAssignments(a);
    } catch (e) {}
  }, []);

  const refreshTab = useCallback(async (tabName) => {
    setLoading(true);
    if (tabName === 'users') await loadUsers();
    if (tabName === 'requests') await loadRequests();
    if (tabName === 'activity') await loadLogs();
    if (tabName === 'assignments') await loadAssignments();
    setLoading(false);
  }, [loadUsers, loadRequests, loadLogs, loadAssignments]);

  useEffect(() => {
    refreshTab(activeTab);
  }, [activeTab, refreshTab]);

  const handleTabChange = (t) => {
    setActiveTab(t);
  };

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', role: 'staff', department: '', username: '' });
    setModalUser(null);
    setShowModal('create');
  };

  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role, department: u.department || '', username: u.username || '' });
    setModalUser(u);
    setShowModal('edit');
  };

  const openDelete = (u) => {
    setModalUser(u);
    setShowModal('delete');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await dataService.createUser(form);
      setShowModal(null);
      refreshTab('users');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await dataService.updateUser(modalUser.id, form);
      setShowModal(null);
      refreshTab('users');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await dataService.deleteUser(modalUser.id);
      setShowModal(null);
      refreshTab('users');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApprove = async (logId) => {
    if (!window.confirm("Approve this department switch?")) return;
    try {
      await dataService.approveDeptChange(logId);
      refreshTab('requests');
      refreshTab('users');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (logId) => {
    if (!window.confirm("Reject this department switch request?")) return;
    try {
      await dataService.rejectDeptChange(logId);
      refreshTab('requests');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAssignment = async (assignId) => {
    if (!window.confirm("Remove this section assignment?")) return;
    try {
      await dataService.deleteAssignment(assignId);
      refreshTab('assignments');
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.username && u.username.toLowerCase().includes(search.toLowerCase()))
  );

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--surface2)',
    color: 'var(--text)', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: 'var(--text2)', marginBottom: 6
  };

  return (
    <div style={{ padding: 28, maxWidth: 1200, margin: '0 auto' }} className="fade-up">
      <PageHeader
        icon={<Shield size={20} color="#fff" />}
        title="Admin Control Center"
        subtitle="Manage users, verify department transitions, and inspect system-wide audit logs"
      />

      <div style={{
        display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', 
        marginBottom: 20, paddingBottom: 10, flexWrap: 'wrap', marginTop: 24
      }}>
        {[
          { id: 'users', label: 'User Registry', icon: Users },
          { id: 'requests', label: 'Department Swapping Requests', icon: RefreshCw },
          { id: 'assignments', label: 'Staff Assignments', icon: Shield },
          { id: 'activity', label: 'Audit Trail / Logs', icon: Activity },
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#fff' : 'var(--text2)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>Loading content...</div>
      ) : (
        <>
          {activeTab === 'users' && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search user by name, username or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ ...inputStyle, width: '300px' }}
                />
                <button
                  onClick={openCreate}
                  style={{
                    padding: '9px 16px', borderRadius: 8, background: 'var(--accent)',
                    color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer'
                  }}
                >
                  Create User
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: 12, textAlign: 'left' }}>User Details</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Role</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Department</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Last Logged In</th>
                      <th style={{ padding: 12, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 12 }}>
                          <div style={{ fontWeight: 700 }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>@{u.username || 'no-username'} · {u.email}</div>
                        </td>
                        <td style={{ padding: 12, textTransform: 'capitalize', fontWeight: 600 }}>{u.role}</td>
                        <td style={{ padding: 12 }}>{u.department || '—'}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                            background: u.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: u.is_active ? '#22c55e' : '#ef4444'
                          }}>
                            {u.is_active ? 'Active' : 'Banned'}
                          </span>
                        </td>
                        <td style={{ padding: 12, color: 'var(--text3)', fontSize: 12 }}>
                          {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                        </td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button onClick={() => openEdit(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)' }}>
                              <Edit size={14} />
                            </button>
                            <button onClick={() => openDelete(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'requests' && (
            <Card>
              {requests.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)' }}>No pending department swapping requests present.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: 12, textAlign: 'left' }}>Staff Member</th>
                        <th style={{ padding: 12, textAlign: 'left' }}>Current Department</th>
                        <th style={{ padding: 12, textAlign: 'left' }}>Requested Department</th>
                        <th style={{ padding: 12, textAlign: 'left' }}>Timestamp</th>
                        <th style={{ padding: 12, textAlign: 'center' }}>Verify Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(r => (
                        <tr key={r.log_id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: 12 }}>
                            <div style={{ fontWeight: 700 }}>{r.user_name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{r.user_email}</div>
                          </td>
                          <td style={{ padding: 12 }}>{r.current_dept || 'Unassigned'}</td>
                          <td style={{ padding: 12, fontWeight: 700, color: 'var(--accent)' }}>{r.requested_dept}</td>
                          <td style={{ padding: 12, color: 'var(--text3)', fontSize: 12 }}>
                            {new Date(r.requested_at).toLocaleString()}
                          </td>
                          <td style={{ padding: 12, textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                              <button onClick={() => handleApprove(r.log_id)} style={{
                                padding: '6px 12px', borderRadius: 6, background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer',
                                fontSize: 11.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4
                              }}>
                                <CheckCircle size={12} /> Approve
                              </button>
                              <button onClick={() => handleReject(r.log_id)} style={{
                                padding: '6px 12px', borderRadius: 6, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer',
                                fontSize: 11.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4
                              }}>
                                <XCircle size={12} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'assignments' && (
            <Card>
              {assignments.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)' }}>No staff class assignments found.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: 12, textAlign: 'left' }}>Staff User ID</th>
                        <th style={{ padding: 12, textAlign: 'left' }}>Department</th>
                        <th style={{ padding: 12, textAlign: 'left' }}>Batch Year</th>
                        <th style={{ padding: 12, textAlign: 'left' }}>Section</th>
                        <th style={{ padding: 12, textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map(a => (
                        <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: 12, fontWeight: 600 }}>User #{a.user_id}</td>
                          <td style={{ padding: 12 }}>{a.department}</td>
                          <td style={{ padding: 12 }}>{a.batch}</td>
                          <td style={{ padding: 12 }}>{a.section || 'All Sections'}</td>
                          <td style={{ padding: 12, textAlign: 'center' }}>
                            <button onClick={() => handleDeleteAssignment(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'activity' && (
            <Card>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: 12, textAlign: 'left' }}>Staff Target</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Performed Action</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>IP Address</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Agent Info</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Logged At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 12 }}>
                          <div style={{ fontWeight: 700 }}>{l.user_name || `ID: ${l.user_id}`}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{l.user_email || '—'}</div>
                        </td>
                        <td style={{ padding: 12 }}>
                          <code style={{ background: 'var(--surface2)', padding: '3px 6px', borderRadius: 4, fontSize: 11.5 }}>
                            {l.action}
                          </code>
                        </td>
                        <td style={{ padding: 12 }}>{l.ip_address || '—'}</td>
                        <td style={{ padding: 12, fontSize: 11, color: 'var(--text2)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {l.user_agent || '—'}
                        </td>
                        <td style={{ padding: 12, color: 'var(--text3)', fontSize: 12 }}>
                          {new Date(l.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      {(showModal === 'create' || showModal === 'edit') && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 24, width: 450, maxWidth: '100%' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, marginTop: 0 }}>
              {showModal === 'create' ? 'Create New User' : `Edit User Details`}
            </h3>
            
            <form onSubmit={showModal === 'create' ? handleCreateSubmit : handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div>
                <label style={labelStyle}>Username</label>
                <input type="text" style={inputStyle} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username (optional)" />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>

              {showModal === 'create' && (
                <div>
                  <label style={labelStyle}>Default Password</label>
                  <input type="password" style={inputStyle} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
              )}

              {showModal === 'edit' && (
                <div>
                  <label style={labelStyle}>Force Reset Password <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(leave blank to keep)</span></label>
                  <input type="password" style={inputStyle} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="New password" />
                </div>
              )}

              <div>
                <label style={labelStyle}>System Role</label>
                <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="staff">Staff (Upload/Rollback only)</option>
                  <option value="hod">HOD (Department Supervisor)</option>
                  <option value="admin">Super Admin (All permissions)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Department Designation</label>
                <select style={inputStyle} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                  <option value="">None / System</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="CSE">Computer Science & Engineering (CSE)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="EEE">Electrical & Electronics (EEE)</option>
                  <option value="MECH">Mechanical Engineering (MECH)</option>
                  <option value="CIVIL">Civil Engineering (CIVIL)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" onClick={() => setShowModal(null)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal === 'delete' && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 24, width: 400, maxWidth: '100%' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6, marginTop: 0 }}>
              <AlertCircle size={18} /> Delete User?
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
              Are you sure you want to delete staff member <strong>{modalUser?.name}</strong>? All their actions and logs will be permanently scrubbed.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
              <button onClick={() => setShowModal(null)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleDeleteSubmit} style={{ padding: '8px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
