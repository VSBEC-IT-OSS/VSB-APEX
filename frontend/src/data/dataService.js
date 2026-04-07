/**
 * VSB-APEX Data Service
 *
 * This service handles all backend API interactions using authentication headers.
 */

const API_BASE = import.meta.env.VITE_API_BASE || (() => {
  throw new Error('VITE_API_BASE not configured. Check .env');
})();

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

  if (res.status === 401) {
    clearAuthToken();
    if (path === '/auth/login') {
      throw new Error('Invalid email or password.');
    }
    throw new Error('Session expired. Please log in again.');
  }

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
    return apiFetch('/attendance/overview');
  },
  async getAttendanceBySections() {
    return apiFetch('/attendance/section');
  },
  async getAvailableAttendanceDates() {
    return apiFetch('/attendance/available-dates');
  },

  // Results
  async getResultsOverview() {
    return apiFetch('/results/overview');
  },
  async getSubjectResults() {
    return apiFetch('/results/subject-analysis');
  },
  async getResultsBySection() {
    return apiFetch('/results/section');
  },

  // Internal Tests
  async getInternalOverview() {
    return apiFetch('/internal/overview');
  },
  async getInternalBySections() {
    return apiFetch('/internal/section');
  },
  async getInternalBySubject() {
    return apiFetch('/internal/subject');
  },

  // Goals
  async getGoals() {
    return apiFetch('/goals');
  },
  async updateGoal(id, updates) {
    return apiFetch(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  },

  // Insights
  async getInsights() {
    return apiFetch('/insights');
  },

  // Placement
  async getPlacementStats() {
    return apiFetch('/placement/stats');
  },

  async getPlacementRows() {
    return apiFetch('/placement/rows');
  },

  // Upload
  async uploadFile(type, file) {
    const fd = new FormData();
    fd.append('file', file);
    return apiUpload(`/upload/${type}`, fd);
  },

  // PPT Export
  async generatePPT() {
    return apiFetch('/generate-ppt');
  },
};
