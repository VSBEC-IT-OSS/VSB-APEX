// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import Login from './pages/Login.jsx';
import Overview from './pages/Overview.jsx';
import Attendance from './pages/Attendance.jsx';
import Results from './pages/Results.jsx';
import InternalTests from './pages/InternalTests.jsx';
import Placement from './pages/Placement.jsx';
import Profile from './pages/Profile.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import HodPanel from './pages/HodPanel.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function MainAppLayout() {
  const { user, logoutUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('vsb_sidebar');
    if (saved !== null) return saved === 'true';
    return window.innerWidth > 1024;
  });

  useEffect(() => {
    localStorage.setItem('vsb_sidebar', sidebarOpen);
  }, [sidebarOpen]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar user={user} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', minWidth: 0 }}>
        <Header user={user} onLogout={logoutUser} onMenuToggle={() => setSidebarOpen(v => !v)} />
        <main style={{ flex: 1, background: 'var(--bg)', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/internal" element={<ProtectedRoute><InternalTests /></ProtectedRoute>} />
            <Route path="/placement" element={<ProtectedRoute><Placement /></ProtectedRoute>} />
            
            {/* Common profile updates page */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin registry and approvals */}
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            {/* HOD assignments management */}
            <Route path="/hod" element={
              <ProtectedRoute allowedRoles={['hod']}>
                <HodPanel />
              </ProtectedRoute>
            } />

            {/* 360-degree aggregated dossier profile */}
            <Route path="/students/:regNumber/profile" element={
              <ProtectedRoute allowedRoles={['admin', 'hod']}>
                <StudentProfile />
              </ProtectedRoute>
            } />

            <Route path="/insights" element={<Navigate to="/" replace />} />
            <Route path="/goals" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const api = import.meta.env.VITE_API_BASE;
    if (!api) setApiError('❌ VITE_API_BASE not configured. Check frontend/.env');
  }, []);

  if (apiError) {
    return (
      <div style={{ padding: 20, color: 'red', fontFamily: 'monospace' }}>
        <h2>Configuration Error</h2>
        <p>{apiError}</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public login/forgot/reset pathways */}
          <Route path="/login" element={<LoginFlowWrapper />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Fallback to dashboard structure */}
          <Route path="/*" element={<MainAppLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function LoginFlowWrapper() {
  const { user, loginUser } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <Login onLogin={loginUser} />;
}
