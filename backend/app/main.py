from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import engine, Base
import app.models  # Ensure all models are imported so Base knows about them

from app.api.routes import (
    auth, upload, attendance, results,
    placement, internal, users,
)
from app.api.routes import students, staff_assignments

app = FastAPI(
    title="VSB-APEX API",
    description="Academic Performance EXchange — VSB Engineering College",
    version="1.0.0",
)

# Create all tables on startup (new models auto-migrate)
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

# Custom exception handler to ensure CORS headers on 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin")
    allowed_origin = origin if origin in settings.cors_origins_list else settings.cors_origins_list[0]
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error",
            "message": str(exc),
            "path": request.url.path
        },
        headers={
            "Access-Control-Allow-Origin": allowed_origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

P = "/api"
app.include_router(auth.router,              prefix=P)
app.include_router(upload.router,            prefix=P)
app.include_router(attendance.router,        prefix=P)
app.include_router(results.router,           prefix=P)
app.include_router(internal.router,          prefix=P)
app.include_router(placement.router,         prefix=P)
app.include_router(users.router,             prefix=P)
app.include_router(students.router,          prefix=P)
app.include_router(staff_assignments.router, prefix=P)


@app.get("/health")
def health():
    return {"status": "ok", "app": "VSB-APEX", "version": "1.0.0"}
