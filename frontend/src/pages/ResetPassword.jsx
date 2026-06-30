import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { dataService } from '../data/dataService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid URL: Verification token is missing.');
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await dataService.resetPassword(token, password);
      setMessage(res.detail ?? 'Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Verification token expired or invalid.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', padding: 20
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16, width: 400, maxWidth: '100%', padding: 32,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }} className="fade-up">

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            Reset Password
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
            Enter your new secure password.
          </p>
        </div>

        {message && (
          <div style={{
            padding: 12, borderRadius: 8, background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: 13, marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <CheckCircle size={16} /> {message} Redirecting to login...
          </div>
        )}

        {error && (
          <div style={{
            padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13, marginBottom: 20
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                required
                type={showPwd ? 'text' : 'password'}
                minLength={8}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '10px 38px 10px 38px', borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0,0,0,0.2)',
                  color: '#fff', fontSize: 14, outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer'
                }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                required
                type={showPwd ? 'text' : 'password'}
                minLength={8}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px 10px 38px', borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0,0,0,0.2)',
                  color: '#fff', fontSize: 14, outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              width: '100%', padding: '11px', borderRadius: 8, background: '#3b82f6',
              color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              transition: 'background 0.2s', marginTop: 8
            }}
          >
            {loading ? 'Changing password...' : 'Save New Password'}
          </button>
        </form>

      </div>
    </div>
  );
}
