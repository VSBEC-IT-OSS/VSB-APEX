# VSB-APEX

Academic performance intelligence platform for the Department of Information Technology, VSB Engineering College.

Tracks attendance, results, internal tests, placement, and goals — giving HoDs and staff a single dashboard to go from raw data to actionable decisions.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 + Vite                     |
| Backend  | FastAPI + SQLAlchemy + Alembic      |
| Database | PostgreSQL (Neon recommended)       |
| Auth     | JWT via `python-jose` + `bcrypt`    |

---

## Prerequisites

Make sure these are installed before you begin:

- Python 3.10+
- Node.js 18+
- Git

You do **not** need PostgreSQL installed locally — the project uses a shared Neon cloud database (see Environment Setup below).

---

## 1. Clone the Repository

```bash
git clone https://github.com/vsbec-it-oss/vsb-apex.git
cd vsb-apex
```

---

## 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Mac / Linux:**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

> ⚠️ Do **not** manually install `passlib`. It has been removed from this project due to incompatibility with modern `bcrypt`. The project uses `bcrypt` directly.

---

## 3. Environment Setup

Copy the example env file:

```bash
cp .env.example .env
```

Then open `.env` and fill in the real values. Get these from the team's shared credentials (see the pinned message in our group / ask the project lead):

```env
DATABASE_URL=postgresql://...      # Shared Neon DB — get from team
SECRET_KEY=...                     # Get from team (or generate your own for local dev)
ACCESS_TOKEN_EXPIRE_MINUTES=48000
APP_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

To generate your own `SECRET_KEY` for local development:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

> ℹ️ If you use your own `SECRET_KEY`, tokens won't be valid across team members' instances — this is fine for local dev.

---

## 4. Run the Backend

```bash
python run.py
```

Backend runs at: `http://localhost:8000`

Confirm it's working:
```bash
curl http://localhost:8000/health
```

---

## 5. Frontend Setup

Open a new terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

The `.env.example` already has the correct local API URL — no changes needed for local development.

---

## 6. Seeding Initial Users (First-Time Only)

> Only needed on a **fresh database**. Skip this if the team DB already has users.

```bash
cd backend
python seed_users.py
```

Default credentials after seeding:

| Email                | Password   | Role  |
|----------------------|------------|-------|
| hod@vsbec.edu.in     | admin123   | hod   |
| staff1@vsbec.edu.in  | staff123   | staff |
| admin@vsbec.edu.in   | admin123   | admin |

> The admin account can create and manage users through the app. Seeding is a one-time bootstrap — ongoing user management happens through the UI.

---

## Project Structure

```
vsb-apex/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Config, security (JWT + bcrypt)
│   │   ├── db/           # Database session
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── utils/        # Excel parser, helpers
│   ├── alembic/          # DB migrations
│   ├── requirements.txt
│   ├── run.py
│   └── seed_users.py
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Route-level page components
    │   ├── data/         # dataService.js — all API calls
    │   └── hooks/
    ├── index.html
    └── vite.config.js
```

---

## Common Errors & Fixes

**`passlib` / bcrypt version error on `seed_users.py`**
This means `passlib` is still installed. The project no longer uses it:
```bash
pip uninstall passlib -y
pip install -r requirements.txt
```

**`Session expired` immediately on login**
This means the backend returned 401. Check:
- Is the backend running? (`python run.py`)
- Are the DB credentials in `.env` correct?
- Did you seed the DB? (`python seed_users.py`)

**`VITE_API_BASE not configured`**
You're missing `frontend/.env`. Run `cp .env.example .env` inside the `frontend/` folder.

**CORS errors in browser console**
Make sure `CORS_ORIGINS` in `backend/.env` includes `http://localhost:5173`.

---

## Contribution Workflow

1. Pick an issue from the GitHub board
2. Create a branch: `git checkout -b feature/issue-name`
3. Make changes, test locally
4. Commit: `git commit -m "feat: what you did"`
5. Push and open a Pull Request against `main`

Keep PRs focused — one issue per PR. Do not push directly to `main`.

See `Contributing.md` for the full AI-assisted development workflow.

---

## Maintained By

TaskForce - VSBEC IT
