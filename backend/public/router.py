from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from crud import product as product_crud
from crud import category as category_crud
from schemas.product import ProductResponse
from schemas.category import Category

# ✅ Public Router - GET만 허용
router = APIRouter(
    tags=["public-api"]
)

@router.get("/health")
def public_health_check():
    """Public API 상태 확인"""
    return {"status": "healthy", "role": "public"}

@router.get("/categories", response_model=List[Category])
async def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """카테고리 목록 조회 (읽기 전용)"""
    return category_crud.get_categories(db, skip=skip, limit=limit)

@router.get("/categories/{category_id}", response_model=Category)
async def get_category_by_id(
    category_id: int,
    db: Session = Depends(get_db)
):
    """카테고리 ID로 조회 (읽기 전용)"""
    category = category_crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.get("/categories/slug/{slug}", response_model=Category)
async def get_category_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """카테고리 slug로 조회 (읽기 전용)"""
    category = category_crud.get_category_by_slug(db, slug)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    skip: int = 0,
    limit: int = 20,
    category_code: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """제품 목록 조회 (읽기 전용)"""
    return product_crud.get_products(db, skip=skip, limit=limit, category_code=category_code, search=search)

@router.get("/products/by-category/{category_code}", response_model=List[ProductResponse])
async def get_products_by_category(
    category_code: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """카테고리별 제품 조회 (읽기 전용)"""
    return product_crud.get_products(db, skip=skip, limit=limit, category_code=category_code)

@router.get("/products/search")
async def search_products(
    q: str = Query(..., description="검색어"),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """제품 검색 (읽기 전용)"""
    return product_crud.get_products(db, skip=skip, limit=limit, search=q)

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product_detail(
    product_id: int,
    db: Session = Depends(get_db)
):
    """제품 상세 조회 (읽기 전용)"""
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/search/suggestions")
async def get_search_suggestions(
    q: str = Query(..., description="검색어"),
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """검색 제안 (읽기 전용)"""
    suggestions = product_crud.get_search_suggestions(db, query=q, limit=limit)
    return {"suggestions": suggestions} 