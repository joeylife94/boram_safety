from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from backend.database import get_db

from backend.crud import company as company_crud
from backend.core.constants import COMPANY_INFO, COMPANY_HISTORY, CERTIFICATIONS, MAJOR_CLIENTS

from backend.schemas.company import CompanyInfo, History, Certification, Client
from backend.schemas.safety import SafetyCategory, SafetyCategoryResponse, SafetyProductResponse
from backend.models.safety import SafetyCategory as DBSafetyCategory, SafetyProduct as DBSafetyProduct


router = APIRouter(
    prefix="/api",
    tags=["public"]
)

@router.get("/")
async def read_root():
    return {
        "message": "보람안전 웹사이트에 오신 것을 환영합니다!",
        "status": "active"
    }

@router.get("/about")
async def read_about():
    """회사 기본 정보를 조회합니다."""
    return COMPANY_INFO

@router.get("/about/history")
async def read_history():
    """회사 연혁을 조회합니다."""
    return COMPANY_HISTORY

@router.get("/about/certifications")
async def read_certifications():
    """회사 인증 및 특허 정보를 조회합니다."""
    return CERTIFICATIONS

@router.get("/about/clients")
async def read_clients():
    """주요 거래처 정보를 조회합니다."""
    return MAJOR_CLIENTS

@router.get("/categories", response_model=List[SafetyCategoryResponse])
async def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """안전용품 카테고리 목록을 조회합니다."""
    categories = db.query(DBSafetyCategory).order_by(DBSafetyCategory.display_order).offset(skip).limit(limit).all()
    return categories

