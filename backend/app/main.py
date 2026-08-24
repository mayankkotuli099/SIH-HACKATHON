from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .core.config import settings
from .routers import auth, dashboard, entities, network, timeline, cases, chat, settings as settings_router

app = FastAPI(
    title="CrimeLens Forensic & Intelligence Backend API",
    description="REST API Gateway & Neural Intelligence Engine for the CrimeLens Platform.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "ONLINE",
        "service": "CrimeLens Intelligence Engine (Python FastAPI)",
        "clearance": "LEVEL 4 CLEARANCE",
        "activeNeuralEngine": "CrimeLens-Titan v4.2",
        "timestamp": datetime.utcnow().isoformat()
    }

# Mount Routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(entities.router, prefix=settings.API_V1_STR)
app.include_router(network.router, prefix=settings.API_V1_STR)
app.include_router(timeline.router, prefix=settings.API_V1_STR)
app.include_router(cases.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(settings_router.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": "CrimeLens Intelligence Backend (Python FastAPI)",
        "status": "OPERATIONAL",
        "documentation": "/docs"
    }
