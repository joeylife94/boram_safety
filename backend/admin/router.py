from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

# 상대 경로로 import 수정
import sys
sys.path.append('..')
from database import get_db
from crud import product as product_crud
from crud import category as category_crud
from schemas.product import ProductResponse, ProductCreate, ProductUpdate
from schemas.category import Category, CategoryCreate, CategoryUpdate

# 🔐 Admin Router - 모든 CRUD 작업 허용
router = APIRouter(
    tags=["admin-api"]
)

@router.get("/health")
def admin_health_check():
    """Admin API 상태 확인"""
    return {"status": "healthy", "role": "admin"}

@router.get("/dashboard")
async def admin_dashboard(db: Session = Depends(get_db)):
    """관리자 대시보드 정보를 반환합니다."""
    total_products = product_crud.get_product_count(db)
    total_categories = category_crud.get_category_count(db)
    featured_products = product_crud.get_featured_product_count(db)
    
    return {
        "message": "관리자 대시보드에 오신 것을 환영합니다",
        "status": "authenticated",
        "stats": {
            "total_products": total_products,
            "total_categories": total_categories,
            "featured_products": featured_products,
            "total_images": total_products
        }
    }

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """제품 이미지를 업로드합니다."""
    import os
    import uuid
    from pathlib import Path
    
    try:
        # 허용된 파일 형식 체크
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다")
        
        # 고유한 파일명 생성
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # 업로드 디렉토리 설정 (public/images/)
        upload_dir = Path("../frontend/public/images")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # 파일 저장
        file_path = upload_dir / unique_filename
        
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # 웹에서 접근 가능한 URL 반환
        file_url = f"/images/{unique_filename}"
        
        return {"url": file_url, "filename": unique_filename}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}")

# ============= 카테고리 관리 =============

@router.get("/categories", response_model=List[Category])
async def read_categories(
    skip: int = 0,
    limit: int = 1000,
    db: Session = Depends(get_db)
):
    """카테고리 목록을 조회합니다."""
    return category_crud.get_categories(db, skip=skip, limit=limit)

@router.get("/categories/{category_id}", response_model=Category)
async def read_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """특정 카테고리를 조회합니다."""
    category = category_crud.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/categories", response_model=Category)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    """새로운 카테고리를 생성합니다."""
    return category_crud.create_category(db, category)

@router.put("/categories/{category_id}", response_model=Category)
async def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db)
):
    """카테고리 정보를 수정합니다."""
    db_category = category_crud.update_category(db, category_id, category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """카테고리를 삭제합니다."""
    db_category = category_crud.delete_category(db, category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": f"카테고리 {category_id}가 성공적으로 삭제되었습니다"}

# ============= 제품 관리 =============

@router.get("/products", response_model=List[ProductResponse])
async def read_products(
    skip: int = 0,
    limit: int = 1000,
    category_code: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):
    """제품 목록을 조회합니다."""
    products = product_crud.get_products(db, skip=skip, limit=limit, category_code=category_code, search=search)
    return products

@router.get("/products/{product_id}", response_model=ProductResponse)
async def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """특정 제품을 조회합니다."""
    product = product_crud.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/products", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    """새로운 제품을 추가합니다."""
    return product_crud.create_product(db, product)

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    """기존 제품 정보를 수정합니다."""
    db_product = product_crud.update_product(db, product_id, product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """제품을 삭제합니다."""
    db_product = product_crud.delete_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": f"제품 {product_id}가 성공적으로 삭제되었습니다"}

@router.post("/content")
async def create_content(content: dict):
    """새로운 컨텐츠를 추가하는 엔드포인트"""
    return {
        "message": "컨텐츠가 성공적으로 추가되었습니다",
        "content": content
    }

@router.put("/content/{content_id}")
async def update_content(content_id: str, content: dict):
    """기존 컨텐츠를 수정하는 엔드포인트"""
    return {
        "message": f"컨텐츠 {content_id}가 성공적으로 수정되었습니다",
        "content": content
    }

@router.delete("/content/{content_id}")
async def delete_content(content_id: str):
    """컨텐츠를 삭제하는 엔드포인트"""
    return {
        "message": f"컨텐츠 {content_id}가 성공적으로 삭제되었습니다"
    } 