from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CompanyInfoBase(BaseModel):
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    business_hours: Optional[str] = None

class CompanyInfoUpdate(CompanyInfoBase):
    pass

class CompanyInfo(CompanyInfoBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class HistoryBase(BaseModel):
    date: datetime
    title: str
    description: Optional[str] = None
    order: Optional[int] = 0

class HistoryCreate(HistoryBase):
    pass

class HistoryUpdate(HistoryBase):
    pass

class History(HistoryBase):
    id: int

    class Config:
        from_attributes = True

class CertificationBase(BaseModel):
    name: str
    issuer: Optional[str] = None
    issue_date: Optional[datetime] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    order: Optional[int] = 0

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(CertificationBase):
    pass

class Certification(CertificationBase):
    id: int

    class Config:
        from_attributes = True

class ClientBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = 0

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class Client(ClientBase):
    id: int

    class Config:
        from_attributes = True 