from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class AuditAction(str, Enum):
    """변경 작업 타입"""
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    BULK_UPDATE = "BULK_UPDATE"
    BULK_DELETE = "BULK_DELETE"

class AuditEntityType(str, Enum):
    """변경 대상 엔티티"""
    PRODUCT = "PRODUCT"
    CATEGORY = "CATEGORY"

class AuditLogBase(BaseModel):
    """Audit Log 기본 스키마"""
    entity_type: AuditEntityType
    entity_id: Optional[int] = None
    action: AuditAction
    old_values: Optional[str] = None
    new_values: Optional[str] = None
    changes_summary: Optional[str] = None
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    """Audit Log 생성 스키마"""
    pass

class AuditLogResponse(AuditLogBase):
    """Audit Log 응답 스키마"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuditLogFilter(BaseModel):
    """Audit Log 필터 스키마"""
    entity_type: Optional[AuditEntityType] = None
    entity_id: Optional[int] = None
    action: Optional[AuditAction] = None
    user_id: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    skip: int = 0
    limit: int = 50
