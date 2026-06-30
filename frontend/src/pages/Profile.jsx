import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Building, Key, History, ClipboardList, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../data/dataService';

export default function Profile() {
  const { user, setUser } = useAuth();
  
  // Profile settings state
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  // Requested department state
  const [requestedDept, setRequestedDept] = useState('');
  const [reason, setReason] = useState('');
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptMsg, setDeptMsg] = useState({ text: '', type: '' });

  // Logs and Assignments
  const [uploads, setUploads] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (user?.role === 'staff') {
      dataService.uploadHistory().then(setUploads).catch(() => {});
      dataService.getStaffAssignments().then(setAssignments).catch(() => {});
    }
  }, [user]);

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const updated = await dataService.updateProfile({ name, username, email });
      setUser(updated);
      localStorage.setItem('vsb_user', JSON.stringify(updated));
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    setPwdLoading(true);
    setPwdMsg({ text: '', type: '' });
    try {
      await dataService.changePassword(currentPassword, newPassword);
      setPwdMsg({ text: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdMsg({ text: err.message || 'Failed to change password.', type: 'error' });
    } finally {
      setPwdLoading(false);
    }
  }

  async function handleDeptRequest(e) {
    e.preventDefault();
    if (!requestedDept) return;
    setDeptLoading(true);
    setDeptMsg({ text: '', type: '' });
    try {
      await dataService.requestDeptChange(requestedDept, reason);
      setDeptMsg({ text: 'Request submitted successfully to Super-Admin!', type: 'success' });
      setReason('');
    } catch (err) {
      setDeptMsg({ text: err.message || 'Failed to submit request.', type: 'error' });
    } finally {
      setDeptLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--surface2)',
    color: 'var(--text)', fontSize: 13.5, outline: 'none'
  };

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: 'var(--text2)', marginBottom: 6
  };

  return (
    <div style={{ padding: 28, maxWidth: 1200, margin: '0 auto' }} className="fade-up">
      <PageHeader
        icon={<User size={20} color="#fff" />}
        title="Profile Settings"
        subtitle="Manage your account profile, credentials, and track department assignments"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginTop: 24 }}>
        
        {/* Profile details editing */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <User size={18} color="var(--accent)" />
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Account Information</h3>
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

          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" style={inputStyle} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            
            <div>
              <label style={labelStyle}>Username</label>
              <input type="text" style={inputStyle} placeholder="not set" value={username} onChange={e => setUsername(e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                alignSelf: 'flex-start', padding: '9px 16px', borderRadius: 8,
                background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', marginTop: 6
              }}
            >
              {loading ? 'Saving...' : 'Update Details'}
            </button>
          </form>
        </Card>

        {/* Change Password */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Key size={18} color="var(--accent)" />
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Change Password</h3>
          </div>

          {pwdMsg.text && (
            <div style={{
              padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14,
              background: pwdMsg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: pwdMsg.type === 'success' ? '#22c55e' : '#ef4444',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              {pwdMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input type="password" style={inputStyle} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}>New Password (min 8 chars)</label>
              <input type="password" style={inputStyle} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input type="password" style={inputStyle} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              style={{
                alignSelf: 'flex-start', padding: '9px 16px', borderRadius: 8,
                background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', marginTop: 6
              }}
            >
              {pwdLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </Card>

        {/* Department Switch / Request change link */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Building size={18} color="var(--accent)" />
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Request Department Switch</h3>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 14 }}>
            Currently assigned to: <strong style={{ color: 'var(--text)' }}>{user?.department || 'Unassigned'}</strong>
            <br />
            To request a department update, submit this form. The Super-Admin will verify and accept/reject it.
          </p>

          {deptMsg.text && (
            <div style={{
              padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14,
              background: deptMsg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: deptMsg.type === 'success' ? '#22c55e' : '#ef4444',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              {deptMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              {deptMsg.text}
            </div>
          )}

          <form onSubmit={handleDeptRequest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Target Department</label>
              <select style={inputStyle} value={requestedDept} onChange={e => setRequestedDept(e.target.value)} required>
                <option value="">Select Department...</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="EEE">Electrical & Electronics (EEE)</option>
                <option value="MECH">Mechanical Engineering (MECH)</option>
                <option value="CIVIL">Civil Engineering (CIVIL)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Reason / Comments</label>
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                placeholder="Reason for change..."
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={deptLoading}
              style={{
                alignSelf: 'flex-start', padding: '9px 16px', borderRadius: 8,
                background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', marginTop: 6
              }}
            >
              {deptLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </Card>

      </div>

      {user?.role === 'staff' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginTop: 24 }}>
          {/* Assigned Classes */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <ClipboardList size={18} color="var(--accent)" />
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Assigned Sectors</h3>
            </div>
            
            {assignments.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No specifically assigned sectors. You have general upload permissions.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {assignments.map(a => (
                  <span key={a.id} style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--border)'
                  }}>
                    {a.department} · Batch {a.batch} {a.section ? `· Sec ${a.section}` : '· All Sections'}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Upload History */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <History size={18} color="var(--accent)" />
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Recent Upload Actions</h3>
            </div>

            {uploads.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No uploads recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {uploads.map((u, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)'
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{u.action}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(u.uploaded_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

    </div>
  );
}
