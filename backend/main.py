from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# sys.path를 사용하여 현재 디렉토리에서 모듈을 찾도록 설정
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 직접 import
from public.router import router as public_router
from admin.router import router as admin_router

app = FastAPI(
    title="보람안전 API",
    description="보람안전 웹사이트 API - Public과 Admin 영역 완전 분리",
    version="2.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 - public/images로 통합
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
images_path = os.path.join(BASE_DIR, "../frontend/public/images")
print(f"Images path: {os.path.abspath(images_path)}")  # 디버깅용

app.mount("/images", StaticFiles(directory=images_path), name="images")

# API 라우터 등록
# ✅ Public API: /api/* (GET만 허용)
app.include_router(public_router, prefix="/api", tags=["public"])

# 🔐 Admin API: /api/admin/* (전체 CRUD 허용)
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])

@app.get("/")
async def root():
    return {
        "message": "보람안전 API 서버 v2.0",
        "structure": {
            "public": "/api/* (GET only)",
            "admin": "/api/admin/* (Full CRUD)",
            "images": "/images/* (Static files)"
        },
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0"} 