@router.get("/categories/{category_code}", response_model=SafetyCategoryResponse)
async def get_category(
    category_code: str,
    db: Session = Depends(get_db)
):
    """특정 안전용품 카테고리 정보를 조회합니다."""
    category = db.query(DBSafetyCategory).filter(
        (DBSafetyCategory.code == category_code) | (DBSafetyCategory.slug == category_code)
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.get("/categories/{category_code}/products", response_model=List[SafetyProductResponse])
async def get_category_products(
    category_code: str,
    skip: int = 0,
    limit: int = 100,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    """특정 카테고리의 안전용품 목록을 조회합니다."""
    # 먼저 카테고리가 존재하는지 확인
    category = db.query(DBSafetyCategory).filter(
        (DBSafetyCategory.code == category_code) | (DBSafetyCategory.slug == category_code)
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # 해당 카테고리의 제품들 조회
    query = db.query(DBSafetyProduct).filter(DBSafetyProduct.category_id == category.id)
    
    if featured_only:
        query = query.filter(DBSafetyProduct.is_featured == 1)
    
    products = query.order_by(DBSafetyProduct.display_order).offset(skip).limit(limit).all()
    
    return products

@router.get("/products/{product_id}", response_model=SafetyProductResponse)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """특정 안전용품의 상세 정보를 조회합니다."""
    product = db.query(DBSafetyProduct).filter(DBSafetyProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/products", response_model=List[SafetyProductResponse])
async def get_products(
    category_code: Optional[str] = None,
    featured_only: bool = False,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """안전용품 목록을 조회합니다."""
    query = db.query(DBSafetyProduct)
    
    if category_code:
        category = db.query(DBSafetyCategory).filter(
            (DBSafetyCategory.code == category_code) | (DBSafetyCategory.slug == category_code)
        ).first()
        if category:
            query = query.filter(DBSafetyProduct.category_id == category.id)
    
    if featured_only:
        query = query.filter(DBSafetyProduct.is_featured == 1)
    
    products = query.order_by(DBSafetyProduct.display_order).offset(skip).limit(limit).all()
    
    return products

@router.get("/search")
async def search_products(
    query: Optional[str] = Query(None, description="검색 키워드"),
    category_code: Optional[str] = Query(None, description="카테고리 필터"),
    min_price: Optional[float] = Query(None, description="최소 가격"),
    max_price: Optional[float] = Query(None, description="최대 가격"),
    stock_status: Optional[str] = Query(None, description="재고 상태"),
    is_featured: Optional[bool] = Query(None, description="추천 제품 여부"),
    sort_by: Optional[str] = Query("name", description="정렬 기준 (name, price_asc, price_desc, featured)"),
    limit: Optional[int] = Query(20, description="결과 제한 수"),
    db: Session = Depends(get_db)
):
    """제품 검색 API - 실시간 검색과 필터링 지원"""
    
    # 기본 쿼리 시작 (JOIN으로 카테고리 정보 포함)
    query_builder = db.query(DBSafetyProduct, DBSafetyCategory).join(
        DBSafetyCategory, DBSafetyProduct.category_id == DBSafetyCategory.id
    )
    
    # 텍스트 검색 (제품명, 설명, 모델번호에서 검색)
    if query and query.strip():
        search_term = f"%{query.strip()}%"
        query_builder = query_builder.filter(
            or_(
                DBSafetyProduct.name.ilike(search_term),
                DBSafetyProduct.description.ilike(search_term),
                DBSafetyProduct.model_number.ilike(search_term)
            )
        )
    
    # 카테고리 필터
    if category_code:
        query_builder = query_builder.filter(DBSafetyCategory.code == category_code)
    
    # 가격 범위 필터
    if min_price is not None:
        query_builder = query_builder.filter(DBSafetyProduct.price >= min_price)
    if max_price is not None:
        query_builder = query_builder.filter(DBSafetyProduct.price <= max_price)
    
    # 재고 상태 필터
    if stock_status:
        query_builder = query_builder.filter(DBSafetyProduct.stock_status == stock_status)
    
    # 추천 제품 필터
    if is_featured is not None:
        query_builder = query_builder.filter(DBSafetyProduct.is_featured == (1 if is_featured else 0))
    
    # 정렬 적용
    if sort_by == "price_asc":
        query_builder = query_builder.order_by(DBSafetyProduct.price.asc())
    elif sort_by == "price_desc":
        query_builder = query_builder.order_by(DBSafetyProduct.price.desc())
    elif sort_by == "featured":
        query_builder = query_builder.order_by(DBSafetyProduct.is_featured.desc(), DBSafetyProduct.name.asc())
    else:  # 기본값: name
        query_builder = query_builder.order_by(DBSafetyProduct.name.asc())
    
    # 결과 제한
    results = query_builder.limit(limit).all()
    
    # 결과를 JSON 형태로 변환
    products = []
    for product, category in results:
        product_dict = {
            "id": product.id,
            "category_id": product.category_id,
            "category_code": category.code,
            "name": product.name,
            "model_number": product.model_number,
            "price": product.price,
            "description": product.description,
            "specifications": product.specifications,
            "stock_status": product.stock_status,
            "file_name": product.file_name,
            "file_path": product.file_path,
            "display_order": product.display_order,
            "is_featured": product.is_featured,
            "created_at": product.created_at,
            "updated_at": product.updated_at
        }
        products.append(product_dict)
    
    # 총 개수 계산
    count_query = db.query(DBSafetyProduct).join(DBSafetyCategory, DBSafetyProduct.category_id == DBSafetyCategory.id)
    if query and query.strip():
        search_term = f"%{query.strip()}%"
        count_query = count_query.filter(
            or_(
                DBSafetyProduct.name.ilike(search_term),
                DBSafetyProduct.description.ilike(search_term),
                DBSafetyProduct.model_number.ilike(search_term)
            )
        )
    if category_code:
        count_query = count_query.filter(DBSafetyCategory.code == category_code)
    if min_price is not None:
        count_query = count_query.filter(DBSafetyProduct.price >= min_price)
    if max_price is not None:
        count_query = count_query.filter(DBSafetyProduct.price <= max_price)
    if stock_status:
        count_query = count_query.filter(DBSafetyProduct.stock_status == stock_status)
    if is_featured is not None:
        count_query = count_query.filter(DBSafetyProduct.is_featured == (1 if is_featured else 0))
    
    total_count = count_query.count()
    
    return {
        "products": products,
        "total": total_count,
        "search_params": {
            "query": query,
            "category_code": category_code,
            "min_price": min_price,
            "max_price": max_price,
            "stock_status": stock_status,
            "is_featured": is_featured,
            "sort_by": sort_by,
            "limit": limit
        }
    }

@router.get("/search/suggestions")
async def get_search_suggestions(
    query: str = Query(..., min_length=1, description="검색어"),
    limit: int = Query(5, description="제안 수 제한"),
    db: Session = Depends(get_db)
):
    """검색어 자동완성 제안"""
    
    if not query or len(query.strip()) < 1:
        return {"suggestions": []}
    
    search_term = f"%{query.strip()}%"
    
    # 제품명으로 검색 (카테고리 정보 포함)
    products = db.query(DBSafetyProduct, DBSafetyCategory).join(
        DBSafetyCategory, DBSafetyProduct.category_id == DBSafetyCategory.id
    ).filter(
        or_(
            DBSafetyProduct.name.ilike(search_term),
            DBSafetyProduct.description.ilike(search_term),
            DBSafetyProduct.model_number.ilike(search_term)
        )
    ).limit(limit).all()
    
    suggestions = []
    for product, category in products:
        suggestions.append({
            "id": product.id,
            "name": product.name,
            "category_code": category.code,
            "category_name": category.name,
            "image_path": product.file_path,
            "url": f"/products/{category.code}/{product.id}"
        })
    
    return {"suggestions": suggestions}

@router.get("/health")
def health_check():
    return {"status": "healthy"} 