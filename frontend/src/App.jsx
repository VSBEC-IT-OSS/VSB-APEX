// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar       from './components/layout/Sidebar.jsx';
import Header        from './components/layout/Header.jsx';
import Login         from './pages/Login.jsx';
import Overview      from './pages/Overview.jsx';
import Attendance    from './pages/Attendance.jsx';
import Results       from './pages/Results.jsx';
import InternalTests from './pages/InternalTests.jsx';
import Insights      from './pages/Insights.jsx';
import Goals         from './pages/Goals.jsx';
import Placement     from './pages/Placement.jsx';
import UserSettings  from './pages/UserSettings.jsx';
import { isLoggedIn, clearAuthToken } from './data/dataService.js';

export default function App() {
  const [apiError, setApiError] = useState('');
  const [user,    setUser]    = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if API_BASE is set
    const api = import.meta.env.VITE_API_BASE;
    if (!api) {
      setApiError('❌ VITE_API_BASE not configured. Check frontend/.env');
    }
  }, []);

  if (apiError) {
    return (
      <div style={{ padding: 20, color: 'red', fontFamily: 'monospace' }}>
        <h2>Configuration Error</h2>
        <p>{apiError}</p>
      </div>
    );
  }

  // Restore session from localStorage on first load
  useEffect(() => {
    if (isLoggedIn()) {
      // In production this would decode the JWT; mock session for now
      const stored = localStorage.getItem('vsb_user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { setUser({ name:'Dr. S. Ramesh', role:'hod' }); }
      } else {
        setUser({ name: 'Mr. K. Manivannan', role: 'hod' });
      }
    }
    setChecked(true);
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem('vsb_user', JSON.stringify(userData));
  }

  function handleLogout() {
    clearAuthToken();
    localStorage.removeItem('vsb_user');
    setUser(null);
  }

  if (!checked) return null; // avoid flash

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <div style={{ display:'flex', minHeight:'100vh' }}>
        {/* Pass user so Sidebar can gate admin links */}
        <Sidebar user={user} />

        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto' }}>
          <Header user={user} onLogout={handleLogout} />
          <main style={{ flex:1, background:'var(--bg)', overflowY:'auto' }}>
            <Routes>
              <Route path="/"          element={<Overview />}      />
              <Route path="/attendance"element={<Attendance />}    />
              <Route path="/results"   element={<Results />}       />
              <Route path="/internal"  element={<InternalTests />} />
              <Route path="/insights"  element={<Insights />}      />
              <Route path="/goals"     element={<Goals />}         />
              <Route path="/placement" element={<Placement />}     />

              {/* Admin-only route — redirect non-admins to home */}
              <Route
                path="/settings"
                element={
                  user.role === 'admin'
                    ? <UserSettings />
                    : <Navigate to="/" replace />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
