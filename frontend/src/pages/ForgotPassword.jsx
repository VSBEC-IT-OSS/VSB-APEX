import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { dataService } from '../data/dataService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await dataService.forgotPassword(email);
      setMessage(res.detail ?? 'A passord reset link has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
            Forgot Password
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
            Enter your email to receive a recovery link.
          </p>
        </div>

        {message && (
          <div style={{
            padding: 12, borderRadius: 8, background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: 13, marginBottom: 20
          }}>
            {message}
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
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                required
                type="email"
                placeholder="you@vsbec.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
            disabled={loading}
            style={{
              width: '100%', padding: '11px', borderRadius: 8, background: '#3b82f6',
              color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.2s', marginTop: 8
            }}
          >
            {loading ? 'Sending...' : (
              <>
                Send Reset Link <Send size={14} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a
            href="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13,
              color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500
            }}
          >
            <ArrowLeft size={14} /> Back to Login
          </a>
        </div>

      </div>
    </div>
  );
}
