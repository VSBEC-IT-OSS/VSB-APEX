# VSB-APEX Backend — FastAPI + PostgreSQL

> REST API for the VSB-APEX academic dashboard.

---

## Quick Start

### 1. Prerequisites
- Python 3.11+
- PostgreSQL running locally

### 2. Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, SECRET_KEY
```

### 3. Create the database

```bash
# In psql or pgAdmin:
CREATE DATABASE vsb_apex;
```

### 4. Run migrations

```bash
# First time — auto-creates all tables:
python run.py
# (Tables created automatically via SQLAlchemy on startup)

# For production, use Alembic:
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

### 5. Start server

```bash
python run.py
# → http://localhost:5000
# → http://localhost:5000/docs  (Swagger UI)
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user |
| POST | `/api/auth/login` | Login → returns JWT token |

### Upload (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/attendance` | Upload attendance .xlsx |
| POST | `/api/upload/results` | Upload results .xlsx |
| POST | `/api/upload/internal` | Upload internal test .xlsx |

### Attendance (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/overview` | Overall stats + trend |
| GET | `/api/attendance/section?year=I Year` | Section breakdown |
| GET | `/api/attendance/student/{id}` | Per-student attendance |

### Results (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/results/overview` | Overall pass %, CGPA, trend |
| GET | `/api/results/subject-analysis` | Per-subject pass %, arrears |
| GET | `/api/results/section?year=II Year` | Per-section performance |

### Insights (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/insights` | Auto-generated observations |

### Placement (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/placement/stats` | Placement statistics |

---

## Connecting the Frontend

In `vsb-apex/src/data/dataService.js`:

```js
const USE_MOCK = false;               // ← flip this
const API_BASE = "http://localhost:5000/api";
```

For authenticated requests, store the JWT from `/api/auth/login`
and send it as `Authorization: Bearer <token>`.

---

## Excel File Format

### Attendance Upload (`/api/upload/attendance`)
| Column | Type | Example |
|--------|------|---------|
| Student_ID | Text | 22IT001 |
| Student_Name | Text | Arun Kumar |
| Year | Text | I Year |
| Section | Text | A |
| Subject_Code | Text | CS3151 |
| Subject_Name | Text | Maths |
| Date | Date | 2025-01-15 |
| Status | Text | present / absent |

### Results Upload (`/api/upload/results`)
| Column | Type | Example |
|--------|------|---------|
| Student_ID | Text | 22IT001 |
| Student_Name | Text | Arun Kumar |
| Year | Text | I Year |
| Section | Text | A |
| Semester | Number | 1 |
| Subject_Code | Text | CS3151 |
| Internal_Marks | Number | 38 |
| External_Marks | Number | 62 |
| Total_Marks | Number | 100 |
| Grade | Text | A |
| Is_Pass | Boolean | TRUE |

---

## Project Structure

```
vsb-apex-backend/
├── app/
│   ├── api/
│   │   ├── deps.py           ← Auth dependency injection
│   │   └── routes/           ← One file per domain
│   ├── core/
│   │   ├── config.py         ← Settings from .env
│   │   └── security.py       ← JWT + bcrypt
│   ├── db/
│   │   └── database.py       ← SQLAlchemy engine + session
│   ├── models/               ← DB table definitions
│   ├── schemas/              ← Pydantic request/response shapes
│   ├── services/             ← Business logic (no FastAPI deps)
│   ├── utils/
│   │   └── excel_parser.py   ← Excel → Python dicts
│   └── main.py               ← App factory + router registration
├── alembic/                  ← DB migrations
├── run.py                    ← Dev server entry
├── requirements.txt
└── .env.example
```

---

## Roadmap

| Phase | Status | Task |
|-------|--------|------|
| 1 — Data Ingestion | ✅ Done | Upload API, Excel parser, DB schema |
| 2 — Core APIs | ✅ Done | All REST endpoints |
| 3 — Analytics Engine | ✅ Done | Aggregation + rule-based insights |
| 5 — PPT Engine | 🔲 Next | `/api/generate-ppt` |

---

*VSB-APEX · Dept of IT · 2024–25*
