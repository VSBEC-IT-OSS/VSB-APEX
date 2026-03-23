# VSB-APEX

> Academic Performance EXchange — Department of Information Technology

---

## Repository Structure

```
vsb-apex/
├── frontend/          # React + Vite dashboard
├── backend/           # FastAPI + PostgreSQL REST API
├── .gitignore
└── README.md
```

---

## Frontend — Quick Start

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

**Currently runs on mock data.** To connect to the backend, open
`frontend/src/data/dataService.js` and set `USE_MOCK = false`.

---

## Backend — Quick Start

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create DB (PostgreSQL must be running)
# psql: CREATE DATABASE vsb_apex;

cp .env.example .env          # then edit DATABASE_URL + SECRET_KEY
python run.py
# → http://localhost:5000
# → http://localhost:5000/docs  (Swagger UI)
```

---

## Full-Stack Workflow (after backend is running)

1. Start backend: `cd backend && python run.py`
2. Start frontend: `cd frontend && npm run dev`
3. Register a user via `POST /api/auth/register` or Swagger UI
4. Login → get JWT token
5. Upload attendance/results Excel files via `POST /api/upload/attendance`
6. Dashboard auto-populates from live DB

---

## Tech Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React 18, Vite, Recharts, Lucide  |
| Backend  | FastAPI, SQLAlchemy, Alembic      |
| Database | PostgreSQL                        |
| Auth     | JWT (python-jose) + bcrypt        |
| Excel    | openpyxl + pandas (backend), xlsx (frontend) |

---

## Branch Strategy (suggested)

```
main          ← stable, demo-ready
dev           ← integration branch
feat/phase-1  ← data ingestion
feat/phase-5  ← ppt generation
```

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 0 — Foundation    | Structure, data formats, design system | ✅ Done |
| 1 — Data Ingestion| Upload API, Excel parser, DB schema    | ✅ Done |
| 2 — Core APIs     | All REST endpoints                     | ✅ Done |
| 3 — Analytics     | Aggregation + insights engine          | ✅ Done |
| 4 — Dashboard UI  | All 4 pages (mock data)                | ✅ Done |
| 5 — PPT Engine    | Auto report generation                 | 🔲 Next |
| 6 — Integration   | End-to-end wiring                      | 🔲 Planned |
| 7 — Enhancements  | Trends, goal tracking, polish          | 🔲 Planned |

---

*Dept of IT · VSB Engineering College · 2024–25*
