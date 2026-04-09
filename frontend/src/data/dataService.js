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
    if (path === '/auth/login') throw new Error('Invalid email or password.');
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

  // ── Attendance ──────────────────────────────────────────────
  async getAttendanceOverview(params = {}) {
    const q = params && typeof params === 'object' ? new URLSearchParams(params).toString() : '';
    return apiFetch(`/attendance/overview${q ? '?' + q : ''}`);
  },
  async getAttendanceBySections(params = {}) {
    const q = params && typeof params === 'object' ? new URLSearchParams(params).toString() : '';
    return apiFetch(`/attendance/section${q ? '?' + q : ''}`);
  },
  async getAvailableAttendanceDates() {
    return apiFetch('/attendance/available-dates');
  },
  async getAttendanceToday() {
    return apiFetch('/attendance/today');
  },

  // ── Results ──────────────────────────────────────────────────
  async getResultsOverview() {
    return apiFetch('/results/overview');
  },
  async getSubjectResults() {
    return apiFetch('/results/subject-analysis');
  },
  async getResultsBySection() {
    return apiFetch('/results/section');
  },
  async getArrearSummary() {
    return apiFetch('/results/arrear-summary');
  },
  async getDepartmentTotals() {
    return apiFetch('/results/department-totals');
  },
  async getCGPAToppers(limit = 5) {
    return apiFetch(`/results/cgpa-toppers?limit=${limit}`);
  },

  // ── Internal Tests ───────────────────────────────────────────
  async getInternalOverview() {
    return apiFetch('/internal/overview');
  },
  async getInternalBySections() {
    return apiFetch('/internal/section');
  },
  async getInternalBySubject() {
    return apiFetch('/internal/subject');
  },
  async getInternalToppers(topN = 3) {
    return apiFetch(`/internal/toppers?top_n=${topN}`);
  },
  async getInternalYears() {
    return apiFetch('/internal/years');
  },
  async getInternalYearOverview(params = {}) {
    const q = params && typeof params === 'object' ? new URLSearchParams(params).toString() : '';
    return apiFetch(`/internal/year-overview-v2${q ? '?' + q : ''}`);
  },
  async getInternalSectionComparison(params = {}) {
    const q = params && typeof params === 'object' ? new URLSearchParams(params).toString() : '';
    return apiFetch(`/internal/section-comparison-v2${q ? '?' + q : ''}`);
  },
  async getInternalSubjectPerformance(params = {}) {
    const q = params && typeof params === 'object' ? new URLSearchParams(params).toString() : '';
    return apiFetch(`/internal/subject-performance-v2${q ? '?' + q : ''}`);
  },

  // ── Placement ────────────────────────────────────────────────
  async getPlacementStats() {
    return apiFetch('/placement/stats');
  },
  async getPlacementRows() {
    return apiFetch('/placement/rows');
  },
  async getTopPackages(limit = 3) {
    return apiFetch(`/placement/top-packages?limit=${limit}`);
  },
  async getUnplacedCount() {
    return apiFetch('/placement/unplaced-count');
  },

  // ── Upload ───────────────────────────────────────────────────
  async uploadFile(type, file) {
    const fd = new FormData();
    fd.append('file', file);
    return apiUpload(`/upload/${type}`, fd);
  },
};
