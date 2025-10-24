"""
Draft Product 스키마
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class DraftProductBase(BaseModel):
    """Draft 제품 기본 스키마"""
    name: Optional[str] = Field(None, max_length=200)
    model_number: Optional[str] = Field(None, max_length=100)
    category_id: Optional[int] = None
    description: Optional[str] = None
    specifications: Optional[str] = None
    price: Optional[Decimal] = None
    stock_status: Optional[str] = Field(None, max_length=50)
    is_featured: Optional[bool] = False
    display_order: Optional[int] = 0
    file_name: Optional[str] = Field(None, max_length=255)
    file_path: Optional[str] = Field(None, max_length=500)
    extra_data: Optional[dict] = None  # 추가 메타데이터
    draft_status: Optional[str] = Field('draft', max_length=20)
    product_id: Optional[int] = None  # 수정 중인 제품 ID


class DraftProductCreate(DraftProductBase):
    """Draft 제품 생성 스키마"""
    created_by: Optional[str] = Field(None, max_length=100)


class DraftProductUpdate(DraftProductBase):
    """Draft 제품 수정 스키마"""
    pass


class DraftProductResponse(DraftProductBase):
    """Draft 제품 응답 스키마"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_auto_saved_at: Optional[datetime] = None
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True


class DraftListResponse(BaseModel):
    """Draft 목록 응답 스키마"""
    total: int
    items: list[DraftProductResponse]
    page: int
    page_size: int
    total_pages: int


class PublishDraftRequest(BaseModel):
    """Draft 발행 요청 스키마"""
    delete_draft: bool = Field(True, description="발행 후 Draft 삭제 여부")
