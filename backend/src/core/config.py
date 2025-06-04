from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Boram Safety API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS 설정
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
    ]
    
    # 데이터베이스 설정
    DATABASE_URL: str = "sqlite:///./safety.db"
    
    class Config:
        case_sensitive = True

settings = Settings() 