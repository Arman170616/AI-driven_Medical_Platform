"""Dependency injection"""
from sqlalchemy.orm import Session
import database


def get_db():
    """Get database session"""
    if database.SessionLocal is None:
        # SessionLocal is not initialized yet
        raise RuntimeError("Database not initialized. Call init_session_local first.")
    
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()