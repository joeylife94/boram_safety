"""
Configuration management for the application
Centralized settings from environment variables
"""
from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Database
    DB_USER: str = "postgres"
    DB_PASSWORD: str
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "boram_safety"
    
    # Backend
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Upload
    UPLOAD_DIR: str = "../frontend/public/images"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def database_url(self) -> str:
        """Build PostgreSQL database URL"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.ENVIRONMENT.lower() == "development"
    
    @property
    def cors_origins(self) -> List[str]:
        """Get CORS origins based on environment"""
        if self.is_development:
            return ["http://localhost:3000", "http://localhost:3001"]
        return [self.FRONTEND_URL]
    
    def get_upload_path(self) -> Path:
        """Get upload directory path"""
        return Path(self.UPLOAD_DIR).resolve()


# Global settings instance
settings = Settings()
