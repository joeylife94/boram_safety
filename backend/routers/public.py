from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from backend.crud import product as product_crud
from backend.crud import review as review_crud
from backend.crud import inquiry as inquiry_crud
from backend.crud import category as category_crud
from backend.crud import company as company_crud
from backend.core.constants import COMPANY_INFO, COMPANY_HISTORY, CERTIFICATIONS, MAJOR_CLIENTS
from backend.schemas.product import Product
from backend.schemas.review import Review, ReviewCreate
from backend.schemas.inquiry import InquiryCreate, InquiryResponse
from backend.schemas.category import Category
from backend.schemas.company import CompanyInfo, History, Certification, Client
from models.product import Product as DBProduct
from models.inquiry import Inquiry as DBInquiry
from schemas.product import ProductResponse

router = APIRouter(
    prefix="/api/v1",
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

@router.get("/categories", response_model=List[Category])
async def read_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """제품 카테고리 목록을 조회합니다."""
    return category_crud.get_categories(db, skip=skip, limit=limit)

@router.get("/categories/{category_id}/products", response_model=List[Product])
async def read_category_products(
    category_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """특정 카테고리의 제품 목록을 조회합니다."""
    return product_crud.get_products(db, skip=skip, limit=limit, category_id=category_id)

@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    제품 목록을 조회합니다.
    - category: 카테고리로 필터링
    - search: 제품명 검색
    - skip: 건너뛸 레코드 수
    - limit: 반환할 최대 레코드 수
    """
    query = db.query(DBProduct)
    
    if category:
        query = query.filter(DBProduct.category == category)
    
    if search:
        query = query.filter(DBProduct.name.ilike(f"%{search}%"))
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    return products

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    특정 제품의 상세 정보를 조회합니다.
    """
    product = db.query(DBProduct).filter(DBProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/products/{product_id}/reviews", response_model=List[Review])
async def read_product_reviews(
    product_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """특정 제품의 리뷰 목록을 조회합니다."""
    return review_crud.get_reviews_by_product(db, product_id, skip=skip, limit=limit)

@router.get("/products/{product_id}/rating")
async def read_product_rating(product_id: int, db: Session = Depends(get_db)):
    """특정 제품의 평균 평점과 총 리뷰 수를 조회합니다."""
    return review_crud.get_product_rating(db, product_id)

@router.post("/products/{product_id}/reviews", response_model=Review)
async def create_product_review(
    product_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    """새로운 제품 리뷰를 작성합니다."""
    if not product_crud.get_product(db, product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return review_crud.create_review(db, review)

@router.post("/inquiries", response_model=InquiryResponse)
async def create_inquiry(
    inquiry: InquiryCreate,
    db: Session = Depends(get_db)
):
    """
    새로운 문의를 생성합니다.
    """
    db_inquiry = DBInquiry(**inquiry.dict())
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry

@router.get("/health")
def health_check():
    return {"status": "healthy"} 