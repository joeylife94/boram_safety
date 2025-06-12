from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    code: str
    slug: str
    description: Optional[str] = None
    display_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None

class Category(CategoryBase):
    id: int
    image: Optional[str] = None
    image_count: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        
    def dict(self, **kwargs):
        data = super().dict(**kwargs)
        if 'image_path' not in data and 'image' in data:
            data['image_path'] = data['image']
        return data 