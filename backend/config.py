from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings from environment variables"""
    google_gemini_api_key: str = ""
    database_url: str = "sqlite:///./medical_platform.db"
    debug: bool = True
    api_title: str = "AI Medical Platform API"
    api_version: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings():
    return Settings()
