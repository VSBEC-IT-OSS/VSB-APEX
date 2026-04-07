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
import Placement     from './pages/Placement.jsx';
import UserSettings  from './pages/UserSettings.jsx';
import { isLoggedIn, clearAuthToken } from './data/dataService.js';

export default function App() {
  const [apiError,     setApiError]     = useState('');
  const [user,         setUser]         = useState(null);
  const [checked,      setChecked]      = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(() => {
    // Persist sidebar state across refreshes
    const saved = localStorage.getItem('vsb_sidebar');
    if (saved !== null) return saved === 'true';
    return window.innerWidth > 1024; // Default to open on PC (large screens), collapsed on Tablet/Mobile
  });

  useEffect(() => {
    const api = import.meta.env.VITE_API_BASE;
    if (!api) setApiError('❌ VITE_API_BASE not configured. Check frontend/.env');
  }, []);

  useEffect(() => {
    localStorage.setItem('vsb_sidebar', sidebarOpen);
  }, [sidebarOpen]);

  if (apiError) {
    return (
      <div style={{ padding: 20, color: 'red', fontFamily: 'monospace' }}>
        <h2>Configuration Error</h2>
        <p>{apiError}</p>
      </div>
    );
  }

  useEffect(() => {
    if (isLoggedIn()) {
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

  if (!checked) return null;
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <div style={{ display:'flex', minHeight:'100vh' }}>
        <Sidebar user={user} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto', minWidth:0 }}>
          <Header user={user} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(v => !v)} />
          <main style={{ flex:1, background:'var(--bg)', overflowY:'auto' }}>
            <Routes>
              <Route path="/"          element={<Overview />}      />
              <Route path="/attendance"element={<Attendance />}    />
              <Route path="/results"   element={<Results />}       />
              <Route path="/internal"  element={<InternalTests />} />
              <Route path="/placement" element={<Placement />}     />
              <Route
                path="/settings"
                element={user.role === 'admin' ? <UserSettings /> : <Navigate to="/" replace />}
              />
              {/* Redirect removed pages to home */}
              <Route path="/insights"  element={<Navigate to="/" replace />} />
              <Route path="/goals"     element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
