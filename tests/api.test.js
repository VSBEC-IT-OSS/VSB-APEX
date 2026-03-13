// tests/api.test.js
// Integration Engineer: ChronoTrack API Integration Tests
// Run: npm test from /tests directory
// These tests validate end-to-end data flow between modules

const request = require('supertest');
const app = require('../backend/server');

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
describe('Health Check', () => {
  test('GET /health returns 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ─── AUTH FLOW (coordinate with Auth Engineer) ───────────────────────────────
describe('Authentication', () => {
  test('POST /api/auth/login with valid credentials returns token', async () => {
    // TODO: Confirm endpoint + payload shape with Auth Engineer
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login with wrong credentials returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(res.statusCode).toBe(401);
    // Must NOT expose system info — only a safe error message
    expect(res.body.error).toBeDefined();
    expect(res.body).not.toHaveProperty('stack');
  });
});

// ─── ATTENDANCE DATA FLOW (coordinate with Backend + DB Manager) ──────────────
describe('Attendance API', () => {
  let authToken; // will be set in beforeAll

  beforeAll(async () => {
    // TODO: Replace with real test credentials once Auth Engineer sets up
    authToken = 'test-jwt-placeholder';
  });

  test('GET /api/attendance/today returns array (even if empty)', async () => {
    const res = await request(app)
      .get('/api/attendance/today')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // Must be array, never null
  });

  test('Chart data fields exist in attendance response', async () => {
    const res = await request(app)
      .get('/api/attendance/today')
      .set('Authorization', `Bearer ${authToken}`);

    // Each record must have these fields for charts to render
    // Coordinate with DB Manager for exact field names
    if (res.body.length > 0) {
      const record = res.body[0];
      expect(record).toHaveProperty('studentId');
      expect(record).toHaveProperty('status'); // 'present' | 'absent'
      expect(record).toHaveProperty('checkInTime');
      expect(record).toHaveProperty('date');
    }
  });

  test('Biometric API downtime: endpoint returns graceful error, not crash', async () => {
    // Simulate by hitting a route that proxies to biometric API
    // This tests that our error handler catches it properly
    const res = await request(app)
      .get('/api/attendance/sync') // Backend Engineer implements this
      .set('Authorization', `Bearer ${authToken}`);

    // Should return a handled error, never a 500 with stack trace
    expect([200, 503, 404]).toContain(res.statusCode);
    expect(res.body).not.toHaveProperty('stack');
  });
});

// ─── ROLE-BASED ACCESS CONTROL (coordinate with Auth Engineer) ───────────────
describe('RBAC', () => {
  test('HoD token cannot access admin routes', async () => {
    const hodToken = 'hod-token-placeholder'; // Replace with real HoD JWT

    const res = await request(app)
      .get('/api/admin/debug')
      .set('Authorization', `Bearer ${hodToken}`);

    expect(res.statusCode).toBe(403); // Forbidden
  });

  test('Unauthenticated request to protected route returns 401', async () => {
    const res = await request(app).get('/api/attendance/today');
    expect(res.statusCode).toBe(401);
  });
});

// ─── EDGE CASES ──────────────────────────────────────────────────────────────
describe('Edge Cases', () => {
  test('Empty attendance day returns empty array, not null or error', async () => {
    // This validates the "no data for today" scenario
    // Chart.js must handle [] without crashing
    const res = await request(app)
      .get('/api/attendance/today')
      .set('Authorization', `Bearer test-jwt-placeholder`);

    expect(res.body).not.toBeNull();
    expect(Array.isArray(res.body)).toBe(true);
  });
});
