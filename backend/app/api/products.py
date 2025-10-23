from typing import List, Optional
from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.safety import SafetyProduct, SafetyCategory
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    """카테고리 목록 조회"""
    try:
        categories = db.query(SafetyCategory).all()
        result = []
        for category in categories:
            # 카테고리별 제품 수 계산
            product_count = db.query(SafetyProduct).filter(SafetyProduct.category_id == category.id).count()
            
            result.append({
                "code": category.code,
                "name": category.name,
                "description": category.description,
                "slug": category.slug,
                "image_count": product_count,
                "image_path": category.image
            })
        
        return result
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(status_code=500, detail="카테고리를 불러오는데 실패했습니다.")

@router.get("/categories/{category_code}")
async def get_category_by_code(category_code: str, db: Session = Depends(get_db)):
    """특정 카테고리 정보 조회"""
    try:
        category = db.query(SafetyCategory).filter(SafetyCategory.code == category_code).first()
        if not category:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")
        
        # 카테고리별 제품 수 계산
        product_count = db.query(SafetyProduct).filter(SafetyProduct.category_id == category.id).count()
        
        return {
            "code": category.code,
            "name": category.name,
            "description": category.description,
            "slug": category.slug,
            "image_count": product_count,
            "image_path": category.image
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching category {category_code}: {str(e)}")
        raise HTTPException(status_code=500, detail="카테고리 정보를 불러오는데 실패했습니다.")

@router.get("/categories/{category_code}/products")
async def get_products_by_category(category_code: str, db: Session = Depends(get_db)):
    """카테고리별 제품 목록 조회"""
    try:
        # 카테고리 존재 확인
        category = db.query(SafetyCategory).filter(SafetyCategory.code == category_code).first()
        if not category:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")
        
        # 해당 카테고리의 제품들 조회 (category_code 포함)
        products = db.query(SafetyProduct).filter(SafetyProduct.category_id == category.id).all()
        
        # category_code 추가
        result = []
        for product in products:
            product_dict = {
                "id": product.id,
                "category_id": product.category_id,
                "category_code": category.code,  # 추가
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
            result.append(product_dict)
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching products for category {category_code}: {str(e)}")
        raise HTTPException(status_code=500, detail="제품 목록을 불러오는데 실패했습니다.")

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
    """
    제품 검색 API - 실시간 검색과 필터링 지원
    """
    try:
        # 기본 쿼리 시작 (JOIN으로 카테고리 정보 포함)
        query_builder = db.query(SafetyProduct, SafetyCategory).join(
            SafetyCategory, SafetyProduct.category_id == SafetyCategory.id
        )
        
        # 텍스트 검색 (제품명, 설명, 모델번호에서 검색)
        if query and query.strip():
            search_term = f"%{query.strip()}%"
            query_builder = query_builder.filter(
                or_(
                    SafetyProduct.name.ilike(search_term),
                    SafetyProduct.description.ilike(search_term),
                    SafetyProduct.model_number.ilike(search_term)
                )
            )
        
        # 카테고리 필터
        if category_code:
            query_builder = query_builder.filter(SafetyCategory.code == category_code)
        
        # 가격 범위 필터
        if min_price is not None:
            query_builder = query_builder.filter(SafetyProduct.price >= min_price)
        if max_price is not None:
            query_builder = query_builder.filter(SafetyProduct.price <= max_price)
        
        # 재고 상태 필터
        if stock_status:
            query_builder = query_builder.filter(SafetyProduct.stock_status == stock_status)
        
        # 추천 제품 필터
        if is_featured is not None:
            query_builder = query_builder.filter(SafetyProduct.is_featured == (1 if is_featured else 0))
        
        # 정렬 적용
        if sort_by == "price_asc":
            query_builder = query_builder.order_by(SafetyProduct.price.asc())
        elif sort_by == "price_desc":
            query_builder = query_builder.order_by(SafetyProduct.price.desc())
        elif sort_by == "featured":
            query_builder = query_builder.order_by(SafetyProduct.is_featured.desc(), SafetyProduct.name.asc())
        else:  # 기본값: name
            query_builder = query_builder.order_by(SafetyProduct.name.asc())
        
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
        
        # 결과 개수 계산
        count_query = db.query(SafetyProduct).join(SafetyCategory, SafetyProduct.category_id == SafetyCategory.id)
        if query and query.strip():
            search_term = f"%{query.strip()}%"
            count_query = count_query.filter(
                or_(
                    SafetyProduct.name.ilike(search_term),
                    SafetyProduct.description.ilike(search_term),
                    SafetyProduct.model_number.ilike(search_term)
                )
            )
        if category_code:
            count_query = count_query.filter(SafetyCategory.code == category_code)
        if min_price is not None:
            count_query = count_query.filter(SafetyProduct.price >= min_price)
        if max_price is not None:
            count_query = count_query.filter(SafetyProduct.price <= max_price)
        if stock_status:
            count_query = count_query.filter(SafetyProduct.stock_status == stock_status)
        if is_featured is not None:
            count_query = count_query.filter(SafetyProduct.is_featured == (1 if is_featured else 0))
        
        total_count = count_query.count()
        
        return {
            "products": products,
            "total_count": total_count,
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
        
    except Exception as e:
        logger.error(f"Error searching products: {str(e)}")
        raise HTTPException(status_code=500, detail="제품 검색 중 오류가 발생했습니다.")

@router.get("/search/suggestions")
async def get_search_suggestions(
    query: str = Query(..., min_length=1, description="검색어"),
    limit: int = Query(5, description="제안 수 제한"),
    db: Session = Depends(get_db)
):
    """
    실시간 검색 제안 API - Header 검색바용
    """
    try:
        if not query or len(query.strip()) < 1:
            return {"suggestions": []}
        
        search_term = f"%{query.strip()}%"
        
        # 제품명에서 검색 (빠른 응답을 위해 제한된 필드만, JOIN으로 category_code 포함)
        results = db.query(
            SafetyProduct.id,
            SafetyProduct.name,
            SafetyProduct.file_path,
            SafetyCategory.code.label('category_code')
        ).join(
            SafetyCategory, SafetyProduct.category_id == SafetyCategory.id
        ).filter(
            or_(
                SafetyProduct.name.ilike(search_term),
                SafetyProduct.model_number.ilike(search_term)
            )
        ).limit(limit).all()
        
        # 결과를 제안 형태로 변환
        suggestions = []
        for result in results:
            suggestions.append({
                "id": result.id,
                "name": result.name,
                "category_code": result.category_code,
                "image_path": result.file_path,
                "url": f"/products/{result.category_code}/{result.id}"
            })
        
        return {"suggestions": suggestions}
        
    except Exception as e:
        logger.error(f"Error getting search suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail="검색 제안을 가져오는 중 오류가 발생했습니다.")

@router.get("/products/{product_id}")
async def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    """제품 ID로 특정 제품 조회"""
    try:
        product = db.query(SafetyProduct).filter(SafetyProduct.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다.")
        
        # 카테고리 정보도 함께 가져오기
        category = db.query(SafetyCategory).filter(SafetyCategory.id == product.category_id).first()
        
        result = {
            "id": product.id,
            "category_id": product.category_id,
            "category_code": category.code if category else None,
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
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="제품 정보를 불러오는데 실패했습니다.") 