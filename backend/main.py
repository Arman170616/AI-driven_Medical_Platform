"""Main FastAPI application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from config import get_settings
from database import init_db, init_session_local
from routes import (
    users_router,
    patients_router,
    visits_router,
    prescriptions_router,
    medical_router,
)

settings = get_settings()

# Initialize database and session factory
init_db(settings.database_url)
init_session_local(settings.database_url)

# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    debug=settings.debug
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*"]
)

# Include routers
app.include_router(users_router)
app.include_router(patients_router)
app.include_router(visits_router)
app.include_router(prescriptions_router)
app.include_router(medical_router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AI Medical Platform API",
        "status": "online",
        "version": settings.api_version
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
