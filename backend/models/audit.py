from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from database import Base
import enum

class AuditAction(str, enum.Enum):
    """변경 작업 타입"""
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    BULK_UPDATE = "BULK_UPDATE"
    BULK_DELETE = "BULK_DELETE"

class AuditEntityType(str, enum.Enum):
    """변경 대상 엔티티"""
    PRODUCT = "PRODUCT"
    CATEGORY = "CATEGORY"

class AuditLog(Base):
    """변경 이력 로그 테이블"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 변경 대상 정보
    entity_type = Column(SQLEnum(AuditEntityType), nullable=False, index=True)
    entity_id = Column(Integer, nullable=True, index=True)  # 삭제 시에도 ID 저장
    
    # 변경 작업 정보
    action = Column(SQLEnum(AuditAction), nullable=False, index=True)
    
    # 변경 내용
    old_values = Column(Text, nullable=True)  # JSON 형태로 저장
    new_values = Column(Text, nullable=True)  # JSON 형태로 저장
    changes_summary = Column(String(500), nullable=True)  # 변경 요약
    
    # 메타 정보
    user_id = Column(String(100), nullable=True)  # 향후 인증 시스템 추가 시 사용
    user_name = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    
    # 시간 정보
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    def __repr__(self):
        return f"<AuditLog {self.entity_type}:{self.entity_id} {self.action} at {self.created_at}>"
