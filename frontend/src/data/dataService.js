/**
 * VSB-APEX Data Service
 *
 * HOW TO CONNECT TO BACKEND:
 *   1. Set USE_MOCK = false
 *   2. Set API_BASE to your backend URL
 *   3. Call setAuthToken(token) after login — all requests will include it
 */

import * as mock from './mockData.js';

const USE_MOCK  = false;
const API_BASE  = 'http://localhost:8000/api';
const delay     = (ms = 250) => new Promise(r => setTimeout(r, ms));

// ── Auth token store ───────────────────────────────────────────
let _token = localStorage.getItem('vsb_token') ?? null;
export const setAuthToken  = (t) => { _token = t; localStorage.setItem('vsb_token', t); };
export const clearAuthToken = () => { _token = null; localStorage.removeItem('vsb_token'); };
export const getAuthToken   = () => _token;
export const isLoggedIn     = () => !!_token;

// ── Data overrides (Excel upload) ─────────────────────────────
let _overrides = {};
export const setDataOverride = (key, data) => { _overrides[key] = data; };
export const clearOverrides  = () => { _overrides = {}; };

// ── Fetch helper ──────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (res.status === 401) { clearAuthToken(); throw new Error('Session expired. Please log in again.'); }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function apiUpload(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: _token ? { Authorization: `Bearer ${_token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload error ${res.status}`);
  return res.json();
}

// ── Data Service ──────────────────────────────────────────────
export const dataService = {
  // Auth
  async login(email, password) {
    if (USE_MOCK) {
      await delay();
      if (email === 'hod@vsb.edu' && password === 'vsb2024') {
        const token = 'mock-jwt-token-hod';
        setAuthToken(token);
        return { access_token: token, user: { name: 'Dr. S. Ramesh', role: 'hod', email } };
      }
      throw new Error('Invalid credentials. Use hod@vsb.edu / vsb2024');
    }
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.access_token);
    return data;
  },

  logout() { clearAuthToken(); },

  // Attendance
  async getAttendanceOverview() {
    if (USE_MOCK) { await delay(); return _overrides.attendanceOverview ?? mock.attendanceOverview; }
    return apiFetch('/attendance/overview');
  },
  async getAttendanceBySections() {
    if (USE_MOCK) { await delay(); return _overrides.attendanceBySections ?? mock.attendanceBySections; }
    return apiFetch('/attendance/section');
  },

  // Results
  async getResultsOverview() {
    if (USE_MOCK) { await delay(); return _overrides.resultsOverview ?? mock.resultsOverview; }
    return apiFetch('/results/overview');
  },
  async getSubjectResults() {
    if (USE_MOCK) { await delay(); return _overrides.subjectWiseResults ?? mock.subjectWiseResults; }
    return apiFetch('/results/subject-analysis');
  },
  async getResultsBySection() {
    if (USE_MOCK) { await delay(); return _overrides.resultsBySection ?? mock.resultsBySection; }
    return apiFetch('/results/section');
  },

  // Internal Tests
  async getInternalOverview() {
    if (USE_MOCK) { await delay(); return _overrides.internalOverview ?? mock.internalOverview; }
    return apiFetch('/internal/overview');
  },
  async getInternalBySections() {
    if (USE_MOCK) { await delay(); return _overrides.internalBySections ?? mock.internalBySections; }
    return apiFetch('/internal/section');
  },
  async getInternalBySubject() {
    if (USE_MOCK) { await delay(); return _overrides.internalBySubject ?? mock.internalBySubject; }
    return apiFetch('/internal/subject');
  },

  // Goals
  async getGoals() {
    if (USE_MOCK) { await delay(); return _overrides.goals ?? mock.goals; }
    return apiFetch('/goals');
  },
  async updateGoal(id, updates) {
    if (USE_MOCK) { await delay(); return { success: true }; }
    return apiFetch(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  },

  // Insights
  async getInsights() {
    if (USE_MOCK) { await delay(); return _overrides.insights ?? mock.insights; }
    return apiFetch('/insights');
  },

  // Placement
  async getPlacementStats() {
    if (USE_MOCK) { await delay(); return _overrides.placementStats ?? mock.placementStats; }
    return apiFetch('/placement/stats');
  },

  // Upload
  async uploadFile(type, file) {
    if (USE_MOCK) {
      await delay(600);
      return { success: true, rows_inserted: 42, rows_skipped: 0, batch_id: 'mock-batch', message: 'Mock upload successful.' };
    }
    const fd = new FormData();
    fd.append('file', file);
    return apiUpload(`/upload/${type}`, fd);
  },

  // PPT Export
  async generatePPT() {
    if (USE_MOCK) { await delay(1000); return { url: null, mock: true }; }
    return apiFetch('/generate-ppt');
  },
};
