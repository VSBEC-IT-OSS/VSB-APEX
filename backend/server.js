// server.js — ChronoTrack Backend Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// --- Health check route (used by integration tests) ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes (to be added by each module owner) ---
// app.use('/api/auth', require('./routes/auth'));        // Auth Engineer
// app.use('/api/attendance', require('./routes/attendance')); // Backend Engineer
// app.use('/api/admin', require('./routes/admin'));      // Backend Engineer

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`ChronoTrack backend running on port ${PORT}`);
});

module.exports = app; // exported for testing
