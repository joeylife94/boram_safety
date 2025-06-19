from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    model_number: str
    category_id: int
    description: Optional[str] = None
    specifications: Optional[str] = None
    price: Optional[float] = None
    stock_status: str = "재고있음"
    is_featured: int = 0
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
    is_featured: Optional[int] = None
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
    
    class Config:
        from_attributes = True 