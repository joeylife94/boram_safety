from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class SafetyCategoryBase(BaseModel):
    name: str
    code: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    display_order: Optional[int] = 0
    image_count: Optional[int] = 0

class SafetyCategoryCreate(SafetyCategoryBase):
    pass

class SafetyCategoryUpdate(SafetyCategoryBase):
    name: Optional[str] = None
    code: Optional[str] = None
    slug: Optional[str] = None

class SafetyCategory(SafetyCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Response 모델
class SafetyCategoryResponse(SafetyCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SafetyProductBase(BaseModel):
    category_id: int
    name: str
    model_number: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    specifications: Optional[str] = None
    stock_status: Optional[str] = "in_stock"
    file_name: str
    file_path: str
    display_order: Optional[int] = 0
    is_featured: Optional[int] = 0

class SafetyProductCreate(SafetyProductBase):
    pass

class SafetyProductUpdate(SafetyProductBase):
    category_id: Optional[int] = None
    name: Optional[str] = None
    file_name: Optional[str] = None
    file_path: Optional[str] = None

class SafetyProduct(SafetyProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SafetyProductResponse(SafetyProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 