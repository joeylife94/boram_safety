from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class InquiryBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    subject: str
    message: str

class InquiryCreate(InquiryBase):
    pass

class InquiryResponse(InquiryBase):
    id: int
    is_read: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 