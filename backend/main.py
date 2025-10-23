from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import time

from public.router import router as public_router
from admin.router import router as admin_router
from core.config import settings
from core.logger import get_logger, log_api_request
from core.exceptions import setup_exception_handlers

# 로거 초기화
logger = get_logger(__name__)

app = FastAPI(
    title="보람안전 API",
    description="보람안전물산(주) 공식 API 서버 - 안전용품 전문 쇼핑몰",
    version="2.0.0"
)

# 전역 예외 핸들러 설정
setup_exception_handlers(app)

# 로깅 미들웨어
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    log_api_request(request.method, request.url.path, response.status_code, duration)
    return response

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 - backend/static/images 사용
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
images_path = os.path.join(BASE_DIR, "static/images")
print(f"Images path: {os.path.abspath(images_path)}")  # 디버깅용

# 이미지 디렉토리가 존재하는 경우에만 마운트
if os.path.exists(images_path):
    app.mount("/images", StaticFiles(directory=images_path), name="images")
else:
    logger.warning(f"Images directory not found: {images_path}")

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