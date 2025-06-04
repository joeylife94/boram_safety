from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.crud import inquiry as inquiry_crud
from backend.crud import company as company_crud
from backend.core.constants import COMPANY_INFO, COMPANY_HISTORY, CERTIFICATIONS, MAJOR_CLIENTS
from backend.schemas.inquiry import InquiryCreate, InquiryResponse
from backend.schemas.company import CompanyInfo, History, Certification, Client
from backend.schemas.safety import SafetyCategory, SafetyCategoryResponse, SafetyProductResponse
from backend.models.safety import SafetyCategory as DBSafetyCategory, SafetyProduct as DBSafetyProduct
from backend.models.inquiry import Inquiry as DBInquiry

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