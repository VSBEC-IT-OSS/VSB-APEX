import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Users, UserPlus, Key, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../data/dataService';

export default function HodPanel() {
  const { user } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Creation Form state
  const [targetUserId, setTargetUserId] = useState('');
  const [batch, setBatch] = useState('');
  const [section, setSection] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadAssignments = useCallback(async () => {
    try {
      const data = await dataService.getStaffAssignments();
      setAssignments(data);
    } catch (e) {}
  }, []);

  const loadStaffMembers = useCallback(async () => {
    try {
      const u = await dataService.listUsers();
      // Only show staff users that belong to HOD's department, or have same designation
      const deptStaff = u.filter(x => x.role === 'staff' && x.department === user.department);
      setUsers(deptStaff);
    } catch (e) {}
  }, [user]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await loadAssignments();
    await loadStaffMembers();
    setLoading(false);
  }, [loadAssignments, loadStaffMembers]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  async function handleAssignSubmit(e) {
    e.preventDefault();
    if (!targetUserId || !batch) return;
    setSubmitting(true);
    setMsg({ text: '', type: '' });
    try {
      await dataService.createAssignment({
        user_id: parseInt(targetUserId),
        department: user.department,
        batch,
        section: section || null
      });
      setMsg({ text: 'Assignment created successfully!', type: 'success' });
      setTargetUserId('');
      setBatch('');
      setSection('');
      loadAssignments();
    } catch (err) {
      setMsg({ text: err.message || 'Failed to create assignment.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAssignment(id) {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await dataService.deleteAssignment(id);
      loadAssignments();
    } catch (err) {
      alert(err.message);
    }
  }

  const inputStyle = {
    width: '105%', padding: '9px 12px', borderRadius: 8,
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
        title="HOD Management Panel"
        subtitle={`Staff Section Allocating Hub for Department of ${user?.department || 'Unspecified'}`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginTop: 24 }}>
        
        {/* Create Assignment Form */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <UserPlus size={18} color="var(--accent)" />
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Assign Sector to Staff</h3>
          </div>

          {msg.text && (
            <div style={{
              padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14,
              background: msg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: msg.type === 'success' ? '#22c55e' : '#ef4444',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              {msg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              {msg.text}
            </div>
          )}

          <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Staff Member</label>
              <select style={inputStyle} value={targetUserId} onChange={e => setTargetUserId(e.target.value)} required>
                <option value="">Select Staff...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Batch Year</label>
              <input
                type="text"
                placeholder="e.g. 2023-2027"
                style={inputStyle}
                value={batch}
                onChange={e => setBatch(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Specific Section (optional)</label>
              <input
                type="text"
                placeholder="e.g. A (leave blank for all)"
                style={inputStyle}
                value={section}
                onChange={e => setSection(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                alignSelf: 'flex-start', padding: '9px 16px', borderRadius: 8,
                background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', marginTop: 6
              }}
            >
              {submitting ? 'Allocating...' : 'Assign Class'}
            </button>
          </form>
        </Card>

        {/* Existing Assignments list */}
        <Card style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} color="var(--accent)" />
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Departmental Active Assignments</h3>
            </div>
            <button onClick={refreshData} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4
            }}>
              <RefreshCw size={13} /> Reload
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)' }}>Loading allocations...</div>
          ) : assignments.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No staff assignments configured, all sector uploads defaults to all staff.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: 10, textAlign: 'left' }}>Staff Member ID</th>
                    <th style={{ padding: 10, textAlign: 'left' }}>Batch Year</th>
                    <th style={{ padding: 10, textAlign: 'left' }}>Section</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Remove Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 10, fontWeight: 600 }}>User #{a.user_id}</td>
                      <td style={{ padding: 10 }}>{a.batch}</td>
                      <td style={{ padding: 10 }}>{a.section || 'All Sections'}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>
                        <button onClick={() => handleDeleteAssignment(a.id)} style={{
                          background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444'
                        }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
