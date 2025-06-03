from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class SafetyCategoryBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    image_count: Optional[int] = 0

class SafetyCategoryCreate(SafetyCategoryBase):
    pass

class SafetyCategoryUpdate(SafetyCategoryBase):
    name: Optional[str] = None
    code: Optional[str] = None

class SafetyCategory(SafetyCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SafetyItemsImageBase(BaseModel):
    category_id: int
    file_name: str
    file_path: str
    description: Optional[str] = None

class SafetyItemsImageCreate(SafetyItemsImageBase):
    pass

class SafetyItemsImageUpdate(SafetyItemsImageBase):
    category_id: Optional[int] = None
    file_name: Optional[str] = None
    file_path: Optional[str] = None

class SafetyItemsImage(SafetyItemsImageBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 