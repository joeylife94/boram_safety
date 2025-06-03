from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ReviewBase(BaseModel):
    product_id: int
    rating: float = Field(..., ge=1, le=5)
    content: Optional[str] = None
    author_name: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 