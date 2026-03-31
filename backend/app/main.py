# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import engine, Base
from app.api.routes import (
    auth, upload, attendance, results,
    insights, placement, internal, goals, users,
)

# Create all tables (including new activity_logs)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VSB-APEX API",
    description="Academic Performance EXchange — Dept of IT",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

P = "/api"
app.include_router(auth.router,       prefix=P)
app.include_router(upload.router,     prefix=P)
app.include_router(attendance.router, prefix=P)
app.include_router(results.router,    prefix=P)
app.include_router(internal.router,   prefix=P)
app.include_router(insights.router,   prefix=P)
app.include_router(goals.router,      prefix=P)
app.include_router(placement.router,  prefix=P)
app.include_router(users.router,      prefix=P)   # ← NEW


@app.get("/health")
def health():
    return {"status": "ok", "app": "VSB-APEX", "version": "0.2.0"}
