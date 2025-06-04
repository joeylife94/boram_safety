from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from backend.database import Base, engine
from backend.routers import public
from backend.app.api import products

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="보람안전 API",
    description="보람안전 웹사이트를 위한 백엔드 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(public.router)
# 카테고리 관련 라우트: /api/categories, /api/categories/{code}, /api/categories/{code}/products
app.include_router(products.router, prefix="/api", tags=["categories", "products"])

@app.get("/")
async def root():
    return {
        "message": "보람안전 API에 오신 것을 환영합니다!",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True) 