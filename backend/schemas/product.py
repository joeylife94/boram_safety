from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class SortOrder(str, Enum):
    """정렬 순서"""
    asc = "asc"
    desc = "desc"

class SortField(str, Enum):
    """정렬 필드"""
    name = "name"
    price = "price"
    created_at = "created_at"
    updated_at = "updated_at"
    display_order = "display_order"

class ProductSearchParams(BaseModel):
    """고급 검색 파라미터"""
    # 기본 검색
    search: Optional[str] = None
    category_id: Optional[int] = None
    category_codes: Optional[List[str]] = None  # 여러 카테고리 동시 검색
    
    # 가격 범위
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    
    # 재고 상태
    stock_status: Optional[str] = None  # "재고있음", "품절", "입고예정" 등
    
    # 추천 제품
    is_featured: Optional[bool] = None
    
    # 날짜 범위
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    
    # 정렬
    sort_by: SortField = SortField.name
    sort_order: SortOrder = SortOrder.asc
    
    # 페이징
    skip: int = 0
    limit: int = 100

class ProductSearchResponse(BaseModel):
    """검색 결과 응답"""
    total: int
    items: List["ProductResponse"]
    page: int
    page_size: int
    total_pages: int

class ProductBase(BaseModel):
    name: str
    model_number: str
    category_id: int
    description: Optional[str] = None
    specifications: Optional[str] = None
    price: Optional[float] = None
    stock_status: str = "재고있음"
    is_featured: bool = False
    display_order: int = 0

class ProductCreate(ProductBase):
    file_name: Optional[str] = "default.jpg"
    file_path: Optional[str] = "/images/default.jpg"

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    model_number: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    specifications: Optional[str] = None
    price: Optional[float] = None
    stock_status: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    file_name: Optional[str] = None
    file_path: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    category_code: Optional[str] = None
    category_name: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    @field_validator('is_featured', mode='before')
    @classmethod
    def convert_is_featured_to_bool(cls, v):
        """is_featured를 boolean으로 변환"""
        if isinstance(v, bool):
            return v
        return bool(v)
    
    class Config:
        from_attributes = True 