from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from database import get_db
from crud import product as product_crud
from crud import category as category_crud
from schemas.product import ProductResponse, ProductSearchParams, ProductSearchResponse
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


@router.post("/products/advanced-search", response_model=ProductSearchResponse)
async def advanced_search_products(
    params: ProductSearchParams,
    db: Session = Depends(get_db)
):
    """
    고급 검색으로 제품을 조회합니다.
    
    - **search**: 텍스트 검색 (제품명, 설명, 모델번호, 사양)
    - **category_id**: 단일 카테고리 ID
    - **category_codes**: 여러 카테고리 코드 (예: ["safety_helmet", "safety_gloves"])
    - **min_price / max_price**: 가격 범위
    - **stock_status**: 재고 상태 ("재고있음", "품절", "입고예정" 등)
    - **is_featured**: 추천 제품 여부
    - **created_after / created_before**: 등록 날짜 범위
    - **sort_by**: 정렬 필드 (name, price, created_at, updated_at, display_order)
    - **sort_order**: 정렬 순서 (asc, desc)
    - **skip / limit**: 페이징
    
    예시:
    ```json
    {
        "search": "헬멧",
        "category_codes": ["safety_helmet"],
        "min_price": 10000,
        "max_price": 50000,
        "is_featured": true,
        "sort_by": "price",
        "sort_order": "asc",
        "skip": 0,
        "limit": 20
    }
    ```
    """
    products, total = product_crud.advanced_search_products(db, params)
    
    # 페이지 정보 계산
    page = (params.skip // params.limit) + 1
    total_pages = math.ceil(total / params.limit) if params.limit > 0 else 0
    
    return ProductSearchResponse(
        total=total,
        items=products,
        page=page,
        page_size=params.limit,
        total_pages=total_pages
    )
 