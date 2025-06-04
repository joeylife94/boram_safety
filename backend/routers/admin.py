from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db, SessionLocal
from backend.core.auth import get_api_key
from backend.crud import product as product_crud
from backend.crud import inquiry as inquiry_crud
from backend.crud import category as category_crud
from backend.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from backend.schemas.inquiry import InquiryResponse
from backend.schemas.category import Category, CategoryCreate, CategoryUpdate

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/health")
def admin_health_check():
    return {"status": "healthy", "role": "admin"}

@router.get("/dashboard")
async def admin_dashboard(db: Session = Depends(get_db)):
    """관리자 대시보드 정보를 반환합니다."""
    return {
        "message": "관리자 대시보드에 오신 것을 환영합니다",
        "status": "authenticated",
        "unread_inquiries": len([i for i in inquiry_crud.get_inquiries(db) if not i.is_read])
    }

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """제품 이미지를 업로드합니다."""
    try:
        file_url = await save_upload_file(file)
        return {"url": file_url}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="파일 업로드 중 오류가 발생했습니다")

@router.get("/categories", response_model=List[Category])
async def read_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """카테고리 목록을 조회합니다."""
    return category_crud.get_categories(db, skip=skip, limit=limit)

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

@router.get("/inquiries", response_model=List[InquiryResponse])
async def read_inquiries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """문의 목록을 조회합니다."""
    return inquiry_crud.get_inquiries(db, skip=skip, limit=limit)

@router.get("/inquiries/{inquiry_id}", response_model=InquiryResponse)
async def read_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db)
):
    """특정 문의를 조회합니다."""
    inquiry = inquiry_crud.get_inquiry(db, inquiry_id)
    if inquiry is None:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry

@router.post("/inquiries/{inquiry_id}/read")
async def mark_inquiry_as_read(
    inquiry_id: int,
    db: Session = Depends(get_db)
):
    """문의를 읽음 상태로 표시합니다."""
    inquiry = inquiry_crud.mark_as_read(db, inquiry_id)
    if inquiry is None:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "성공적으로 읽음 처리되었습니다"}

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