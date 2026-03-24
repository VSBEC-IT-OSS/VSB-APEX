# VSB APEX

VSB APEX is a full-stack academic analytics and management platform designed for department-level monitoring of:

- Attendance
- Results
- Internal Tests
- Placement

It enables HoDs and faculty to move from **raw data → actionable insights → decisions**.

---

# 🚀 Features

## ✅ Current Features

- Excel-based data upload system
- Attendance tracking and aggregation
- Results and internal marks processing
- Basic insights and analytics APIs
- Role-based authentication (Admin / Staff)

---

## 🔥 Upcoming Features (In Progress)

### 🎓 Advanced Student Dashboard
- Full student profile (academic + placement)
- Risk classification (high / moderate / safe)
- Performance trends (attendance, results, internals)
- Subject-wise drilldown
- LeetCode + internships + placement metrics
- Admin edit + audit logging

---

### 📊 Hierarchical Data System
- Batch → Section → Student filtering across all pages
- Dynamic controls for data exploration
- Standardized filtering UX

---

### 🔍 Drilldown Navigation
- Clickable overview metrics
- Navigate to source data (attendance, results, etc.)
- Context-aware filtering

---

### 📈 Advanced Analytics
- Cross-batch comparisons
- Section-wise comparisons
- Subject difficulty analysis
- Internal test progression tracking

---

### 💼 Placement Intelligence System
- Multi-offer tracking per student
- Company-wise analysis
- Offer distribution insights
- HoD-level placement overview

---

### 📤 PPT Export System
- Auto-generate meeting presentations
- Editable slides
- Data-driven content

---

### ☁️ Deployment (Planned)
- Frontend: Vercel
- Backend: Render / Railway
- Database: Neon / Supabase

---

# 🧱 Tech Stack

## Backend
- FastAPI
- SQLAlchemy
- Alembic (migrations)

## Frontend
- React (Vite)

## Database
- PostgreSQL (recommended)

---

# 🛠️ Getting Started (For Everyone)

## 📥 1. Clone the Repository

```bash
git clone https://github.com/VSBEC-IT-OSS/VSB-APEX.git
cd VSB-APEX
```

---

## ⚙️ 2. Backend Setup

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Run Backend

```bash
uvicorn main:app --reload
```

Backend runs at:
```
http://127.0.0.1:8000
```

---

## 💻 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

# 🐳 Docker (Optional but Recommended)

Docker helps you run everything without worrying about setup issues.

## Install Docker
👉 https://www.docker.com/

---

## Run Project Using Docker

```bash
docker-compose up --build
```

---

## Why Docker?

- Same environment for everyone
- No dependency conflicts
- Easier deployment later

---

# 🔄 Contribution Workflow

## 🍴 1. Fork the Repo

Click **Fork** on GitHub

---

## 📥 2. Clone Your Fork

```bash
git clone <your-fork-url>
cd VSB-APEX
```

---

## 🌿 3. Create Branch

```bash
git checkout -b feature/issue-name
```

---

## ✏️ 4. Make Changes

- Follow issue requirements
- Keep code clean
- Do NOT break existing features

---

## 🧪 5. Test Locally

Backend:
```bash
uvicorn main:app --reload
```

Frontend:
```bash
npm run dev
```

---

## 📤 6. Commit & Push

```bash
git add .
git commit -m "feat: implemented <feature name>"
git push origin feature/issue-name
```

---

## 🔁 7. Create Pull Request

- Go to GitHub
- Click **Compare & Pull Request**
- Describe:
  - What you did
  - How to test

---

# 👨‍💼 Admin Guide (Testing PRs)

## Pull PR Locally

```bash
git fetch origin pull/<PR_NUMBER>/head:test-branch
git checkout test-branch
```

---

## Test Checklist

- App runs without errors
- Feature works correctly
- No existing features broken
- Clean code structure

---

## Merge Rules

✅ Merge if:
- Fully working
- Matches issue
- No conflicts

❌ Reject if:
- Breaks system
- Incomplete
- Bad structure

---

# ⚠️ Important Rules

## DO

- Follow project structure
- Use services (not random logic)
- Write clean code

## DON'T

- Duplicate code
- Hardcode values
- Create random files

---

# ⚡ Development Speed Goal

- 1 developer → 1 issue/day  
- Team of 5 → 5 issues/day  

---

# 🧠 Using AI (Mandatory)

We use AI (Claude) to accelerate development.

👉 See `CONTRIBUTING.md` for full AI workflow.

---

# 🏁 Vision

Build a **complete academic intelligence platform** that helps departments:

- Monitor performance
- Identify risks
- Improve outcomes

---

# 📌 Maintained By

VSBEC IT OSS Team
