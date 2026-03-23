import { useState } from 'react';
import { dataService } from '../data/dataService.js';
import { LogIn, Eye, EyeOff, GraduationCap } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await dataService.login(email, password);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: 400 }}>
        {/* College header */}
        <div style={{
          background: 'var(--accent)', borderRadius: '12px 12px 0 0',
          padding: '28px 36px 24px', textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <GraduationCap size={26} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
            VSB-APEX
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
            Department of Information Technology
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
            VSB Engineering College
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderTop: 'none', borderRadius: '0 0 12px 12px',
          padding: '28px 36px 32px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            Sign in to continue
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 22 }}>
            Use your department credentials
          </p>

          {error && (
            <div style={{
              background: 'var(--red-bg)', border: '1px solid #fca5a5',
              borderRadius: 7, padding: '9px 14px',
              fontSize: 13, color: 'var(--red)', marginBottom: 16,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="yourname@vsb.edu" required
                style={{
                  width: '100%', padding: '10px 13px', borderRadius: 8,
                  border: '1px solid var(--border)', fontSize: 13,
                  background: 'var(--surface2)', color: 'var(--text)',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '10px 40px 10px 13px', borderRadius: 8,
                    border: '1px solid var(--border)', fontSize: 13,
                    background: 'var(--surface2)', color: 'var(--text)',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="button" onClick={() => setShow(!show)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text3)', display: 'flex', alignItems: 'center',
                }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px', borderRadius: 8,
              background: loading ? 'var(--border2)' : 'var(--accent)',
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.15s',
            }}>
              {loading ? 'Signing in…' : <><LogIn size={15} /> Sign In</>}
            </button>
          </form>

          <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginTop: 18 }}>
            Demo: <code style={{ background:'var(--surface2)', padding:'1px 6px', borderRadius:4 }}>hod@vsb.edu</code> / <code style={{ background:'var(--surface2)', padding:'1px 6px', borderRadius:4 }}>vsb2024</code>
          </p>
        </div>
      </div>
    </div>
  );
}
