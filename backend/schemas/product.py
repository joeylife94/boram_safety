from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = 0
    specifications: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True 