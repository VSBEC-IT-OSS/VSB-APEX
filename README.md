# ChronoTrack 🕐
> Biometric Student Attendance Dashboard

ChronoTrack is a web-based attendance analytics system built for academic institutions. It integrates with biometric devices to automatically pull daily student attendance data, stores it securely, and presents it through a role-based dashboard — giving Heads of Department clean analytics and giving admins full system control.

Built as a team project by students at TaskForce, [VSBEC-IT](https://vsbec.edu.in/).

---

## What It Does

- Pulls daily attendance records automatically from a biometric device API
- Stores data with a rolling 60-day window (auto-cleanup built in)
- Displays attendance trends through interactive charts — daily, weekly, present/absent breakdowns, and average check-in times
- Enforces role-based access: HoDs see analytics, Admins manage the system
- Secured with JWT authentication

---

## Team

| # | Role | Member |
|---|------|--------|
| 1 | System Architect & Project Lead | [Kabilan](https://github.com/Kabilroy) |
| 2 | Authentication Engineer | [Mohamed Anas](https://github.com/sMDANAS02) |
| 3 | Data & Database Manager | [Mohamed Ashraf](https://github.com/ashraf-2005) |
| 4 | Dashboard & Frontend Engineer | [Mohan Dhass](https://github.com/gkdhass) |
| 5 | Integration, Testing & Deployment | [Kishore Prabakar](https://github.com/KishorePrabakar) |

---

## Tech Stack

- **Frontend:** React + Chart.js
- **Backend:** Node.js + Express
- **Database:** TBD (confirmed by DB Manager)
- **Auth:** JWT
- **Deployment:** Vercel (frontend) · Render (backend)

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm
- Git

### Clone & Setup
```bash
git clone https://github.com/Kabilroy/ChronoTrack.git
cd ChronoTrack

# Backend
cd backend && npm install && cp .env.example .env

# Frontend
cd ../frontend && npm install && cp .env.example .env
```

### Run Locally
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## Environment Variables

Copy `.env.example` to `.env` in both `frontend/` and `backend/` and fill in your values. **Never commit `.env` files.**

---

## Testing

```bash
cd tests && npm install && npm test
```

---

## Deployment

- **Frontend** → Vercel: connect `main` branch, set root directory to `frontend/`
- **Backend** → Render: connect `main` branch, set root directory to `backend/`