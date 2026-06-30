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

  // ── Auth profile / details updates ──
  async updateProfile(data) {
    return apiFetch('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async changePassword(current_password, new_password) {
    return apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password, new_password }),
    });
  },
  async forgotPassword(email) {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  async resetPassword(token, new_password) {
    return apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password }),
    });
  },
  async requestDeptChange(requested_department, reason = '') {
    return apiFetch('/auth/request-dept-change', {
      method: 'POST',
      body: JSON.stringify({ requested_department, reason }),
    });
  },

  // ── Students ──
  async searchStudents(q) {
    return apiFetch(`/students/search?q=${encodeURIComponent(q)}`);
  },
  async getStudentProfile(regNumber) {
    return apiFetch(`/students/${encodeURIComponent(regNumber)}/profile`);
  },
  async getStudents(params = {}) {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/students${q ? '?' + q : ''}`);
  },
  async createStudent(data) {
    return apiFetch('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateStudent(id, data) {
    return apiFetch(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async deleteStudent(id) {
    return apiFetch(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  // ── User / Admin Management ──
  async listUsers() {
    return apiFetch('/users');
  },
  async createUser(data) {
    return apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateUser(id, data) {
    return apiFetch(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async deleteUser(id) {
    return apiFetch(`/users/${id}`, {
      method: 'DELETE',
    });
  },
  async getActivityLog(params = {}) {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/users/activity-log${q ? '?' + q : ''}`);
  },
  async getDeptChangeRequests() {
    return apiFetch('/users/dept-change-requests');
  },
  async approveDeptChange(logId) {
    return apiFetch(`/users/dept-change-requests/${logId}/approve`, {
      method: 'POST',
    });
  },
  async rejectDeptChange(logId) {
    return apiFetch(`/users/dept-change-requests/${logId}/reject`, {
      method: 'POST',
    });
  },
  async uploadHistory() {
    return apiFetch('/users/upload-history');
  },

  // ── Staff Assignments ──
  async getStaffAssignments() {
    return apiFetch('/staff-assignments');
  },
  async createAssignment(data) {
    return apiFetch('/staff-assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async deleteAssignment(assignmentId) {
    return apiFetch(`/staff-assignments/${assignmentId}`, {
      method: 'DELETE',
    });
  },
};
